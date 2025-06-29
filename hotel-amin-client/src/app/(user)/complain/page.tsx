"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface RoomItem {
    id: number;
    item_name: string;
    room_num: number;
}

export default function ComplainPage() {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        roomNumber: "",
        selectedItem: "",
        status: "",
        issueDescription: "",
    });
    const [roomItems, setRoomItems] = useState<RoomItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (formData.roomNumber) {
            fetchRoomItems(parseInt(formData.roomNumber));
        } else {
            setRoomItems([]);
            setFormData((prev) => ({ ...prev, selectedItem: "", status: "" }));
        }
    }, [formData.roomNumber]);

    const fetchRoomItems = async (roomNum: number) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/room/${roomNum}/items`
            );
            setRoomItems(response.data);
        } catch (error) {
            console.error("Error fetching room items:", error);
            toast.error(
                "Failed to fetch room items. Please check the room number."
            );
            setRoomItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (
            !/^(\+880|880|0)?1[3-9]\d{8}$/.test(
                formData.phoneNumber.replace(/\s|-/g, "")
            )
        ) {
            newErrors.phoneNumber = "Please enter a valid phone number";
        }

        if (!formData.roomNumber.trim()) {
            newErrors.roomNumber = "Room number is required";
        } else if (
            isNaN(Number(formData.roomNumber)) ||
            Number(formData.roomNumber) <= 0
        ) {
            newErrors.roomNumber = "Please enter a valid room number";
        }

        if (!formData.selectedItem) {
            newErrors.selectedItem = "Please select an item";
        }

        if (!formData.status) {
            newErrors.status = "Please select a status";
        }

        if (!formData.issueDescription.trim()) {
            newErrors.issueDescription = "Issue description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:3000/complain/report",
                {
                    phone_number: formData.phoneNumber,
                    room_num: parseInt(formData.roomNumber),
                    item_name: formData.selectedItem,
                    status: formData.status,
                    issue_description: formData.issueDescription,
                }
            );

            toast.success(
                "Complaint submitted successfully! An email has been sent to the hotel management."
            );

            setFormData({
                phoneNumber: "",
                roomNumber: "",
                selectedItem: "",
                status: "",
                issueDescription: "",
            });
            setRoomItems([]);
            setErrors({});
        } catch (error: any) {
            console.error("Error submitting complaint:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to submit complaint. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900">
                        Submit a Complaint
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Report any issues with room items or services
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number (used for booking):{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.phoneNumber ? "input-error" : ""
                                    }`}
                                    placeholder="e.g., +8801XXXXXXXXX"
                                />
                                {errors.phoneNumber && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.phoneNumber}
                                    </span>
                                )}
                            </div>

                            {/* Room Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Room Number:{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.roomNumber ? "input-error" : ""
                                    }`}
                                    placeholder="Enter room number"
                                    min="1"
                                />
                                {errors.roomNumber && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.roomNumber}
                                    </span>
                                )}
                            </div>

                            {/* Room Item Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item with Issue:{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="selectedItem"
                                    value={formData.selectedItem}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.selectedItem
                                            ? "select-error"
                                            : ""
                                    }`}
                                    disabled={!formData.roomNumber || loading}
                                >
                                    <option value="">
                                        {!formData.roomNumber
                                            ? "Please enter room number first"
                                            : loading
                                            ? "Loading items..."
                                            : roomItems.length === 0
                                            ? "No items found for this room"
                                            : "Select an item"}
                                    </option>
                                    {roomItems.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.item_name}
                                        >
                                            {item.item_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.selectedItem && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.selectedItem}
                                    </span>
                                )}
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Status:{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.status ? "select-error" : ""
                                    }`}
                                >
                                    <option value="">Select status</option>
                                    <option value="functional">
                                        Functional
                                    </option>
                                    <option value="needs_repair">
                                        Needs Repair
                                    </option>
                                    <option value="missing">Missing</option>
                                </select>
                                {errors.status && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.status}
                                    </span>
                                )}
                            </div>

                            {/* Issue Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Issue Description:{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="issueDescription"
                                    value={formData.issueDescription}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`textarea textarea-bordered w-full ${
                                        errors.issueDescription
                                            ? "textarea-error"
                                            : ""
                                    }`}
                                    placeholder="Describe the issue in detail..."
                                />
                                {errors.issueDescription && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.issueDescription}
                                    </span>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn btn-primary w-full ${
                                        loading ? "loading" : ""
                                    }`}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Submit Complaint"}
                                </button>
                            </div>
                        </form>

                        {/* Info Section */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                How it works:
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>
                                    • Enter the phone number used for your
                                    booking
                                </li>
                                <li>
                                    • Select your room number to load available
                                    items
                                </li>
                                <li>
                                    • Choose the specific item that has an issue
                                </li>
                                <li>• Select the current status of the item</li>
                                <li>• Describe the problem in detail</li>
                                <li>
                                    • Submit and we'll send your complaint to
                                    hotel management
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

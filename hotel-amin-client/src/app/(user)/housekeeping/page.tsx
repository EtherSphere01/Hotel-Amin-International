"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const HousekeepingPage = () => {
    const [formData, setFormData] = useState({
        room: "",
        phone: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors: string[] = [];

        if (!formData.room.trim()) {
            errors.push("Room number is required");
        } else if (isNaN(Number(formData.room)) || Number(formData.room) <= 0) {
            errors.push("Please enter a valid room number");
        }

        if (!formData.phone.trim()) {
            errors.push("Phone number is required");
        } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
            errors.push("Please enter a valid phone number (10-15 digits)");
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(error));
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                room: parseInt(formData.room),
                phone: formData.phone.replace(/\s+/g, ""),
                description: formData.description.trim() || undefined,
            };

            console.log("Submitting housekeeping request:", requestData);

            const response = await fetch(
                "http://localhost:3000/housekeeping/request",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            const result = await response.json();
            console.log("Housekeeping request response:", result);

            if (!response.ok) {
                if (result.message && Array.isArray(result.message)) {
                    result.message.forEach((msg: string) => toast.error(msg));
                } else {
                    toast.error(
                        result.message ||
                            "Failed to submit housekeeping request"
                    );
                }
                return;
            }

            if (result.success) {
                toast.success(
                    "Housekeeping request submitted successfully! We will contact you soon."
                );

                setFormData({
                    room: "",
                    phone: "",
                    description: "",
                });
            } else {
                toast.error(
                    "Failed to submit housekeeping request. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting housekeeping request:", error);
            toast.error(
                "Network error. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Housekeeping Request
                        </h1>
                        <p className="text-gray-600">
                            Request housekeeping services for your room
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="room"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Room Number *
                            </label>
                            <input
                                type="number"
                                id="room"
                                name="room"
                                value={formData.room}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your room number"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your phone number"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Enter 10-15 digits (e.g., 1234567890)
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Service Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Describe the housekeeping service you need (e.g., room cleaning, fresh towels, etc.)"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-blue-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> Our housekeeping
                                        team will contact you to confirm the
                                        service time. Requests are typically
                                        handled within 1-2 hours during business
                                        hours.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-6 rounded-lg font-medium transition duration-200 ${
                                isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                            } text-white`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting Request...
                                </span>
                            ) : (
                                "Submit Housekeeping Request"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                            <p>
                                Need immediate assistance? Call our front desk
                                at <strong>(555) 123-4567</strong>
                            </p>
                            <p className="mt-1">
                                Available 24/7 for your convenience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HousekeepingPage;

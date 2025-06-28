"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface GuestRegistrationData {
    name: string;
    age: string;
    fatherName: string;
    homeAddress: string;
    relation: string;
    mobileNo: string;
    nationality: string;
    profession: string;
    passportNid: string;
    guestType: "domestic" | "foreigner" | "vip";
    vehicleNo: string;
}

interface GuestRegistrationFormProps {
    onClose: () => void;
    onSubmit: (guestData: GuestRegistrationData) => void;
    roomData: any;
    bookingDetails: {
        checkInDate: string;
        checkOutDate: string;
        guests: number;
        rooms: number;
    };
    appliedCoupon?: any;
    userData?: {
        name: string;
        email: string;
    } | null;
    isAuthenticated?: boolean;
}

export default function GuestRegistrationForm({
    onClose,
    onSubmit,
    roomData,
    bookingDetails,
    appliedCoupon,
    userData,
    isAuthenticated = false,
}: GuestRegistrationFormProps) {
    const [formData, setFormData] = useState<GuestRegistrationData>({
        name: userData?.name || "",
        age: "",
        fatherName: "",
        homeAddress: "",
        relation: "",
        mobileNo: "",
        nationality: "",
        profession: "",
        passportNid: "",
        guestType: "domestic",
        vehicleNo: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.age.trim()) newErrors.age = "Age is required";
        if (!formData.fatherName.trim())
            newErrors.fatherName = "Father's name is required";
        if (!formData.homeAddress.trim())
            newErrors.homeAddress = "Home address is required";
        if (!formData.mobileNo.trim())
            newErrors.mobileNo = "Mobile number is required";
        if (!formData.nationality.trim())
            newErrors.nationality = "Nationality is required";
        if (!formData.profession.trim())
            newErrors.profession = "Profession is required";
        if (!formData.passportNid.trim())
            newErrors.passportNid = "Passport No./NID is required";

        // Validate mobile number format
        if (
            formData.mobileNo &&
            !/^(\+880|880|0)?1[3-9]\d{8}$/.test(
                formData.mobileNo.replace(/\s|-/g, "")
            )
        ) {
            newErrors.mobileNo = "Please enter a valid mobile number";
        }

        // Validate age
        if (
            formData.age &&
            (isNaN(Number(formData.age)) ||
                Number(formData.age) < 1 ||
                Number(formData.age) > 120)
        ) {
            newErrors.age = "Please enter a valid age (1-120)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        } else {
            toast.error("Please fill in all required fields correctly");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000075] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-blue-900">
                            {isAuthenticated
                                ? "Booking Details"
                                : "Guest Registration Form"}
                        </h3>
                        {isAuthenticated && userData && (
                            <p className="text-sm text-gray-600 mt-1">
                                Signed in as: {userData.name}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Row 1: Name, Age, Father's Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.name ? "input-error" : ""
                                }`}
                                placeholder="Enter full name"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-xs">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.age ? "input-error" : ""
                                }`}
                                placeholder="Enter age"
                                min="1"
                                max="120"
                            />
                            {errors.age && (
                                <span className="text-red-500 text-xs">
                                    {errors.age}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Father's Name:{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.fatherName ? "input-error" : ""
                                }`}
                                placeholder="Enter father's name"
                            />
                            {errors.fatherName && (
                                <span className="text-red-500 text-xs">
                                    {errors.fatherName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Home Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Home Address:{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="homeAddress"
                            value={formData.homeAddress}
                            onChange={handleInputChange}
                            rows={2}
                            className={`textarea textarea-bordered w-full ${
                                errors.homeAddress ? "textarea-error" : ""
                            }`}
                            placeholder="Enter complete home address"
                        />
                        {errors.homeAddress && (
                            <span className="text-red-500 text-xs">
                                {errors.homeAddress}
                            </span>
                        )}
                    </div>

                    {/* Row 3: Relation, Mobile No. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Relation:
                            </label>
                            <input
                                type="text"
                                name="relation"
                                value={formData.relation}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder="e.g., Self, Spouse, Child"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile No.:{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.mobileNo ? "input-error" : ""
                                }`}
                                placeholder="e.g., +8801XXXXXXXXX"
                            />
                            {errors.mobileNo && (
                                <span className="text-red-500 text-xs">
                                    {errors.mobileNo}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Nationality, Profession */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nationality:{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.nationality ? "input-error" : ""
                                }`}
                                placeholder="e.g., Bangladeshi"
                            />
                            {errors.nationality && (
                                <span className="text-red-500 text-xs">
                                    {errors.nationality}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profession:{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="profession"
                                value={formData.profession}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.profession ? "input-error" : ""
                                }`}
                                placeholder="e.g., Engineer, Doctor"
                            />
                            {errors.profession && (
                                <span className="text-red-500 text-xs">
                                    {errors.profession}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Row 5: Passport No./NID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Passport No./NID:{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="passportNid"
                            value={formData.passportNid}
                            onChange={handleInputChange}
                            className={`input input-bordered w-full ${
                                errors.passportNid ? "input-error" : ""
                            }`}
                            placeholder="Enter passport number or NID"
                        />
                        {errors.passportNid && (
                            <span className="text-red-500 text-xs">
                                {errors.passportNid}
                            </span>
                        )}
                    </div>

                    {/* Row 6: Guest Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Guest Type: <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="guestType"
                                    value="domestic"
                                    checked={formData.guestType === "domestic"}
                                    onChange={handleInputChange}
                                    className="radio radio-primary mr-2"
                                />
                                Domestic
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="guestType"
                                    value="foreigner"
                                    checked={formData.guestType === "foreigner"}
                                    onChange={handleInputChange}
                                    className="radio radio-primary mr-2"
                                />
                                Foreigner
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="guestType"
                                    value="vip"
                                    checked={formData.guestType === "vip"}
                                    onChange={handleInputChange}
                                    className="radio radio-primary mr-2"
                                />
                                VIP
                            </label>
                        </div>
                    </div>

                    {/* Row 7: Vehicle No. */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle No.:
                        </label>
                        <input
                            type="text"
                            name="vehicleNo"
                            value={formData.vehicleNo}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="e.g., Dhaka Metro-Ka-11-1234"
                        />
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">
                            Booking Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Room:</span>{" "}
                                {roomData?.title}
                            </div>
                            <div>
                                <span className="font-medium">Room Rent:</span>{" "}
                                ৳{roomData?.price}/night
                            </div>
                            <div>
                                <span className="font-medium">Check-in:</span>{" "}
                                {bookingDetails.checkInDate}
                            </div>
                            <div>
                                <span className="font-medium">Check-out:</span>{" "}
                                {bookingDetails.checkOutDate}
                            </div>
                            <div>
                                <span className="font-medium">Guests:</span>{" "}
                                {bookingDetails.guests}
                            </div>
                            <div>
                                <span className="font-medium">Rooms:</span>{" "}
                                {bookingDetails.rooms}
                            </div>
                            {appliedCoupon && (
                                <div className="col-span-2 mt-2 pt-2 border-t border-gray-300">
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="font-medium">
                                            Coupon ({appliedCoupon.coupon_code}
                                            ):
                                        </span>
                                        <span>
                                            -{appliedCoupon.coupon_percent}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                        >
                            Register & Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

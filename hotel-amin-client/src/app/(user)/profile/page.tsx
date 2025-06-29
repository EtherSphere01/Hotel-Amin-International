"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Users,
    Briefcase,
    Calendar,
    FileText,
    Car,
    Edit3,
    Save,
    X,
    History,
} from "lucide-react";
import { toast } from "react-toastify";
import { decodeJWT } from "@/app/utilities/jwt-operation";
import Link from "next/link";

interface UserProfile {
    user_id: number;
    name: string;
    email?: string;
    phone: string;
    address: string;
    nid: string;
    passport: string;
    nationality: string;
    profession: string;
    age: number;
    maritalStatus: boolean;
    vehicleNo?: string;
    fatherName: string;
    registrationDate: string;
    role: string;
}

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const tokenString = localStorage.getItem("accessToken");

            if (!tokenString) {
                toast.error("Please login to view profile");
                return;
            }

            const token = JSON.parse(tokenString);

            const response = await fetch("http://localhost:3000/user/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserProfile(data);
                setEditData(data);
            } else {
                const errorData = await response.text();
                console.error("Error response:", errorData);
                toast.error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (editing) {
            setEditData(userProfile || {});
        }
        setEditing(!editing);
    };

    const handleInputChange = (
        field: keyof UserProfile,
        value: string | number | boolean
    ) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const tokenString = localStorage.getItem("accessToken");
            if (!tokenString) {
                toast.error("Please login to update profile");
                return;
            }

            const token = JSON.parse(tokenString);

            const updateData = {
                name: editData.name,
                email: editData.email,
                phone: editData.phone,
                address: editData.address,
                nid: editData.nid,
                passport: editData.passport,
                nationality: editData.nationality,
                profession: editData.profession,
                age: editData.age,
                maritalStatus: editData.maritalStatus,
                vehicleNo: editData.vehicleNo,
                fatherName: editData.fatherName,
            };

            const response = await fetch("http://localhost:3000/user/profile", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.user) {
                    setUserProfile(result.user);
                    setEditing(false);
                    toast.success("Profile updated successfully!");
                } else {
                    toast.error(result.message || "Failed to update profile");
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Network error. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Check console for debug info
                    </p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Failed to load profile data</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Check console for error details
                    </p>
                    <button
                        onClick={fetchUserProfile}
                        className="mt-4 bg-[#F5A623] text-white px-4 py-2 rounded hover:bg-[#e49b1a]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#0B3C5D] rounded-full p-4">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {userProfile.name}
                                </h1>
                                <p className="text-gray-600">
                                    {userProfile.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/booking-history"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                    >
                                        <History className="h-4 w-4" />
                                        <span>Booking History</span>
                                    </Link>
                                    <button
                                        onClick={handleEditToggle}
                                        className="bg-[#F5A623] text-white px-4 py-2 rounded-lg hover:bg-[#e49b1a] flex items-center space-x-2"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.name || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    {editing ? (
                                        <input
                                            type="email"
                                            value={editData.email || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.email ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    {editing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    {editing ? (
                                        <input
                                            type="number"
                                            value={editData.age || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "age",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.age}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Users className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Marital Status
                                    </label>
                                    {editing ? (
                                        <select
                                            value={
                                                editData.maritalStatus
                                                    ? "married"
                                                    : "single"
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "maritalStatus",
                                                    e.target.value === "married"
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        >
                                            <option value="single">
                                                Single
                                            </option>
                                            <option value="married">
                                                Married
                                            </option>
                                        </select>
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.maritalStatus
                                                ? "Married"
                                                : "Single"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Father's Name
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.fatherName || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "fatherName",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.fatherName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Additional Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    {editing ? (
                                        <textarea
                                            value={editData.address || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.address}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        National ID
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.nid || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "nid",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.nid}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Passport
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.passport || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "passport",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.passport}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nationality
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.nationality || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "nationality",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.nationality}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Profession
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.profession || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "profession",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.profession}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Car className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Vehicle Number
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editData.vehicleNo || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "vehicleNo",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">
                                            {userProfile.vehicleNo ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Registration Date
                                </label>
                                <p className="mt-1 text-gray-900">
                                    {new Date(
                                        userProfile.registrationDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    User ID
                                </label>
                                <p className="mt-1 text-gray-900">
                                    #{userProfile.user_id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

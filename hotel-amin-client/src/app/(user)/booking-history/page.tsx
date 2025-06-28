"use client";

import React, { useState, useEffect } from "react";
import {
    Calendar,
    MapPin,
    Users,
    CreditCard,
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

interface BookingHistory {
    booking_id: number;
    checkin_date: string;
    checkout_date: string;
    number_of_guests: number;
    room_price: number;
    discount_price: number;
    total_price: number;
    booking_date: string;
    payment_status: "PENDING" | "PARTIAL" | "PAID";
    typeOfBooking: "ONLINE" | "OFFLINE";
    room?: {
        room_num: number;
        type: string;
        floor: number;
    };
}

export default function BookingHistoryPage() {
    const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const fetchBookingHistory = async () => {
        try {
            const tokenString = localStorage.getItem("accessToken");
            console.log("Token string found:", !!tokenString);

            if (!tokenString) {
                toast.error("Please login to view booking history");
                return;
            }

            const token = JSON.parse(tokenString);
            console.log("Making request to booking history endpoint...");

            const response = await fetch(
                "http://localhost:3000/user/booking-history",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Booking history data received:", data);
                setBookingHistory(data || []);
            } else {
                console.error(
                    "Response not ok:",
                    response.status,
                    response.statusText
                );
                const errorData = await response.text();
                console.error("Error response:", errorData);
                toast.error("Failed to fetch booking history");
            }
        } catch (error) {
            console.error("Error fetching booking history:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case "PAID":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "PARTIAL":
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case "PENDING":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800";
            case "PARTIAL":
                return "bg-yellow-100 text-yellow-800";
            case "PENDING":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading booking history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/profile"
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <ArrowLeft className="h-6 w-6 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Booking History
                                </h1>
                                <p className="text-gray-600">
                                    View all your past and current bookings
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total Bookings: {bookingHistory.length}
                        </div>
                    </div>
                </div>

                {/* Booking History List */}
                {bookingHistory.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Booking History
                        </h3>
                        <p className="text-gray-600">
                            You haven't made any bookings yet.
                        </p>
                        <Link
                            href="/accommodation"
                            className="mt-4 inline-flex items-center px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#e49b1a] transition"
                        >
                            Browse Accommodations
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookingHistory.map((booking) => (
                            <div
                                key={booking.booking_id}
                                className="bg-white rounded-lg shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-[#0B3C5D] rounded-full p-2">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Booking #{booking.booking_id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Booked on{" "}
                                                {formatDate(
                                                    booking.booking_date
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                                booking.payment_status
                                            )}`}
                                        >
                                            {getPaymentStatusIcon(
                                                booking.payment_status
                                            )}
                                            <span className="ml-1">
                                                {booking.payment_status}
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {booking.typeOfBooking}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Stay Details */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">
                                            Stay Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>
                                                    Check-in:{" "}
                                                    {formatDate(
                                                        booking.checkin_date
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>
                                                    Check-out:{" "}
                                                    {formatDate(
                                                        booking.checkout_date
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>
                                                    {booking.number_of_guests}{" "}
                                                    Guest
                                                    {booking.number_of_guests >
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Details */}
                                    {booking.room && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900">
                                                Room Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span>
                                                        Room{" "}
                                                        {booking.room.room_num}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span>
                                                        {booking.room.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span>
                                                        Floor{" "}
                                                        {booking.room.floor}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">
                                            Pricing
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span>Room Price:</span>
                                                <span>
                                                    {formatCurrency(
                                                        booking.room_price
                                                    )}
                                                </span>
                                            </div>
                                            {booking.discount_price > 0 && (
                                                <div className="flex items-center justify-between text-green-600">
                                                    <span>Discount:</span>
                                                    <span>
                                                        -
                                                        {formatCurrency(
                                                            booking.discount_price
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between font-medium border-t pt-2">
                                                <span>Total:</span>
                                                <span>
                                                    {formatCurrency(
                                                        booking.total_price
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">
                                            Duration
                                        </h4>
                                        <div className="text-sm">
                                            {(() => {
                                                const checkIn = new Date(
                                                    booking.checkin_date
                                                );
                                                const checkOut = new Date(
                                                    booking.checkout_date
                                                );
                                                const days = Math.ceil(
                                                    (checkOut.getTime() -
                                                        checkIn.getTime()) /
                                                        (1000 * 3600 * 24)
                                                );
                                                return (
                                                    <span className="text-gray-600">
                                                        {days} Night
                                                        {days > 1 ? "s" : ""}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

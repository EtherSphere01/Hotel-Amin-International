"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const BookingPage = () => {
    const searchParams = useSearchParams();
    const [bookingData, setBookingData] = useState({
        roomNum: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
    });

    useEffect(() => {
        const roomNum = searchParams.get("roomNum") || "";
        const checkIn = searchParams.get("checkIn") || "";
        const checkOut = searchParams.get("checkOut") || "";
        const guests = parseInt(searchParams.get("guests") || "1");

        setBookingData({ roomNum, checkIn, checkOut, guests });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Book Your Room
                    </h1>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4">
                            Booking Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-700">
                                    Room Number:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {bookingData.roomNum}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Guests:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {bookingData.guests}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Check-in:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {bookingData.checkIn
                                        ? new Date(
                                              bookingData.checkIn
                                          ).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Check-out:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {bookingData.checkOut
                                        ? new Date(
                                              bookingData.checkOut
                                          ).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                Booking System Under Development
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                The full booking system is currently being
                                developed. Please contact our front desk to
                                complete your reservation.
                            </p>
                            <div className="text-center">
                                <p className="font-semibold text-gray-900">
                                    Contact Information:
                                </p>
                                <p className="text-gray-700">
                                    Phone: 01886966602
                                </p>
                                <p className="text-gray-700">
                                    Email: info@hotelamin.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;

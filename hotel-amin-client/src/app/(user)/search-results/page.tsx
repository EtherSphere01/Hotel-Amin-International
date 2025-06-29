"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";

import GuestRegistrationForm from "@/component/GuestRegistrationForm";
import { decodeJWT } from "@/app/utilities/jwt-operation";
import { generateBookingPDFFromResponse } from "@/app/utilities/pdf-generator";

interface Room {
    room_num: number;
    room_type: string;
    price_per_night: number;
    room_status: string;
    housekeeping_status: string;
    accommodation_id: number;
    category: string;
    specs: string[];
    accommodations?: any[];
}

const SearchResultsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchCriteria, setSearchCriteria] = useState({
        checkIn: "",
        checkOut: "",
        guests: 1,
    });

    const [showGuestForm, setShowGuestForm] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkIn = searchParams.get("checkIn") || "";
        const checkOut = searchParams.get("checkOut") || "";
        const guests = parseInt(searchParams.get("guests") || "1");
        const resultsData = searchParams.get("results");

        setSearchCriteria({ checkIn, checkOut, guests });

        if (resultsData) {
            try {
                const parsedRooms = JSON.parse(resultsData);
                setRooms(parsedRooms);
            } catch (error) {
                console.error("Error parsing search results:", error);
                toast.error("Error loading search results");
            }
        }

        checkAuthStatus();
    }, [searchParams]);

    const checkAuthStatus = () => {
        try {
            const decoded = decodeJWT();
            if (decoded && decoded.user_id) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const handleBookRoom = (room: Room) => {
        if (!searchCriteria.checkIn || !searchCriteria.checkOut) {
            toast.error(
                "Please ensure check-in and check-out dates are selected"
            );
            return;
        }

        setSelectedRoom(room);
        setShowGuestForm(true);
    };

    const handleViewDetails = (room: Room) => {
        router.push(`/accommodation/${room.accommodation_id}`);
    };

    const calculateNights = () => {
        if (searchCriteria.checkIn && searchCriteria.checkOut) {
            const checkInDate = new Date(searchCriteria.checkIn);
            const checkOutDate = new Date(searchCriteria.checkOut);
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
        return 1;
    };

    const nights = calculateNights();

    const handleGuestBooking = async (guestData: any) => {
        if (
            !searchCriteria.checkIn ||
            !searchCriteria.checkOut ||
            !selectedRoom
        ) {
            toast.error("Please fill in all booking details");
            return;
        }

        try {
            const bookingData = {
                checkin_date: new Date(searchCriteria.checkIn),
                checkout_date: new Date(searchCriteria.checkOut),
                number_of_guests: searchCriteria.guests,
                payment_status: "pending",
                typeOfBooking: "online",
                no_of_rooms: 1,
                accommodation_id: selectedRoom.accommodation_id,
                guest_name: guestData.name,
                guest_age: guestData.age,
                guest_father_name: guestData.fatherName,
                guest_address: guestData.homeAddress,
                guest_relation: guestData.relation,
                guest_mobile: guestData.mobileNo,
                guest_nationality: guestData.nationality,
                guest_profession: guestData.profession,
                guest_passport_nid: guestData.passportNid,
                guest_type: guestData.guestType,
                guest_vehicle_no: guestData.vehicleNo,
            };

            const response = await axios.post(
                "http://localhost:3000/booking/create-guest",
                bookingData
            );

            toast.success("Booking created successfully!");
            console.log("Guest booking response:", response.data);

            try {
                const roomData = {
                    id: selectedRoom.accommodation_id,
                    title: selectedRoom.room_type,
                    price: selectedRoom.price_per_night,
                };

                generateBookingPDFFromResponse(
                    response,
                    {
                        checkInDate: searchCriteria.checkIn,
                        checkOutDate: searchCriteria.checkOut,
                        guests: searchCriteria.guests,
                        rooms: 1,
                        appliedCoupon: null,
                    },
                    roomData,
                    guestData
                );
                toast.success("Booking confirmation PDF has been downloaded!");
            } catch (pdfError) {
                console.error("Error generating PDF:", pdfError);
                toast.warn("Booking successful, but PDF generation failed");
            }

            setShowGuestForm(false);
            setSelectedRoom(null);

        } catch (error: any) {
            console.error("Error creating guest booking:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to create booking. Please try again.");
            }
        }
    };

    const getAuthenticatedUserData = () => {
        if (!isAuthenticated) return null;

        try {
            const decoded = decodeJWT();
            if (decoded) {
                return {
                    name: decoded.full_name || "",
                    email: decoded.email || "",
                };
            }
        } catch (error) {
            console.log("Error getting user data for pre-fill:", error);
        }
        return null;
    };

    if (rooms.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Search Results
                        </h1>
                        <p className="text-gray-600">
                            No available rooms found for your search criteria.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 btn btn-primary"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Available Rooms
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-semibold">Check-in:</span>{" "}
                            {new Date(
                                searchCriteria.checkIn
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-semibold">Check-out:</span>{" "}
                            {new Date(
                                searchCriteria.checkOut
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-semibold">Guests:</span>{" "}
                            {searchCriteria.guests}
                        </div>
                        <div>
                            <span className="font-semibold">Nights:</span>{" "}
                            {nights}
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-lg font-semibold text-green-600">
                            {rooms.length} room{rooms.length > 1 ? "s" : ""}{" "}
                            available
                        </span>
                    </div>
                </div>

                {/* Room Results */}
                <div className="grid gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.room_num}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <div className="h-64 md:h-full relative bg-gray-200">
                                        <Image
                                            src="/images/rooms/room-hero.png"
                                            alt={`Room ${room.room_num}`}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = "none";
                                                target.parentElement!.style.background =
                                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                                            }}
                                        />
                                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Room {room.room_num}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-2/3 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {room.room_type ||
                                                    "Standard Room"}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    {room.room_status}
                                                </span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {room.housekeeping_status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-900">
                                                ৳{room.price_per_night}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                per night
                                            </div>
                                            <div className="text-lg font-semibold text-blue-600 mt-1">
                                                Total: ৳
                                                {room.price_per_night * nights}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                for {nights} night
                                                {nights > 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            Room Features:
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                            <div>• Air Conditioning</div>
                                            <div>• Free WiFi</div>
                                            <div>• Private Bathroom</div>
                                            <div>• Room Service</div>
                                            <div>• Daily Housekeeping</div>
                                            <div>• Complimentary Breakfast</div>
                                        </div>
                                        {room.category && (
                                            <div className="mt-2">
                                                <span className="text-sm text-blue-600 font-medium">
                                                    Category: {room.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() =>
                                                handleViewDetails(room)
                                            }
                                            className="btn btn-outline btn-primary flex-1"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleBookRoom(room)}
                                            className="btn btn-primary flex-1"
                                        >
                                            <FaCalendarAlt className="mr-2" />
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back to Search */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="btn btn-outline btn-primary px-8 py-3"
                    >
                        Modify Search
                    </button>
                </div>
            </div>

            {/* Guest Registration Modal */}
            {showGuestForm && selectedRoom && (
                <GuestRegistrationForm
                    onClose={() => {
                        setShowGuestForm(false);
                        setSelectedRoom(null);
                    }}
                    onSubmit={handleGuestBooking}
                    roomData={{
                        id: selectedRoom.accommodation_id,
                        title: selectedRoom.room_type || "Standard Room",
                        price: selectedRoom.price_per_night,
                    }}
                    bookingDetails={{
                        checkInDate: searchCriteria.checkIn,
                        checkOutDate: searchCriteria.checkOut,
                        guests: searchCriteria.guests,
                        rooms: 1,
                    }}
                    appliedCoupon={null} 
                    userData={getAuthenticatedUserData()}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </div>
    );
};

export default SearchResultsPage;

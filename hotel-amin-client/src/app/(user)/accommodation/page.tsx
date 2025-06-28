"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Import auth and booking components
import GuestRegistrationForm from "@/component/GuestRegistrationForm";
import { decodeJWT, getToken } from "@/app/utilities/jwt-operation";
import { generateBookingPDFFromResponse } from "@/app/utilities/pdf-generator";

const categories = [
    "All",
    "Premium Rooms",
    "Deluxe Rooms",
    "Family Suites Rooms",
];

export default function RoomCategoriesPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [roomData, setRoomData] = useState<any[]>([]);

    // Booking states
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Booking form states (default values)
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/accommodation/all"
                );
                // Optional: group by category
                const grouped = response.data.reduce((acc: any, room: any) => {
                    const found = acc.find(
                        (cat: any) => cat.category === room.category
                    );
                    if (found) {
                        found.rooms.push(room);
                    } else {
                        acc.push({
                            category: room.category,
                            description: room.description || "",
                            rooms: [room],
                        });
                    }
                    return acc;
                }, []);
                setRoomData(grouped);
            } catch (error) {
                console.error("Failed to fetch room data:", error);
            }
        };
        fetchRooms();

        // Check authentication status
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = await getToken();
        if (token) {
            try {
                const decoded = decodeJWT();
                setIsAuthenticated(!!decoded);
            } catch (error) {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    const handleBookNow = (room: any) => {
        setSelectedRoom(room);
        // Set default dates (today and tomorrow) if not already set
        if (!checkInDate || !checkOutDate) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            setCheckInDate(today.toISOString().split("T")[0]);
            setCheckOutDate(tomorrow.toISOString().split("T")[0]);
        }
        setShowGuestForm(true);
    };

    const handleViewDetails = (room: any) => {
        router.push(`/accommodation/${room.id}`);
    };

    const handleGuestBooking = async (guestData: any) => {
        if (!checkInDate || !checkOutDate || !selectedRoom) {
            toast.error("Please fill in all booking details");
            return;
        }

        try {
            const bookingData = {
                checkin_date: new Date(checkInDate),
                checkout_date: new Date(checkOutDate),
                number_of_guests: guests,
                payment_status: "pending",
                typeOfBooking: "online",
                no_of_rooms: 1,
                accommodation_id: selectedRoom.id,
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

            // Generate PDF after successful booking
            try {
                generateBookingPDFFromResponse(
                    response,
                    {
                        checkInDate,
                        checkOutDate,
                        guests,
                        rooms: 1,
                        appliedCoupon: null,
                    },
                    selectedRoom,
                    guestData
                );
                toast.success("Booking confirmation PDF has been downloaded!");
            } catch (pdfError) {
                console.error("Error generating PDF:", pdfError);
                toast.warn("Booking successful, but PDF generation failed");
            }

            setShowGuestForm(false);
            setSelectedRoom(null);

            // Optionally redirect to booking confirmation
            router.push("/booking");
        } catch (error: any) {
            console.error("Error creating guest booking:", error);
            toast.error(
                error.response?.data?.message || "Failed to create booking"
            );
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

    const filteredData =
        selectedCategory === "All"
            ? roomData
            : roomData.filter((cat) => cat.category === selectedCategory);

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Hero Section */}
                <div className="relative w-full h-[300px]">
                    <Image
                        src="/images/rooms/room-hero.png"
                        alt="Hero"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-[0.3]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 md:px-20 text-white">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
                            Accommodation
                        </h1>
                        <p className="text-yellow-500 text-base sm:text-lg md:text-xl font-semibold mt-2 leading-snug">
                            Discover the epitome of a luxury accommodation in
                            Cox’s Bazar at
                            <br className="hidden md:block" />
                            <span className="block md:inline text-amber-400 font-bold">
                                HOTEL AMIN INTERNATIONAL.
                            </span>
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="absolute w-[90%] md:w-[50%] -bottom-5 left-1/2 transform -translate-x-1/2 z-30">
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6 bg-[#F3CFCF] px-4 sm:px-6 md:px-8 py-4 rounded-full shadow-lg border border-[#d9a9a9] backdrop-blur-md">
                            {categories.map((cat) => (
                                <label
                                    key={cat}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="room-category"
                                        value={cat}
                                        checked={selectedCategory === cat}
                                        onChange={() =>
                                            setSelectedCategory(cat)
                                        }
                                        className="w-4 h-4 border-2 border-[#4C0000] rounded-full appearance-none checked:bg-[#4C0000] checked:border-[#4C0000]"
                                    />
                                    <span
                                        className={`text-xs sm:text-sm md:text-sm font-medium ${
                                            selectedCategory === cat
                                                ? "text-[#4C0000] font-bold"
                                                : "text-[#4C0000]"
                                        }`}
                                    >
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Room Sections */}
                <h1 className="text-2xl sm:text-3xl font-semibold px-4 sm:px-8">
                    {selectedCategory === "All"
                        ? `All Accommodations (${roomData.reduce(
                              (total, cat) => total + cat.rooms.length,
                              0
                          )})`
                        : `All Accommodations (${
                              filteredData[0]?.rooms.length || 0
                          })`}
                </h1>
                <hr className="border-t-2 border-gray-300 my-8 md:my-12" />

                {filteredData.map((section, catIdx) => (
                    <div key={catIdx} className="space-y-6 px-4 sm:px-8">
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold">
                                {section.category.toUpperCase()} (
                                {section.rooms.length})
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                                {section.description}
                            </p>
                        </div>

                        <div className="space-y-12">
                            {section.rooms.map((room: any, index: number) => {
                                const isReversed = index % 2 !== 0;
                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col md:flex-row gap-6 ${
                                            isReversed
                                                ? "md:flex-row-reverse"
                                                : ""
                                        }`}
                                    >
                                        {/* Swiper Carousel */}
                                        <div className="md:w-1/2 w-full">
                                            <Swiper
                                                navigation
                                                modules={[Navigation]}
                                                className="rounded overflow-hidden"
                                            >
                                                {room.images?.map(
                                                    (
                                                        img: string,
                                                        idx: number
                                                    ) => (
                                                        <SwiperSlide key={idx}>
                                                            <Image
                                                                src={img}
                                                                alt={`Room ${index} Image ${
                                                                    idx + 1
                                                                }`}
                                                                width={700}
                                                                height={450}
                                                                className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded"
                                                            />
                                                        </SwiperSlide>
                                                    )
                                                )}
                                            </Swiper>
                                        </div>

                                        {/* Room Info */}
                                        <div
                                            className={`md:w-1/2 w-full space-y-2 ${
                                                isReversed
                                                    ? "flex flex-col md:items-end md:text-right"
                                                    : ""
                                            }`}
                                        >
                                            <p className="text-red-600 text-base sm:text-lg font-semibold">
                                                {room.price}
                                            </p>
                                            <h4 className="text-sm sm:text-base font-semibold">
                                                {room.title}
                                            </h4>
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                <li>{room.max_adults}</li>
                                                {room.specs?.map(
                                                    (
                                                        spec: string,
                                                        i: number
                                                    ) => (
                                                        <li key={i}>{spec}</li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="flex flex-wrap gap-2 pt-2 justify-start md:justify-start">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleBookNow(room)
                                                    }
                                                >
                                                    BOOK NOW
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleViewDetails(room)
                                                    }
                                                >
                                                    DETAILS
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedCategory === "All" && (
                            <hr className="border-t-2 border-gray-300 my-12" />
                        )}
                    </div>
                ))}
            </div>

            {/* Guest Registration Modal */}
            {showGuestForm && selectedRoom && (
                <GuestRegistrationForm
                    onClose={() => {
                        setShowGuestForm(false);
                        setSelectedRoom(null);
                    }}
                    onSubmit={handleGuestBooking}
                    roomData={selectedRoom}
                    bookingDetails={{
                        checkInDate,
                        checkOutDate,
                        guests,
                        rooms: 1,
                    }}
                    userData={getAuthenticatedUserData()}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </>
    );
}

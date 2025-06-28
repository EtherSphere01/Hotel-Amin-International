"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    FaCheckCircle,
    FaShoppingCart,
    FaCalendarAlt,
    FaUsers,
    FaBed,
    FaSnowflake,
    FaWifi,
    FaTv,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { toast } from "react-toastify";
import {
    addToCart as addItemToCart,
    CartItem as CartUtilItem,
} from "@/app/utilities/cart-utils";
import { generateBookingPDFFromResponse } from "@/app/utilities/pdf-generator";

// Import auth components
import SignInPage from "@/app/(user)/auth/SignInPage";
import GuestRegistrationForm from "@/component/GuestRegistrationForm";
import { decodeJWT, getToken } from "@/app/utilities/jwt-operation";

interface RoomData {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    max_adults: string;
    specs: string[];
    images: string[];
}

interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
}

export default function RoomDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.id as string;

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Booking form states
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/accommodation/${roomId}`
                );
                setRoomData(response.data);
            } catch (error) {
                console.error("Error fetching room data:", error);
                toast.error("Failed to load room details");
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchRoomData();
        }

        // Check authentication status
        checkAuthStatus();
    }, [roomId]);

    const checkAuthStatus = () => {
        const token = localStorage.getItem("accessToken");
        console.log("Checking auth status - token:", !!token);

        if (token) {
            try {
                // Properly decode and validate JWT token
                const decoded = decodeJWT();
                console.log("Decoded token:", decoded);

                if (decoded) {
                    setIsAuthenticated(true);
                    console.log("User authenticated successfully");
                } else {
                    // Token is invalid or expired
                    console.log("Token invalid or expired");
                    setIsAuthenticated(false);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            } catch (error) {
                console.log("Error decoding token:", error);
                setIsAuthenticated(false);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        } else {
            console.log("No token found");
            setIsAuthenticated(false);
        }
    };

    const addToCart = () => {
        if (!roomData) return;

        const cartItem: CartUtilItem = {
            id: roomData.id,
            title: roomData.title,
            price: roomData.price,
            image: roomData.images[0] || "/images/rooms/default.jpg",
            quantity: rooms,
            checkInDate,
            checkOutDate,
            guests,
        };

        const success = addItemToCart(cartItem);

        if (success) {
            toast.success("Room added to cart!");
        } else {
            toast.error("Failed to add room to cart");
        }
    };
    const handleBookNow = async () => {
        if (!checkInDate || !checkOutDate || !roomData) {
            toast.error("Please fill in all booking details");
            return;
        }

        // Always show guest form regardless of authentication status
        setShowGuestForm(true);
    };

    // Get authenticated user data for pre-filling the guest form
    const getAuthenticatedUserData = () => {
        if (!isAuthenticated) return null;

        try {
            const decoded = decodeJWT();
            if (decoded) {
                return {
                    name: decoded.full_name || "",
                    email: decoded.email || "",
                    // Add other fields as available from JWT or user API
                };
            }
        } catch (error) {
            console.log("Error getting user data for pre-fill:", error);
        }
        return null;
    };

    const handleAuthSuccess = () => {
        setShowSignIn(false);
        setIsAuthenticated(true);
        checkAuthStatus();
    };

    const handleGuestBooking = async (guestData: any) => {
        if (!checkInDate || !checkOutDate || !roomData) {
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
                no_of_rooms: rooms,
                accommodation_id: roomData.id,
                ...(appliedCoupon && {
                    coupon_code: appliedCoupon.coupon_code,
                    coupon_percent: appliedCoupon.coupon_percent,
                }),
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

            toast.success("Guest booking created successfully!");
            console.log("Guest booking response:", response.data);

            // Generate PDF after successful booking
            try {
                generateBookingPDFFromResponse(
                    response,
                    {
                        checkInDate,
                        checkOutDate,
                        guests,
                        rooms,
                        appliedCoupon,
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
            // router.push("/booking-confirmation"); // Redirect to confirmation page
        } catch (error: any) {
            console.error("Error creating guest booking:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to create booking. Please try again.");
            }
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/coupon/search/${couponCode}`
            );

            const coupon = response.data;

            // Validate coupon
            if (!coupon.is_active) {
                toast.error("This coupon is no longer active");
                return;
            }

            if (new Date() > new Date(coupon.expire_at)) {
                toast.error("This coupon has expired");
                return;
            }

            if (coupon.quantity <= 0) {
                toast.error("This coupon is no longer available");
                return;
            }

            // Apply coupon
            setAppliedCoupon(coupon);
            setCouponDiscount(coupon.coupon_percent);
            toast.success(`Coupon applied! ${coupon.coupon_percent}% discount`);
        } catch (error: any) {
            console.error("Error applying coupon:", error);
            if (error.response?.status === 404) {
                toast.error("Invalid coupon code");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to apply coupon");
            }
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
        toast.info("Coupon removed");
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Room not found
                    </h2>
                    <button
                        onClick={() => router.back()}
                        className="btn btn-primary"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm py-4">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => router.back()}
                        className="btn btn-ghost btn-sm mb-4"
                    >
                        ← Back to Rooms
                    </button>
                    <h1 className="text-3xl font-bold text-blue-900">
                        {roomData.title}
                    </h1>
                    <p className="text-gray-600 mt-2">{roomData.category}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images and Details */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="mb-8">
                            <Swiper
                                navigation={true}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                modules={[Navigation, Pagination, Autoplay]}
                                className="rounded-lg shadow-lg h-96"
                            >
                                {roomData.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative w-full h-96">
                                            <Image
                                                src={image}
                                                alt={`${
                                                    roomData.title
                                                } - Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 66vw"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Room Description */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                About This Room
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {roomData.description}
                            </p>

                            {/* Room Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-blue-500" />
                                    <span className="text-sm">
                                        {roomData.max_adults}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBed className="text-blue-500" />
                                    <span className="text-sm">King Bed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaSnowflake className="text-blue-500" />
                                    <span className="text-sm">AC</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaWifi className="text-blue-500" />
                                    <span className="text-sm">Free WiFi</span>
                                </div>
                            </div>

                            {/* Specifications */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Room Features
                            </h3>
                            <ul className="space-y-2">
                                {roomData.specs.map((spec, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <FaCheckCircle className="text-green-500 text-sm" />
                                        <span className="text-gray-700">
                                            {spec}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                                    ৳{roomData.price.toLocaleString()}
                                </h3>
                                <p className="text-gray-600">per night</p>
                            </div>

                            {/* Booking Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) =>
                                            setCheckInDate(e.target.value)
                                        }
                                        min={getTodayDate()}
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={checkOutDate}
                                        onChange={(e) =>
                                            setCheckOutDate(e.target.value)
                                        }
                                        min={checkInDate || getTomorrowDate()}
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guests
                                        </label>
                                        <select
                                            value={guests}
                                            onChange={(e) =>
                                                setGuests(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="select select-bordered w-full"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rooms
                                        </label>
                                        <select
                                            value={rooms}
                                            onChange={(e) =>
                                                setRooms(Number(e.target.value))
                                            }
                                            className="select select-bordered w-full"
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Coupon Section */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Coupon Code
                                    </label>
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <FaCheckCircle className="text-green-500" />
                                                <span className="text-green-700 font-medium">
                                                    {appliedCoupon.coupon_code}
                                                </span>
                                                <span className="text-green-600 text-sm">
                                                    (
                                                    {
                                                        appliedCoupon.coupon_percent
                                                    }
                                                    % off)
                                                </span>
                                            </div>
                                            <button
                                                onClick={removeCoupon}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) =>
                                                    setCouponCode(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter coupon code"
                                                className="input input-bordered flex-1"
                                                disabled={couponLoading}
                                            />
                                            <button
                                                onClick={applyCoupon}
                                                disabled={
                                                    couponLoading ||
                                                    !couponCode.trim()
                                                }
                                                className="btn btn-outline btn-primary min-w-[80px]"
                                            >
                                                {couponLoading ? (
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                ) : (
                                                    "Apply"
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Price Calculation */}
                                {checkInDate && checkOutDate && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Price per night</span>
                                            <span>
                                                ৳
                                                {roomData.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Nights</span>
                                            <span>
                                                {Math.ceil(
                                                    (new Date(
                                                        checkOutDate
                                                    ).getTime() -
                                                        new Date(
                                                            checkInDate
                                                        ).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Rooms</span>
                                            <span>{rooms}</span>
                                        </div>

                                        {appliedCoupon && (
                                            <>
                                                <hr className="my-2" />
                                                <div className="flex justify-between items-center mb-2 text-green-600">
                                                    <span>
                                                        Coupon Discount (
                                                        {
                                                            appliedCoupon.coupon_percent
                                                        }
                                                        %)
                                                    </span>
                                                    <span>
                                                        -৳
                                                        {Math.round(
                                                            (roomData.price *
                                                                Math.ceil(
                                                                    (new Date(
                                                                        checkOutDate
                                                                    ).getTime() -
                                                                        new Date(
                                                                            checkInDate
                                                                        ).getTime()) /
                                                                        (1000 *
                                                                            60 *
                                                                            60 *
                                                                            24)
                                                                ) *
                                                                rooms *
                                                                appliedCoupon.coupon_percent) /
                                                                100
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        <hr className="my-2" />
                                        <div className="flex justify-between items-center font-bold">
                                            <span>Total</span>
                                            <span>
                                                ৳
                                                {(() => {
                                                    const baseTotal =
                                                        roomData.price *
                                                        Math.ceil(
                                                            (new Date(
                                                                checkOutDate
                                                            ).getTime() -
                                                                new Date(
                                                                    checkInDate
                                                                ).getTime()) /
                                                                (1000 *
                                                                    60 *
                                                                    60 *
                                                                    24)
                                                        ) *
                                                        rooms;

                                                    const discount =
                                                        appliedCoupon
                                                            ? Math.round(
                                                                  (baseTotal *
                                                                      appliedCoupon.coupon_percent) /
                                                                      100
                                                              )
                                                            : 0;

                                                    return (
                                                        baseTotal - discount
                                                    ).toLocaleString();
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3 mt-6">
                                    <button
                                        onClick={handleBookNow}
                                        className="btn btn-primary w-full"
                                    >
                                        <FaCalendarAlt className="mr-2" />
                                        BOOK NOW
                                    </button>

                                    <button
                                        onClick={addToCart}
                                        className="btn btn-outline btn-primary w-full"
                                    >
                                        <FaShoppingCart className="mr-2" />
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sign In Modal */}
            {showSignIn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                Sign In Required
                            </h3>
                            <button
                                onClick={() => setShowSignIn(false)}
                                className="btn btn-ghost btn-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-600 mb-4">
                                Please sign in to continue with your booking.
                            </p>
                            <SignInPage
                                onClose={() => setShowSignIn(false)}
                                onAuthSuccess={handleAuthSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Guest Registration Modal */}
            {showGuestForm && (
                <GuestRegistrationForm
                    onClose={() => setShowGuestForm(false)}
                    onSubmit={handleGuestBooking}
                    roomData={roomData}
                    bookingDetails={{
                        checkInDate: checkInDate,
                        checkOutDate: checkOutDate,
                        guests: guests,
                        rooms: rooms,
                    }}
                    appliedCoupon={appliedCoupon}
                    userData={getAuthenticatedUserData()}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </div>
    );
}

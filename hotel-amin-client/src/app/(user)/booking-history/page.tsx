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
    Star,
    MessageSquare,
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

interface BookingReview {
    review_id: number;
    review_text: string;
    rating: number;
    guest_name: string;
    created_date: string;
}

export default function BookingHistoryPage() {
    const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingReviews, setBookingReviews] = useState<{
        [key: number]: BookingReview;
    }>({});
    const [showReviewForm, setShowReviewForm] = useState<{
        [key: number]: boolean;
    }>({});
    const [reviewData, setReviewData] = useState<{
        [key: number]: { rating: number; review: string; guestName: string };
    }>({});
    const [submittingReview, setSubmittingReview] = useState<{
        [key: number]: boolean;
    }>({});

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    useEffect(() => {
        if (bookingHistory.length > 0) {
            fetchExistingReviews();
        }
    }, [bookingHistory]);

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

    const fetchExistingReviews = async () => {
        try {
            const tokenString = localStorage.getItem("accessToken");
            if (!tokenString) return;

            const token = JSON.parse(tokenString);
            const reviews: { [key: number]: BookingReview } = {};

            for (const booking of bookingHistory) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/feedback/booking-review/${booking.booking_id}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (response.ok) {
                        const reviewData = await response.json();
                        reviews[booking.booking_id] = reviewData;
                    }
                } catch (error) {
                    console.log(
                        `No review found for booking ${booking.booking_id}`
                    );
                }
            }

            setBookingReviews(reviews);
        } catch (error) {
            console.error("Error fetching existing reviews:", error);
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

    const isBookingCompleted = (booking: BookingHistory) => {
        const today = new Date();
        const checkoutDate = new Date(booking.checkout_date);
        return checkoutDate < today && booking.payment_status === "PAID";
    };

    const toggleReviewForm = (bookingId: number) => {
        setShowReviewForm((prev) => ({
            ...prev,
            [bookingId]: !prev[bookingId],
        }));

        if (!reviewData[bookingId]) {
            setReviewData((prev) => ({
                ...prev,
                [bookingId]: { rating: 5, review: "", guestName: "" },
            }));
        }
    };

    const handleReviewSubmit = async (bookingId: number) => {
        try {
            const tokenString = localStorage.getItem("accessToken");
            if (!tokenString) {
                toast.error("Please login to submit a review");
                return;
            }

            const token = JSON.parse(tokenString);
            const data = reviewData[bookingId];

            if (!data.review.trim()) {
                toast.error("Please write a review");
                return;
            }

            if (!data.guestName.trim()) {
                toast.error("Please enter your name");
                return;
            }

            setSubmittingReview((prev) => ({ ...prev, [bookingId]: true }));

            const tokenData = JSON.parse(atob(token.split(".")[1]));
            const userId = tokenData.sub;

            const response = await fetch(
                "http://localhost:3000/feedback/booking-review",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        booking_id: bookingId,
                        user_id: userId,
                        review_text: data.review,
                        rating: data.rating,
                        guest_name: data.guestName,
                    }),
                }
            );

            if (response.ok) {
                const newReview = await response.json();
                setBookingReviews((prev) => ({
                    ...prev,
                    [bookingId]: newReview,
                }));
                setShowReviewForm((prev) => ({
                    ...prev,
                    [bookingId]: false,
                }));
                toast.success("Review submitted successfully!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review");
        } finally {
            setSubmittingReview((prev) => ({ ...prev, [bookingId]: false }));
        }
    };

    const handleReviewChange = (
        bookingId: number,
        field: string,
        value: any
    ) => {
        setReviewData((prev) => ({
            ...prev,
            [bookingId]: {
                ...prev[bookingId],
                [field]: value,
            },
        }));
    };

    const renderStarRating = (bookingId: number, currentRating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() =>
                            handleReviewChange(bookingId, "rating", star)
                        }
                        className={`text-xl ${
                            star <= currentRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                    >
                        <Star className="h-5 w-5 fill-current" />
                    </button>
                ))}
            </div>
        );
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

                                {/* Review Section */}
                                {isBookingCompleted(booking) && (
                                    <div className="mt-6">
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            Your Review
                                        </h4>
                                        {bookingReviews[booking.booking_id] ? (
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Star className="h-5 w-5 text-yellow-400" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {
                                                                bookingReviews[
                                                                    booking
                                                                        .booking_id
                                                                ].rating
                                                            }{" "}
                                                            Star
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(
                                                            bookingReviews[
                                                                booking
                                                                    .booking_id
                                                            ].created_date
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm mb-2">
                                                    {
                                                        bookingReviews[
                                                            booking.booking_id
                                                        ].review_text
                                                    }
                                                </p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        By{" "}
                                                        {
                                                            bookingReviews[
                                                                booking
                                                                    .booking_id
                                                            ].guest_name
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-700 text-sm mb-2">
                                                    You have not reviewed this
                                                    booking
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        toggleReviewForm(
                                                            booking.booking_id
                                                        )
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 bg-[#0B3C5D] text-white rounded-md hover:bg-[#0a2e3b] transition"
                                                >
                                                    <Star className="h-4 w-4 mr-1" />
                                                    Leave a Review
                                                </button>
                                            </div>
                                        )}

                                        {/* Review Form */}
                                        {showReviewForm[booking.booking_id] && (
                                            <div className="mt-4 p-4 bg-white rounded-lg shadow">
                                                <h5 className="text-gray-900 font-medium mb-3">
                                                    Leave a Review for Booking #
                                                    {booking.booking_id}
                                                </h5>
                                                <div className="flex items-center mb-4">
                                                    {renderStarRating(
                                                        booking.booking_id,
                                                        reviewData[
                                                            booking.booking_id
                                                        ]?.rating || 0
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor={`review-${booking.booking_id}`}
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Your Review
                                                    </label>
                                                    <textarea
                                                        id={`review-${booking.booking_id}`}
                                                        value={
                                                            reviewData[
                                                                booking
                                                                    .booking_id
                                                            ]?.review
                                                        }
                                                        onChange={(e) =>
                                                            handleReviewChange(
                                                                booking.booking_id,
                                                                "review",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full p-2 text-sm border rounded-md focus:ring-[#0B3C5D] focus:border-[#0B3C5D] resize-none"
                                                        rows={3}
                                                        placeholder="Write your review here"
                                                    ></textarea>
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor={`guestName-${booking.booking_id}`}
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Your Name
                                                    </label>
                                                    <input
                                                        id={`guestName-${booking.booking_id}`}
                                                        type="text"
                                                        value={
                                                            reviewData[
                                                                booking
                                                                    .booking_id
                                                            ]?.guestName
                                                        }
                                                        onChange={(e) =>
                                                            handleReviewChange(
                                                                booking.booking_id,
                                                                "guestName",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full p-2 text-sm border rounded-md focus:ring-[#0B3C5D] focus:border-[#0B3C5D]"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            toggleReviewForm(
                                                                booking.booking_id
                                                            )
                                                        }
                                                        className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleReviewSubmit(
                                                                booking.booking_id
                                                            )
                                                        }
                                                        disabled={
                                                            submittingReview[
                                                                booking
                                                                    .booking_id
                                                            ]
                                                        }
                                                        className={`px-4 py-2 text-sm rounded-md transition ${
                                                            submittingReview[
                                                                booking
                                                                    .booking_id
                                                            ]
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-[#0B3C5D] text-white hover:bg-[#0a2e3b]"
                                                        }`}
                                                    >
                                                        {submittingReview[
                                                            booking.booking_id
                                                        ] ? (
                                                            <>
                                                                <svg
                                                                    className="animate-spin h-5 w-5 mr-3"
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
                                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                                    ></path>
                                                                </svg>
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            "Submit Review"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

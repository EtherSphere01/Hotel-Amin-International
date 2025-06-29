"use client";

import React, { useState, useEffect } from "react";
import { Star, User } from "lucide-react";

interface BookingReview {
    review_id: number;
    review_text: string;
    rating: number;
    guest_name: string;
    created_date: string;
    user: {
        user_id: number;
        name: string;
    };
    booking: {
        booking_id: number;
        checkin_date: string;
        checkout_date: string;
    };
}

const CustomerReviews = () => {
    const [reviews, setReviews] = useState<BookingReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingReviews();
    }, []);

    const fetchBookingReviews = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/feedback/booking-reviews",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setReviews(data.slice(0, 6)); // Show only latest 6 reviews
            } else {
                console.error("Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="py-14 px-4 md:px-16 lg:px-24 bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return null; // Don't show the section if there are no reviews
    }

    return (
        <div className="py-14 px-4 md:px-16 lg:px-24 bg-gray-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#0B3C5D] mb-4">
                    What Our Guests Say
                </h2>
                <p className="text-gray-600 text-lg">
                    Read reviews from our valued customers who have stayed with
                    us
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div
                        key={review.review_id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative"
                    >
                        {/* Rating */}
                        <div className="flex items-center justify-between mb-4">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                                {formatDate(review.created_date)}
                            </span>
                        </div>

                        <p
                            className="text-gray-700 mb-4 overflow-hidden"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            "{review.review_text}"
                        </p>

                        {/* Guest Info */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-center w-10 h-10 bg-[#0B3C5D] rounded-full">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {review.guest_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Stayed{" "}
                                    {new Date(
                                        review.booking.checkin_date
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4">
                            <div className="bg-[#F5A623] text-white px-2 py-1 rounded-full text-xs font-medium">
                                {review.rating}/5
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More Reviews Button */}
            {reviews.length >= 6 && (
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Enjoying great experiences at Hotel Amin International
                    </p>
                </div>
            )}
        </div>
    );
};

export default CustomerReviews;

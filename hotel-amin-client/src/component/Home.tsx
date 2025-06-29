"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/pagination";

import {
    FaShuttleVan,
    FaGlassCheers,
    FaUtensils,
    FaWifi,
    FaGamepad,
    FaParking,
    FaMapMarkedAlt,
    FaSnowflake,
    FaTshirt,
    FaUserMd,
    FaConciergeBell,
    FaCoffee,
    FaLock,
    FaHotTub,
    FaStar,
} from "react-icons/fa";
import AccommodationSlider from "./AccommodationSlider";
import DiscoverSection from "./DiscoverySection";

// Interfaces
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

// Fake FAQs data
const faqs = [
    {
        question: "Is there any extra charge like room service and vat?",
        answer: "No, We don’t have any extra charge. Our room price includes VAT.",
    },
    {
        question: "What are the check-in and check-out time",
        answer: "Check-in: 12:00 PM | Check-out: 11:00 AM",
    },
    {
        question: "If we want to check-in before 12 PM, is this possible?",
        answer: "Yes, depending on room availability. Early check-in may be allowed.",
    },
    {
        question: "Is there any swimming pool",
        answer: "No, currently we do not have a swimming pool.",
    },
];

// Sample places data
const places = [
    {
        title: "Inani Beach",
        image: "https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg",
        rating: 4.96,
        reviews: 672,
        description:
            "I've been staying at this hotel in Cox’s Bazar for several years now, and it has truly become my go-to getaway spot.",
    },
    {
        title: "Inani Beach 2",
        image: "https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg",
        rating: 4.96,
        reviews: 672,
        description:
            "I've been staying at this hotel in Cox’s Bazar for several years now, and it has truly become my go-to getaway spot.",
    },
    {
        title: "Mermaid Beach",
        image: "https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg",
        rating: 4.96,
        reviews: 672,
        description:
            "I've been staying at this hotel in Cox’s Bazar for several years now, and it has truly become my go-to getaway spot.",
    },
    {
        title: "Radient Fish World",
        image: "https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg",
        rating: 4.96,
        reviews: 672,
        description:
            "I've been staying at this hotel in Cox’s Bazar for several years now, and it has truly become my go-to getaway spot.",
    },
];

const Home = () => {
    const router = useRouter();
    const [searchData, setSearchData] = useState({
        checkIn: "",
        checkOut: "",
        guests: 1,
    });
    const [isSearching, setIsSearching] = useState(false);
    const [reviews, setReviews] = useState<BookingReview[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    // Fetch reviews on component mount
    useEffect(() => {
        fetchBookingReviews();
    }, []);

    const fetchBookingReviews = async () => {
        try {
            console.log("Fetching booking reviews from API...");
            const response = await fetch(
                "http://localhost:3000/feedback/booking-reviews",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Reviews API response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Reviews data received:", data);
                console.log("Number of reviews:", data.length);
                setReviews(data.slice(0, 6)); // Show only latest 6 reviews
            } else {
                console.error(
                    "Failed to fetch reviews - Status:",
                    response.status
                );
                const errorText = await response.text();
                console.error("Error response:", errorText);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSearchData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        try {
            setIsSearching(true);

            // Validate dates
            const checkInDate = new Date(searchData.checkIn);
            const checkOutDate = new Date(searchData.checkOut);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to beginning of day

            if (!searchData.checkIn || !searchData.checkOut) {
                toast.error("Please select both check-in and check-out dates");
                return;
            }

            if (checkInDate >= checkOutDate) {
                toast.error("Check-out date must be after check-in date");
                return;
            }

            if (checkInDate < today) {
                toast.error("Check-in date cannot be in the past");
                return;
            }

            // Validate guest count
            if (searchData.guests < 1 || searchData.guests > 20) {
                toast.error("Number of guests must be between 1 and 20");
                return;
            }

            const searchPayload = {
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                guests: searchData.guests,
            };

            console.log("Search payload:", searchPayload);

            // Make API call to search for available rooms
            const response = await fetch("http://localhost:3000/room/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchPayload),
            });

            const result = await response.json();
            console.log("Search result:", result);

            if (!response.ok) {
                toast.error(result.message || "Failed to search for rooms");
                return;
            }

            if (result.success && result.data) {
                // Navigate to search results page with the search data
                const searchParams = new URLSearchParams({
                    checkIn: searchData.checkIn,
                    checkOut: searchData.checkOut,
                    guests: searchData.guests.toString(),
                    results: JSON.stringify(result.data),
                });

                router.push(`/search-results?${searchParams.toString()}`);
            } else {
                toast.error("No available rooms found for the selected dates");
            }
        } catch (error) {
            console.error("Error searching for rooms:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <>
            <div
                className="hero min-h-screen bg-cover bg-center"
                style={{ backgroundImage: "url(/images/home/home-hero.jpeg)" }}
            >
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content w-full text-left px-6 md:px-16 lg:px-24 flex flex-col items-start justify-center">
                    <div className="max-w-2xl text-white">
                        <h1 className="mb-2 text-5xl font-bold">Welcome to</h1>
                        <h2 className="mb-4 text-5xl font-bold text-yellow-400">
                            Hotel Amin International
                        </h2>
                        <p className="mb-2 text-lg">
                            A privately owned 3 Star Standard Luxury Hotel in
                            Coxs Bazar, Bangladesh
                        </p>
                        <p className="mb-6 text-base">
                            Dolphin Circle, Kolatoli, Coxs Bazar. <br />{" "}
                            Hotline: 01886966602
                        </p>
                        <div className="bg-white bg-opacity-90 text-black p-5 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center max-w-3xl">
                            <div className="form-control w-full">
                                <label className="label text-sm font-semibold">
                                    Check-in
                                </label>
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={searchData.checkIn}
                                    onChange={handleSearchInputChange}
                                    min={getTodayDate()}
                                    className="input input-bordered w-full h-12"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label text-sm font-semibold">
                                    Check-out
                                </label>
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={searchData.checkOut}
                                    onChange={handleSearchInputChange}
                                    min={
                                        searchData.checkIn
                                            ? new Date(
                                                  new Date(
                                                      searchData.checkIn
                                                  ).getTime() +
                                                      24 * 60 * 60 * 1000
                                              )
                                                  .toISOString()
                                                  .split("T")[0]
                                            : getTodayDate()
                                    }
                                    className="input input-bordered w-full h-12"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label text-sm font-semibold">
                                    Guests
                                </label>
                                <div className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg h-12 shadow-sm hover:border-blue-300 transition-all duration-200 px-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchData((prev) => ({
                                                ...prev,
                                                guests: Math.max(
                                                    1,
                                                    prev.guests - 1
                                                ),
                                            }))
                                        }
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 transform ${
                                            searchData.guests <= 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed scale-95"
                                                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                        }`}
                                        disabled={searchData.guests <= 1}
                                        aria-label={`Decrease guests count to ${Math.max(
                                            1,
                                            searchData.guests - 1
                                        )}`}
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {searchData.guests}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            {searchData.guests === 1
                                                ? "Guest"
                                                : "Guests"}
                                        </div>
                                        <input
                                            type="number"
                                            name="guests"
                                            value={searchData.guests}
                                            onChange={(e) => {
                                                const value =
                                                    parseInt(e.target.value) ||
                                                    1;
                                                setSearchData((prev) => ({
                                                    ...prev,
                                                    guests: Math.max(
                                                        1,
                                                        Math.min(20, value)
                                                    ),
                                                }));
                                            }}
                                            min="1"
                                            max="20"
                                            className="sr-only"
                                            placeholder="1"
                                            aria-label="Number of guests"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchData((prev) => ({
                                                ...prev,
                                                guests: Math.min(
                                                    20,
                                                    prev.guests + 1
                                                ),
                                            }))
                                        }
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 transform ${
                                            searchData.guests >= 20
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed scale-95"
                                                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                        }`}
                                        disabled={searchData.guests >= 20}
                                        aria-label={`Increase guests count to ${Math.min(
                                            20,
                                            searchData.guests + 1
                                        )}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                className="btn btn-warning mt-4 md:mt-7 w-full md:w-32 h-12"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Search"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AccommodationSlider />

            <div className="py-14 px-4 md:px-16 lg:px-24 bg-blue-50">
                <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
                    HOTEL SERVICES AND FACILITIES
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                    {[
                        {
                            label: "Airport Pickup",
                            icon: (
                                <FaShuttleVan className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Welcome Drinks",
                            icon: (
                                <FaGlassCheers className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Restaurant",
                            icon: (
                                <FaUtensils className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Wifi - Internet",
                            icon: (
                                <FaWifi className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Billiard Board(CS)",
                            icon: (
                                <FaGamepad className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Free Parking",
                            icon: (
                                <FaParking className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Travel Desk",
                            icon: (
                                <FaMapMarkedAlt className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Mini Fridge",
                            icon: (
                                <FaSnowflake className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Laundry Service",
                            icon: (
                                <FaTshirt className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Doctor on call",
                            icon: (
                                <FaUserMd className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "24h Room Service",
                            icon: (
                                <FaConciergeBell className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Coffee & Juice Shop",
                            icon: (
                                <FaCoffee className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Safe Deposit Box",
                            icon: (
                                <FaLock className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                        {
                            label: "Hot water",
                            icon: (
                                <FaHotTub className="text-3xl text-blue-700 mx-auto" />
                            ),
                        },
                    ].map((service, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                        >
                            {service.icon}
                            <p className="mt-2 text-sm font-medium text-gray-700">
                                {service.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-100% px-4 md:px-16 lg:px-24 bg-white text-center py-10">
                <h2 className="text-3xl font-bold text-blue-900 mb-10">
                    DISCOVER COX’S BAZAR
                </h2>
            </div>

            <DiscoverSection />

            <div className="py-14 px-4 md:px-16 lg:px-24 bg-white">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0B3C5D] mb-4">
                        WHAT OUR CUSTOMER SAY
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto">
                    {reviewsLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading reviews...
                            </p>
                        </div>
                    ) : reviews.length > 0 ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="mb-6">
                                    {renderStars(reviews[0].rating)}
                                </div>
                                <div className="mb-4">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-600">
                                            {reviews[0].guest_name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#0B3C5D] mb-2">
                                        {reviews[0].guest_name}
                                    </h3>
                                </div>
                                <p className="text-gray-700 text-lg italic max-w-3xl mx-auto leading-relaxed">
                                    "{reviews[0].review_text}"
                                </p>
                                <div className="mt-4 text-sm text-gray-500">
                                    -- {reviews[0].guest_name} --
                                </div>
                            </div>

                            {reviews.length > 1 && (
                                <div className="flex justify-center items-center space-x-4 mb-8">
                                    {reviews
                                        .slice(1, 5)
                                        .map((review, index) => (
                                            <div
                                                key={review.review_id}
                                                className="flex-shrink-0"
                                            >
                                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold text-gray-600">
                                                        {review.guest_name.charAt(
                                                            0
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {reviews.length > 1 && (
                                <div className="flex justify-center space-x-2">
                                    {reviews.slice(0, 5).map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-2 h-2 rounded-full ${
                                                index === 0
                                                    ? "bg-[#F5A623]"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <FaStar className="text-2xl text-gray-400" />
                            </div>
                            <p className="text-gray-500 italic">
                                No customer reviews yet. Be the first to share
                                your experience!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="py-14 px-4 md:px-16 lg:px-24 bg-white">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Frequently Asked{" "}
                    <span className="text-yellow-500">Questions</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-[260px] h-[260px]">
                            <Image
                                src="/images/home/faq.png"
                                alt="FAQ Illustration"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 80vw, 300px"
                                priority
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="collapse collapse-arrow bg-base-100 border border-base-200"
                            >
                                <input type="checkbox" />
                                <div className="collapse-title text-sm font-semibold">
                                    {faq.question}
                                </div>
                                <div className="collapse-content text-sm text-gray-600">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

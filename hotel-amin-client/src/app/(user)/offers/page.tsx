"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const offersByDate: Record<
    string,
    { category: "Rooms" | "Foods"; data: OfferItem[] }[]
> = {
    "2025-06-10": [
        {
            category: "Rooms",
            data: [
                {
                    title: "Deluxe Room 10% Off",
                    image: "/assets/room1.jpg",
                    rating: 4.8,
                    reviews: 340,
                    description: "Save 10% on our Deluxe Rooms this summer!",
                },
            ],
        },
        {
            category: "Foods",
            data: [
                {
                    title: "Free Breakfast Buffet",
                    image: "/assets/food1.jpg",
                    rating: 4.9,
                    reviews: 128,
                    description:
                        "Enjoy a complimentary breakfast buffet with fresh local dishes.",
                },
                {
                    title: "Seafood Dinner Combo",
                    image: "/assets/food2.jpg",
                    rating: 4.6,
                    reviews: 89,
                    description:
                        "Seafood dinner combo at 20% off for June 10 only.",
                },
            ],
        },
    ],
    "2025-06-15": [
        {
            category: "Rooms",
            data: [
                {
                    title: "20% Off Executive Suites",
                    image: "/assets/room2.jpg",
                    rating: 4.95,
                    reviews: 256,
                    description:
                        "Relax in our premium executive suites at a discounted rate.",
                },
            ],
        },
    ],
    "2025-06-29": [
        {
            category: "Rooms",
            data: [
                {
                    title: "20% Off Executive Suites",
                    image: "/assets/room2.jpg",
                    rating: 4.95,
                    reviews: 256,
                    description:
                        "Relax in our premium executive suites at a discounted rate.",
                },
            ],
        },
    ],
    "2025-07-03": [
        {
            category: "Rooms",
            data: [
                {
                    title: "20% Off Executive Suites",
                    image: "/assets/room2.jpg",
                    rating: 4.95,
                    reviews: 256,
                    description:
                        "Relax in our premium executive suites at a discounted rate.",
                },
            ],
        },
    ],
};

type OfferItem = {
    title: string;
    image: string;
    rating: number;
    reviews: number;
    description: string;
};

function isSameDate(date1: Date, date2: Date): boolean {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export default function OffersPage() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthYearLabel = new Date(
        currentYear,
        currentMonth
    ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const dates = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
        if (i < firstDay) return null;
        return new Date(currentYear, currentMonth, i - firstDay + 1);
    });

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const getOffersForSelected = (): Record<"Rooms" | "Foods", OfferItem[]> => {
        const key = selectedDate?.toISOString().split("T")[0];
        const offers = offersByDate[key || ""] || [];
        return {
            Rooms: offers.find((o) => o.category === "Rooms")?.data || [],
            Foods: offers.find((o) => o.category === "Foods")?.data || [],
        };
    };

    const { Rooms, Foods } = getOffersForSelected();

    return (
        <div className="bg-[#f0f8ff] min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Offers & Packages
                </h1>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    Choose a date to explore room discounts and food offers
                    available at Hotel Amin International.
                </p>

                {/* Calendar Section */}
                <div className="bg-white rounded-lg shadow p-6 inline-block mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={goToPreviousMonth}>
                            <ChevronLeft />
                        </button>
                        <h2 className="font-semibold">{monthYearLabel}</h2>
                        <button onClick={goToNextMonth}>
                            <ChevronRight />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center font-semibold text-gray-700 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-sm text-center">
                        {dates.map((date, idx) => {
                            const key = date?.toISOString().split("T")[0];
                            const isOffer = key && offersByDate[key];
                            const isSelected =
                                selectedDate &&
                                date &&
                                isSameDate(date, selectedDate);
                            return (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        date && setSelectedDate(date)
                                    }
                                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                        isSelected
                                            ? "bg-blue-700 text-white"
                                            : isOffer
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-700"
                                    }`}
                                    disabled={!date}
                                >
                                    {date ? date.getDate() : ""}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Offers Slider */}
                {selectedDate && (
                    <div className="text-left space-y-10">
                        {/* Rooms Offers */}
                        {Rooms.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">
                                    Room Offers
                                </h2>
                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={1.2}
                                    breakpoints={{
                                        768: { slidesPerView: 2.2 },
                                        1024: { slidesPerView: 3.2 },
                                    }}
                                >
                                    {Rooms.map((offer, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="bg-white rounded-lg shadow p-4">
                                                <Image
                                                    src={offer.image}
                                                    alt={offer.title}
                                                    width={400}
                                                    height={240}
                                                    className="w-full h-48 object-cover rounded mb-3"
                                                />
                                                <h3 className="font-bold text-lg text-[#0B3C5D]">
                                                    {offer.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {offer.description}
                                                </p>
                                                <p className="text-sm mt-2 text-gray-500">
                                                    ⭐ {offer.rating} (
                                                    {offer.reviews} reviews)
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}

                        {/* Food Offers */}
                        {Foods.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">
                                    Food Offers
                                </h2>
                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={1.2}
                                    breakpoints={{
                                        768: { slidesPerView: 2.2 },
                                        1024: { slidesPerView: 3.2 },
                                    }}
                                >
                                    {Foods.map((offer, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="bg-white rounded-lg shadow p-4">
                                                <Image
                                                    src={offer.image}
                                                    alt={offer.title}
                                                    width={400}
                                                    height={240}
                                                    className="w-full h-48 object-cover rounded mb-3"
                                                />
                                                <h3 className="font-bold text-lg text-[#0B3C5D]">
                                                    {offer.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {offer.description}
                                                </p>
                                                <p className="text-sm mt-2 text-gray-500">
                                                    ⭐ {offer.rating} (
                                                    {offer.reviews} reviews)
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}

                        {Rooms.length === 0 && Foods.length === 0 && (
                            <p className="text-center text-gray-500 mt-10">
                                No offers available for this date.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRouter } from "next/navigation";
import axios from "axios";

const fallbackAccommodations = [
    {
        title: "Family Suits Room",
        img: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
        price: "1,800/- TK",
        specs: [
            "Max 4 Adults",
            "2 Large Beds",
            "AC & Geyser",
            "Spacious Interior",
        ],
    },
    {
        title: "Deluxe Couple Room",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        price: "2,200/- TK",
        specs: [
            "Max 2 Adults + 1 Child",
            "Bed Size (6 X 7 Feet)",
            "AC & Geyser",
            "Well Interior",
        ],
    },
    {
        title: "Premium Couple",
        img: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
        price: "2,800/- TK",
        specs: [
            "Max 2 Adults",
            "Luxury Queen Bed",
            "AC & Smart TV",
            "Modern Interior",
        ],
    },
    {
        title: "Executive Suite",
        img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
        price: "3,500/- TK",
        specs: [
            "Max 3 Adults + 2 Children",
            "King Size Bed",
            "Premium A/C",
            "High Speed Wifi",
        ],
    },
];

const AccommodationSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);
    const [accommodationData, setAccommodationData] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchAccommodationData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/accommodation/all"
                );
                setAccommodationData(response.data);
            } catch (error) {
                console.error("Error fetching accommodation data:", error);
            }
        };
        fetchAccommodationData();
    }, []);

    const handlePrev = () => swiperRef.current?.slidePrev(500);
    const handleNext = () => swiperRef.current?.slideNext(500);

    const handleBookNow = (roomId: number) => {
        router.push(`/accommodation/${roomId}`);
    };

    const handleDetails = (roomId: number) => {
        router.push(`/accommodation/${roomId}`);
    };

    const displayData =
        accommodationData.length > 0
            ? accommodationData
            : fallbackAccommodations;

    return (
        <div className="py-14 px-4 md:px-16 lg:px-24 bg-white relative">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
                ACCOMMODATION
            </h2>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 hover:bg-white/90 shadow-lg p-3 rounded-full backdrop-blur-sm"
                aria-label="Previous Slide"
            >
                <svg
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 hover:bg-white/90 shadow-lg p-3 rounded-full backdrop-blur-sm"
                aria-label="Next Slide"
            >
                <svg
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                slidesPerView={3}
                centeredSlides
                loop
                spaceBetween={30}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={false}
                modules={[Pagination, Autoplay]}
                breakpoints={{
                    0: { slidesPerView: 1.1 },
                    640: { slidesPerView: 1.5 },
                    1024: { slidesPerView: 3 },
                }}
                className="pb-10"
            >
                {displayData.map((room, index) => (
                    <SwiperSlide key={index}>
                        <div
                            onClick={() =>
                                swiperRef.current?.slideToLoop(index, 500)
                            }
                            className={`transition-all duration-300 w-full flex justify-center cursor-pointer ${
                                activeIndex === index
                                    ? "scale-105 z-10"
                                    : "scale-95 opacity-60"
                            }`}
                        >
                            <div className="bg-white rounded-lg shadow-xl w-80">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={room?.images?.[0] || room.img}
                                        alt={room.title}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {room.title}
                                    </h3>
                                    {activeIndex === index && (
                                        <>
                                            <p className="text-blue-900 font-bold text-sm mb-2">
                                                {room.price} /- Per Night
                                            </p>
                                            <ul className="text-left space-y-1 text-sm text-gray-700 mb-4">
                                                {(room.specs || []).map(
                                                    (
                                                        spec: string,
                                                        i: number
                                                    ) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <FaCheckCircle className="text-blue-500 text-xs" />
                                                            {spec}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleBookNow(
                                                            room.id || index
                                                        )
                                                    }
                                                    className="btn btn-warning btn-sm w-28"
                                                >
                                                    BOOK NOW
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDetails(
                                                            room.id || index
                                                        )
                                                    }
                                                    className="btn btn-outline btn-sm w-28"
                                                >
                                                    DETAILS
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination */}
            <div className="text-center text-gray-600 font-medium mt-4">
                {activeIndex + 1} / {displayData.length}
            </div>
        </div>
    );
};

export default AccommodationSlider;

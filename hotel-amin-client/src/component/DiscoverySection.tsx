"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FaStar } from "react-icons/fa";
import "swiper/css";

// Sample data 
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

const DiscoverSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="py-14 px-4 md:px-16 lg:px-24 bg-white text-center relative">
      <h2 className="text-3xl font-bold text-blue-900 mb-10">
        DISCOVER COX’S BAZAR
      </h2>

      {/* Navigation buttons */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={swiperRef.current?.isBeginning}
        className={`absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${
          swiperRef.current?.isBeginning
            ? "bg-yellow-300 cursor-not-allowed opacity-50"
            : "bg-[#F88600] hover:bg-[#e27c00] cursor-pointer"
        }`}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
        onClick={() => swiperRef.current?.slideNext()}
        disabled={swiperRef.current?.isEnd}
        className={`absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${
          swiperRef.current?.isEnd
            ? "bg-yellow-300 cursor-not-allowed opacity-50"
            : "bg-[#F88600] hover:bg-[#e27c00] cursor-pointer"
        }`}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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

      {/* Swiper Carousel */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-8 max-w-6xl mx-auto"
      >
        {places.map((place, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-xl overflow-hidden bg-white shadow-lg mb-6 mx-2">
              <div className="relative w-full h-56">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{place.title}</h3>
                <div className="flex items-center text-sm text-blue-800 mb-2 gap-1">
                  <FaStar className="text-yellow-400" />
                  {place.rating}
                  <span className="text-gray-600 ml-1">
                    ({place.reviews} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{place.description}</p>
                <button className="btn btn-sm bg-[#F88600] rounded-full text-white">
                  Read More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Discover More Button */}
      <button className="btn mt-6 bg-[#F88600] px-8 text-white font-semibold">
        Discover More
      </button>
    </div>
  );
};

export default DiscoverSection;

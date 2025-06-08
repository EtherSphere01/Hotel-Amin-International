"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

const accommodations = [
  {
    title: "Family Suits Room",
    img: "https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg",
    price: "1,800/- TK, Per Night",
    features: [
      "Max 4 Adults",
      "2 Large Beds",
      "AC & Geyser",
      "Spacious Interior",
    ],
  },
  {
    title: "Deluxe Couple Room",
    img: "https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg",
    price: "2,200/- TK, Per Night",
    features: [
      "Max 2 Adults + 1 Child",
      "Bed Size (6 X 7 Feet)",
      "AC & Geyser",
      "Well Interior",
    ],
  },
  {
    title: "Premium Couple",
    img: "https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg",
    price: "2,800/- TK, Per Night",
    features: [
      "Max 2 Adults",
      "Luxury Queen Bed",
      "AC & Smart TV",
      "Modern Interior",
    ],
  },
  {
    title: "Premium Couple",
    img: "https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg",
    price: "2,800/- TK, Per Night",
    features: [
      "Max 2 Adults",
      "Luxury Queen Bed",
      "AC & Smart TV",
      "Modern Interior",
    ],
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      {/* Hero Section */}
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
              A privately owned 3 Star Standard Luxury Hotel in Coxs Bazar,
              Bangladesh
            </p>
            <p className="mb-6 text-base">
              Dolphin Circle, Kolatoli, Coxs Bazar. <br /> Hotline: 01886966602
            </p>
            <div className="bg-white bg-opacity-90 text-black p-5 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center max-w-3xl">
              <div className="form-control w-full">
                <label className="label text-xs font-semibold">Check-in</label>
                <input
                  type="date"
                  defaultValue="2025-06-19"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label text-xs font-semibold">Check-out</label>
                <input
                  type="date"
                  defaultValue="2025-06-24"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label text-xs font-semibold">Guests</label>
                <select className="select select-bordered w-full">
                  <option>1 adult</option>
                  <option>2 adults</option>
                  <option>3 adults</option>
                </select>
              </div>
              <button className="btn btn-warning mt-4 md:mt-7 w-full md:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation Slider */}
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
          ACCOMMODATION
        </h2>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          slidesPerView={3}
          centeredSlides={true}
          loop
          spaceBetween={30}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={false}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            0: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {accommodations.map((room, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={`transition-all duration-300 ease-in-out w-full flex justify-center cursor-pointer ${
                  activeIndex === index
                    ? "scale-105 z-10"
                    : "scale-95 opacity-60"
                }`}
              >
                <div className="bg-white rounded-lg shadow-xl w-80">
                  <div className="relative w-full h-48">
                    <Image
                      src={room.img}
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
                          {room.price}
                        </p>
                        <ul className="text-left space-y-1 text-sm text-gray-700 mb-4">
                          {room.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <FaCheckCircle className="text-blue-500 text-xs" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 justify-center">
                          <button className="btn btn-warning btn-sm w-28">
                            BOOK NOW
                          </button>
                          <button className="btn btn-outline btn-sm w-28">
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

        {/* Custom pagination */}
        <div className="text-center text-gray-600 font-medium mt-4">
          {activeIndex + 1} / {accommodations.length}
        </div>
      </div>  
    </>
  );
};

export default Home;

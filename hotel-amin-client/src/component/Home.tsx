"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";


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

// Fake accommodations data
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

// Fake discovery places data
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


const Home = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const swiperRef = useRef < SwiperType | null > (null);

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
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-white relative">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
          ACCOMMODATION
        </h2>

        {/* Left arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="flex items-center justify-center absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 hover:bg-white/90 shadow-lg p-3 rounded-full transition duration-300 backdrop-blur-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="flex items-center justify-center absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20  hover:bg-white/90 shadow-lg p-3 rounded-full transition duration-300 backdrop-blur-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

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
                className={`transition-all duration-300 ease-in-out w-full flex justify-center cursor-pointer ${activeIndex === index ? "scale-105 z-10" : "scale-95 opacity-60"
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

      {/*Services  Section */}
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
        HOTEL SERVICES AND FACILITIES
      </h2>
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-blue-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
          {[
            { label: "Airport Pickup", icon: <FaShuttleVan className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Welcome Drinks", icon: <FaGlassCheers className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Restaurant", icon: <FaUtensils className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Wifi - Internet", icon: <FaWifi className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Billiard Board(CS)", icon: <FaGamepad className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Free Parking", icon: <FaParking className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Travel Desk", icon: <FaMapMarkedAlt className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Mini Fridge", icon: <FaSnowflake className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Laundry Service", icon: <FaTshirt className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Doctor on call", icon: <FaUserMd className="text-3xl text-blue-700 mx-auto" /> },
            { label: "24h Room Service", icon: <FaConciergeBell className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Coffee & Juice Shop", icon: <FaCoffee className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Safe Deposit Box", icon: <FaLock className="text-3xl text-blue-700 mx-auto" /> },
            { label: "Hot water", icon: <FaHotTub className="text-3xl text-blue-700 mx-auto" /> },
          ].map((service, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition">
              {service.icon}
              <p className="mt-2 text-sm font-medium text-gray-700">{service.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Section */}
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-white text-center relative">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">
          DISCOVER COX’S BAZAR
        </h2>

        {/* Custom navigation buttons */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={swiperRef.current?.isBeginning}
          className={`absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${swiperRef.current?.isBeginning
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
          className={`absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${swiperRef.current?.isEnd
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
                  <div className="flex items-center text-sm text-blue-800 mb-2 gap-1 ">
                    <FaStar className="text-yellow-400" />
                    {place.rating}
                    <span className="text-gray-600 ml-1">({place.reviews} reviews)</span>
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

        <button className="btn mt-6 bg-[#F88600] px-8 text-white font-semibold">
          Discover More
        </button>
      </div>


      {/* Feedback Section */}


      {/* FAQ Section */}
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked <span className="text-yellow-500">Questions</span>
        </h2>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          {/* Question Mark Image */}
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

          {/* FAQ Collapsible Section */}
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

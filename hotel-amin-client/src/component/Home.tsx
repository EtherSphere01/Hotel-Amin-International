"use client";

import React from "react";
import Image from "next/image";
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
      <AccommodationSlider />

      {/*Services  Section */}
      <div className="py-14 px-4 md:px-16 lg:px-24 bg-blue-50">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
          HOTEL SERVICES AND FACILITIES
        </h2>
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

      <div className="w-100% px-4 md:px-16 lg:px-24 bg-white text-center py-10">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">
        DISCOVER COX’S BAZAR
        </h2>
      </div>
      {/* Discover Section */}
      <DiscoverSection places={places} />

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

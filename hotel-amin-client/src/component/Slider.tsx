"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import "swiper/css";

type SlideItem = {
  title: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
};

type ReusableSliderProps = {
  data: SlideItem[];
};

const ReusableSlider = ({ data }: ReusableSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="py-14 px-4 md:px-16 lg:px-24 bg-white text-center relative">

      {/* Navigation buttons */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={swiperRef.current?.isBeginning}
        className={`absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${
          swiperRef.current?.isBeginning
            ? "bg-gray-300 cursor-not-allowed opacity-50"
            : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
        }`}
      >
        &lt;
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        disabled={swiperRef.current?.isEnd}
        className={`absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 h-11 w-11 rounded-full text-white shadow-md transition duration-200 flex items-center justify-center ${
          swiperRef.current?.isEnd
            ? "bg-gray-300 cursor-not-allowed opacity-50"
            : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
        }`}
      >
        &gt;
      </button>

      {/* Swiper Carousel */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-8 max-w-6xl mx-auto"
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-xl overflow-hidden bg-white shadow-lg mb-6 mx-2">
              <div className="relative w-full h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                <div className="flex items-center text-sm text-blue-800 mb-2 gap-1">
                  <FaStar className="text-yellow-400" />
                  {item.rating}
                  <span className="text-gray-600 ml-1">
                    ({item.reviews} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
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
  );
};

export default ReusableSlider;

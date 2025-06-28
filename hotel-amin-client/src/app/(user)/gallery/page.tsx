'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['All', 'Rooms & Suites', 'Restaurant', 'Interior & Exterior', 'Scenic Surroundings'];

const galleryData = [
  {
    category: 'Rooms & Suites',
    images: [
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
    ],
  },
  {
    category: 'Restaurant',
    images: [
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
    ],
  },
  {
    category: 'Interior & Exterior',
    images: [
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
      'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
    ],
  },
  {
    category: 'Scenic Surroundings',
    details: [
      {
        title: 'Kolatoli Beach',
        image: 'https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg',
        description: 'Just steps away from Hotel Amin International, this beach offers a beautiful stretch of golden sand.',
      },
      {
        title: 'Marine Drive',
        image: 'https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg',
        description: 'Scenic coastal road with stunning ocean views. Great for peaceful drives or walks.',
      },
      {
        title: 'Himchari',
        image: 'https://www.solimarinternational.com/wp-content/uploads/sea-3243357_1280-1.jpg',
        description: 'Lush green hills, waterfalls, and sea view. Ideal for nature lovers and photographers.',
      },
    ],
  },
];

export default function GalleryPage() {
  const [selected, setSelected] = useState('All');

  // Store swiper refs
  const swiperRefs = useRef([]);

  const filteredData =
    selected === 'All' ? galleryData : galleryData.filter((d) => d.category === selected);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 text-sm rounded-full border ${
              selected === cat ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Sections */}
      {filteredData.map((section, i) => (
        <div key={i}>
          <h2 className="text-lg font-semibold mb-2">{section.category}</h2>

          {/* Image Slider */}
          {section.images && (
            <div className="relative">
              {/* Left Arrow */}
              <button
                className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow border"
                onClick={() => swiperRefs.current[i]?.slidePrev()}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <Swiper
                spaceBetween={10}
                slidesPerView={3}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => (swiperRefs.current[i] = swiper)}
                navigation={false}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-8"
              >
                {section.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      src={img}
                      alt={`Image ${idx + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-[160px] object-cover rounded"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Arrow */}
              <button
                className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow border"
                onClick={() => swiperRefs.current[i]?.slideNext()}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Scenic Info Cards */}
          {section.details && (
  <div className="grid md:grid-cols-2 gap-10 mt-10">
    {section.details.map((item, idx) => (
      <div key={idx} className="flex flex-col items-start gap-4">
        {/* Conditional layout: image on left/right */}
        {idx % 2 === 0 ? (
          <>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="rounded shadow-md"
            />
            <div className="border-l-4 pl-4 border-[#0B3C5D]">
              <h3 className="uppercase font-bold text-[#0B3C5D] text-lg">{item.title}</h3>
              <p className="text-gray-800 mt-2 text-justify">{item.description}</p>
            </div>
          </>
        ) : (
          <>
            <div className="border-r-4 pr-4 border-[#FF9900] text-right self-end">
              <h3 className="uppercase font-bold text-[#FF9900] text-lg">{item.title}</h3>
              <p className="text-gray-800 mt-2 text-justify">{item.description}</p>
            </div>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="rounded shadow-md self-end"
            />
          </>
        )}
      </div>
    ))}
  </div>
)}

        </div>
      ))}
    </div>
  );
}

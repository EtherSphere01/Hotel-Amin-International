'use client';

import React from 'react';
import Image from 'next/image';

const roomData = [
  {
    category: 'Premium Rooms',
    description:
      'Our stylish and well-appointed Guest Rooms offer the very best in comfort and privacy, while providing a peaceful retreat in which to relax and unwind throughout your stay.',
    rooms: [
      {
        title: 'Premium Double Room',
        price: '4,400/- TK, Per Night',
        description: 'Max 3 Adults',
        specs: [
          'Bed Size (6*7 Feet) And (4*7 Feet)',
          'AC & Geyser',
          'Well Interior',
          'Colorful Lighting',
        ],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Premium Three Bed Room',
        price: '3,630/- TK, Per Night',
        description: 'Max 2 Adults + 1 child',
        specs: [
          'Bed Size (6*7 Feet)',
          'AC & Geyser',
          'Well Interior',
          'Colorful Lighting',
        ],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Premium Couple',
        price: '3,080/- TK, Per Night',
        description: 'Max 2 Adults + 1 child',
        specs: [
          'Bed Size (6*7 Feet)',
          'AC & Geyser',
          'Well Interior',
          'Colorful Lighting',
        ],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
    ],
  },
  {
    category: 'Deluxe Rooms',
    description:
      'Elegant Deluxe Rooms with a modern aesthetic. These air-conditioned, heater-provided units offer cozy space & small decor to help you relax and rejuvenate during your stay.',
    rooms: [
      {
        title: 'Super Deluxe Couple Room',
        price: '3,875/- TK, Per Night',
        description: 'Max 2 Adults',
        specs: ['Bed Size (6*7 Feet)', 'AC & Geyser', 'Modern Decor'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Deluxe Couple Room',
        price: '3,630/- TK, Per Night',
        description: 'Max 2 Adults',
        specs: ['Bed Size (6*7 Feet)', 'AC & Geyser', 'Sofa, Decor'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Deluxe Twin Room',
        price: '2,900/- TK, Per Night',
        description: 'Max 2 Adults',
        specs: ['2x Single Beds', 'AC & Geyser', 'Simple Interior'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Deluxe Double Room',
        price: '3,150/- TK, Per Night',
        description: 'Max 2 Adults',
        specs: ['Bed Size (6*7 Feet)', 'AC & Geyser', 'Basic Decor'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
    ],
  },
  {
    category: 'Family Suites Rooms',
    description:
      'Spacious and cozy family suites for your comfort, with added lighting and modern facilities. Great for families both short term and extended stay.',
    rooms: [
      {
        title: 'Family Suite 1',
        price: '5,000/- TK, Per Night',
        description: 'Max 4 Adults',
        specs: ['2x Double Beds', 'AC & Geyser', 'Modern Family Space'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
      {
        title: 'Family Suite 2',
        price: '5,500/- TK, Per Night',
        description: 'Max 4 Adults + 1 child',
        specs: ['2x Double Beds', 'AC & Geyser', 'Living Space'],
        images: [
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
          'https://longbeachhotelbd.com/wp-content/uploads/2024/02/superior-deluxe-room-05.jpg',
        ],
      },
    ],
  },
];

export default function RoomCategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-16">
      <h2 className="text-2xl font-bold">
        All Accommodations ({roomData.reduce((acc, cat) => acc + cat.rooms.length, 0)})
      </h2>

      {roomData.map((section, catIdx) => (
        <div key={catIdx} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">
              {section.category.toUpperCase()} ({section.rooms.length})
            </h3>
            <p className="text-sm text-gray-700 mt-1">{section.description}</p>
          </div>

          <div className="space-y-12 px-8">
            {section.rooms.map((room, index) => {
              const isReversed = index % 2 !== 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-6 ${isReversed ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`md:w-1/2 w-full ${isReversed ? 'md:-ml-80' : ''}`}>
                    <div className="relative w-full rounded overflow-hidden">
                      <div className="carousel w-full rounded-box">
                        {room.images.map((img, idx) => (
                          <div
                            key={idx}
                            id={`cat${catIdx}-room${index}-slide${idx}`}
                            className="carousel-item relative w-full"
                          >
                            <Image
                              src={img}
                              alt={`Room ${index} Image ${idx + 1}`}
                              width={700}
                              height={450}
                              className={`rounded w-full object-cover`}
                            />

                            <a
                              href={`#cat${catIdx}-room${index}-slide${(idx - 1 + room.images.length) % room.images.length}`}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
                            >
                              ❮
                            </a>
                            <a
                              href={`#cat${catIdx}-room${index}-slide${(idx + 1) % room.images.length}`}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
                            >
                              ❯
                            </a>

                            <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                              {idx + 1} / {room.images.length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                {/* info */}
                  <div className="divider divider-horizontal divider-start"></div>
                  <div className={`md:w-1/2 w-full space-y-2 ${isReversed ? '' : ''}`}>
                    <p className="text-red-600 text-lg font-semibold">{room.price}</p>
                    <h4 className="text-base font-semibold">{room.title}</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      <li>{room.description}</li>
                      {room.specs.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2 pt-2">
                      <button className="btn btn-warning btn-sm">BOOK NOW</button>
                      <button className="btn btn-outline btn-sm">DETAILS</button>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
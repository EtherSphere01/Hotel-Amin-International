'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  {
    id: 1,
    title: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    description: 'Indulgent sweet treats and delectable desserts',
  },
  {
    id: 2,
    title: 'Dishes',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    description: 'Hearty main courses and signature dishes',
  },
  {
    id: 3,
    title: 'Juices',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&fit=crop',
    description: 'Fresh squeezed juices and healthy beverages',
  },
  {
    id: 4,
    title: 'Snacks',
    image: 'https://images.unsplash.com/photo-1505253210343-d6d4fa8a0b9b?w=800&h=600&fit=crop',
    description: 'Light snacks and appetizers for any time',
  },
];

const Restaurant = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % menuItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % menuItems.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + menuItems.length) % menuItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };
  interface MenuCardProps {
  title: string;
  image: string;
  description: string;
  isActive: boolean;
}

const MenuCard = ({ title, image, description, isActive }: MenuCardProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-1000 ${
            isActive ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="relative h-full flex flex-col justify-center items-center text-center px-8">
        <div
          className={`transform transition-all duration-700 ${
            isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-lg md:text-xl text-white/90 max-w-md leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>

        <div
          className={`absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full transition-all duration-700 ${
            isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        ></div>

        <div
          className={`absolute bottom-8 right-8 w-12 h-12 border-2 border-white/30 rotate-45 transition-all duration-700 delay-200 ${
            isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        ></div>
      </div>
    </div>
  );
};

  return (
    <div className="w-full">
      {/* Top Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <Image
          src="/images/Res/Res-1.png"
          alt="Hotel Restaurant"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Intro */}
      <div className="bg-white bg-opacity-90 text-center px-4 py-10">
        <p className="text-base md:text-lg font-medium text-black max-w-3xl mx-auto leading-relaxed">
          Discover unforgettable flavors at <strong>Hotel Amin International</strong> in the heart of Cox’s Bazar.
          Enjoy local and international dishes at our rooftop restaurant with stunning sea views,
          relax with a drink at the lounge, or grab a quick snack from our cozy lobby café.
        </p>
        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold shadow transition-all">
          Book Table
        </button>
      </div>

      {/* Menu Slider */}
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">OUR MENU</h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
          <div className="relative h-[300px] md:h-[350px]">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {menuItems.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <MenuCard {...item} isActive={index === currentSlide} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {menuItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-orange-500 scale-125'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* View Details */}
          <div className="absolute bottom-15 left-1/2 -translate-x-1/2 z-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              View Details
            </button>
          </div>
        </div>

        {/* Thumbnail Nav */}
        <div className="flex justify-center mt-8 flex-wrap gap-4">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                index === currentSlide
                  ? 'ring-4 ring-orange-400 scale-105'
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-16 object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-1 left-1 right-1 text-white text-xs font-medium text-center">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Restaurant;



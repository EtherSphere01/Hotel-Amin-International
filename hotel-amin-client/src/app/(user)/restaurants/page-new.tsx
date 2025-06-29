"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface MenuItem {
    food_id: number;
    item_name: string;
    item_price: number;
    food_type: string;
    description: string;
    availability: boolean;
}

const Restaurant = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/restaurant/menu"
                );
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const categories = [
        { id: "all", name: "ALL", color: "bg-orange-500" },
        { id: "breakfast", name: "BREAKFAST", color: "bg-orange-500" },
        { id: "lunch", name: "DISHES", color: "bg-orange-500" },
        { id: "dinner", name: "DISHES", color: "bg-orange-500" },
        { id: "snack", name: "SNACKS", color: "bg-orange-500" },
        { id: "beverage", name: "DRINKS & JUICE", color: "bg-orange-500" },
        { id: "dessert", name: "DESSERTS", color: "bg-orange-500" },
    ];

    const filteredItems =
        activeCategory === "all"
            ? menuItems
            : menuItems.filter((item) => item.food_type === activeCategory);

    const getItemsByCategory = (category: string) => {
        if (category === "all") return menuItems;
        return menuItems.filter((item) => item.food_type === category);
    };

    const getImageForFoodType = (foodType: string, itemName: string) => {
        const imageMap: { [key: string]: string } = {
            breakfast: "/images/rooms/room1.jpg",
            lunch: "/images/rooms/room2.jpg",
            dinner: "/images/rooms/room3.jpg",
            snack: "/images/rooms/room4.jpg",
            beverage: "/images/rooms/room5.jpg",
            dessert: "/images/rooms/room6.jpg",
        };
        return imageMap[foodType] || "/images/rooms/room1.jpg";
    };

    const testimonials = [
        {
            name: "John Doe",
            rating: 5,
            comment:
                "The food at Hotel Amin International is absolutely delicious! The breakfast spread is amazing and the service is top-notch.",
            image: "/images/home/testimonial1.jpg",
        },
        {
            name: "Sarah Johnson",
            rating: 5,
            comment:
                "I've been staying at this hotel in Cox's Bazar for several years now, and the restaurant never disappoints. Highly recommended!",
            image: "/images/home/testimonial2.jpg",
        },
        {
            name: "Mike Chen",
            rating: 4,
            comment:
                "Great variety of dishes from local to international cuisine. The rooftop restaurant has an amazing view of the sea.",
            image: "/images/home/testimonial3.jpg",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading menu...</p>
                </div>
            </div>
        );
    }

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
                    Discover unforgettable flavors at{" "}
                    <strong>Hotel Amin International</strong> in the heart of
                    Cox's Bazar. Enjoy local and international dishes at our
                    rooftop restaurant with stunning sea views, relax with a
                    drink at the lounge, or grab a quick snack from our cozy
                    lobby café.
                </p>
                <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold shadow transition-all">
                    Book Table
                </button>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Menu Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        OUR MENU
                    </h2>
                    <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeCategory === category.id
                                    ? "bg-orange-500 text-white shadow-lg transform scale-105"
                                    : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Menu Items by Category */}
                {categories.map((category) => {
                    const categoryItems = getItemsByCategory(category.id);
                    if (
                        category.id === "all" ||
                        categoryItems.length === 0 ||
                        (activeCategory !== "all" &&
                            activeCategory !== category.id)
                    )
                        return null;

                    return (
                        <div
                            key={category.id}
                            className={`mb-16 ${
                                activeCategory !== "all" &&
                                activeCategory !== category.id
                                    ? "hidden"
                                    : ""
                            }`}
                        >
                            {activeCategory === "all" && (
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-gray-800 uppercase">
                                        {category.name}
                                    </h3>
                                    <div className="h-px bg-orange-300 flex-1 ml-8"></div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryItems.map((item) => (
                                    <div
                                        key={item.food_id}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
                                    >
                                        <div className="relative h-48">
                                            <Image
                                                src={getImageForFoodType(
                                                    item.food_type,
                                                    item.item_name
                                                )}
                                                alt={item.item_name}
                                                fill
                                                className="object-cover"
                                            />
                                            {!item.availability && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-semibold">
                                                        Currently Unavailable
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="text-xl font-bold text-gray-800 leading-tight">
                                                    {item.item_name}
                                                </h4>
                                                <span className="text-orange-500 font-bold text-lg">
                                                    ৳{item.item_price}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                                {item.description ||
                                                    "Delicious and carefully prepared dish from our kitchen."}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className="h-4 w-4 text-yellow-400 fill-current"
                                                            />
                                                        )
                                                    )}
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        (4.8)
                                                    </span>
                                                </div>

                                                <button
                                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                                        item.availability
                                                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    disabled={
                                                        !item.availability
                                                    }
                                                >
                                                    Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Testimonials Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">
                            WHAT OUR FOODIE SAY
                        </h2>
                        <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-semibold text-lg">
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold text-gray-800">
                                            {testimonial.name}
                                        </h4>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <=
                                                        testimonial.rating
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    "{testimonial.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;

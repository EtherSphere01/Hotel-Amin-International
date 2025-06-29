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

    // Fetch menu items from API
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

    // Group items by category - consolidate lunch and dinner into "DISHES"
    const categories = [
        { id: "all", name: "ALL", color: "bg-orange-500" },
        { id: "breakfast", name: "BREAKFAST", color: "bg-orange-500" },
        { id: "dishes", name: "DISHES", color: "bg-orange-500" }, // Combined lunch & dinner
        { id: "snack", name: "SNACKS", color: "bg-orange-500" },
        { id: "beverage", name: "DRINKS & JUICE", color: "bg-orange-500" },
        { id: "dessert", name: "DESSERTS", color: "bg-orange-500" },
    ];

    const filteredItems =
        activeCategory === "all"
            ? menuItems
            : activeCategory === "dishes"
            ? menuItems.filter(
                  (item) =>
                      item.food_type === "lunch" || item.food_type === "dinner"
              )
            : menuItems.filter((item) => item.food_type === activeCategory);

    const getItemsByCategory = (category: string) => {
        if (category === "all") return menuItems;
        if (category === "dishes")
            return menuItems.filter(
                (item) =>
                    item.food_type === "lunch" || item.food_type === "dinner"
            );
        return menuItems.filter((item) => item.food_type === category);
    };

    const getImageForFoodType = (foodType: string, itemName: string) => {
        // Map specific food items to appropriate images
        const foodImages: { [key: string]: string } = {
            // Breakfast items
            "paratha & dal":
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
            "luchi & bor digh":
                "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
            khichuri:
                "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",

            // Main dishes
            "butter chicken":
                "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
            "grilled salmon":
                "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
            "chicken biryani":
                "https://images.unsplash.com/photo-1563379091339-03246963d4fb?w=400&h=300&fit=crop",

            // Snacks
            "crispy spring rolls":
                "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop",
            "mini samosas":
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
            "cheese nachos":
                "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",

            // Beverages
            "fresh orange juice":
                "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
            "mango lassi":
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "watermelon cooler":
                "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=400&h=300&fit=crop",

            // Desserts
            "cheesecake delight":
                "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
            "gulab jamun":
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
            "chocolate lava cake":
                "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop",
        };

        // Try to find specific image for the food item
        const itemKey = itemName.toLowerCase();
        if (foodImages[itemKey]) {
            return foodImages[itemKey];
        }

        // Fallback to food type images
        const typeImages: { [key: string]: string } = {
            breakfast:
                "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop",
            lunch: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
            dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
            snack: "https://images.unsplash.com/photo-1505253213348-cd54c92b37be?w=400&h=300&fit=crop",
            beverage:
                "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop",
            dessert:
                "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        };

        return (
            typeImages[foodType] ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
        );
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

                {/* Menu Items Display */}
                {activeCategory === "all" ? (
                    // Show all categories when 'all' is selected
                    categories.slice(1).map((category) => {
                        const categoryItems = getItemsByCategory(category.id);
                        if (categoryItems.length === 0) return null;

                        return (
                            <div key={category.id} className="mb-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-gray-800 uppercase">
                                        {category.name}
                                    </h3>
                                    <div className="h-px bg-orange-300 flex-1 ml-8"></div>
                                </div>

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
                                                            Currently
                                                            Unavailable
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
                    })
                ) : (
                    // Show only selected category items
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
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
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="h-4 w-4 text-yellow-400 fill-current"
                                                />
                                            ))}
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
                                            disabled={!item.availability}
                                        >
                                            Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

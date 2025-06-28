"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrash, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
    getCartItems,
    removeFromCart as removeItemFromCart,
    updateCartItemQuantity,
    clearCart as clearAllItems,
    CartItem,
} from "@/app/utilities/cart-utils";
import GuestRegistrationForm from "@/component/GuestRegistrationForm";
import { decodeJWT } from "@/app/utilities/jwt-operation";
import axios from "axios";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadCartItems();
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem("accessToken");
        console.log("Checking auth status - token:", !!token);

        if (token) {
            try {
                // Properly decode and validate JWT token
                const decoded = decodeJWT();
                console.log("Decoded token:", decoded);

                if (decoded) {
                    setIsAuthenticated(true);
                    console.log("User authenticated successfully");
                } else {
                    // Token is invalid or expired
                    console.log("Token invalid or expired");
                    setIsAuthenticated(false);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            } catch (error) {
                console.log("Error decoding token:", error);
                setIsAuthenticated(false);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        } else {
            console.log("No token found");
            setIsAuthenticated(false);
        }
    };

    // Get authenticated user data for pre-filling the guest form
    const getAuthenticatedUserData = () => {
        if (!isAuthenticated) return null;

        try {
            const decoded = decodeJWT();
            if (decoded) {
                return {
                    name: decoded.full_name || "",
                    email: decoded.email || "",
                    // Add other fields as available from JWT or user API
                };
            }
        } catch (error) {
            console.log("Error getting user data for pre-fill:", error);
        }
        return null;
    };

    const loadCartItems = () => {
        try {
            const items = getCartItems();
            setCartItems(items);
        } catch (error) {
            console.error("Error loading cart:", error);
            toast.error("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    const updateCart = (newCartItems: CartItem[]) => {
        setCartItems(newCartItems);
        // The cart utilities will handle localStorage and event dispatch
    };

    const removeFromCart = (itemId: number) => {
        const success = removeItemFromCart(itemId);
        if (success) {
            setCartItems(getCartItems());
            toast.success("Item removed from cart");
        } else {
            toast.error("Failed to remove item from cart");
        }
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const success = updateCartItemQuantity(itemId, newQuantity);
        if (success) {
            setCartItems(getCartItems());
        } else {
            toast.error("Failed to update quantity");
        }
    };

    const calculateNights = (checkIn: string, checkOut: string): number => {
        if (!checkIn || !checkOut) return 1;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    const calculateItemTotal = (item: CartItem): number => {
        const nights =
            item.checkInDate && item.checkOutDate
                ? calculateNights(item.checkInDate, item.checkOutDate)
                : 1;
        return item.price * item.quantity * nights;
    };

    const calculateTotal = (): number => {
        return cartItems.reduce(
            (total, item) => total + calculateItemTotal(item),
            0
        );
    };

    const clearCart = () => {
        const success = clearAllItems();
        if (success) {
            setCartItems([]);
            toast.success("Cart cleared");
        } else {
            toast.error("Failed to clear cart");
        }
    };

    const proceedToCheckout = () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Validate that all cart items have required booking details
        const hasIncompleteItems = cartItems.some(
            (item) => !item.checkInDate || !item.checkOutDate
        );

        if (hasIncompleteItems) {
            toast.error(
                "Please ensure all items have check-in and check-out dates"
            );
            return;
        }

        // Always show guest form regardless of authentication status
        setShowGuestForm(true);
    };

    const handleGuestBooking = async (guestData: any) => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            // Process each cart item as a separate booking
            for (const item of cartItems) {
                const bookingData = {
                    checkin_date: new Date(item.checkInDate!),
                    checkout_date: new Date(item.checkOutDate!),
                    number_of_guests: item.guests || 1,
                    payment_status: "pending",
                    typeOfBooking: "online",
                    no_of_rooms: item.quantity,
                    accommodation_id: item.id,
                    guest_name: guestData.name,
                    guest_age: guestData.age,
                    guest_father_name: guestData.fatherName,
                    guest_address: guestData.homeAddress,
                    guest_relation: guestData.relation,
                    guest_mobile: guestData.mobileNo,
                    guest_nationality: guestData.nationality,
                    guest_profession: guestData.profession,
                    guest_passport_nid: guestData.passportNid,
                    guest_type: guestData.guestType,
                    guest_vehicle_no: guestData.vehicleNo,
                };

                const response = await axios.post(
                    "http://localhost:3000/booking/create-guest",
                    bookingData
                );

                console.log(
                    `Booking created for ${item.title}:`,
                    response.data
                );
            }

            toast.success("All bookings created successfully!");
            setShowGuestForm(false);
            clearCart(); // Clear cart after successful booking
            // router.push("/booking-confirmation"); // Redirect to confirmation page
        } catch (error: any) {
            console.error("Error creating bookings:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to create bookings. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <FaShoppingCart className="text-blue-600 text-2xl" />
                        <h1 className="text-3xl font-bold text-blue-900">
                            Shopping Cart
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Browse our rooms and add some to your cart!
                        </p>
                        <button
                            onClick={() => router.push("/accommodation")}
                            className="btn btn-primary"
                        >
                            Browse Rooms
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md p-6"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Room Image */}
                                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 192px"
                                                />
                                            </div>

                                            {/* Room Details */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        {item.title}
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                                    {item.checkInDate && (
                                                        <div>
                                                            <span className="font-medium">
                                                                Check-in:
                                                            </span>{" "}
                                                            {item.checkInDate}
                                                        </div>
                                                    )}
                                                    {item.checkOutDate && (
                                                        <div>
                                                            <span className="font-medium">
                                                                Check-out:
                                                            </span>{" "}
                                                            {item.checkOutDate}
                                                        </div>
                                                    )}
                                                    {item.guests && (
                                                        <div>
                                                            <span className="font-medium">
                                                                Guests:
                                                            </span>{" "}
                                                            {item.guests}
                                                        </div>
                                                    )}
                                                    {item.checkInDate &&
                                                        item.checkOutDate && (
                                                            <div>
                                                                <span className="font-medium">
                                                                    Nights:
                                                                </span>{" "}
                                                                {calculateNights(
                                                                    item.checkInDate,
                                                                    item.checkOutDate
                                                                )}
                                                            </div>
                                                        )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium">
                                                            Rooms:
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                className="btn btn-outline btn-xs"
                                                                disabled={
                                                                    item.quantity <=
                                                                    1
                                                                }
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                className="btn btn-outline btn-xs"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            ৳
                                                            {calculateItemTotal(
                                                                item
                                                            ).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ৳{item.price}/night
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="truncate mr-2">
                                                {item.title} × {item.quantity}
                                                {item.checkInDate &&
                                                    item.checkOutDate &&
                                                    ` × ${calculateNights(
                                                        item.checkInDate,
                                                        item.checkOutDate
                                                    )} nights`}
                                            </span>
                                            <span>
                                                ৳
                                                {calculateItemTotal(
                                                    item
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <hr className="my-4" />

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl font-bold">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ৳{calculateTotal().toLocaleString()}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={proceedToCheckout}
                                        className="btn btn-primary w-full"
                                    >
                                        <FaCalendarAlt className="mr-2" />
                                        Proceed to Checkout
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        className="btn btn-outline btn-error w-full"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Guest Registration Modal */}
            {showGuestForm && cartItems.length > 0 && (
                <GuestRegistrationForm
                    onClose={() => setShowGuestForm(false)}
                    onSubmit={handleGuestBooking}
                    roomData={{
                        title: `${cartItems.length} Room${
                            cartItems.length > 1 ? "s" : ""
                        }`,
                        price: calculateTotal(),
                    }}
                    bookingDetails={{
                        checkInDate: cartItems[0]?.checkInDate || "",
                        checkOutDate: cartItems[0]?.checkOutDate || "",
                        guests: cartItems.reduce(
                            (total, item) => total + (item.guests || 1),
                            0
                        ),
                        rooms: cartItems.reduce(
                            (total, item) => total + item.quantity,
                            0
                        ),
                    }}
                    userData={getAuthenticatedUserData()}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </div>
    );
}

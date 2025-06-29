"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
    FaShoppingCart,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaUser,
} from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import SignInPage from "@/app/(user)/auth/SignInPage";
import SignUpPage from "@/app/(user)/auth/SignUpPage";
import { decodeJWT, singOut, getToken } from "@/app/utilities/jwt-operation";
import { getCartItemCount } from "@/app/utilities/cart-utils";
import { toast } from "react-toastify";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Accommodation", href: "/accommodation" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "Offers", href: "/offers" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
];

const serviceLinks = [
    { name: "Complain", href: "/complain" },
    { name: "Housekeeping", href: "/housekeeping" },
];

const HeaderUser = () => {
    const [signinButton, setSignInButton] = useState(false);
    const [signupButton, setSignUpButton] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const servicesDropdownRef = useRef<HTMLDivElement>(null);

    // Check authentication status
    const checkAuthStatus = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const userInfo = decodeJWT();
            if (userInfo) {
                setIsAuthenticated(true);
                setUser(userInfo);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Update cart item count
    const updateCartCount = () => {
        const count = getCartItemCount();
        setCartItemCount(count);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await singOut();
            setIsAuthenticated(false);
            setUser(null);
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error("Error logging out");
        }
    };

    // Handle successful signin/signup
    const handleAuthSuccess = () => {
        setSignInButton(false);
        setSignUpButton(false);
        checkAuthStatus();
    };

    // Check auth status on component mount
    useEffect(() => {
        checkAuthStatus();
        updateCartCount();

        // Listen for storage changes to update cart count
        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener("storage", handleStorageChange);

        // Also listen for custom cart update events
        window.addEventListener("cartUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cartUpdated", handleStorageChange);
        };
    }, []);

    const handleSignInButton = (value: boolean) => {
        console.log("Sign In button clicked:", value);
        setSignInButton(value);
        if (value) setSignUpButton(false); // Close signup when opening signin
    };

    const handleSignUpButton = (value: boolean) => {
        console.log("Sign Up button clicked:", value);
        setSignUpButton(value);
        if (value) setSignInButton(false); // Close signin when opening signup
    };

    // Handle clicking outside modal to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setSignInButton(false);
                setSignUpButton(false);
            }

            // Close services dropdown when clicking outside
            if (
                servicesDropdownRef.current &&
                !servicesDropdownRef.current.contains(event.target as Node)
            ) {
                setServicesDropdownOpen(false);
            }
        };

        if (signinButton || signupButton || servicesDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [signinButton, signupButton, servicesDropdownOpen]);

    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-[#0C1F34] text-white w-full">
            <div className="flex flex-col md:flex-row items-center md:items-stretch">
                <div className="flex md:items-center px-4 relative h-12 md:h-auto w-full md:w-auto justify-between">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className=" h-16 md:h-20 w-auto object-contain"
                    />

                    <div className="md:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative">
                            <FaShoppingCart className="text-white text-lg cursor-pointer hover:text-yellow-400 transition" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount > 99 ? "99+" : cartItemCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="relative p-2 hover:bg-gray-700 rounded-full transition"
                                    title="Profile"
                                >
                                    <FaUser className="text-white text-lg hover:text-yellow-400 transition" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() =>
                                        handleSignInButton(!signinButton)
                                    }
                                    className="bg-[#F5A623] text-white text-sm font-semibold px-4 py-1 rounded hover:bg-[#e49b1a] transition"
                                >
                                    Sign In
                                </button>

                                <button
                                    onClick={() =>
                                        handleSignUpButton(!signupButton)
                                    }
                                    className="hidden"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}

                        <div className="flex items-center gap-2 bg-gray-200 text-black text-sm px-3 py-1 rounded">
                            <IoGlobeOutline className="text-base" />
                            <select className="bg-transparent focus:outline-none">
                                <option value="en">English</option>
                                <option value="bn">বাংলা</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white text-2xl focus:outline-none"
                        >
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-[80%] w-px bg-[#1A2B3D]" />
                </div>

                <div className="flex-1 mx-5 w-full flex flex-col">
                    <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 pt-4 pb-3">
                        <h1 className="hidden md:block text-yellow-400 text-lg font-bold text-center md:text-left w-full md:w-auto mb-2 md:mb-0">
                            HOTEL AMIN INTERNATIONAL
                        </h1>

                        <div className="hidden md:flex flex-wrap gap-2 sm:gap-3 items-center justify-center md:justify-end w-full md:w-auto">
                            <Link href="/cart" className="relative">
                                <FaShoppingCart className="text-white text-lg cursor-pointer hover:text-yellow-400 transition" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount > 99
                                            ? "99+"
                                            : cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="relative p-2 hover:bg-gray-700 rounded-full transition"
                                        title="Profile"
                                    >
                                        <FaUser className="text-white text-lg hover:text-yellow-400 transition" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            handleSignInButton(!signinButton)
                                        }
                                        className="bg-[#F5A623] text-white text-sm font-semibold px-4 py-1 rounded hover:bg-[#e49b1a] transition"
                                    >
                                        Sign In
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleSignUpButton(!signupButton)
                                        }
                                        className="hidden"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}

                            <div className="flex items-center gap-2 bg-gray-200 text-black text-sm px-3 py-1 rounded">
                                <IoGlobeOutline className="text-base" />
                                <select className="bg-transparent focus:outline-none">
                                    <option value="en">English</option>
                                    <option value="bn">বাংলা</option>
                                    <option value="ar">Arabic</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex flex-wrap justify-start gap-4 md:gap-15 px-4 sm:px-6 pb-4 pt-2 text-sm font-medium">
                        {navLinks
                            .filter((link) => link.name !== "Contact Us")
                            .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`cursor-pointer ${
                                        pathname === link.href
                                            ? "text-white font-bold underline"
                                            : "text-white hover:underline"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                        <div ref={servicesDropdownRef} className="relative">
                            <button
                                onClick={() =>
                                    setServicesDropdownOpen(
                                        !servicesDropdownOpen
                                    )
                                }
                                className={`cursor-pointer flex items-center gap-1 ${
                                    serviceLinks.some(
                                        (link) => pathname === link.href
                                    )
                                        ? "text-white font-bold underline"
                                        : "text-white hover:underline"
                                }`}
                            >
                                Self Service
                                <FaChevronDown
                                    className={`text-xs transition-transform ${
                                        servicesDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {servicesDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg border min-w-[150px] z-50">
                                    {serviceLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() =>
                                                setServicesDropdownOpen(false)
                                            }
                                            className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                                                pathname === link.href
                                                    ? "text-blue-600 font-bold bg-blue-50"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/contact"
                            className={`cursor-pointer ${
                                pathname === "/contact"
                                    ? "text-white font-bold underline"
                                    : "text-white hover:underline"
                            }`}
                        >
                            Contact Us
                        </Link>
                    </nav>

                    {menuOpen && (
                        <div
                            ref={menuRef}
                            className="flex flex-col items-center md:hidden gap-4 px-4 pb-4 pt-2 text-sm font-medium border-t border-gray-600"
                        >
                            {navLinks
                                .filter((link) => link.name !== "Contact Us")
                                .map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)} // Close menu on link click
                                        className={`cursor-pointer ${
                                            pathname === link.href
                                                ? "text-white font-bold underline"
                                                : "text-white hover:underline"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                            {serviceLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)} // Close menu on link click
                                    className={`cursor-pointer ${
                                        pathname === link.href
                                            ? "text-white font-bold underline"
                                            : "text-white hover:underline"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <Link
                                href="/contact"
                                onClick={() => setMenuOpen(false)}
                                className={`cursor-pointer ${
                                    pathname === "/contact"
                                        ? "text-white font-bold underline"
                                        : "text-white hover:underline"
                                }`}
                            >
                                Contact Us
                            </Link>

                            <Link href="/cart" className="relative">
                                <FaShoppingCart className="text-white text-lg cursor-pointer hover:text-yellow-400 transition" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount > 99
                                            ? "99+"
                                            : cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {signinButton && (
                <div className="fixed inset-0 bg-[#00000065] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
                    >
                        <button
                            onClick={() => setSignInButton(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            <FaTimes />
                        </button>

                        <div className="p-6">
                            <SignInPage
                                onClose={() => setSignInButton(false)}
                                onSwitchToSignUp={() => {
                                    setSignInButton(false);
                                    setSignUpButton(true);
                                }}
                                onAuthSuccess={handleAuthSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {signupButton && (
                <div className="fixed inset-0 bg-[#00000065] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                    >
                        <button
                            onClick={() => setSignUpButton(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
                        >
                            <FaTimes />
                        </button>

                        <div className="p-6">
                            <SignUpPage
                                onClose={() => setSignUpButton(false)}
                                onSwitchToSignIn={() => {
                                    setSignUpButton(false);
                                    setSignInButton(true);
                                }}
                                onAuthSuccess={handleAuthSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {process.env.NODE_ENV === "development" && (
                <div className="fixed bottom-4 left-4 bg-black text-white p-2 text-xs z-50">
                    SignIn: {signinButton ? "true" : "false"} | SignUp:{" "}
                    {signupButton ? "true" : "false"}
                </div>
            )}
        </header>
    );
};

export default HeaderUser;

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import SignInPage from "@/app/(user)/auth/SignInPage";
import SignUpPage from "@/app/(user)/auth/SignUpPage";
import { decodeJWT, singOut, getToken } from "@/app/utilities/jwt-operation";
import { toast } from "react-toastify";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Accommodation", href: "/accommodation" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "Offers", href: "/offers" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
];

const HeaderUser = () => {
    const [signinButton, setSignInButton] = useState(false);
    const [signupButton, setSignUpButton] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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
        };

        if (signinButton || signupButton) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [signinButton, signupButton]);

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
                {/* Logo + Divider */}
                <div className="flex md:items-center px-4 relative h-12 md:h-auto w-full md:w-auto justify-between">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className=" h-16 md:h-20 w-auto object-contain"
                    />

                    {/* Mobile Right Section */}
                    <div className="md:hidden flex items-center gap-3">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
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
                                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-blue-700 transition"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}

                        {/* Language Dropdown */}
                        <div className="flex items-center gap-2 bg-gray-200 text-black text-sm px-3 py-1 rounded">
                            <IoGlobeOutline className="text-base" />
                            <select className="bg-transparent focus:outline-none">
                                <option value="en">English</option>
                                <option value="bn">বাংলা</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white text-2xl focus:outline-none"
                        >
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-[80%] w-px bg-[#1A2B3D]" />
                </div>

                {/* Right Section */}
                <div className="flex-1 mx-5 w-full flex flex-col">
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 pt-4 pb-3">
                        {/* Title - only on desktop */}
                        <h1 className="hidden md:block text-yellow-400 text-lg font-bold text-center md:text-left w-full md:w-auto mb-2 md:mb-0">
                            HOTEL AMIN INTERNATIONAL
                        </h1>

                        {/* Desktop buttons */}
                        <div className="hidden md:flex flex-wrap gap-2 sm:gap-3 items-center justify-center md:justify-end w-full md:w-auto">
                            <FaShoppingCart className="text-white text-lg cursor-pointer" />

                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
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
                                        className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded hover:bg-blue-700 transition"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}

                            {/* Language Dropdown */}
                            <div className="flex items-center gap-2 bg-gray-200 text-black text-sm px-3 py-1 rounded">
                                <IoGlobeOutline className="text-base" />
                                <select className="bg-transparent focus:outline-none">
                                    <option value="en">English</option>
                                    <option value="bn">বাংলা</option>
                                    <option value="ar">Arabic</option>
                                </select>
                            </div>

                            {/* Theme Toggle */}
                            <label className="flex cursor-pointer gap-2 items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="23"
                                    height="25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                </svg>
                                <input
                                    type="checkbox"
                                    value="synthwave"
                                    className="toggle theme-controller bg-white"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </label>
                        </div>
                    </div>

                    {/* Nav Row - Desktop */}
                    <nav className="hidden md:flex flex-wrap justify-start gap-4 md:gap-15 px-4 sm:px-6 pb-4 pt-2 text-sm font-medium">
                        {navLinks.map((link) => (
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
                    </nav>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div
                            ref={menuRef}
                            className="flex flex-col items-center md:hidden gap-4 px-4 pb-4 pt-2 text-sm font-medium border-t border-gray-600"
                        >
                            {/* Nav Links */}
                            {navLinks.map((link) => (
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

                            {/* Cart */}
                            <FaShoppingCart className="text-white text-lg cursor-pointer" />

                            {/* Theme Toggle */}
                            <label className="flex cursor-pointer gap-2 items-center mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="23"
                                    height="25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                </svg>
                                <input
                                    type="checkbox"
                                    value="synthwave"
                                    className="toggle theme-controller bg-white"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Sign In Modal */}
            {signinButton && (
                <div className="fixed inset-0 bg-[#00000065] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
                    >
                        {/* Cancel Button */}
                        <button
                            onClick={() => setSignInButton(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            <FaTimes />
                        </button>

                        {/* Sign In Page Content */}
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

            {/* Sign Up Modal */}
            {signupButton && (
                <div className="fixed inset-0 bg-[#00000065] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                    >
                        {/* Cancel Button */}
                        <button
                            onClick={() => setSignUpButton(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
                        >
                            <FaTimes />
                        </button>

                        {/* Sign Up Page Content */}
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

            {/* Debug Info - Remove in production */}
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

"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "http://localhost:3000/email/send-contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        message: formData.message.trim(),
                        subject: `Contact Form Message from ${formData.name.trim()}`,
                    }),
                }
            );

            if (response.ok) {
                toast.success(
                    "Message sent successfully! We will get back to you soon."
                );
                setFormData({ name: "", email: "", message: "" });
            } else {
                const errorData = await response.json();
                toast.error(
                    errorData.message ||
                        "Failed to send message. Please try again."
                );
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(
                "Network error. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="bg-white min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Left Side: Contact Information */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-[#0B3C5D]">
                        Get in Touch
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Whether you’re planning your vacation or have questions
                        about our services, our team is here to help. Reach out
                        and we’ll get back to you as soon as possible.
                    </p>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin className="text-[#0B3C5D]" />
                            <span>
                                Hotel Amin International, Kolatoli Beach, Cox’s
                                Bazar
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone className="text-[#0B3C5D]" />
                            <span>+880 1234-567890</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail className="text-[#0B3C5D]" />
                            <span>info@hotelamininternational.com</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-[#0B3C5D]">
                        Send Us a Message
                    </h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isSubmitting}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isSubmitting}
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isSubmitting}
                        ></textarea>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded font-semibold text-lg transition duration-200 ${
                                isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                                    : "bg-[#F5A623] text-white hover:bg-[#f5a523e5] cursor-pointer"
                            }`}
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

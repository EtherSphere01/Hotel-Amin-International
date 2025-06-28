'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left Side: Contact Information */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-[#0B3C5D]">Get in Touch</h1>
          <p className="text-gray-600 text-lg">
            Whether you’re planning your vacation or have questions about our services, our team is here to help. Reach out and we’ll get back to you as soon as possible.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="text-[#0B3C5D]" />
              <span>Hotel Amin International, Kolatoli Beach, Cox’s Bazar</span>
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
          <h2 className="text-2xl font-semibold mb-4 text-[#0B3C5D]">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-[#F5A623] text-white py-3 rounded hover:bg-[#f5a523e5] transition duration-200 cursor-pointer font-semibold text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

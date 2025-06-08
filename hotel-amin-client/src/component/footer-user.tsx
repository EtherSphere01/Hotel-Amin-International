import React from 'react';
import Image from 'next/image';
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  PhoneCall,
  Mail,
  Clock,
  MapPin
} from 'lucide-react';

const FooterUser = () => {
  return (
    <footer className="bg-[#06253A] text-white py-12 px-4 md:px-20 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Address & Contact */}
        <div className="flex gap-4 col-span-2">
          <div className="shrink-0">
            <Image src="/images/logo.png" alt="Hotel Amin International" width={120} height={120} className="w-28" />
          </div>
          <div className="space-y-3 w-full">
            <p className="flex items-start gap-2 text-[#D6E3EA]">
              <MapPin size={16} className="mt-1 shrink-0" />
              <span className="block">Hotel Amin International, Dolphin Circle,<br />Kolatoli, Coxs Bazar</span>
            </p>
            <p className="flex items-center gap-2 text-[#D6E3EA]">
              <Clock size={16} /> Hours: 8:00 - 17:00
            </p>
            <p className="flex items-center gap-2 text-[#D6E3EA]">
              <Mail size={16} /> booking@hotel-amin.com
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h4 className="font-semibold mb-2">Services</h4>
          <ul className="space-y-2 text-[#D6E3EA]">
            <li>Rooms & Suites</li>
            <li>Restaurant</li>
            <li>Hotel Booking</li>
          </ul>
        </div>

        {/* Affiliations */}
        <div className="space-y-3">
          <h4 className="font-semibold mb-2">Affiliations</h4>
          <ul className="space-y-2 text-[#D6E3EA]">
            <li>Visit Coxs Bazar</li>
            <li>Hotel Coxs Hilton</li>
            <li>AR Guest House</li>
            <li>Sea Breeze Resort</li>
            <li>Shalik Restaurant</li>
          </ul>
        </div>

        {/* Payment Methods and Support combined */}
        <div className="space-y-6 flex flex-col">
          <div className="space-y-3">
            <h4 className="font-semibold mb-2">WE ACCEPT</h4>
            <div className="flex items-center gap-2">
              <Image src="/images/footer/bkash.png" alt="bKash" width={45} height={28} className="h-6 w-auto" />
              <Image src="/images/footer/nagad.png" alt="Nagad" width={45} height={28} className="h-6 w-auto" />
              <Image src="/images/footer/bank.png" alt="Rocket" width={45} height={28} className="h-6 w-auto" />
              <Image src="/images/footer/visa.png" alt="Visa" width={45} height={28} className="h-6 w-auto" />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold mb-2">Need help? Call us</h4>
            <p className="text-[#F6A623] font-bold flex items-center gap-2">
              <PhoneCall size={16} /> +880 1886-956602
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Socials */}
        <div>
          <p className="text-white mb-2">Follow us</p>
          <div className="flex gap-3">
            <button className="bg-white text-black p-2 rounded-full"><Facebook size={16} /></button>
            <button className="bg-white text-black p-2 rounded-full"><Instagram size={16} /></button>
            <button className="bg-white text-black p-2 rounded-full"><Twitter size={16} /></button>
            <button className="bg-white text-black p-2 rounded-full"><Youtube size={16} /></button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[#D6E3EA] text-xs text-center">
          © 2025 Hotel Amin International. All Rights Reserved.
        </div>

        {/* Footer Links */}
        <div className="text-[#D6E3EA] text-xs space-x-4 text-center">
          <span className="cursor-pointer">Terms</span>
          <span className="cursor-pointer">Privacy policy</span>
          <span className="cursor-pointer">Cancellation Policy</span>
          <span className="cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterUser;

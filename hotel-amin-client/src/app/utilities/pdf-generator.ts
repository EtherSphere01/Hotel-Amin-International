import jsPDF from "jspdf";

interface BookingData {
    id?: string;
    guest_name: string;
    guest_mobile: string;
    guest_email?: string;
    checkin_date: string;
    checkout_date: string;
    number_of_guests: number;
    no_of_rooms: number;
    roomTitle: string;
    roomPrice: number;
    coupon_code?: string;
    coupon_percent?: number;
    totalAmount: number;
    booking_date?: string;
}

export const generateBookingPDF = (bookingData: BookingData): void => {
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("HOTEL AMIN INTERNATIONAL", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Dolphin Circle, Kolatoli, Cox's Bazar", 105, 30, {
        align: "center",
    });
    doc.text("Hotline: 01886966602", 105, 40, { align: "center" });

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255);
    doc.text("BOOKING CONFIRMATION", 105, 60, { align: "center" });

    // Booking ID
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    if (bookingData.id) {
        doc.text(`Booking ID: ${bookingData.id}`, 20, 80);
    }

    // Booking Date
    const bookingDate =
        bookingData.booking_date || new Date().toLocaleDateString();
    doc.text(`Booking Date: ${bookingDate}`, 20, 90);

    // Guest Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text("GUEST INFORMATION", 20, 110);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${bookingData.guest_name}`, 20, 125);
    doc.text(`Mobile: ${bookingData.guest_mobile}`, 20, 135);
    if (bookingData.guest_email) {
        doc.text(`Email: ${bookingData.guest_email}`, 20, 145);
    }

    // Booking Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text("BOOKING DETAILS", 20, 165);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Room Type: ${bookingData.roomTitle}`, 20, 180);
    doc.text(
        `Check-in Date: ${new Date(
            bookingData.checkin_date
        ).toLocaleDateString()}`,
        20,
        190
    );
    doc.text(
        `Check-out Date: ${new Date(
            bookingData.checkout_date
        ).toLocaleDateString()}`,
        20,
        200
    );
    doc.text(`Number of Guests: ${bookingData.number_of_guests}`, 20, 210);
    doc.text(`Number of Rooms: ${bookingData.no_of_rooms}`, 20, 220);

    // Calculate nights
    const checkIn = new Date(bookingData.checkin_date);
    const checkOut = new Date(bookingData.checkout_date);
    const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    doc.text(`Number of Nights: ${nights}`, 20, 230);

    // Payment Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text("PAYMENT INFORMATION", 20, 250);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(
        `Room Price (per night): ৳${bookingData.roomPrice.toLocaleString()}`,
        20,
        265
    );
    doc.text(
        `Subtotal: ৳${(
            bookingData.roomPrice *
            nights *
            bookingData.no_of_rooms
        ).toLocaleString()}`,
        20,
        275
    );

    if (bookingData.coupon_code && bookingData.coupon_percent) {
        const discount = Math.round(
            (bookingData.roomPrice *
                nights *
                bookingData.no_of_rooms *
                bookingData.coupon_percent) /
                100
        );
        doc.text(
            `Coupon (${
                bookingData.coupon_code
            }): -৳${discount.toLocaleString()} (${
                bookingData.coupon_percent
            }% off)`,
            20,
            285
        );
        doc.setFontSize(14);
        doc.text(
            `Total Amount: ৳${bookingData.totalAmount.toLocaleString()}`,
            20,
            300
        );
    } else {
        doc.setFontSize(14);
        doc.text(
            `Total Amount: ৳${bookingData.totalAmount.toLocaleString()}`,
            20,
            285
        );
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for choosing Hotel Amin International!", 105, 320, {
        align: "center",
    });
    doc.text("Please present this confirmation at check-in.", 105, 330, {
        align: "center",
    });

    // Generate filename with booking ID and date
    const filename = `booking-confirmation-${bookingData.id || "draft"}-${
        new Date().toISOString().split("T")[0]
    }.pdf`;

    // Save the PDF
    doc.save(filename);
};

export const generateBookingPDFFromResponse = (
    response: any,
    bookingDetails: any,
    roomData: any,
    guestData: any
): void => {
    const nights = Math.ceil(
        (new Date(bookingDetails.checkOutDate).getTime() -
            new Date(bookingDetails.checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const subtotal = roomData.price * nights * bookingDetails.rooms;

    // Calculate discount if coupon is applied
    let discount = 0;
    if (bookingDetails.appliedCoupon) {
        discount = Math.round(
            (subtotal * bookingDetails.appliedCoupon.coupon_percent) / 100
        );
    }

    const totalAmount = subtotal - discount;

    const bookingData: BookingData = {
        id: response.data?.id || response.id || "N/A",
        guest_name: guestData.name,
        guest_mobile: guestData.mobileNo,
        checkin_date: bookingDetails.checkInDate,
        checkout_date: bookingDetails.checkOutDate,
        number_of_guests: bookingDetails.guests,
        no_of_rooms: bookingDetails.rooms,
        roomTitle: roomData.title,
        roomPrice: roomData.price,
        coupon_code: bookingDetails.appliedCoupon?.coupon_code,
        coupon_percent: bookingDetails.appliedCoupon?.coupon_percent,
        totalAmount: totalAmount,
        booking_date: new Date().toLocaleDateString(),
    };

    generateBookingPDF(bookingData);
};

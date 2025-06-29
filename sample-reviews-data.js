// Create test reviews directly in the database for testing
const sampleReviews = [
    {
        review_text:
            "I've been staying at this hotel for several years now, and it has truly become my go-to place for a comfortable and enjoyable stay. The atmosphere is warm and welcoming, the staff is consistently attentive and professional, and I truly appreciate the well-maintained facilities and the cleanliness of the rooms every single time.",
        rating: 5,
        guest_name: "Sara Mohamed",
        user_id: 1, // Assuming user with ID 1 exists
        booking_id: 1, // Assuming booking with ID 1 exists
        created_date: new Date(),
    },
    {
        review_text:
            "Excellent service and beautiful rooms! The staff went above and beyond to make our stay comfortable. The location is perfect and the amenities are top-notch. Highly recommended!",
        rating: 5,
        guest_name: "Ahmed Hassan",
        user_id: 2, // Assuming user with ID 2 exists
        booking_id: 2, // Assuming booking with ID 2 exists
        created_date: new Date(),
    },
    {
        review_text:
            "Great hotel with amazing views. The breakfast was delicious and the room was very clean. Will definitely stay here again on our next visit!",
        rating: 4,
        guest_name: "Fatima Ali",
        user_id: 3, // Assuming user with ID 3 exists
        booking_id: 3, // Assuming booking with ID 3 exists
        created_date: new Date(),
    },
];

console.log("Sample reviews data for testing:");
console.log(JSON.stringify(sampleReviews, null, 2));

console.log("\nTo manually insert these reviews into the database:");
console.log("1. Start the backend server");
console.log("2. Create users and bookings if they don't exist");
console.log(
    "3. Use the POST /feedback/booking-review endpoint to create reviews"
);
console.log("4. The reviews should then appear on the home page");

console.log("\nExample API call:");
console.log("POST http://localhost:3000/feedback/booking-review");
console.log("Body:", JSON.stringify(sampleReviews[0], null, 2));

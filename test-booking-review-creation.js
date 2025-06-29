const axios = require("axios");

async function testBookingReviewCreation() {
    console.log("Testing booking review creation...\n");

    try {
        // First sign in to get a token
        const signInData = {
            phone: "01712345678",
            password: "Test123!",
        };

        console.log("1. Signing in...");
        const signInResponse = await axios.post(
            "http://localhost:3000/auth/signin",
            signInData
        );

        if (!signInResponse.data.accessToken) {
            console.log("❌ No access token received");
            return;
        }

        const token = signInResponse.data.accessToken;
        console.log("✅ Sign in successful");

        // Get user ID from token
        const tokenData = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );
        const userId = tokenData.sub;
        console.log("User ID from token:", userId);

        // Get user's bookings first
        console.log("\n2. Fetching user bookings...");
        const bookingsResponse = await axios.get(
            "http://localhost:3000/user/booking-history",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Bookings found:", bookingsResponse.data.length);
        if (bookingsResponse.data.length === 0) {
            console.log("❌ No bookings found for this user");
            return;
        }

        // Use first booking for review
        const booking = bookingsResponse.data[0];
        console.log("Using booking ID:", booking.booking_id);

        // Create a review
        console.log("\n3. Creating booking review...");
        const reviewData = {
            booking_id: booking.booking_id,
            user_id: userId,
            review_text:
                "Amazing stay! The hotel staff was very friendly and the room was clean and comfortable. I will definitely come back!",
            rating: 5,
            guest_name: "Test User",
        };

        console.log("Review data:", reviewData);

        const reviewResponse = await axios.post(
            "http://localhost:3000/feedback/booking-review",
            reviewData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Review created successfully!");
        console.log("Review response:", reviewResponse.data);

        // Test fetching all reviews
        console.log("\n4. Fetching all booking reviews...");
        const allReviewsResponse = await axios.get(
            "http://localhost:3000/feedback/booking-reviews"
        );
        console.log("Total reviews found:", allReviewsResponse.data.length);
        console.log("Reviews:", allReviewsResponse.data);
    } catch (error) {
        console.error("❌ Error occurred:");
        console.error("Status:", error.response?.status);
        console.error(
            "Error message:",
            error.response?.data?.message || error.message
        );
        console.error("Full error data:", error.response?.data);
    }
}

testBookingReviewCreation();

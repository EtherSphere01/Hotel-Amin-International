// Test booking review endpoints
const testBookingReviews = async () => {
    try {
        console.log("Testing booking review endpoints...");

        // Test GET all booking reviews
        const response = await fetch(
            "http://localhost:3000/feedback/booking-reviews",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("GET booking reviews status:", response.status);

        if (response.ok) {
            const data = await response.json();
            console.log("Booking reviews data:", data);
        } else {
            const error = await response.text();
            console.log("Error:", error);
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
};

testBookingReviews();

// Script to create test booking reviews
const { exec } = require("child_process");
const fs = require("fs");

// First, let's create a simple booking review via API
const createTestReview = async () => {
    // For now, let's create a simple script to test the complete flow
    console.log("Testing complete booking review flow...");

    // Step 1: Check if we can connect to the server
    console.log("1. Testing server connection...");

    try {
        const response = await fetch(
            "http://localhost:3000/feedback/booking-reviews",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("✓ Server is responding");
            console.log("Current reviews count:", data.length);

            if (data.length > 0) {
                console.log("Sample review:", data[0]);
            }
        } else {
            console.log("✗ Server responded with error:", response.status);
        }
    } catch (error) {
        console.log("✗ Cannot connect to server:", error.message);
        console.log("Make sure the server is running on http://localhost:3000");
    }
};

// Check if we're in Node.js environment
if (typeof fetch === "undefined") {
    console.log("Installing node-fetch for testing...");
    exec("npm install node-fetch", (error, stdout, stderr) => {
        if (error) {
            console.error("Error installing node-fetch:", error);
            return;
        }
        console.log("node-fetch installed, please run the script again");
    });
} else {
    createTestReview();
}

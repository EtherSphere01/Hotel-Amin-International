// Test script to verify signin functionality
const axios = require("axios");

async function testSignIn() {
    try {
        console.log("Testing signin with phone authentication...");

        const response = await axios.post(
            "http://localhost:3000/auth/signin",
            {
                phone: "+8801715998900",
                password: "Root@123",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Signin successful!");
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.data.accessToken) {
            console.log("✅ Access token received");
            console.log("Access token:", response.data.accessToken);
        }

        if (response.data.refreshToken) {
            console.log("✅ Refresh token received");
            console.log("Refresh token:", response.data.refreshToken);
        }
    } catch (error) {
        console.error("❌ Signin failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testSignIn();

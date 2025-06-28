// Test API call simulation
const axios = require("axios");

const testSignupData = {
    name: "John Doe Smith",
    email: "john.doe@example.com",
    password: "TestPass123!",
    phone: "+8801712345678",
    address: "123 Main Street, Dhaka, Bangladesh",
    nid: "1234567890123",
    passport: "A12345678",
    nationality: "Bangladeshi",
    profession: "Software Engineer",
    age: 28,
    maritalStatus: false,
    vehicleNo: "DHK-1234",
    fatherName: "Mr. John Doe Senior",
    registrationDate: new Date().toISOString(),
};

async function testSignupAPI() {
    const baseURL = "http://localhost:3000";
    const endpoint = `${baseURL}/user/createUser`;

    console.log("Testing API endpoint:", endpoint);
    console.log("Sending data:", JSON.stringify(testSignupData, null, 2));

    try {
        const response = await axios.post(endpoint, testSignupData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Success! Response:", response.data);
        console.log("Status:", response.status);
    } catch (error) {
        console.log("❌ Error occurred:");

        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
            console.log(
                "🔌 Backend server is not running on http://localhost:3000"
            );
            console.log("Please start your backend server first");
        } else if (error.response) {
            console.log("📤 Request was sent but server responded with error:");
            console.log("Status:", error.response.status);
            console.log("Status Text:", error.response.statusText);
            console.log("Error Data:", error.response.data);

            if (error.response.status === 400) {
                console.log(
                    "🚫 Validation Error - Check the data format and required fields"
                );
            } else if (error.response.status === 404) {
                console.log(
                    "🔍 Endpoint not found - Check if the API route exists"
                );
            } else if (error.response.status === 500) {
                console.log("💥 Server error - Check backend logs");
            }
        } else if (error.request) {
            console.log("📡 Request was made but no response received");
            console.log("Check network connection or backend server");
        } else {
            console.log("⚠️ Error setting up request:", error.message);
        }
    }
}

testSignupAPI();

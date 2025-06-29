const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function createAdminUser() {
    console.log("Creating admin user...\n");

    try {
        const userData = {
            name: "Admin User",
            email: "admin@hotel.com",
            password: "Admin123!",
            phone: "01777777777",
            address: "Admin Address",
            nid: "1111111111",
            passport: null,
            nationality: "Bangladeshi",
            profession: "Administrator",
            age: 30,
            maritalStatus: false,
            vehicleNo: null,
            fatherName: "Admin Father",
            registrationDate: new Date().toISOString(),
        };

        // First create the user
        try {
            const response = await axios.post(
                `${BASE_URL}/user/createUser`,
                userData
            );
            console.log("✅ Admin user created:", response.data);
        } catch (error) {
            console.log("User creation response:", error.response?.data);
            // Continue anyway, might already exist
        }

        // Now we need to manually update the role to admin in the database
        // Since there's no direct API for this, we'll need to do it via database
        console.log(
            '\n⚠️  NOTE: You need to manually update the user role to "admin" in the database'
        );
        console.log("Run this SQL query:");
        console.log(
            `UPDATE users SET role = 'admin' WHERE phone = '01777777777';`
        );
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function testAdminLogin() {
    console.log("\nTesting admin login...\n");

    try {
        const signInData = {
            phone: "01777777777",
            password: "Admin123!",
        };

        const signInResponse = await axios.post(
            `${BASE_URL}/auth/signin`,
            signInData
        );
        console.log(
            "Sign in response:",
            JSON.stringify(signInResponse.data, null, 2)
        );

        if (signInResponse.data.accessToken) {
            const jwt = require("jsonwebtoken");
            const decoded = jwt.decode(signInResponse.data.accessToken);
            console.log("JWT payload:", JSON.stringify(decoded, null, 2));
            console.log("User role:", decoded?.role);
        }
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

async function run() {
    await createAdminUser();
    await testAdminLogin();
}

run();

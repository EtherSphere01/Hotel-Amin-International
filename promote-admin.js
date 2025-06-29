const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function promoteUserToAdmin() {
    console.log("Promoting user to admin...\n");

    try {
        // First find the user ID by phone
        const users = await axios.get(`${BASE_URL}/user/all`);
        const adminUser = users.data.find(
            (user) => user.phone === "01777777777"
        );

        if (!adminUser) {
            console.log("❌ Admin user not found");
            return;
        }

        console.log(
            "Found user:",
            adminUser.name,
            "with ID:",
            adminUser.user_id
        );

        // Update the user role to admin
        const updateData = {
            role: "admin",
        };

        const updateResponse = await axios.put(
            `${BASE_URL}/user/update/${adminUser.user_id}`,
            updateData
        );
        console.log("✅ User role updated:", updateResponse.data);

        // Test login again
        console.log("\n🔄 Testing admin login after role update...");
        const signInData = {
            phone: "01777777777",
            password: "Admin123!",
        };

        const signInResponse = await axios.post(
            `${BASE_URL}/auth/signin`,
            signInData
        );

        if (signInResponse.data.accessToken) {
            const jwt = require("jsonwebtoken");
            const decoded = jwt.decode(signInResponse.data.accessToken);
            console.log(
                "✅ New JWT payload:",
                JSON.stringify(decoded, null, 2)
            );
            console.log("✅ User role is now:", decoded?.role);
        }
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

promoteUserToAdmin();

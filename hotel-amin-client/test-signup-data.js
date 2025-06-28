// Test script to simulate the signup data being sent
// This simulates what the frontend is sending to the backend

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

console.log("Test Signup Data:", JSON.stringify(testSignupData, null, 2));

console.log("\nData Types:");
Object.keys(testSignupData).forEach((key) => {
    console.log(
        `${key}: ${typeof testSignupData[key]} - ${testSignupData[key]}`
    );
});

console.log("\nData Validation Checks:");
console.log("Name length:", testSignupData.name.length);
console.log(
    "Email format:",
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testSignupData.email)
);
console.log(
    "Phone format:",
    /^(\+880|880|0)?1[3-9]\d{8}$/.test(
        testSignupData.phone.replace(/\s|-/g, "")
    )
);
console.log(
    "Age range:",
    testSignupData.age >= 18 && testSignupData.age <= 120
);
console.log(
    "NID length:",
    testSignupData.nid.length >= 5 && testSignupData.nid.length <= 50
);

// Test with null values for optional fields
const testDataWithNulls = {
    ...testSignupData,
    email: null,
    passport: null,
    vehicleNo: null,
};

console.log("\nTest Data with Nulls for Optional Fields:");
console.log(JSON.stringify(testDataWithNulls, null, 2));

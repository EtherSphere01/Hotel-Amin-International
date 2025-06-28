// Test script to verify authentication flow
console.log("Testing authentication state management...");

// Test localStorage operations
localStorage.setItem("accessToken", '"test-token"');
console.log("✅ Token set in localStorage");

const token = localStorage.getItem("accessToken");
console.log("Token retrieved:", token);

// Clear token
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
console.log("✅ Tokens cleared from localStorage");

const clearedToken = localStorage.getItem("accessToken");
console.log("Token after clearing:", clearedToken);

console.log("Authentication flow test completed!");

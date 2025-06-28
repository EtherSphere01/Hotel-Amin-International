const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSignupAPI() {
  console.log('Testing signup API from frontend perspective...\n');

  // Test data similar to what frontend would send
  const testUser = {
    name: 'Frontend Test User 6',
    email: 'frontend.test6@example.com',
    password: 'Root@123',
    phone: '01744995563',
    address: 'Frontend Test Address, Dhaka',
    nid: 'FRONTENDTEST128',
    passport: 'Not Available',
    nationality: 'Bangladeshi',
    profession: 'Developer',
    age: 28,
    maritalStatus: false,
    vehicleNo: 'Not Available',
    fatherName: 'Frontend Father',
  };

  try {
    console.log('Sending signup request...');
    console.log('Data:', JSON.stringify(testUser, null, 2));

    const response = await axios.post(`${BASE_URL}/user/createUser`, testUser, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Error occurred:');
    if (error.code === 'ECONNABORTED') {
      console.log(
        'Request timed out - server might be slow due to email sending',
      );
    } else if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSignupAPI();

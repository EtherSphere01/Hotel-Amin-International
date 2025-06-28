const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testUserSignup() {
  console.log('Testing user signup functionality...\n');

  try {
    // Test data matching the frontend format
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Test123!',
      phone: '01712345678', // BD format
      address: 'Dhaka, Bangladesh',
      nid: '1234567890',
      passport: null,
      nationality: 'Bangladeshi',
      profession: 'Engineer',
      age: 28,
      maritalStatus: false,
      vehicleNo: null,
      fatherName: 'Mr. Doe Senior',
      registrationDate: new Date().toISOString(),
    };

    console.log('Sending POST request to:', `${BASE_URL}/user/createUser`);
    console.log('Request body:', JSON.stringify(userData, null, 2));

    const response = await axios.post(`${BASE_URL}/user/createUser`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Success! Response:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('❌ Error occurred:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
  }
}

testUserSignup();

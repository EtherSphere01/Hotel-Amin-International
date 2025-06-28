const axios = require('axios');

async function testHousekeepingRequest() {
  console.log('Testing housekeeping request submission...');

  const requestData = {
    room: 101,
    phone: '01712345678',
    description: 'Need room cleaning and fresh towels',
  };

  try {
    console.log('Sending request:', requestData);

    const response = await axios.post(
      'http://localhost:3000/housekeeping/request',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data.success) {
      console.log('✅ Housekeeping request submitted successfully!');
    } else {
      console.log('❌ Failed to submit housekeeping request');
    }
  } catch (error) {
    console.error(
      '❌ Error testing housekeeping request:',
      error.response?.data || error.message,
    );
  }
}

// Test fetching all requests (admin endpoint)
async function testGetAllRequests() {
  console.log('\nTesting get all housekeeping requests...');

  try {
    const response = await axios.get(
      'http://localhost:3000/housekeeping/requests',
    );

    console.log('Response status:', response.status);
    console.log('Number of requests:', response.data.length);
    console.log('Requests:', response.data);
  } catch (error) {
    console.error(
      '❌ Error fetching requests:',
      error.response?.data || error.message,
    );
  }
}

// Run tests
async function runTests() {
  await testHousekeepingRequest();
  await testGetAllRequests();
}

runTests();

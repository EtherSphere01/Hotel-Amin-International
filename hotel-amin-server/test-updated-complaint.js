const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testComplaintEndpoint() {
  console.log('Testing updated complaint endpoint with status...\n');

  try {
    // Test data for the complaint endpoint
    const complaintData = {
      phone_number: '1234567890',
      room_num: 111,
      item_name: 'laptop',
      status: 'needs_repair',
      issue_description: 'Laptop is not working properly and needs repair',
    };

    console.log('Sending POST request to:', `${BASE_URL}/complain/report`);
    console.log('Request body:', JSON.stringify(complaintData, null, 2));

    const response = await axios.post(
      `${BASE_URL}/complain/report`,
      complaintData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Success! Response:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error occurred:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
    console.error('Full Error:', error.message);
  }
}

testComplaintEndpoint();

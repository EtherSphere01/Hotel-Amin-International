const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('Testing complaint endpoints...\n');

  try {
    // Test 1: Get room items
    console.log('Test 1: Getting room items for room 101...');
    const roomItemsResponse = await axios.get(`${BASE_URL}/room/101/items`);
    console.log('Room items response:', roomItemsResponse.data);
    console.log('Status:', roomItemsResponse.status);
  } catch (error) {
    console.error('Room items error:', error.response?.data || error.message);
  }

  console.log('\n---\n');

  try {
    // Test 2: Submit complaint
    console.log('Test 2: Submitting a complaint...');
    const complaintData = {
      phone_number: '1234567890',
      room_num: 101,
      item_name: 'Air Conditioner',
      issue_description: 'Air conditioner is not working properly',
    };

    const complaintResponse = await axios.post(
      `${BASE_URL}/complain/report`,
      complaintData,
    );
    console.log('Complaint response:', complaintResponse.data);
    console.log('Status:', complaintResponse.status);
  } catch (error) {
    console.error('Complaint error:', error.response?.data || error.message);
    console.error(
      'Error details:',
      error.response?.status,
      error.response?.statusText,
    );
  }
}

testEndpoints();

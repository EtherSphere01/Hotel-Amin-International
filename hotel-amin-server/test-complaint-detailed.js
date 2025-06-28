const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testComplaintEndpoint() {
  console.log('Testing complaint endpoint...\n');

  // First, let's get room items to see what's available
  try {
    console.log('1. Getting room items for room 111...');
    const roomItemsResponse = await axios.get(`${BASE_URL}/room/111/items`);
    console.log('Room items:', roomItemsResponse.data);
  } catch (error) {
    console.error('Error getting room items:', error.response?.data);
  }

  console.log('\n2. Testing complaint submission...');

  // Test with different phone numbers to see if booking exists
  const testCases = [
    { phone_number: '1234567890', description: 'Test phone 1234567890' },
    { phone_number: '0987654321', description: 'Test phone 0987654321' },
    { phone_number: '1111111111', description: 'Test phone 1111111111' },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\nTesting with phone: ${testCase.phone_number}`);
      const complaintData = {
        phone_number: testCase.phone_number,
        room_num: 111,
        item_name: 'laptop',
        issue_description: `Laptop screen is flickering - ${testCase.description}`,
      };

      const response = await axios.post(
        `${BASE_URL}/complain/report`,
        complaintData,
      );
      console.log('✓ Success:', response.data);
      break; // If one succeeds, we're good
    } catch (error) {
      console.log('✗ Failed:', error.response?.data);
    }
  }
}

testComplaintEndpoint();

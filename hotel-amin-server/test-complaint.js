// Test script for complaint functionality
const axios = require('axios');

async function testComplaintAPI() {
  try {
    console.log('Testing complaint functionality...');

    // Test 1: Get room items for room 101
    console.log('\n1. Testing get room items for room 101:');
    try {
      const roomItemsResponse = await axios.get(
        'http://localhost:3000/room/101/items',
      );
      console.log('Room items:', roomItemsResponse.data);
    } catch (error) {
      console.log('Room items error:', error.response?.data || error.message);
    }

    // Test 2: Submit a complaint
    console.log('\n2. Testing submit complaint:');
    const complaintData = {
      phone_number: '01700000000',
      room_num: 101,
      item_name: 'Bed',
      issue_description: 'The bed is not comfortable and needs replacement.',
    };

    try {
      const complaintResponse = await axios.post(
        'http://localhost:3000/complain/report',
        complaintData,
      );
      console.log('Complaint response:', complaintResponse.data);
    } catch (error) {
      console.log('Complaint error:', error.response?.data || error.message);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testComplaintAPI();

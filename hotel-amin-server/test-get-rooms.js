const axios = require('axios');

async function testGetAllRooms() {
  console.log('Testing get all rooms...');

  try {
    const response = await axios.get('http://localhost:3000/room/all', {
      headers: {
        Authorization: 'Bearer your-token-here', // You might need a token
      },
    });

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      '❌ Error getting rooms:',
      error.response?.data || error.message,
    );
  }
}

async function testGetRoomsByStatus() {
  console.log('Testing get rooms by status...');

  try {
    const response = await axios.get(
      'http://localhost:3000/room/by-status/available',
      {
        headers: {
          Authorization: 'Bearer your-token-here',
        },
      },
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      '❌ Error getting rooms by status:',
      error.response?.data || error.message,
    );
  }
}

testGetAllRooms();
setTimeout(() => testGetRoomsByStatus(), 2000);

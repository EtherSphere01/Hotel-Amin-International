const axios = require('axios');

async function testRoomSearch() {
  console.log('Testing room search functionality...');

  const searchData = {
    checkIn: '2025-07-01',
    checkOut: '2025-07-03',
    guests: 2,
  };

  try {
    console.log('Sending search request:', searchData);

    const response = await axios.post(
      'http://localhost:3000/room/search',
      searchData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log(`✅ Found ${response.data.data.length} available rooms`);
      response.data.data.forEach((room, index) => {
        console.log(
          `Room ${index + 1}: ${room.room_num} - ${room.room_type} - ৳${room.price_per_night}/night`,
        );
      });
    } else {
      console.log('❌ No rooms found');
    }
  } catch (error) {
    console.error(
      '❌ Error testing room search:',
      error.response?.data || error.message,
    );
  }
}

// Test with different dates
async function testMultipleDates() {
  const testCases = [
    { checkIn: '2025-07-01', checkOut: '2025-07-03', guests: 1 },
    { checkIn: '2025-07-15', checkOut: '2025-07-20', guests: 2 },
    { checkIn: '2025-08-01', checkOut: '2025-08-05', guests: 4 },
  ];

  for (const testCase of testCases) {
    console.log(
      `\n--- Testing: ${testCase.checkIn} to ${testCase.checkOut}, ${testCase.guests} guests ---`,
    );
    await testRoomSearch();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
}

testRoomSearch();

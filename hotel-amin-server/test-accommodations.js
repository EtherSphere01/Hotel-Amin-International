const axios = require('axios');

async function testGetAccommodations() {
  console.log('Testing get accommodations...');

  try {
    const response = await axios.get(
      'http://localhost:3000/accommodation/all',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.length > 0) {
      console.log(`✅ Found ${response.data.length} accommodations`);
      response.data.forEach((acc, index) => {
        console.log(
          `Accommodation ${index + 1}: ${acc.title} - ৳${acc.price_per_night}/night`,
        );
      });
    } else {
      console.log('❌ No accommodations found');
    }
  } catch (error) {
    console.error(
      '❌ Error getting accommodations:',
      error.response?.data || error.message,
    );
  }
}

testGetAccommodations();

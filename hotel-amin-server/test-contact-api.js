const axios = require('axios');

async function testContactFormEndpoint() {
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message from the contact form.',
    subject: 'Contact Form Test Message',
  };

  try {
    console.log('Testing contact form endpoint...');
    console.log('Sending data:', contactData);

    const response = await axios.post(
      'http://localhost:3000/email/send-contact',
      contactData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Success!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testContactFormEndpoint();

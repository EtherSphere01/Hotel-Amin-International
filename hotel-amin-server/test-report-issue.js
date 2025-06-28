const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testReportIssueEndpoint() {
  console.log('Testing room report issue endpoint...\n');

  try {
    // Test data for the report issue endpoint
    const reportData = {
      issue_report: 'Laptop is not working properly',
      status: 'needs_repair',
    };

    console.log(
      'Sending PATCH request to:',
      `${BASE_URL}/room/111/items/report-issue/laptop`,
    );
    console.log('Request body:', JSON.stringify(reportData, null, 2));

    const response = await axios.patch(
      `${BASE_URL}/room/111/items/report-issue/laptop`,
      reportData,
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

testReportIssueEndpoint();

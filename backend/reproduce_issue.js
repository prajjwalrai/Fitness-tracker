const http = require('http');

function testRegistration() {
  const payload = JSON.stringify({
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com',
    password: { nested: "object" }, // Invalid type for password
    goals: {
      dailyCalories: 2000,
      dailyProtein: 150,
      targetWeight: 70
    },
    height: 170
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/users/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(payload);
  req.end();
}

testRegistration();

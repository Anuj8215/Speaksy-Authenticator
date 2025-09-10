#!/usr/bin/env node

/**
 * Test script to verify API endpoints are working
 * Run with: node scripts/test-api.js [BASE_URL]
 * 
 * Examples:
 * node scripts/test-api.js http://localhost:3000
 * node scripts/test-api.js https://your-app.vercel.app
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data || '{}')
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log(`🧪 Testing API at ${BASE_URL}`);
  console.log('=' .repeat(50));

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest(`${BASE_URL}/api/health`);
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response:`, healthResponse.data);
    
    if (healthResponse.status !== 200) {
      console.log('❌ Health check failed');
      return;
    }
    console.log('✅ Health check passed\n');

    // Test user registration
    console.log('2. Testing user registration...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      password: 'testpass123'
    };
    
    const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: testUser
    });
    
    console.log(`   Status: ${registerResponse.status}`);
    console.log(`   Response:`, registerResponse.data);
    
    if (registerResponse.status !== 201) {
      console.log('❌ Registration failed');
      return;
    }
    console.log('✅ Registration passed\n');

    // Test login
    console.log('3. Testing user login...');
    const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: testUser
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Response:`, loginResponse.data);
    
    if (loginResponse.status !== 200 || !loginResponse.data.token) {
      console.log('❌ Login failed');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login passed\n');

    // Test authenticated endpoint
    console.log('4. Testing authenticated user endpoint...');
    const userResponse = await makeRequest(`${BASE_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`   Status: ${userResponse.status}`);
    console.log(`   Response:`, userResponse.data);
    
    if (userResponse.status !== 200) {
      console.log('❌ User endpoint failed');
      return;
    }
    console.log('✅ User endpoint passed\n');

    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
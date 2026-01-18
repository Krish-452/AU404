const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
    const timestamp = Date.now();
    const user = {
        name: 'Auto Test User',
        email: `auto_test_${timestamp}@test.com`,
        password: 'Password123!',
        role: 'CITIZEN'
    };

    console.log('--- Starting Integration Test ---');

    try {
        // 1. Signup
        console.log(`1. Testing Signup for ${user.email}...`);
        const signupRes = await axios.post(`${API_URL}/signup`, user);
        if (signupRes.status === 201 && signupRes.data.token) {
            console.log('   [SUCCESS] Signup complete.');
        } else {
            throw new Error('Signup failed');
        }

        // 2. Login (fail case)
        console.log('2. Testing Login Invalid Password...');
        try {
            await axios.post(`${API_URL}/login`, { email: user.email, password: 'wrongpassword' });
            throw new Error('   [FAIL] Login should have failed!');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                console.log('   [SUCCESS] Invalid password rejected correctly.');
            } else {
                throw e;
            }
        }

        // 3. Login (success case)
        console.log('3. Testing Login Success...');
        const loginRes = await axios.post(`${API_URL}/login`, { email: user.email, password: user.password });
        if (loginRes.status === 200 && loginRes.data.token) {
            console.log('   [SUCCESS] Login successful.');
        } else {
            throw new Error('Login failed');
        }

        console.log('--- All Integration Tests Passed ---');
        process.exit(0);

    } catch (err) {
        console.error('--- TEST FAILED ---');
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error(`Data:`, err.response.data);
        } else {
            console.error(`Error Code: ${err.code}`);
            console.error(`Message: ${err.message}`);
        }
        process.exit(1);
    }
}

testAuthFlow();

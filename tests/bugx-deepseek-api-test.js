/**
 * BugX Diagnostic Test for DeepSeek API Key Failure
 * 
 * ISSUE: User reports valid DeepSeek API key failing during "Test & Save"
 * 
 * HYPOTHESIS:
 * 1. Worker might not be deployed (DeepSeek handler missing)
 * 2. API endpoint URL mismatch
 * 3. Request format incompatible with DeepSeek API
 * 4. CORS issue if using direct endpoint
 * 5. Authorization header format incorrect
 */

// TEST 1: Check if site is detecting Worker URL
console.log('=== TEST 1: Worker URL Detection ===');
console.log('Current hostname:', window.location.hostname);
console.log('Should use Worker:', window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('tapestrai'));

// TEST 2: Simulate what apiKeyManager does
console.log('\n=== TEST 2: API Key Manager Configuration ===');
const testWorkerUrl = window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('tapestrai')
  ? 'https://tapestrai-worker.david-ec6.workers.dev'
  : null;

console.log('Worker URL that would be used:', testWorkerUrl);
console.log('DeepSeek endpoint would be:', testWorkerUrl 
  ? `${testWorkerUrl}/api/deepseek` 
  : 'https://api.deepseek.com/chat/completions');

// TEST 3: Test Worker endpoint accessibility
console.log('\n=== TEST 3: Worker Endpoint Accessibility ===');
async function testWorkerEndpoint() {
  const workerUrl = 'https://tapestrai-worker.david-ec6.workers.dev';
  const endpoints = [
    '/api/gemini',
    '/api/openai', 
    '/api/anthropic',
    '/api/perplexity',
    '/api/deepseek'
  ];
  
  console.log('Testing Worker endpoints...');
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${workerUrl}${endpoint}`, {
        method: 'OPTIONS'
      });
      console.log(`✓ ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`✗ ${endpoint}: ${error.message}`);
    }
  }
}

// TEST 4: Test DeepSeek API directly (will likely fail due to CORS)
console.log('\n=== TEST 4: Direct DeepSeek API Test ===');
async function testDeepSeekDirectly(apiKey) {
  console.log('Testing DeepSeek API directly (expect CORS error)...');
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Respond with just "success"' }],
        max_tokens: 10
      })
    });
    
    console.log('Direct API Status:', response.status);
    const data = await response.json();
    console.log('Direct API Response:', data);
    return response.ok;
  } catch (error) {
    console.error('Direct API Error:', error.message);
    if (error.message.includes('CORS') || error.name === 'TypeError') {
      console.log('✓ CONFIRMED: CORS block (expected - need Worker)');
    }
    return false;
  }
}

// TEST 5: Test DeepSeek via Worker
console.log('\n=== TEST 5: DeepSeek via Worker Test ===');
async function testDeepSeekViaWorker(apiKey) {
  console.log('Testing DeepSeek API via Worker...');
  try {
    const response = await fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Respond with just "success"' }],
        max_tokens: 10
      })
    });
    
    console.log('Worker API Status:', response.status);
    console.log('Worker API StatusText:', response.statusText);
    
    const responseText = await response.text();
    console.log('Worker Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Worker API Response:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON');
    }
    
    if (response.status === 404) {
      console.error('❌ PROBLEM FOUND: Worker endpoint not found!');
      console.error('   The Worker has not been deployed with DeepSeek handler.');
      console.error('   Solution: Deploy the updated Worker code to Cloudflare.');
      return false;
    }
    
    if (response.status === 401) {
      console.error('❌ PROBLEM FOUND: API key rejected by DeepSeek');
      console.error('   Either the key is invalid or expired.');
      console.error('   Solution: Generate a new API key from https://platform.deepseek.com/api_keys');
      return false;
    }
    
    if (response.ok) {
      console.log('✓ SUCCESS: DeepSeek API working via Worker!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Worker API Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

// TEST 6: Check DeepSeek API Key format
console.log('\n=== TEST 6: API Key Format Validation ===');
function validateDeepSeekKeyFormat(apiKey) {
  console.log('Validating API key format...');
  console.log('Key length:', apiKey.length);
  console.log('Key starts with:', apiKey.substring(0, 10) + '...');
  
  // DeepSeek keys typically start with 'sk-'
  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️ Warning: DeepSeek keys usually start with "sk-"');
  }
  
  if (apiKey.length < 20) {
    console.error('❌ Key too short (< 20 characters)');
    return false;
  }
  
  console.log('✓ Key format looks valid');
  return true;
}

// RUN ALL TESTS
console.log('\n==================================================');
console.log('BUGX: DeepSeek API Key Test Diagnostic');
console.log('==================================================\n');

// Auto-run tests that don't need API key
testWorkerEndpoint();

// Instructions for manual testing with API key
console.log('\n=== MANUAL TESTING REQUIRED ===');
console.log('To complete diagnosis, run in browser console:');
console.log('');
console.log('// Replace YOUR_API_KEY with your actual DeepSeek API key');
console.log('const apiKey = "YOUR_API_KEY";');
console.log('');
console.log('// Validate format');
console.log('validateDeepSeekKeyFormat(apiKey);');
console.log('');
console.log('// Test directly (will show CORS error)');
console.log('await testDeepSeekDirectly(apiKey);');
console.log('');
console.log('// Test via Worker (THE REAL TEST)');
console.log('await testDeepSeekViaWorker(apiKey);');
console.log('');

// Export test functions to window for manual use
window.bugxTests = {
  testWorkerEndpoint,
  testDeepSeekDirectly,
  testDeepSeekViaWorker,
  validateDeepSeekKeyFormat
};

console.log('✓ BugX test functions available at: window.bugxTests');
console.log('');
console.log('EXPECTED DIAGNOSIS:');
console.log('- If testDeepSeekViaWorker returns 404: Worker not deployed');
console.log('- If testDeepSeekViaWorker returns 401: Invalid API key');
console.log('- If testDeepSeekViaWorker returns 200: Everything works!');

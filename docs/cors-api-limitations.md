# CORS & API Limitations - tapestrAI v3.0

## 🚨 Issue: Direct Browser API Calls

### What's Happening

When testing API keys for **OpenAI**, **Anthropic**, and **Perplexity**, you may encounter errors even with valid API keys. This is due to **CORS (Cross-Origin Resource Sharing)** restrictions.

### Why This Happens

**CORS** is a browser security mechanism that prevents JavaScript from making requests to a different domain than the one serving the web page. 

- ✅ **Gemini**: Google's API explicitly allows browser requests (CORS enabled)
- ❌ **OpenAI**: Does NOT allow direct browser requests
- ❌ **Anthropic**: Does NOT allow direct browser requests  
- ❌ **Perplexity**: Does NOT allow direct browser requests

### Error Messages You'll See

```
CORS Error: [Provider] cannot be accessed directly from browser
```

Or in the browser console:
```
Access to fetch at 'https://api.openai.com/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

---

## ✅ Solutions

### Solution 1: Use a Proxy Server (Recommended)

Create a simple backend proxy that forwards requests to the APIs. This bypasses CORS because the proxy makes server-to-server requests.

#### Quick Setup with Node.js

**1. Create `proxy-server.js`:**

```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI proxy
app.post('/api/openai', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Anthropic proxy
app.post('/api/anthropic', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': req.headers['x-api-key'],
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Perplexity proxy
app.post('/api/perplexity', async (req, res) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
```

**2. Install dependencies:**

```bash
npm install express cors node-fetch
```

**3. Run the proxy:**

```bash
node proxy-server.js
```

**4. Update `apiKeyManager.js` endpoints:**

```javascript
// Change from:
endpoint: 'https://api.openai.com/v1/chat/completions'

// To:
endpoint: 'http://localhost:3001/api/openai'
```

---

### Solution 2: Browser Extension

Use a browser extension like [CORS Unblock](https://chrome.google.com/webstore) to disable CORS **for testing only**.

⚠️ **Warning**: This is insecure and should ONLY be used for local development testing.

---

### Solution 3: Deploy with Backend

Deploy tapestrAI with a proper backend (Node.js, Python Flask, etc.) that handles API calls server-side.

**Architecture:**
```
Browser → Your Backend → External APIs
         (No CORS issues)
```

---

### Solution 4: Use Only Gemini

Since Gemini works perfectly from the browser and provides excellent analysis:

1. Use **only Gemini** for now
2. Get free API key: https://aistudio.google.com/apikey
3. No backend needed
4. Full functionality available

---

## 🔧 Current Workaround Implementation

The codebase now includes:

1. **Enhanced Error Detection**: Identifies CORS errors and shows clear messages
2. **Graceful Degradation**: App works fully with Gemini only
3. **Clear User Feedback**: Explains which APIs work and which don't

---

## 📊 Provider Compatibility Matrix

| Provider | Browser Support | Notes |
|----------|----------------|-------|
| **Google Gemini** | ✅ Full | CORS enabled, works perfectly |
| **OpenAI** | ❌ Blocked | Requires proxy or backend |
| **Anthropic** | ❌ Blocked | Requires proxy or backend |
| **Perplexity** | ❌ Blocked | Requires proxy or backend |

---

## 🎯 Recommended Approach

### For Local Development/Testing
Use **Gemini only** - it's free, fast, and works perfectly from the browser.

### For Production Deployment
1. Deploy with a backend proxy (Node.js, Python, etc.)
2. Keep API keys server-side (more secure)
3. Enable all 4 providers for full multi-agent analysis

---

## 📝 Code Changes Needed for Proxy

If you set up a proxy server, update `js/apiKeyManager.js`:

```javascript
// In the providers object, change endpoints:
openai: {
  // ... other config
  endpoint: 'http://localhost:3001/api/openai', // Proxy endpoint
},

anthropic: {
  // ... other config
  endpoint: 'http://localhost:3001/api/anthropic', // Proxy endpoint
},

perplexity: {
  // ... other config  
  endpoint: 'http://localhost:3001/api/perplexity', // Proxy endpoint
},
```

---

## 🔍 Testing API Keys Manually

If you want to verify your API keys work (outside the browser):

### Test OpenAI (curl):
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 10
  }'
```

### Test Anthropic (curl):
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 10,
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### Test Perplexity (curl):
```bash
curl https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 10
  }'
```

---

## 💡 Summary

**The Problem**: OpenAI, Anthropic, and Perplexity block direct browser requests due to CORS.

**Quick Solution**: Use Gemini only (works great!)

**Full Solution**: Deploy with a backend proxy server to enable all 4 providers.

**Status**: This is a common limitation of browser-based apps, not a bug in tapestrAI.

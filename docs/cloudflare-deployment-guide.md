# Cloudflare Free Deployment Guide - tapestrAI v3.0

## ✅ YES! Cloudflare Free Plan Works Perfectly

**Good news**: Cloudflare's free plan is **ideal** for tapestrAI with full multi-provider API support!

---

## Why Cloudflare Free Plan is Perfect

### Free Tier Limits (More Than Enough!)

| Resource | Free Limit | tapestrAI Needs | Status |
|----------|------------|-----------------|--------|
| **Cloudflare Workers** | 100,000 requests/day | ~100-500/day typical | ✅ Plenty |
| **Worker CPU Time** | 10ms per request | ~5ms per proxy | ✅ Excellent |
| **Cloudflare Pages** | Unlimited | Static hosting | ✅ Perfect |
| **Bandwidth** | Unlimited | Frontend files | ✅ Perfect |
| **Custom Domain** | Yes | Optional | ✅ Available |

### Cost Analysis

**Typical Usage**:
- 50 analyses per day
- 4 API providers each
- = 200 Worker requests/day
- = **$0.00** on Cloudflare

**You'd need to do 500+ analyses per day to exceed free tier!**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
│           (tapestrAI Frontend - HTML/JS)            │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ HTTPS
                  │
┌─────────────────▼───────────────────────────────────┐
│              Cloudflare Pages                        │
│         (Free Static Hosting)                        │
│   Serves: index.html, CSS, JS files                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Frontend calls Worker URLs
                  │
┌─────────────────▼───────────────────────────────────┐
│           Cloudflare Workers                         │
│         (Free Serverless Functions)                  │
│                                                      │
│  Workers:                                            │
│  - /api/gemini    → proxies to Google               │
│  - /api/openai    → proxies to OpenAI               │
│  - /api/anthropic → proxies to Anthropic            │
│  - /api/perplexity → proxies to Perplexity          │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ HTTPS (Server-to-Server, No CORS!)
                  │
┌─────────────────▼───────────────────────────────────┐
│            External AI APIs                          │
│   • Google Gemini API                               │
│   • OpenAI API                                      │
│   • Anthropic API                                   │
│   • Perplexity API                                  │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step Deployment Guide

### Prerequisites
- Cloudflare account (free): https://dash.cloudflare.com/sign-up
- GitHub account (optional, for easier deployment)
- Node.js installed (for local development)

---

### Step 1: Prepare Your Code

#### 1.1 Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
```

#### 1.2 Login to Cloudflare

```bash
wrangler login
```

This opens a browser for authentication.

---

### Step 2: Create Cloudflare Workers

#### 2.1 Create `wrangler.toml` in project root

```toml
name = "tapestrai-workers"
main = "workers/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "tapestrai-workers"
routes = [
  { pattern = "yourdomain.com/api/*", zone_name = "yourdomain.com" }
]

# Environment variables (optional - can use Wrangler secrets instead)
[env.production.vars]
# Add any non-sensitive config here
```

#### 2.2 Create `workers/index.js`

```javascript
/**
 * Cloudflare Worker for tapestrAI API Proxy
 * Handles all external API calls to bypass CORS
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Route to appropriate API handler
      if (url.pathname.startsWith('/api/gemini')) {
        return await handleGemini(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/openai')) {
        return await handleOpenAI(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/anthropic')) {
        return await handleAnthropic(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/perplexity')) {
        return await handlePerplexity(request, corsHeaders);
      } else {
        return new Response('API endpoint not found', { 
          status: 404,
          headers: corsHeaders 
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Gemini API Handler
async function handleGemini(request, corsHeaders) {
  const body = await request.json();
  const apiKey = new URL(request.url).searchParams.get('key');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${body.model || 'gemini-2.0-flash-exp'}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload)
    }
  );
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// OpenAI API Handler
async function handleOpenAI(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Anthropic API Handler
async function handleAnthropic(request, corsHeaders) {
  const body = await request.json();
  const apiKey = request.headers.get('x-api-key');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Perplexity API Handler
async function handlePerplexity(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

#### 2.3 Deploy Worker

```bash
wrangler deploy
```

You'll get a URL like: `https://tapestrai-workers.your-subdomain.workers.dev`

---

### Step 3: Update Frontend Code

#### 3.1 Update `js/apiKeyManager.js`

Change the endpoints to use your Cloudflare Worker:

```javascript
// Find this section in apiKeyManager.js (around line 10-60)

this.providers = {
  gemini: {
    name: 'Google Gemini',
    required: true,
    model: 'gemini-2.0-flash-exp',
    endpoint: 'https://tapestrai-workers.your-subdomain.workers.dev/api/gemini', // Changed!
    icon: '🔷',
    color: '#4285F4',
    getKeyUrl: 'https://aistudio.google.com/apikey',
    instructions: 'Get a free API key from Google AI Studio.',
    testPrompt: 'Respond with just the word "success"',
    costPer1kTokens: 0.00002
  },
  
  openai: {
    name: 'OpenAI',
    required: false,
    model: 'gpt-4-turbo',
    endpoint: 'https://tapestrai-workers.your-subdomain.workers.dev/api/openai', // Changed!
    icon: '🟢',
    color: '#10A37F',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    instructions: 'Create an API key from OpenAI Platform.',
    testPrompt: 'Respond with just "success"',
    costPer1kTokens: 0.01
  },
  
  anthropic: {
    name: 'Anthropic Claude',
    required: false,
    model: 'claude-sonnet-4-20250514',
    endpoint: 'https://tapestrai-workers.your-subdomain.workers.dev/api/anthropic', // Changed!
    icon: '🟣',
    color: '#8B5CF6',
    getKeyUrl: 'https://console.anthropic.com/',
    instructions: 'Generate API key from Anthropic Console.',
    testPrompt: 'Respond with just "success"',
    costPer1kTokens: 0.003
  },
  
  perplexity: {
    name: 'Perplexity AI',
    required: false,
    model: 'sonar-pro',
    endpoint: 'https://tapestrai-workers.your-subdomain.workers.dev/api/perplexity', // Changed!
    icon: '🔵',
    color: '#3B82F6',
    getKeyUrl: 'https://www.perplexity.ai/settings/api',
    instructions: 'Get API key from Perplexity Settings.',
    testPrompt: 'Respond with just "success"',
    costPer1kTokens: 0.001
  }
};
```

#### 3.2 Update API Call Methods

Since Gemini now goes through the Worker, update the `testKey` method around line 197:

```javascript
case 'gemini':
  // Now uses Worker, so structure changes slightly
  response = await fetch(
    `${config.endpoint}?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        payload: {
          contents: [{
            parts: [{ text: config.testPrompt }]
          }],
          generationConfig: { maxOutputTokens: 10 }
        }
      })
    }
  );
  break;
```

---

### Step 4: Deploy Frontend to Cloudflare Pages

#### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Deploy to Cloudflare"
git branch -M main
git remote add origin https://github.com/yourusername/tapestrai.git
git push -u origin main
```

2. **Connect to Cloudflare Pages**

- Go to: https://dash.cloudflare.com/
- Click "Workers & Pages" → "Create"
- Select "Pages" → "Connect to Git"
- Select your repository
- Configure build:
  - **Build command**: (leave empty - static site)
  - **Build output directory**: `/` (root)
  - **Root directory**: `/` (root)
- Click "Save and Deploy"

#### Option B: Direct Upload (Quick & Easy)

```bash
wrangler pages publish . --project-name=tapestrai
```

Your site will be live at: `https://tapestrai.pages.dev`

---

### Step 5: Configure Custom Domain (Optional)

If you have a domain (e.g., `yourdomain.com`):

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Custom domains"
4. Add your domain
5. Cloudflare automatically configures DNS

**Result**: `https://yourdomain.com` → tapestrAI

---

### Step 6: Test Everything

1. **Open your deployed site**: `https://tapestrai.pages.dev`

2. **Test Gemini** (should work):
   - Add Gemini API key
   - Click "Test & Save"
   - Should show "✓ Google Gemini connected successfully!"

3. **Test OpenAI** (should now work!):
   - Add OpenAI API key
   - Click "Test & Save"
   - Should work through Worker proxy

4. **Test Anthropic** (should now work!):
   - Add Anthropic API key
   - Click "Test & Save"
   - Should work through Worker proxy

5. **Test Perplexity** (should now work!):
   - Add Perplexity API key
   - Click "Test & Save"
   - Should work through Worker proxy

---

## Cost Breakdown

### Cloudflare Free Tier

```
Frontend Hosting (Pages):  $0.00 / month
Worker Requests (100k):     $0.00 / month
Bandwidth (unlimited):      $0.00 / month
SSL Certificate:            $0.00 / month
Custom Domain:              $0.00 / month
───────────────────────────────────────
Total Cloudflare Cost:      $0.00 / month
```

### AI API Costs (Your Usage)

```
Gemini Free Tier:           $0.00 (60 req/min free)
OpenAI (optional):          ~$0.01 per analysis
Anthropic (optional):       ~$0.003 per analysis
Perplexity (optional):      ~$0.001 per analysis
───────────────────────────────────────
Total per Analysis:         $0.00 - $0.50
```

**Example Monthly Cost** (50 analyses):
- Gemini only: **$0.00**
- All 4 providers: **~$25.00** (AI APIs only)

---

## Monitoring & Limits

### Check Worker Usage

```bash
wrangler tail
```

Or view in dashboard: Workers & Pages → Your Worker → Metrics

### Free Tier Limits

- **100,000 requests/day** = 3.3 million/month
- **10ms CPU per request** = plenty for proxy
- **No bandwidth limits** on frontend

### What Happens if You Exceed?

- Cloudflare sends notification
- You can upgrade to Workers Paid ($5/month for 10M requests)
- But you'd need **1,000+ analyses per day** to exceed free tier!

---

## Security Considerations

### ✅ What's Secure

- **API keys stored client-side**: Encrypted in browser
- **HTTPS everywhere**: Cloudflare provides free SSL
- **No keys in Worker**: Keys sent from browser in requests
- **CORS properly configured**: Only your domain can access Worker

### ⚠️ Additional Security (Optional)

#### Add Rate Limiting

```javascript
// In workers/index.js, add at the top
const rateLimiter = new Map();

async function checkRateLimit(ip) {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  
  // Clean old requests (older than 1 minute)
  const recent = requests.filter(time => now - time < 60000);
  
  if (recent.length >= 100) {
    return false; // Rate limit exceeded
  }
  
  recent.push(now);
  rateLimiter.set(ip, recent);
  return true;
}

// Then in fetch handler:
const ip = request.headers.get('CF-Connecting-IP');
if (!await checkRateLimit(ip)) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

#### Add Domain Restriction

```javascript
// Only allow requests from your domain
const allowedOrigins = [
  'https://tapestrai.pages.dev',
  'https://yourdomain.com'
];

const origin = request.headers.get('Origin');
if (!allowedOrigins.includes(origin)) {
  return new Response('Forbidden', { status: 403 });
}
```

---

## Troubleshooting

### Issue: Worker not receiving requests

**Solution**: Check CORS headers and Worker URL

```bash
# Test Worker directly
curl -X POST https://tapestrai-workers.your-subdomain.workers.dev/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Issue: API keys not working

**Solution**: Check if keys are being passed correctly

```javascript
// Add logging to Worker
console.log('Request headers:', request.headers);
console.log('Request body:', await request.clone().text());
```

### Issue: Exceeding free tier

**Solution**: Check Worker metrics

```bash
wrangler tail --format pretty
```

---

## Comparison: Cloudflare vs Other Options

| Feature | Cloudflare Free | Vercel Free | Netlify Free | Heroku Free (deprecated) |
|---------|----------------|-------------|--------------|--------------------------|
| **Cost** | $0 | $0 | $0 | N/A |
| **Workers** | 100k/day | 100k/month | 125k/month | N/A |
| **Bandwidth** | Unlimited | 100GB/month | 100GB/month | N/A |
| **Build Minutes** | N/A | 100/month | 300/month | N/A |
| **Serverless Functions** | Yes | Yes (limited) | Yes (limited) | N/A |
| **Recommendation** | ✅ **Best** | ⚠️ Low limits | ⚠️ Low limits | ❌ No longer free |

**Winner**: Cloudflare - most generous free tier for this use case!

---

## Scaling Up (If Needed)

### Cloudflare Workers Paid ($5/month)
- **10 million requests/month** (100x more)
- **50ms CPU time** (5x more)
- **More memory** for complex operations

**When to upgrade**: 
- 3,000+ analyses per day
- Need longer CPU time for processing
- Want additional features (Durable Objects, KV storage)

---

## Summary

### ✅ Yes, Cloudflare Free Plan is Perfect!

**Why it works**:
1. **Generous limits**: 100k Worker requests/day (way more than needed)
2. **Unlimited bandwidth**: For frontend hosting
3. **Free SSL**: HTTPS everywhere
4. **Easy deployment**: Single command or GitHub integration
5. **Great DX**: Wrangler CLI is excellent

**Total monthly cost**: **$0.00** for Cloudflare infrastructure

**You only pay for AI API usage**, which is the same regardless of where you deploy!

---

## Next Steps

1. **Create Cloudflare account**: https://dash.cloudflare.com/sign-up
2. **Install Wrangler**: `npm install -g wrangler`
3. **Create Worker**: Copy code from this guide
4. **Deploy Worker**: `wrangler deploy`
5. **Update frontend endpoints**: Point to Worker URL
6. **Deploy frontend**: `wrangler pages publish .`
7. **Test all 4 APIs**: They should all work now!

**Estimated setup time**: 30-60 minutes

---

## Resources

- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Example Projects**: https://workers.cloudflare.com/built-with

**Have questions?** The Cloudflare Discord is very helpful: https://discord.gg/cloudflaredev

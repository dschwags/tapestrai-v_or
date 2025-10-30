# Cloudflare Quick Start - tapestrAI

## ⚡ 5-Minute Overview

**Goal**: Deploy tapestrAI with all 4 AI providers working (OpenAI, Anthropic, Perplexity, Gemini)

**Cost**: $0.00/month for hosting (only pay for AI API usage)

**Time**: 30-60 minutes first time, 5 minutes for updates

---

## ✅ What You Get

- 🌍 Public URL: `https://tapestrai.pages.dev`
- 🔒 Free SSL/HTTPS
- 🚀 All 4 AI providers working
- 💰 100,000 Worker requests/day (free)
- 📡 Unlimited bandwidth
- 🌐 Global CDN (fast everywhere)

---

## 📋 Prerequisites

```bash
# 1. Node.js installed
node --version  # Should show v16 or higher

# 2. Cloudflare account (free)
# Sign up: https://dash.cloudflare.com/sign-up

# 3. Install Wrangler CLI
npm install -g wrangler

# 4. Login
wrangler login
```

---

## 🚀 Deployment Steps

### Step 1: Create Worker

**File**: `workers/index.js` (copy from `docs/cloudflare-deployment-guide.md`)

```bash
# Deploy Worker
wrangler deploy
```

**Result**: Get Worker URL like `https://tapestrai-abc123.workers.dev`

---

### Step 2: Update Frontend

**File**: `js/apiKeyManager.js`

Find the `providers` object (around line 10) and update all endpoints:

```javascript
gemini: {
  // ... other config ...
  endpoint: 'https://YOUR-WORKER-URL.workers.dev/api/gemini',
},

openai: {
  // ... other config ...
  endpoint: 'https://YOUR-WORKER-URL.workers.dev/api/openai',
},

anthropic: {
  // ... other config ...
  endpoint: 'https://YOUR-WORKER-URL.workers.dev/api/anthropic',
},

perplexity: {
  // ... other config ...
  endpoint: 'https://YOUR-WORKER-URL.workers.dev/api/perplexity',
}
```

---

### Step 3: Deploy Frontend

```bash
# From project root
wrangler pages publish . --project-name=tapestrai
```

**Result**: Get Pages URL like `https://tapestrai.pages.dev`

---

### Step 4: Test

1. Open `https://tapestrai.pages.dev`
2. Add API keys for providers
3. Click "Test & Save" on each
4. All 4 should now work! ✅

---

## 📊 Free Tier Limits

| Resource | Limit | Your Usage | Status |
|----------|-------|------------|--------|
| Worker requests | 100k/day | ~200/day | ✅ 0.2% |
| CPU time | 10ms/req | ~5ms | ✅ 50% |
| Bandwidth | Unlimited | Small | ✅ Safe |

**You're using less than 1% of free tier limits!**

---

## 🔧 Common Issues

### Issue: Worker URL not working

**Check**:
```bash
# Test Worker directly
curl https://YOUR-WORKER-URL.workers.dev/api/gemini
```

**Should return**: JSON response

**Fix**: Redeploy Worker
```bash
wrangler deploy
```

---

### Issue: CORS errors still appearing

**Check**: Frontend endpoints updated?

**Fix**: Make sure ALL 4 providers in `apiKeyManager.js` point to Worker URL

---

### Issue: API key test fails

**Check**: Is key valid?

**Test manually**:
```bash
# Test OpenAI key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 💰 Cost Calculator

### Infrastructure (Cloudflare)

```
Worker: $0.00 (100k req/day free)
Pages:  $0.00 (unlimited)
SSL:    $0.00 (free)
───────────────────────────
Total:  $0.00/month ✅
```

### AI APIs (Your Usage)

**Per Analysis**:
- Gemini only: $0.00 - $0.02
- All 4 providers: $0.01 - $0.50

**Monthly** (50 analyses):
- Gemini only: **$0 - $1**
- All 4 providers: **$25 - $50**

---

## 📱 Update Your App

After making changes:

```bash
# Update Worker
wrangler deploy

# Update Frontend
wrangler pages publish .
```

Changes go live instantly!

---

## 🎓 Learn More

- **Full Guide**: `docs/cloudflare-deployment-guide.md`
- **Deployment Options**: `DEPLOYMENT_OPTIONS_SUMMARY.md`
- **CORS Explanation**: `docs/cors-api-limitations.md`

---

## 🆘 Need Help?

- Cloudflare Docs: https://developers.cloudflare.com/workers/
- Cloudflare Discord: https://discord.gg/cloudflaredev
- Wrangler Issues: https://github.com/cloudflare/workers-sdk/issues

---

## ✨ Summary

**Deploy tapestrAI to Cloudflare for free:**

1. ✅ Install Wrangler: `npm install -g wrangler`
2. ✅ Deploy Worker: `wrangler deploy`
3. ✅ Update endpoints in `apiKeyManager.js`
4. ✅ Deploy frontend: `wrangler pages publish .`
5. ✅ Test all 4 APIs!

**Cost**: $0/month for hosting

**Time**: 30-60 minutes

**Result**: Professional, scalable, fully-functional tapestrAI!

---

**Ready to deploy? Start with the full guide:**
👉 `docs/cloudflare-deployment-guide.md`

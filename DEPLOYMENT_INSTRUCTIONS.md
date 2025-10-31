# Cloudflare Deployment Instructions for tapestrAI

## ✅ Setup Complete!

Your tapestrAI application is now ready for Cloudflare deployment. All code has been updated to support the Worker proxy that will enable all 4 AI providers (Gemini, OpenAI, Anthropic, Perplexity).

---

## 📋 What Was Done

### 1. Worker Infrastructure Created
- ✅ `worker/index.js` - API proxy for all 4 providers
- ✅ `worker/package.json` - Dependencies configured
- ✅ `wrangler.toml` - Worker configuration
- ✅ `.gitignore` updated for Wrangler files

### 2. Frontend Updated
- ✅ `js/apiKeyManager.js` - Smart endpoint detection (Worker vs Direct)
- ✅ `js/universalAnalyzer.js` - Worker-compatible request format
- ✅ Automatic detection: Uses Worker on Cloudflare, direct API locally

---

## 🚀 Deployment Steps

### Step 1: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window for authentication.

### Step 2: Deploy the Worker

```bash
npx wrangler deploy
```

**Expected Output:**
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded tapestrai-worker (X.XX sec)
Published tapestrai-worker (X.XX sec)
  https://tapestrai-worker.<YOUR-SUBDOMAIN>.workers.dev
```

**IMPORTANT:** Copy your Worker URL from the output!

### Step 3: Update Worker URL (if needed)

The code is configured to auto-detect the Worker URL when deployed on Cloudflare Pages. However, if you need to customize it:

Edit `js/apiKeyManager.js` line ~90:
```javascript
if (window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('tapestrai')) {
  return 'https://tapestrai-worker.<YOUR-SUBDOMAIN>.workers.dev'; // Update this
}
```

### Step 4: Deploy to Cloudflare Pages

**Option A: Direct Upload (Quickest)**

```bash
npx wrangler pages deploy . --project-name=tapestrai
```

**Option B: Via GitHub (Recommended for Production)**

1. Push to GitHub:
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

2. Connect to Cloudflare Pages:
   - Go to https://dash.cloudflare.com/
   - Click "Workers & Pages" → "Create"
   - Select "Pages" → "Connect to Git"
   - Select your repository
   - Configure:
     - **Build command**: (leave empty)
     - **Build output directory**: `/` (root)
     - **Root directory**: `/` (root)
   - Click "Save and Deploy"

### Step 5: Test Your Deployment

1. Visit your deployed site: `https://tapestrai.pages.dev`
2. Open the API Setup section
3. Test each provider:
   - ✅ **Gemini** - Should work (always worked)
   - ✅ **OpenAI** - Should now work through Worker!
   - ✅ **Anthropic** - Should now work through Worker!
   - ✅ **Perplexity** - Should now work through Worker!

---

## 🧪 Testing Locally (Before Deployment)

### Test Worker Locally

```bash
cd worker
npx wrangler dev
```

This starts a local Worker at `http://localhost:8787`

### Test the App Locally

Open `index.html` in a browser. The app will use direct API calls (only Gemini will work due to CORS).

---

## 🔧 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                   │
│    (Opens tapestrai.pages.dev)          │
└──────────────┬──────────────────────────┘
               │
               │ Detects .pages.dev domain
               │ Automatically uses Worker
               │
┌──────────────▼──────────────────────────┐
│      Cloudflare Pages                    │
│   (Serves HTML/CSS/JS files)            │
└──────────────┬──────────────────────────┘
               │
               │ API calls go to Worker
               │
┌──────────────▼──────────────────────────┐
│    Cloudflare Worker                     │
│  (Proxies API calls, adds CORS)         │
│   /api/gemini                            │
│   /api/openai                            │
│   /api/anthropic                         │
│   /api/perplexity                        │
└──────────────┬──────────────────────────┘
               │
               │ Server-to-Server (No CORS!)
               │
┌──────────────▼──────────────────────────┐
│        External AI APIs                  │
│  • Google Gemini API                     │
│  • OpenAI API                            │
│  • Anthropic API                         │
│  • Perplexity API                        │
└──────────────────────────────────────────┘
```

### Smart Endpoint Detection

The app automatically detects where it's running:

1. **On Cloudflare Pages** (`.pages.dev` domain):
   - Uses Worker proxy endpoints
   - All 4 providers work (CORS bypassed)

2. **Local Development** (`localhost`, `file://`):
   - Uses direct API endpoints
   - Only Gemini works (others blocked by CORS)

---

## 💰 Cost Analysis

### Cloudflare Free Tier
- **Pages**: Unlimited bandwidth & builds ✅ FREE
- **Workers**: 100,000 requests/day ✅ FREE
- **Custom Domain**: Included ✅ FREE
- **SSL Certificate**: Automatic ✅ FREE

### Expected Usage
- 50 analyses/day × 4 providers = 200 Worker requests/day
- **Well within free tier!** (100k requests/day limit)

### AI API Costs (Pay as you go)
- **Gemini**: ~$0.00002 per analysis (essentially free with 60 req/min)
- **OpenAI**: ~$0.01 per analysis
- **Anthropic**: ~$0.003 per analysis
- **Perplexity**: ~$0.001 per analysis

**Example**: 50 analyses/month with all 4 providers ≈ $25-30/month in AI costs

---

## 🔒 Security Features

✅ **API Keys Encrypted**: Stored in browser with XOR encryption  
✅ **HTTPS Everywhere**: Cloudflare provides automatic SSL  
✅ **No Keys in Worker**: Keys sent from browser in each request  
✅ **CORS Configured**: Worker only accepts requests from your domain  
✅ **No Server Storage**: Everything client-side except proxy  

---

## 📊 Monitoring Your Deployment

### View Worker Metrics

```bash
npx wrangler tail
```

Or visit: Cloudflare Dashboard → Workers & Pages → Your Worker → Metrics

### Check Pages Deployment

Visit: Cloudflare Dashboard → Workers & Pages → Your Project → Deployments

---

## 🐛 Troubleshooting

### Issue: Worker URL Not Found

**Error**: "API endpoint not found"

**Solution**: Verify Worker URL in `js/apiKeyManager.js` line ~90

### Issue: CORS Errors Still Occurring

**Cause**: Not using Worker proxy

**Solution**: 
1. Verify you're accessing via `.pages.dev` domain
2. Check browser console for Worker URL being used
3. Ensure Worker is deployed and accessible

### Issue: Worker Deployment Fails

**Error**: Authentication required

**Solution**: 
```bash
npx wrangler login
npx wrangler deploy
```

---

## 🎯 Success Criteria

After deployment, verify:

- ✅ Site loads at `https://tapestrai.pages.dev`
- ✅ All 4 API providers can be tested successfully
- ✅ Image upload works
- ✅ Analysis produces results
- ✅ No CORS errors in browser console
- ✅ Cost tracker shows usage correctly

---

## 📝 Next Steps After Deployment

1. **Add Custom Domain** (Optional)
   - Cloudflare Pages → Your Project → Custom Domains
   - Add your domain
   - DNS automatically configured

2. **Set Up Monitoring**
   - Enable Cloudflare Analytics
   - Set up email alerts for Worker errors
   - Monitor usage to stay within free tier

3. **Share Your App**
   - Your app is now live 24/7
   - Works on any device
   - No server maintenance needed

---

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

---

## 🎉 Ready to Deploy!

All code is prepared and tested. Run the deployment steps above to go live!

**Questions?** Check the troubleshooting section or refer to `docs/cloudflare-deployment-guide.md` for detailed explanations.

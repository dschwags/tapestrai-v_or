# 🔧 Fix DeepSeek API Key Test (5 Minutes)

## The Problem
✅ Your API key is **VALID**  
✅ The code is **CORRECT**  
❌ The Worker **NOT DEPLOYED**

## The Solution (Copy/Paste)

### Step 1: Open Cloudflare Dashboard
👉 https://dash.cloudflare.com

### Step 2: Navigate to Worker
1. Click **"Workers & Pages"**
2. Click **"Workers"** tab (not Pages)
3. Find **`tapestrai-worker`**
4. Click **"Quick Edit"** button

### Step 3: Get New Code
Open this link in a new tab:
👉 https://raw.githubusercontent.com/dschwags/tapestrai-v3/4API/worker/index.js

**Select ALL** (Ctrl+A or Cmd+A)  
**Copy** (Ctrl+C or Cmd+C)

### Step 4: Replace Old Code
Back in the Cloudflare "Quick Edit" window:

1. **Delete everything** (Ctrl+A, Delete)
2. **Paste new code** (Ctrl+V)
3. **Check line 4** should say:
   ```
   * Supports: Gemini, OpenAI, Anthropic, Perplexity, DeepSeek
   ```
4. Click **"Save and Deploy"** (blue button)

### Step 5: Wait 30 Seconds
⏳ Let Cloudflare deploy the changes globally

### Step 6: Test Your API Key
1. Go to: https://tapestrai.pages.dev
2. **Hard refresh:** `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Scroll to **DeepSeek** card
4. Paste your API key
5. Click **"Test & Save"**

### Expected Result:
✅ **"DeepSeek API key is valid!"**  
✅ Counter shows **"5/5"** instead of **"4/5"**

---

## What Changed?

### Before (Old Worker):
```javascript
// Only 4 API handlers
if (url.pathname.startsWith('/api/gemini')) { ... }
else if (url.pathname.startsWith('/api/openai')) { ... }
else if (url.pathname.startsWith('/api/anthropic')) { ... }
else if (url.pathname.startsWith('/api/perplexity')) { ... }
else { return 404; } // ← DeepSeek requests hit this!
```

### After (New Worker):
```javascript
// 5 API handlers
if (url.pathname.startsWith('/api/gemini')) { ... }
else if (url.pathname.startsWith('/api/openai')) { ... }
else if (url.pathname.startsWith('/api/anthropic')) { ... }
else if (url.pathname.startsWith('/api/perplexity')) { ... }
else if (url.pathname.startsWith('/api/deepseek')) { ... } // ← NOW EXISTS!
else { return 404; }
```

---

## Why Your Key Keeps Failing

### Current Flow:
1. You enter valid DeepSeek key → ✅
2. Site sends test to: `https://tapestrai-worker.david-ec6.workers.dev/api/deepseek` → ✅
3. Worker returns: **404 Not Found** → ❌ (endpoint doesn't exist yet)
4. Site thinks key is invalid → ❌

### After Deploying Worker:
1. You enter valid DeepSeek key → ✅
2. Site sends test to: `https://tapestrai-worker.david-ec6.workers.dev/api/deepseek` → ✅
3. Worker forwards to: `https://api.deepseek.com/chat/completions` → ✅
4. DeepSeek responds: **200 OK** → ✅
5. Site confirms key is valid → ✅

---

## Troubleshooting

### Still getting error after deploying?

**1. Clear browser cache:**
- Chrome: `Ctrl + Shift + Delete` → Clear cache
- Or use Incognito/Private window

**2. Check Worker deployed correctly:**
Open browser console (F12) and run:
```javascript
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
})
.then(r => console.log('Status:', r.status)) // Should be 200
.catch(e => console.error(e));
```

**3. Verify your API key is active:**
- Go to: https://platform.deepseek.com/api_keys
- Make sure key is not expired
- Try creating a new key

**4. Test key with curl:**
```bash
curl https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"max_tokens":10}'
```

Should return JSON with generated text.

---

## Summary

| Issue | Status |
|-------|--------|
| DeepSeek code added | ✅ Done |
| Counter bug fixed | ✅ Done |
| Pushed to GitHub | ✅ Done |
| **Worker deployed** | ⏭️ **You do this** |
| API key working | ⏭️ After Worker deploy |

**Total time to fix:** ~5 minutes

---

## Quick Links

**Cloudflare Dashboard:** https://dash.cloudflare.com  
**Worker Code (copy this):** https://raw.githubusercontent.com/dschwags/tapestrai-v3/4API/worker/index.js  
**Your Site:** https://tapestrai.pages.dev  
**DeepSeek API Keys:** https://platform.deepseek.com/api_keys  
**Full Diagnosis:** See `DEEPSEEK_API_KEY_FAILURE_DIAGNOSIS.md` in repo

---

**🎯 Bottom Line:** The Worker is the missing piece. Once deployed, your valid API key will work perfectly!

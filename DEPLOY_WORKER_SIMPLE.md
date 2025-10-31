# 🚀 Deploy Worker - Simple Copy/Paste Method

## The Problem
The GitHub raw URL isn't working. No worries! I've created the code file right here in your workspace.

## ✅ Simple Solution (3 Steps)

### Step 1: Get The Code

**Option A - From This Workspace:**
1. In Clacky file tree (left sidebar), find: `WORKER_CODE_TO_DEPLOY.js`
2. Open it
3. Select ALL (Ctrl+A / Cmd+A)
4. Copy (Ctrl+C / Cmd+C)

**Option B - Alternative GitHub URL:**
Try this URL format instead:
```
https://github.com/dschwags/tapestrai-v3/blob/4API/worker/index.js
```
Then click "Raw" button on GitHub to get the raw code.

**Option C - Direct from main branch:**
```
https://raw.githubusercontent.com/dschwags/tapestrai-v3/main/worker/index.js
```
(Note: This may have older code without DeepSeek. Use Option A instead!)

---

### Step 2: Edit Worker in Cloudflare

From your Cloudflare dashboard screenshot:

1. You're already on `tapestrai-worker` page ✅
2. Look for one of these options:
   - **"Edit code"** button (top right area)
   - Or click **"Settings"** tab → scroll to find edit option
   - Or click **"Deployments"** tab → click on current version → "Edit"

3. Once code editor opens:
   - Select ALL existing code (Ctrl+A)
   - Delete it
   - Paste the new code from Step 1
   - **Verify line 4 says:** `Supports: Gemini, OpenAI, Anthropic, Perplexity, DeepSeek`

4. Click **"Save and Deploy"**

---

### Step 3: Test It Works

Wait 30 seconds, then run this in browser console (F12):

```javascript
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
})
.then(r => console.log('Status:', r.status)) // Should be 200
.catch(e => console.error(e));
```

If you see `Status: 200` → ✅ **Success!**

Now test your DeepSeek API key at https://tapestrai.pages.dev

---

## Alternative: Deploy via Wrangler CLI

If you can't find the code editor in Cloudflare dashboard:

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Clone and deploy
git clone https://github.com/dschwags/tapestrai-v3.git
cd tapestrai-v3
git checkout 4API
cd worker
wrangler deploy
```

This will deploy the Worker directly from the repo.

---

## What Changed in the Worker?

### Added This Handler (Line 34-35):
```javascript
} else if (url.pathname.startsWith('/api/deepseek')) {
  return await handleDeepSeek(request, corsHeaders);
}
```

### Added This Function (Line 136-155):
```javascript
// DeepSeek API Handler
async function handleDeepSeek(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.deepseek.com/chat/completions', {
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

---

## Quick Reference

**Code file in workspace:** `WORKER_CODE_TO_DEPLOY.js`  
**Cloudflare Dashboard:** https://dash.cloudflare.com  
**Worker Name:** `tapestrai-worker`  
**Your Site:** https://tapestrai.pages.dev  
**Test Endpoint:** https://tapestrai-worker.david-ec6.workers.dev/api/deepseek

---

## Still Stuck?

If you can't find the code editor button:

**Screenshot what you see when you:**
1. Click the "Settings" tab on your Worker page
2. Or click the "Deployments" tab

And I'll tell you exactly where to click!

**Or just use Wrangler CLI method** - it's faster and guaranteed to work.

# 🚀 DUMMY-PROOF Wrangler CLI Deployment

## What You'll Do
Copy and paste 5 commands. That's it!

---

## Prerequisites Check

### Do you have Node.js installed?
Open terminal and type:
```bash
node --version
```

**See a version number?** (like v18.x.x or v20.x.x) → ✅ Continue below  
**See "command not found"?** → ⚠️ [Install Node.js first](https://nodejs.org/) then come back

---

## 🎯 THE 5 COMMANDS (Copy/Paste Each One)

### Command 1: Install Wrangler
```bash
npm install -g wrangler
```

**What this does:** Installs the Cloudflare deployment tool globally  
**How long:** 10-30 seconds  
**Expected:** Bunch of download messages, ends with success message

---

### Command 2: Login to Cloudflare
```bash
wrangler login
```

**What happens:**
1. A browser window will pop open
2. You'll see Cloudflare login page
3. Click **"Allow"** to authorize Wrangler
4. Browser shows "Success! You may now close this page"
5. Go back to terminal

**Expected in terminal:** `Successfully logged in.`

**Troubleshooting:**
- Browser didn't open? Copy the URL from terminal and paste in browser manually
- Already logged in elsewhere? That's fine, it will detect it

---

### Command 3: Go to Worker Directory
```bash
cd /home/runner/app/worker
```

**What this does:** Changes to the folder with Worker code  
**Expected:** Just changes directory, no output

**If you're NOT in Clacky terminal:**
```bash
# Find where you cloned the repo, then:
cd path/to/tapestrai-v3/worker

# Example:
cd ~/Projects/tapestrai-v3/worker
```

---

### Command 4: Install Dependencies (Just in Case)
```bash
npm install
```

**What this does:** Makes sure wrangler is available in this project  
**How long:** 5-10 seconds  
**Expected:** `up to date` or `added X packages`

---

### Command 5: DEPLOY! 🚀
```bash
npm run deploy
```

OR (same thing):
```bash
wrangler deploy
```

**What happens:**
1. Wrangler bundles your Worker code
2. Uploads it to Cloudflare
3. Deploys it globally

**Expected output:**
```
Total Upload: 5.xx KiB / gzip: 1.xx KiB
Uploaded tapestrai-worker (x.xx sec)
Published tapestrai-worker (x.xx sec)
  https://tapestrai-worker.david-ec6.workers.dev
Current Deployment ID: xxxxx
```

**✅ SUCCESS if you see that URL!**

---

## Verify It Worked

### Test 1: Check Endpoint Exists
Open browser console (F12) and run:
```javascript
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
})
.then(r => console.log('✅ DeepSeek endpoint found! Status:', r.status))
.catch(e => console.error('❌ Error:', e));
```

**Expected:** `✅ DeepSeek endpoint found! Status: 200`

### Test 2: Test Your API Key
1. Go to https://tapestrai.pages.dev
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Scroll to DeepSeek card
4. Enter your API key
5. Click **"Test & Save"**

**Expected:** ✅ **"DeepSeek API key is valid!"**

---

## Troubleshooting

### "npm: command not found"
You need to install Node.js first:
- **Windows/Mac:** https://nodejs.org/ (download and install)
- **Linux:** `sudo apt install nodejs npm` or `sudo yum install nodejs npm`

### "wrangler: command not found" (after installing)
Try:
```bash
npx wrangler login
npx wrangler deploy
```

Or restart your terminal and try again.

### "Failed to publish" or "Authentication error"
Run login again:
```bash
wrangler logout
wrangler login
```

### "Worker with this name already exists"
That's fine! It will update the existing Worker. Just proceed.

### Wrangler asks "Which account do you want to use?"
If you have multiple Cloudflare accounts, select the one where `tapestrai-worker` exists.

Look for account with domain like `david-ec6.workers.dev`.

### "No account_id found"
Wrangler needs your account ID. Get it from:
1. Go to https://dash.cloudflare.com
2. Click on "Workers & Pages"
3. Look at URL: `dash.cloudflare.com/[ACCOUNT_ID]/workers`
4. Copy that ID

Then run:
```bash
wrangler deploy --account-id YOUR_ACCOUNT_ID
```

---

## Alternative: One-Liner (For Advanced Users)

If you're already logged in and just want to deploy:

```bash
cd /home/runner/app/worker && npm install && wrangler deploy
```

---

## Visual Progress Guide

```
Step 1: npm install -g wrangler
│
├─ Downloading packages... ⏳
├─ Installing... ⏳
└─ ✅ Done! "wrangler@3.x.x added"

Step 2: wrangler login
│
├─ Opening browser... 🌐
├─ Waiting for authorization... ⏳
└─ ✅ Done! "Successfully logged in"

Step 3: cd /home/runner/app/worker
│
└─ ✅ Done! (no output)

Step 4: npm install
│
├─ Checking dependencies... ⏳
└─ ✅ Done! "up to date"

Step 5: npm run deploy
│
├─ Bundling Worker code... 📦
├─ Uploading to Cloudflare... ☁️
├─ Publishing globally... 🌍
└─ ✅ Done! "Published tapestrai-worker"
    URL: https://tapestrai-worker.david-ec6.workers.dev
```

---

## Copy-Paste All 5 Commands at Once

**For maximum laziness, copy this entire block:**

```bash
# Install wrangler
npm install -g wrangler

# Login (browser will open - click Allow)
wrangler login

# Go to worker folder (adjust path if not in Clacky)
cd /home/runner/app/worker

# Install dependencies
npm install

# Deploy!
npm run deploy
```

**Paste into terminal, press Enter, follow prompts.**

---

## What Gets Deployed?

The `/home/runner/app/worker/index.js` file, which includes:
- ✅ Gemini API handler
- ✅ OpenAI API handler
- ✅ Anthropic API handler
- ✅ Perplexity API handler
- ✅ **DeepSeek API handler** ← THE NEW ONE!

---

## After Deployment

Your DeepSeek API key test will now work because:
1. Browser sends test to: `tapestrai-worker.david-ec6.workers.dev/api/deepseek`
2. Worker forwards to: `api.deepseek.com/chat/completions`
3. DeepSeek validates your key
4. Worker returns response
5. Browser shows: ✅ "API key is valid!"

---

## Timeline

| Step | Time |
|------|------|
| Install wrangler | 30 sec |
| Login | 15 sec |
| cd to folder | 1 sec |
| npm install | 10 sec |
| Deploy | 10 sec |
| **TOTAL** | **~1 minute** |

---

## Summary

**5 commands. 1 minute. Done.**

No finding buttons in dashboards.  
No copy-pasting code.  
Just pure CLI magic. ✨

Ready? Start with Command 1! 👆

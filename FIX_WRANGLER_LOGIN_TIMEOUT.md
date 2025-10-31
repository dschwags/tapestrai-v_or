# 🔧 Fix Wrangler Login Timeout

## The Problem
`wrangler login` timed out waiting for you to authorize in the browser.

---

## ✅ Solution 1: Try Login Again (Faster This Time)

```bash
cd /home/runner/app/worker
npx wrangler login
```

**Be ready to:**
1. Browser opens immediately
2. Click "Allow" button QUICKLY (within 30 seconds)
3. Return to terminal

---

## ✅ Solution 2: Manual Login (No Browser Pop-up)

If the browser isn't opening or timing out:

### Step 1: Get Your API Token Manually

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Use template"** next to **"Edit Cloudflare Workers"**
4. Scroll down, click **"Continue to summary"**
5. Click **"Create Token"**
6. **COPY the token** (starts with something like `abc123...`)

### Step 2: Set the Token in Clacky

```bash
export CLOUDFLARE_API_TOKEN="your-token-here"
```

**Replace `your-token-here` with the actual token you copied.**

### Step 3: Deploy (Without Login)

```bash
cd /home/runner/app/worker
npx wrangler deploy
```

**This will use the token instead of requiring browser login!**

---

## ✅ Solution 3: Use Wrangler Config File

Create a config with your credentials:

### Step 1: Get Account ID

1. Go to: https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Look at URL: `dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers`
4. Copy that account ID

### Step 2: Get API Token (same as Solution 2, Step 1)

### Step 3: Set Environment Variables

```bash
cd /home/runner/app/worker
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"
```

### Step 4: Deploy

```bash
npx wrangler deploy
```

---

## ✅ Solution 4: Deploy with Inline Credentials

One command with everything:

```bash
cd /home/runner/app/worker
CLOUDFLARE_API_TOKEN="your-token" npx wrangler deploy
```

---

## Recommended: Solution 2 (Manual Token)

**This is the most reliable for Clacky workspace.**

### Full Steps:

1. **Get token:** https://dash.cloudflare.com/profile/api-tokens → Create Token → Edit Cloudflare Workers
2. **Copy token**
3. **In Clacky terminal:**

```bash
cd /home/runner/app/worker
export CLOUDFLARE_API_TOKEN="paste-your-token-here"
npx wrangler deploy
```

**Done!** No browser timeout issues.

---

## Why Login Times Out

The `wrangler login` command:
1. Starts a local server
2. Opens browser
3. Waits for you to authorize
4. **Times out after ~2 minutes** if no response

**In cloud environments like Clacky, browser opening can be tricky.**

**Solution:** Use API tokens directly (more reliable).

---

## Example: Complete Deployment

```bash
# Navigate to worker folder
cd /home/runner/app/worker

# Set your API token (get from Cloudflare dashboard)
export CLOUDFLARE_API_TOKEN="abc123_your_actual_token_here_xyz789"

# Deploy!
npx wrangler deploy
```

**Expected output:**
```
✨ Bundling Worker...
📦 Uploading...
✅ Published tapestrai-worker
   https://tapestrai-worker.david-ec6.workers.dev
```

---

## Get Your API Token (Step-by-Step with Screenshots)

### 1. Go to Cloudflare Dashboard
https://dash.cloudflare.com/profile/api-tokens

### 2. Click "Create Token"
Blue button on the right

### 3. Find "Edit Cloudflare Workers" Template
Scroll down, click **"Use template"**

### 4. Review Permissions
Should show:
- Account: [Your Account]
- Zone: All zones
- Permissions: Workers Scripts:Edit

Click **"Continue to summary"**

### 5. Create Token
Click **"Create Token"** button

### 6. Copy Token
**IMPORTANT:** Copy it NOW! You won't be able to see it again.

Should look like: `abcd1234efgh5678ijkl9012mnop3456qrst7890`

### 7. Use Token in Clacky

```bash
export CLOUDFLARE_API_TOKEN="paste-that-token-here"
```

---

## Test Token Works

```bash
cd /home/runner/app/worker
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler whoami
```

Should show your account info. If it works, proceed to deploy!

---

## Troubleshooting

### "Invalid API token"
- Check you copied the entire token
- Make sure no extra spaces
- Token might be expired (create new one)

### "Account ID required"
Add account ID:
```bash
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler deploy
```

### "Worker name already exists"
That's fine! It will update the existing worker.

---

## Quick Copy/Paste Template

```bash
# 1. Go get your token from: 
# https://dash.cloudflare.com/profile/api-tokens

# 2. Replace YOUR_TOKEN_HERE and paste this:
cd /home/runner/app/worker
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN_HERE"
npx wrangler deploy
```

---

## Summary

**Problem:** Browser login timeout  
**Solution:** Use API token instead  
**Where to get token:** https://dash.cloudflare.com/profile/api-tokens  
**How to use:** `export CLOUDFLARE_API_TOKEN="token"`  
**Then:** `npx wrangler deploy`

**No browser needed! No timeouts! ✅**

---

## Next Step

1. ⏭️ Go get your API token (link above)
2. ⏭️ Run the export command with your token
3. ⏭️ Run `npx wrangler deploy`
4. ✅ Done!

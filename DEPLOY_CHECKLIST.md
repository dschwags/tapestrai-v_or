# ✅ DeepSeek Worker Deployment Checklist

## Copy/Paste These 5 Commands

Open your terminal and paste each command one by one:

### ✅ 1. Install Wrangler
```bash
npm install -g wrangler
```
Wait for "added" message.

---

### ✅ 2. Login to Cloudflare  
```bash
wrangler login
```
Browser opens → Click "Allow" → Done!

---

### ✅ 3. Go to Worker Folder
```bash
cd /home/runner/app/worker
```
(If not in Clacky, adjust path to where you have the code)

---

### ✅ 4. Install Dependencies
```bash
npm install
```
Wait for "up to date" message.

---

### ✅ 5. DEPLOY!
```bash
npm run deploy
```

**Expected output:**
```
Published tapestrai-worker
https://tapestrai-worker.david-ec6.workers.dev
```

✅ **DONE!** If you see that URL, it worked!

---

## Test It Worked

### Quick Test (Browser Console)
Press F12, paste this:
```javascript
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
}).then(r => console.log('Status:', r.status));
```

**Should show:** `Status: 200` ✅

---

### Full Test (Your Site)
1. Go to: https://tapestrai.pages.dev
2. Refresh: `Ctrl + Shift + R`
3. Enter DeepSeek API key
4. Click "Test & Save"
5. Should see: ✅ "API key is valid!"

---

## Run Automated Test
```bash
cd /home/runner/app
./test-worker-deployed.sh
```

All endpoints should show ✅ OK

---

## Troubleshooting

**"npm: command not found"**
→ Install Node.js from https://nodejs.org/

**"wrangler: command not found"** (after installing)
→ Use `npx wrangler` instead: `npx wrangler login`, `npx wrangler deploy`

**"Authentication error"**
→ Run: `wrangler logout` then `wrangler login` again

**Still stuck?**
→ Read full guide: `WRANGLER_DEPLOY_DUMMYPROOF.md`

---

## That's It!

5 commands.  
1 minute.  
DeepSeek working. ✅

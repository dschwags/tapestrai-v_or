# 🚀 Deploy Right Now in Clacky (Super Simple)

## You're Already In The Right Place!

You're in Clacky workspace. Wrangler is already installed. Just 2 commands!

---

## 📋 THE 2 COMMANDS

### Command 1: Login to Cloudflare

**Copy and paste this into the Clacky terminal (at bottom of screen):**

```bash
cd /home/runner/app/worker && npx wrangler login
```

**What happens:**
- Browser window/tab will open
- Cloudflare login page appears
- Click **"Allow"** button
- Browser says "Success! You may now close this page"
- Come back to Clacky terminal

---

### Command 2: Deploy!

**Copy and paste this:**

```bash
npx wrangler deploy
```

**Expected output:**
```
✨ Bundling Worker...
📦 Uploading...
✅ Published tapestrai-worker
   https://tapestrai-worker.david-ec6.workers.dev
```

**✅ DONE!** That's it!

---

## OR: One Single Command (Both at Once)

If you want to do it all in one go:

```bash
cd /home/runner/app/worker && npx wrangler login && npx wrangler deploy
```

**This will:**
1. Open browser for login
2. After you click "Allow" and come back
3. Automatically deploy

---

## Troubleshooting

### "Cannot find browser"
If the browser doesn't open automatically:
1. Look for a URL in the terminal output
2. Copy that URL
3. Paste it in your browser
4. Click "Allow"

### "Already logged in"
Perfect! Skip to Command 2 (deploy).

### "Which account to use?"
Select the account that has `tapestrai-worker` (look for `david-ec6.workers.dev`).

---

## Test It Worked

### In Browser Console (F12):
```javascript
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
}).then(r => console.log('✅ Status:', r.status));
```

Should show: `Status: 200`

---

### Then Test Your DeepSeek Key:
1. Go to https://tapestrai.pages.dev
2. Hard refresh: `Ctrl + Shift + R`
3. Enter DeepSeek API key
4. Click "Test & Save"
5. Should see: ✅ "API key is valid!"

---

## Visual Guide

```
┌─────────────────────────────────────┐
│  Clacky Workspace                   │
│  ┌───────────────────────────────┐  │
│  │  Code Editor                  │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  TERMINAL ← PASTE COMMANDS    │  │ ⭐ HERE!
│  │  $ cd /home/runner/app/worker │  │
│  │  $ npx wrangler login         │  │
│  │  $ npx wrangler deploy        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Summary

**Where:** Clacky terminal (bottom of screen)  
**Commands:** 2 (login + deploy)  
**Time:** 1 minute  
**Result:** DeepSeek working! ✅

---

## Ready? Copy This:

```bash
cd /home/runner/app/worker && npx wrangler login && npx wrangler deploy
```

**Paste into Clacky terminal. Press Enter. Follow browser prompt. Done!** 🎉

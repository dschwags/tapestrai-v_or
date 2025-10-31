# 🔗 Connect GitHub to Cloudflare Pages - Complete Guide

## Overview

Cloudflare Pages can automatically deploy your site whenever you push to GitHub. This is the **easiest and recommended way** to deploy updates.

---

## 🎯 Two Deployment Methods

### Method A: Auto-Deploy (Recommended) ⭐
- Push to GitHub → Cloudflare automatically deploys
- No manual commands needed
- Takes 2-5 minutes
- **Setup once, use forever**

### Method B: Manual Deploy
- Use `wrangler` CLI each time
- Requires authentication
- More control but more effort

**Let's set up Method A!**

---

## 📋 Step-by-Step: Connect GitHub to Cloudflare

### Step 1: Check if Already Connected

1. **Go to Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com
   ```

2. **Navigate to Pages:**
   - Click **Workers & Pages** in sidebar
   - Click **Pages** tab
   - Look for a project named `tapestrai` or `tapestrai-v3`

3. **Check Connection Status:**
   - If you see a project → **It's already connected!** (skip to Step 4)
   - If no project → **Continue to Step 2**

---

### Step 2: Create New Pages Project (If Not Connected)

1. **Click "Create application"**
   - Or **"Connect to Git"** button

2. **Select "Connect to Git"**

3. **Choose GitHub:**
   - Click **"GitHub"** button
   - You may need to authorize Cloudflare to access GitHub

4. **Authorize Cloudflare (if prompted):**
   - Click **"Authorize Cloudflare Pages"**
   - Grant access to your repositories

5. **Select Repository:**
   - Find: `dschwags/tapestrai-v3`
   - Click **"Begin setup"**

---

### Step 3: Configure Build Settings

**Project name:** `tapestrai` (or any name you prefer)

**Production branch:** 
- Choose: `main` (if you'll merge there)
- OR: `4API` (deploy directly from feature branch)

**Build settings:**
- **Framework preset:** None
- **Build command:** Leave empty (static site)
- **Build output directory:** `/`

**Environment variables:** Leave empty (not needed for static site)

**Click "Save and Deploy"**

---

### Step 4: Configure Branch Deployment

If you want `4API` branch to auto-deploy:

1. **Go to Project Settings:**
   - Click your project name
   - Click **Settings** tab

2. **Navigate to Builds & deployments:**
   - Click **Builds & deployments** in sidebar

3. **Configure Branch Deployments:**
   - **Production branch:** `main` OR `4API`
   - **Preview branches:** Enable for other branches
   - **Deploy from:** `All branches` or `Custom branches: 4API`

4. **Click "Save"**

---

### Step 5: Deploy Your Current Code

**Option A: Merge to Main (Recommended)**

Merge your `4API` branch to `main` to trigger deployment:

```bash
# Method 1: Via GitHub Web UI (Easiest)
# 1. Go to: https://github.com/dschwags/tapestrai-v3
# 2. Click "Compare & pull request"
# 3. Create pull request
# 4. Click "Merge pull request"
# 5. Cloudflare auto-deploys!

# Method 2: Via Command Line
git checkout main
git merge 4API
git push origin main
```

**Option B: Deploy 4API Branch Directly**

If Cloudflare is configured to watch `4API`:
- It's already deployed! (from your push earlier)
- Check: https://dash.cloudflare.com → Pages → Deployments

**Option C: Trigger Manual Deployment**

In Cloudflare Dashboard:
1. Go to your Pages project
2. Click **"Create deployment"**
3. Select branch: `4API`
4. Click **"Save and Deploy"**

---

## 🚨 IMPORTANT: Worker Deployment (Separate Step!)

**Cloudflare Pages auto-deploys your frontend, but NOT the Worker!**

The Worker needs to be deployed separately because it's a different service.

### Deploy the Worker:

**Method 1: Via Wrangler CLI (Easiest)**
```bash
# On your local machine (where you can authenticate)
git clone https://github.com/dschwags/tapestrai-v3.git
cd tapestrai-v3
git checkout 4API

# Login to Cloudflare
wrangler login

# Deploy Worker
wrangler deploy
```

**Method 2: Via Cloudflare Dashboard**
1. Go to: **Workers & Pages** → **Workers**
2. Click on your existing worker (or **"Create application"**)
3. Click **"Quick Edit"**
4. Copy/paste content from: https://github.com/dschwags/tapestrai-v3/blob/4API/worker/index.js
5. Make sure DeepSeek handler is included (search for `deepseek`)
6. Click **"Save and Deploy"**

---

## ✅ Verification Checklist

After connecting and deploying:

### 1. Check Pages Deployment
- [ ] Go to: https://dash.cloudflare.com → Pages
- [ ] Click your project
- [ ] See "Deployment successful" status
- [ ] Copy the URL (e.g., `https://tapestrai.pages.dev`)

### 2. Check Worker Deployment
- [ ] Go to: https://dash.cloudflare.com → Workers
- [ ] Find `tapestrai-worker`
- [ ] See "Published" status
- [ ] Note the Worker URL

### 3. Test Live Site
- [ ] Visit: `https://tapestrai.pages.dev` (or your URL)
- [ ] See 5 provider cards (including DeepSeek)
- [ ] Header shows `0/5` not `0/4`
- [ ] DeepSeek card has "100x Cheaper!" badge

### 4. Test DeepSeek Integration
- [ ] Get free key: https://platform.deepseek.com/api_keys
- [ ] Add to DeepSeek card
- [ ] Click "Test & Save"
- [ ] Should show green ✓

---

## 🔄 Future Updates (After Setup)

Once connected, updating is super easy:

```bash
# Make changes to your code
# Then:
git add .
git commit -m "Update features"
git push origin main
# Cloudflare automatically deploys!
```

**That's it!** No manual deployment commands needed!

---

## 🎯 Quick Reference Commands

### Check Current Setup:
```bash
# See what branch you're on
git branch

# See remote repository
git remote -v

# See recent commits
git log --oneline -5
```

### Merge 4API to Main:
```bash
git checkout main
git pull origin main
git merge 4API
git push origin main
```

### Deploy Worker Manually:
```bash
wrangler login
wrangler deploy
```

---

## 📊 Deployment Flow Diagram

```
Your Code Changes
       ↓
   git commit
       ↓
git push origin main
       ↓
    GitHub
       ↓
[GitHub webhook triggers Cloudflare]
       ↓
Cloudflare Pages Build
       ↓
   2-5 minutes
       ↓
✅ Live at https://tapestrai.pages.dev
```

**Worker Deployment (Separate):**
```
worker/index.js changes
       ↓
wrangler deploy
       ↓
✅ Live at https://tapestrai-worker.workers.dev
```

---

## 🆘 Troubleshooting

### Issue: "No projects found"

**Cause:** GitHub not connected to Cloudflare

**Fix:**
1. Go to: https://dash.cloudflare.com/pages
2. Click **"Create application"**
3. Select **"Connect to Git"**
4. Authorize GitHub access
5. Select `tapestrai-v3` repository

---

### Issue: "Build failed"

**Cause:** Build settings misconfigured

**Fix:**
1. Go to: Project Settings → Builds & deployments
2. Set **Build command:** empty
3. Set **Build output directory:** `/`
4. Set **Root directory:** `/` (or leave empty)
5. Retry deployment

---

### Issue: Site deployed but DeepSeek not working

**Cause:** Worker not deployed

**Fix:**
```bash
wrangler login
wrangler deploy
```

Or update Worker via dashboard (see Method 2 above)

---

### Issue: Changes not appearing

**Cause:** Browser cache

**Fix:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or clear browser cache
3. Or try incognito/private mode

---

## 💡 Pro Tips

### Enable Build Notifications
1. Go to: Project Settings → Integrations
2. Add email notification
3. Get alerts when deployments succeed/fail

### Set Up Preview Deployments
1. Go to: Settings → Builds & deployments
2. Enable "Preview deployments"
3. Every branch gets its own preview URL!
   - Example: `https://4api.tapestrai.pages.dev`

### View Build Logs
1. Go to: Your project → Deployments
2. Click on a deployment
3. Click "View build log"
4. See detailed build output

### Rollback if Needed
1. Go to: Deployments tab
2. Find previous working deployment
3. Click "•••" menu
4. Click "Rollback to this deployment"

---

## 📚 Official Documentation

- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Git Integration:** https://developers.cloudflare.com/pages/get-started/git-integration/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/

---

## ✨ Summary

### To Deploy Now:

**Step 1: Connect GitHub to Cloudflare Pages**
- Go to: https://dash.cloudflare.com/pages
- Click "Connect to Git"
- Select your repository

**Step 2: Deploy Worker Separately**
```bash
wrangler login
wrangler deploy
```

**Step 3: Merge to Main (or configure 4API as production branch)**
```bash
git checkout main
git merge 4API
git push origin main
```

**Step 4: Wait 2-5 minutes**
- Cloudflare builds and deploys automatically

**Step 5: Visit your live site!**
- https://tapestrai.pages.dev (or your custom domain)

---

**That's it!** 🎉

After this one-time setup, every `git push` automatically deploys your site. The Worker needs to be redeployed separately when `worker/index.js` changes.

---

**Need help with any step? Let me know!**

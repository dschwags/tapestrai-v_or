# Quick Deploy to Cloudflare Pages

## Overview
This guide explains how to push updates to your tapestrAI site and trigger automatic Cloudflare Pages deployment.

---

## Prerequisites
- Changes committed to your local Git repository
- GitHub repository: `dschwags/tapestrai-v3`
- Cloudflare Pages connected to `main` branch

---

## Quick Deploy Process

### Step 1: Ensure You're on the Correct Branch
```bash
cd /home/runner/app
git status
```

**If you're on `4API` branch (development):**
- Your changes need to be merged to `main` for Cloudflare to deploy them

**If you're on `main` branch:**
- You can push directly

---

### Step 2: Update Timestamp (Recommended)
This helps identify which version is deployed and aids in cache debugging:

```bash
./update-timestamp.sh
```

This updates the build timestamp in `index.html` to current time.

---

### Step 3: Commit Your Changes
```bash
git add -A
git commit -m "Your descriptive commit message"
```

**Good commit message examples:**
- `"feat: Add numbered circle symbols for API status"`
- `"fix: Correct token tracker calculation"`
- `"docs: Update deployment guide"`

---

### Step 4: Push to Main Branch

#### Option A: If Already on Main
```bash
git push origin main
```

#### Option B: If on 4API Branch (Development)
```bash
# Push your changes to 4API first
git push origin 4API

# Switch to main and merge
git checkout main
git pull origin main
git merge 4API -m "Merge 4API: [brief description]"
git push origin main

# Switch back to 4API for continued development
git checkout 4API
```

---

### Step 5: Verify Cloudflare Deployment

1. **Check GitHub Push Success**
   - Look for "remote: Resolving deltas: 100%" in terminal output
   - Confirm commit appears on GitHub: https://github.com/dschwags/tapestrai-v3

2. **Monitor Cloudflare Pages**
   - Go to: https://dash.cloudflare.com/
   - Navigate to: **Workers & Pages** → **tapestrai-v3**
   - Check **Deployments** tab
   - Look for new build triggered from `main` branch
   - Status should show: **Building** → **Success**
   - Typical build time: 30-90 seconds

3. **Test Live Site**
   - Visit your production URL
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Check timestamp in page source (View Source → search for "Build:")
   - Verify your changes are visible

---

## Common Issues & Fixes

### Issue 1: Changes Not Visible After Deploy
**Cause:** Browser cache holding old version

**Fix:**
```
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache for the site
3. Try incognito/private window
4. Check timestamp in source code to verify correct version loaded
```

---

### Issue 2: Merge Conflict
**Cause:** Conflicting changes between branches

**Fix:**
```bash
# If merge fails with conflict
git merge --abort

# Pull latest main and rebase
git pull origin main --rebase

# Resolve any conflicts in editor
# Then commit and push
git add -A
git commit -m "Resolve merge conflicts"
git push origin 4API

# Try merge again
git checkout main
git merge 4API
```

---

### Issue 3: Cloudflare Not Building
**Cause:** Cloudflare might not be connected to the correct branch

**Fix:**
1. Go to Cloudflare Dashboard
2. Workers & Pages → tapestrai-v3 → Settings
3. Check **Builds & deployments**
4. Confirm **Production branch** is set to `main`
5. Save if changed, then push again

---

## Quick Reference: One-Command Deploy

If you're on `4API` and want to quickly deploy to production:

```bash
cd /home/runner/app && \
./update-timestamp.sh && \
git add -A && \
git commit -m "Your commit message here" && \
git push origin 4API && \
git checkout main && \
git pull origin main && \
git merge 4API -m "Deploy updates from 4API" && \
git push origin main && \
git checkout 4API
```

**Replace** `"Your commit message here"` with your actual message.

---

## Branch Strategy

### `4API` Branch (Development)
- Active development happens here
- Test changes before production
- Safe to experiment

### `main` Branch (Production)
- Connected to Cloudflare Pages
- Only merge tested, working code
- Auto-deploys on push

---

## Build Timestamp Location

The timestamp is in the HTML `<head>` section:
```html
<!-- Version: 3.2.0 - Unique Shapes & Better Status | Build: 2025-10-31 16:42 EDT>
```

**Check it in browser:**
1. Right-click page → View Page Source
2. Look at top of `<head>` section (around line 7)
3. Verify timestamp matches your latest update

---

## Cloudflare Build Configuration

Your site is configured as a **static site**:
- **Framework preset:** None
- **Build command:** (none required)
- **Build output directory:** `/`
- **Root directory:** `/`

All HTML, CSS, and JavaScript files are served directly from the repository.

---

## Rollback Process

If you need to undo a deployment:

```bash
# Find the commit hash you want to revert to
git log --oneline

# Revert to specific commit
git checkout main
git reset --hard <commit-hash>
git push origin main --force

# Or revert just the last commit
git revert HEAD
git push origin main
```

⚠️ **Warning:** `--force` push can cause issues if others are working on the same branch.

---

## Performance Tips

1. **Always update timestamp** - Helps with cache debugging
2. **Use descriptive commit messages** - Easy to identify changes later
3. **Test in 4API first** - Catch bugs before production
4. **Monitor Cloudflare build logs** - Catch deployment issues early
5. **Hard refresh after deploy** - Ensure you see latest version

---

## Support Links

- **GitHub Repo:** https://github.com/dschwags/tapestrai-v3
- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Production Site:** [Your Cloudflare Pages URL]

---

## Quick Checklist

Before pushing to production (`main` branch):

- [ ] Changes tested locally
- [ ] Timestamp updated with `./update-timestamp.sh`
- [ ] Changes committed with clear message
- [ ] No console errors in browser
- [ ] All features working as expected
- [ ] Pushed to 4API first (if applicable)
- [ ] Ready to merge to main

---

## Notes

- Cloudflare Pages deploys **automatically** when you push to `main`
- Build takes ~30-90 seconds
- No manual deploy button needed
- Watch the **Deployments** tab in Cloudflare for build status
- Each deployment gets a unique preview URL you can test

---

**Last Updated:** 2025-10-31  
**Version:** 3.2.0

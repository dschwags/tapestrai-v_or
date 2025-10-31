# 🍎 Deploy From Your Mac (Fixed Instructions)

## The Problem
You tried to run commands meant for Clacky workspace on your local Mac. The paths are different!

---

## ✅ Correct Steps For Your Mac

### Step 1: Install Wrangler (With sudo for permissions)

```bash
sudo npm install -g wrangler
```

**Enter your Mac password when prompted.**

If that still gives permission errors, use this instead:

```bash
npm install -g wrangler --prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

---

### Step 2: Login to Cloudflare

```bash
wrangler login
```

**Or if wrangler not found:**

```bash
npx wrangler login
```

Browser will open → Click "Allow"

---

### Step 3: Clone the Repo (If You Haven't Already)

```bash
cd ~/Desktop
git clone https://github.com/dschwags/tapestrai-v3.git
cd tapestrai-v3
git checkout 4API
```

**Or if you already have it:**

```bash
cd ~/path/to/tapestrai-v3
git checkout 4API
git pull origin 4API
```

---

### Step 4: Go to Worker Folder

```bash
cd worker
```

**Check you're in the right place:**

```bash
ls -la
```

Should see: `index.js`, `package.json`, `wrangler.toml`

---

### Step 5: Install Dependencies

```bash
npm install
```

---

### Step 6: Deploy!

```bash
npm run deploy
```

**Or:**

```bash
npx wrangler deploy
```

---

## Full Copy/Paste Command Sequence

```bash
# Clone repo (skip if you already have it)
cd ~/Desktop
git clone https://github.com/dschwags/tapestrai-v3.git
cd tapestrai-v3
git checkout 4API

# Install wrangler with npx (no sudo needed)
npx wrangler login

# Deploy
cd worker
npm install
npx wrangler deploy
```

---

## Alternative: Deploy From Clacky Workspace

Since you're already in Clacky, you can deploy **directly from the Clacky terminal**:

### In Clacky Terminal (right side of screen):

```bash
# Install wrangler locally (no -g flag)
cd /home/runner/app/worker
npm install

# Login
npx wrangler login

# Deploy
npx wrangler deploy
```

**This uses `npx` which runs wrangler without installing globally (no permission issues).**

---

## Why You Got Errors

| Error | Reason | Fix |
|-------|--------|-----|
| `EACCES: permission denied` | Need sudo on Mac for global install | Use `sudo npm install -g` or `npx` |
| `wrangler: command not found` | Wasn't installed globally | Use `npx wrangler` instead |
| `/home/runner/app/worker: No such file or directory` | That's the Clacky path, not Mac | Use `~/path/to/tapestrai-v3/worker` |
| `Could not read package.json` | Not in the right directory | `cd` to the worker folder first |

---

## Recommended: Use Clacky Terminal

**Easiest option:**

1. Stay in Clacky workspace
2. Open the terminal panel (bottom of screen)
3. Run these commands:

```bash
cd /home/runner/app/worker
npm install
npx wrangler login
npx wrangler deploy
```

No path issues, no permission issues! ✅

---

## After Deployment

Test it worked:

```javascript
// Browser console (F12)
fetch('https://tapestrai-worker.david-ec6.workers.dev/api/deepseek', {
  method: 'OPTIONS'
}).then(r => console.log('Status:', r.status));
```

Should show: `Status: 200` ✅

Then test your DeepSeek API key at https://tapestrai.pages.dev

---

## Quick Reference

### On Your Mac:
```bash
cd ~/path/to/tapestrai-v3/worker
npx wrangler login
npx wrangler deploy
```

### In Clacky (Recommended):
```bash
cd /home/runner/app/worker
npx wrangler login
npx wrangler deploy
```

**Use `npx wrangler` instead of just `wrangler` to avoid installation issues.**

---

## Next Step

Choose one:

**Option A: Deploy from Clacky** (easier, no path/permission issues)
→ Use Clacky terminal at bottom of screen
→ Run: `cd /home/runner/app/worker && npx wrangler login && npx wrangler deploy`

**Option B: Deploy from your Mac** (if you prefer local terminal)
→ Clone repo first if needed
→ Run: `cd ~/Desktop/tapestrai-v3/worker && npx wrangler login && npx wrangler deploy`

**Pick one and go!** 🚀

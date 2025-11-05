# URGENT FIX: Non-ASCII Character Error in OpenRouter Headers

## The Error You're Getting:

```
TypeError: Failed to execute 'fetch' on 'Window': Failed to read the 'headers' 
property from 'RequestInit': String contains non ISO-8859-1 code point.
```

## Root Cause:

The error is caused by **non-ASCII characters** (likely a smart quote or special apostrophe) 
in one of your header values. The browser's fetch API only accepts ISO-8859-1 (Latin-1) 
characters in headers.

## Where the Problem Is:

There are TWO locations in your `apiKeyManager.js` where you're setting OpenRouter headers:

### Location 1: Line ~380 (testKey function)
### Location 2: Line ~771 (analyzeWithOpenRouter function)

---

## THE FIX - TWO METHODS:

### Method 1: Manual Fix (Recommended)

Open your `apiKeyManager.js` file and find these TWO sections:

#### Section 1: Around line 374-389 (in the `testKey` function):

**FIND THIS:**
```javascript
case 'openrouter':
  response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'TapestrAI',  // ← PROBLEM MAY BE HERE
      'Content-Type': 'application/json'
    },
```

**REPLACE WITH THIS (type it fresh, don't copy/paste):**
```javascript
case 'openrouter':
  response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'tapestrAI',
      'Content-Type': 'application/json'
    },
```

#### Section 2: Around line 765-775 (in the `analyzeWithOpenRouter` function):

**FIND THIS:**
```javascript
const response = await fetch(config.endpoint, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.keys.openrouter}`,
    'HTTP-Referer': window.location.origin,
    'X-Title': 'TapestrAI',  // ← PROBLEM MAY BE HERE
    'Content-Type': 'application/json'
  },
```

**REPLACE WITH THIS (type it fresh, don't copy/paste):**
```javascript
const response = await fetch(config.endpoint, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.keys.openrouter}`,
    'HTTP-Referer': window.location.origin,
    'X-Title': 'tapestrAI',
    'Content-Type': 'application/json'
  },
```

---

### Method 2: Search and Replace (Quick Fix)

1. Open `apiKeyManager.js` in your editor
2. Use Find & Replace (Ctrl+H or Cmd+H)
3. **Find:** `'X-Title': 'TapestrAI'` (or any variation)
4. **Replace with:** `'X-Title': 'tapestrAI'`
5. Replace ALL occurrences (should be 2)
6. Save the file

---

## What Changed:

| Before (Broken) | After (Fixed) | Why |
|----------------|---------------|-----|
| `'TapestrAI'` | `'tapestrAI'` | Lowercase 't' |
| May have special apostrophes | Regular straight quotes | ASCII-safe |

---

## How to Type It Correctly:

When typing the fix, make sure you:

1. **Use straight quotes only:** `'` (keyboard apostrophe)
   - NOT curly quotes: `'` or `'` 
   - NOT backticks: `` ` ``

2. **Type the value as:** `tapestrAI`
   - Lowercase 't'
   - Capital 'AI'
   - No special characters

---

## Testing After the Fix:

1. Save your `apiKeyManager.js` file
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Try testing the OpenRouter API key again

**Expected result:**
```
Testing openrouter API key...
openrouter response status: 200  ✅
✓ OpenRouter API key test successful
```

---

## Why This Happens:

HTTP headers can only contain ASCII characters (codes 0-127). The `fetch()` API enforces 
this and throws an error if it finds any character outside the ISO-8859-1 range in headers.

Common culprits:
- Smart quotes: `'` `'` (Unicode: U+2018, U+2019)
- Em dashes: `—` (Unicode: U+2014)
- Special apostrophes
- Accented characters: `é` `ñ` etc.

These characters might be invisibly inserted by:
- Word processors (MS Word, Google Docs)
- Some code editors with "smart quotes" enabled
- Copy/pasting from formatted text

---

## Still Getting Errors?

If you still see the error after fixing both locations, check for these:

1. **Clear your browser cache** completely
2. **Hard refresh** (Ctrl+Shift+R)
3. Check if there are any other OpenRouter fetch calls I missed
4. Verify you saved the file
5. Check your text editor isn't auto-converting quotes

---

## Alternative: Remove X-Title Header (Nuclear Option)

If you can't fix it, you can temporarily remove the X-Title header entirely:

```javascript
headers: {
  'Authorization': `Bearer ${key}`,
  'HTTP-Referer': window.location.origin,
  // 'X-Title': 'tapestrAI',  // ← Comment out or delete
  'Content-Type': 'application/json'
},
```

**Note:** The X-Title header is optional. OpenRouter works fine without it, but it helps 
with attribution on their leaderboards.

---

## Quick Check Command (if you have terminal access):

```bash
grep -n "X-Title" apiKeyManager.js
```

Should show only ASCII characters in the output.

---

## Summary Checklist:

- [ ] Found line ~380 with `case 'openrouter':`
- [ ] Changed `'X-Title': 'TapestrAI'` to `'X-Title': 'tapestrAI'`
- [ ] Found line ~771 in `analyzeWithOpenRouter` function
- [ ] Changed `'X-Title': 'TapestrAI'` to `'X-Title': 'tapestrAI'`
- [ ] Verified using STRAIGHT quotes only
- [ ] Saved the file
- [ ] Hard refreshed browser
- [ ] Tested OpenRouter API key

---

**Result:** OpenRouter API key test should now work! ✅

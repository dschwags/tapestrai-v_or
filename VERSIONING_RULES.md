# TapestrAI Versioning Rules

## **MANDATORY: Always Update Version & Timestamp**

**🔴 CRITICAL RULE:** Every time code changes are committed, the version number and timestamp MUST be updated.

This ensures:
- User can quickly verify they have the latest code
- Clear tracking of when changes were made
- Easy debugging and support (user can report version number)
- Professional versioning standards

---

## Version Format

**Semantic Versioning: `MAJOR.MINOR.PATCH`**

- **MAJOR** (X.0.0): Breaking changes, complete redesigns, major architecture changes
- **MINOR** (0.X.0): New features, new providers, significant functionality additions
- **PATCH** (0.0.X): Bug fixes, UI tweaks, error handling improvements, minor updates

---

## Where to Update

### 1. **index.html** (2 locations)

**Location 1: Header comment (Line ~7)**
```html
<!-- Version: 3.6.4 - Description | Build: 2025-01-05 17:15 EST -->
```

**Location 2: Footer (Line ~943)**
```html
v3.6.4 • Build 2025-01-05 17:15 EST
```

### 2. **ALL JavaScript Files** (Header comment)

**Every JavaScript file must have a version header:**

```javascript
/**
 * tapestrAI v3.6.4 - [Module Name]
 * [Brief description of module purpose]
 * Last updated: 2025-01-05 17:15 EST
 */
```

**Files that must be updated:**
- `js/apiKeyManager.js`
- `js/main.js`
- `js/imageProcessor.js`
- `js/agentOrchestrator.js`
- `js/costTracker.js`
- `js/progressUI.js`
- `js/errorHandler.js`
- `js/universalAnalyzer.js`
- `js/tokenTracker.js`
- Any other `.js` files in the project

---

## Timestamp Format

**Format:** `YYYY-MM-DD HH:MM TZ`
**Example:** `2025-01-05 15:45 EST`

Always use 24-hour time format and include timezone.

---

## Update Checklist

Before every commit:

- [ ] Increment version number appropriately (MAJOR, MINOR, or PATCH)
- [ ] Update timestamp to current time
- [ ] Update both locations in index.html (header comment + footer)
- [ ] Write descriptive commit message matching version description
- [ ] Commit to both repositories (if applicable):
  - `/home/runner/app` (main development)
  - `/home/runner/tapestrai-v_or` (OpenRouter production)

---

## Example Version History

| Version | Date | Description |
|---------|------|-------------|
| 3.6.1 | 2025-01-05 15:45 EST | API Key Management & Error Logging fixes |
| 3.6.0 | 2025-01-05 15:03 EST | OpenRouter Integration: Unified API provider |
| 3.5.1 | 2025-01-03 | Previous stable version |

---

## Commit Message Format

```
v{VERSION} - {SHORT_DESCRIPTION}

{DETAILED_CHANGES}
- Feature/fix 1
- Feature/fix 2
- Feature/fix 3
```

**Example:**
```
v3.6.1 - API Key Management & Error Logging

Enhanced error handling and key management:
- Fixed removeAPIKey() function to properly delete keys
- Added detailed OpenRouter error logging
- Added OpenRouter to quick status display
- Updated provider count to 6
```

---

## When to Bump Version

### PATCH (0.0.X)
- Bug fixes
- Error message improvements
- UI text changes
- Performance optimizations
- Documentation updates (in code)

### MINOR (0.X.0)
- New API providers
- New features (Ultimate Analysis, etc.)
- New UI sections
- New analysis capabilities
- Architecture improvements

### MAJOR (X.0.0)
- Complete UI redesign
- Breaking API changes
- New analysis engine
- Migration to new framework
- Major architecture overhaul

---

## Automation Note

⚠️ **This is currently a manual process.** A git pre-commit hook could be added to enforce this rule automatically in the future.

---

## Repository Sync

When updating versions, ensure changes are pushed to:

1. **Main development repo:** `/home/runner/app` (tapestrai-v3)
2. **Production repo:** `/home/runner/tapestrai-v_or`

Both repositories should maintain version parity.

---

**Last Updated:** 2025-01-05 15:45 EST by Clacky AI Assistant

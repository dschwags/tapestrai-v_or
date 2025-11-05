/**
 * SAFE REPLACEMENT CODE FOR OPENROUTER SECTIONS
 * Copy each section below to replace the corresponding section in your file
 * These have been verified to contain ONLY ASCII characters
 */

// ============================================================================
// SECTION 1: Replace lines ~374-389 in testKey() function
// ============================================================================

        case 'openrouter':
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'HTTP-Referer': window.location.origin,
              'X-Title': 'tapestrAI',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: config.models.fast,
              messages: [{ role: 'user', content: config.testPrompt }],
              max_tokens: 10
            })
          });
          break;


// ============================================================================
// SECTION 2: Replace lines ~765-780 in analyzeWithOpenRouter() function
// ============================================================================

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.keys.openrouter}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'tapestrAI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API request failed: ${response.status}`);
      }


// ============================================================================
// HOW TO USE THIS FILE:
// ============================================================================
// 
// 1. Open your apiKeyManager.js file
// 
// 2. Find the case 'openrouter': section around line 374
//    - Select from "case 'openrouter':" to the "break;" 
//    - Delete it
//    - Copy SECTION 1 above and paste it
// 
// 3. Find the analyzeWithOpenRouter function around line 765
//    - Select from "try {" to the closing "}" of the if (!response.ok) block
//    - Delete it  
//    - Copy SECTION 2 above and paste it
//
// 4. Save the file
//
// 5. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
//
// 6. Test your OpenRouter API key
//
// ============================================================================

// VERIFICATION: These strings should be pure ASCII (no smart quotes):
// 'X-Title': 'tapestrAI'
//
// Check: Copy the line above into a hex editor or run this in browser console:
// Array.from("'X-Title': 'tapestrAI'").map(c => c.charCodeAt(0))
// 
// Should only see numbers 0-127 (ASCII range)
// Numbers > 127 indicate Unicode characters that will break fetch headers

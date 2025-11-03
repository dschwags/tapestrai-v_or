# Puter.js Integration Testing Guide

## Overview
This guide provides step-by-step instructions for testing the Puter.js integration in tapestrAI. The integration provides an alternative authentication method that gives users instant access to all AI models without managing individual API keys.

## Prerequisites
- Browser with developer console access (Chrome, Firefox, Edge, Safari)
- Project running at http://localhost:3000
- Internet connection for Puter API access

## Testing Phases

### Phase 1: Authentication Flow Testing

#### 1.1 Initial Load
1. Open http://localhost:3000 in your browser
2. Open Developer Console (F12 or Cmd+Option+I)
3. Look for initialization messages:
   ```
   ✅ PuterIntegration loaded and ready
   ✅ PuterAIProvider and PuterAgentOrchestrator loaded
   🌐 Page loaded, initializing Puter integration...
   ✅ Puter integration initialized successfully
   ```

#### 1.2 Sign In Flow
1. Locate the "✨ Try the Easy Way!" section in the UI
2. Click "🚀 Sign in with Puter" button
3. Expected behavior:
   - Puter authentication popup appears
   - You can sign in with existing account or create new one
   - After successful auth, popup closes automatically
4. Verify UI updates:
   - "Sign in with Puter" button disappears
   - Username display appears
   - "Connected" badge shows green
   - Success message displays: "✅ Ready to analyze! All AI models are now available."
5. Check console for:
   ```
   🔐 Signing in with Puter...
   ✅ Puter sign-in successful: [username]
   ```

#### 1.3 Persistent Authentication
1. Refresh the page (F5 or Cmd+R)
2. Expected behavior:
   - UI automatically shows signed-in state
   - No need to re-authenticate
3. Check console for:
   ```
   ✅ User already signed in: [username]
   ```

#### 1.4 Sign Out Flow
1. Click "Sign out" link
2. Expected behavior:
   - UI reverts to signed-out state
   - "Sign in with Puter" button reappears
   - Username and badge disappear
3. Check console for:
   ```
   👋 Signed out from Puter
   ```

### Phase 2: AI API Testing

#### 2.1 Basic Connection Test
1. Sign in with Puter (if not already signed in)
2. Open browser console
3. Test PuterIntegration basic functionality:
   ```javascript
   // Check if Puter is available
   console.log('Puter available:', PuterIntegration.isPuterAvailable());
   
   // Check authentication status
   const authStatus = window.puterIntegration.getAuthStatus();
   console.log('Auth status:', authStatus);
   
   // Test simple AI call
   const result = await window.puterIntegration.testAI('gemini-2.0-flash-exp');
   console.log('Test result:', result);
   ```

Expected output:
```javascript
Puter available: true
Auth status: { isAuthenticated: true, user: { username: "...", ... } }
Test result: { content: "Hello! I'm working correctly...", model: "...", usage: {...} }
```

#### 2.2 PuterAIProvider Test
1. Test the provider wrapper:
   ```javascript
   // Create provider instance
   const provider = new PuterAIProvider(window.puterIntegration);
   
   // Check if ready
   console.log('Provider ready:', provider.isReady());
   
   // Get available models
   const models = await provider.getAvailableModels();
   console.log('Available models:', models);
   
   // Test connection with specific model
   const testResult = await provider.testConnection('gemini-2.0-flash-exp');
   console.log('Connection test:', testResult);
   ```

Expected output:
```javascript
Provider ready: true
Available models: [{ id: "...", name: "...", enabled: true, source: "puter" }, ...]
Connection test: { success: true, model: "gemini-2.0-flash-exp", response: "...", message: "..." }
```

#### 2.3 Image Analysis Test
1. Prepare a test image (convert to base64):
   ```javascript
   // Helper function to convert image to base64
   async function imageToBase64(url) {
     const response = await fetch(url);
     const blob = await response.blob();
     return new Promise((resolve) => {
       const reader = new FileReader();
       reader.onloadend = () => resolve(reader.result);
       reader.readAsDataURL(blob);
     });
   }
   
   // Use a sample image (you can use any online image URL)
   const imageUrl = 'https://example.com/sample-artifact.jpg';
   const imageData = await imageToBase64(imageUrl);
   ```

2. Test artifact analysis:
   ```javascript
   const provider = new PuterAIProvider(window.puterIntegration);
   
   const result = await provider.analyzeArtifact(
     [imageData],
     "Analyze this artifact and describe what you see. Include material, age estimates, and historical context.",
     { model: 'gemini-2.0-flash-exp', temperature: 0.7 }
   );
   
   console.log('Analysis result:', result);
   console.log('Content:', result.content);
   console.log('Model used:', result.model);
   console.log('Token usage:', result.usage);
   ```

Expected output:
```javascript
Analysis result: {
  content: "Detailed analysis of the artifact...",
  model: "gemini-2.0-flash-exp",
  provider: "Google",
  usage: { input_tokens: 1234, output_tokens: 567, total_tokens: 1801 },
  timestamp: "2025-01-31T...",
  source: "puter"
}
```

### Phase 3: Multi-Agent Orchestration Test

#### 3.1 Agent Configuration Test
```javascript
// Create orchestrator
const orchestrator = new PuterAgentOrchestrator(provider);

// Check agent configuration
const agents = orchestrator.getAllAgents();
console.log('Configured agents:', agents);

// Check specific agent
const primaryAgent = orchestrator.getAgentConfig('primary');
console.log('Primary agent:', primaryAgent);
```

Expected output:
```javascript
Configured agents: {
  primary: { name: "Material Analyst", model: "gemini-2.0-flash-exp", role: "primary", ... },
  cultural: { name: "Cultural Context Expert", model: "gpt-4o", role: "cultural", ... },
  synthesis: { name: "Research Synthesizer", model: "claude-3.5-sonnet", role: "synthesis", ... },
  research: { name: "Web Researcher", model: "gpt-4o", role: "research", ... }
}
```

#### 3.2 Multi-Agent Analysis Test
```javascript
// Define prompts for each agent
const prompts = {
  primary: "Examine this artifact's physical characteristics, materials, and construction techniques.",
  cultural: "Analyze the cultural and historical significance of this artifact.",
  synthesis: "Synthesize insights from multiple perspectives about this artifact's importance.",
  research: "Research and verify factual information about this artifact."
};

// Run multi-agent analysis
const results = await orchestrator.analyzeWithAgents(
  [imageData],
  prompts,
  (progress) => console.log('Progress:', progress)
);

console.log('Multi-agent results:', results);
```

Expected output:
```javascript
Progress: { agent: "primary", progress: 25, status: "analyzing" }
Progress: { agent: "primary", progress: 25, status: "completed" }
Progress: { agent: "cultural", progress: 50, status: "analyzing" }
...
Multi-agent results: {
  success: true,
  results: {
    primary: { content: "...", agent: "Material Analyst", role: "primary", ... },
    cultural: { content: "...", agent: "Cultural Context Expert", role: "cultural", ... },
    synthesis: { content: "...", agent: "Research Synthesizer", role: "synthesis", ... },
    research: { content: "...", agent: "Web Researcher", role: "research", ... }
  },
  source: "puter",
  timestamp: "2025-01-31T..."
}
```

### Phase 4: Error Handling Test

#### 4.1 Unauthenticated Access Test
```javascript
// Sign out first
await window.puterIntegration.signOut();

// Try to analyze without authentication
const provider = new PuterAIProvider(window.puterIntegration);
try {
  await provider.analyzeArtifact([imageData], "Test prompt");
} catch (error) {
  console.log('Expected error:', error.message);
  // Should see: "Not authenticated with Puter. Please sign in first."
}
```

#### 4.2 Invalid Model Test
```javascript
// Sign in first
await window.puterIntegration.signIn();

// Try with invalid model
try {
  await provider.analyzeArtifact([imageData], "Test prompt", { model: 'invalid-model' });
} catch (error) {
  console.log('Model error:', error.message);
}
```

### Phase 5: Performance & Quality Comparison

#### 5.1 Response Time Test
```javascript
// Test Puter response time
const puterStart = performance.now();
const puterResult = await provider.analyzeArtifact(
  [imageData],
  "Describe this artifact in detail.",
  { model: 'gemini-2.0-flash-exp' }
);
const puterTime = performance.now() - puterStart;

console.log('Puter response time:', puterTime, 'ms');
console.log('Puter content length:', puterResult.content.length, 'chars');
```

#### 5.2 Quality Comparison
To compare with direct API (requires Gemini API key configured):
```javascript
// Direct API call (if available)
const directStart = performance.now();
const directResult = await window.universalAnalyzer.analyzeArtifact(
  [imageData],
  "Describe this artifact in detail.",
  { provider: 'gemini', model: 'gemini-2.0-flash-exp' }
);
const directTime = performance.now() - directStart;

console.log('Direct API response time:', directTime, 'ms');
console.log('Direct API content length:', directResult.content.length, 'chars');

// Compare results
console.log('Time difference:', Math.abs(puterTime - directTime), 'ms');
console.log('Content similarity:', 
  puterResult.content.substring(0, 100) === directResult.content.substring(0, 100)
);
```

## Success Criteria

### Authentication
- ✅ Sign-in popup appears and completes successfully
- ✅ UI updates correctly after sign-in
- ✅ Authentication persists across page refreshes
- ✅ Sign-out works and reverts UI state
- ✅ Console shows appropriate status messages

### AI API
- ✅ Basic AI calls return valid responses
- ✅ Image analysis produces detailed descriptions
- ✅ Token usage is tracked and reported
- ✅ Multiple models can be used interchangeably
- ✅ Error handling works for unauthenticated requests

### Multi-Agent
- ✅ All agents are configured correctly
- ✅ Multi-agent analysis runs sequentially
- ✅ Progress callbacks fire appropriately
- ✅ All agent results are returned
- ✅ Different models are used for different agents

### Performance
- ✅ Response times are reasonable (< 10 seconds for typical queries)
- ✅ Quality matches or exceeds direct API calls
- ✅ No memory leaks or performance degradation over multiple calls

## Troubleshooting

### Issue: Puter SDK Not Loading
**Symptoms:** Console shows "⚠️ Puter SDK failed to load"
**Solutions:**
1. Check internet connection
2. Verify Puter CDN is accessible: https://js.puter.com/v2/
3. Check browser console for CORS or network errors
4. Try refreshing the page

### Issue: Authentication Popup Blocked
**Symptoms:** Nothing happens when clicking "Sign in with Puter"
**Solutions:**
1. Check if browser is blocking popups
2. Allow popups for localhost:3000
3. Try clicking the button again

### Issue: "Not authenticated" Error
**Symptoms:** AI calls fail with authentication error
**Solutions:**
1. Check `window.puterIntegration.getAuthStatus()`
2. Sign in again using `handlePuterSignIn()`
3. Clear browser cache and try again

### Issue: Slow Response Times
**Symptoms:** AI calls take longer than expected
**Solutions:**
1. Check network connection
2. Try a different model
3. Reduce image size/quality
4. Check Puter service status

### Issue: Empty or Invalid Responses
**Symptoms:** AI returns empty content or errors
**Solutions:**
1. Verify model name is correct
2. Check that prompt is well-formed
3. Ensure images are properly base64-encoded
4. Try with a simpler prompt first

## Next Steps

After completing all tests:
1. Document any issues or unexpected behaviors
2. Compare performance with direct API calls
3. Identify any missing features or improvements
4. Update documentation with findings
5. Commit changes and update changelog

## Testing Checklist

- [ ] Phase 1: Authentication flow works correctly
- [ ] Phase 2: AI API calls return valid responses
- [ ] Phase 3: Multi-agent orchestration functions properly
- [ ] Phase 4: Error handling works as expected
- [ ] Phase 5: Performance is acceptable and quality matches expectations
- [ ] All console messages are appropriate and helpful
- [ ] No JavaScript errors in console
- [ ] UI updates smoothly without glitches
- [ ] Authentication persists correctly
- [ ] Sign-out cleans up properly

## Report Template

```markdown
# Puter.js Testing Report

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Environment:** [Browser + Version]

## Authentication Tests
- Sign In: [PASS/FAIL] - [Notes]
- Persistent Auth: [PASS/FAIL] - [Notes]
- Sign Out: [PASS/FAIL] - [Notes]

## AI API Tests
- Basic Connection: [PASS/FAIL] - [Notes]
- Image Analysis: [PASS/FAIL] - [Notes]
- Token Tracking: [PASS/FAIL] - [Notes]

## Multi-Agent Tests
- Agent Configuration: [PASS/FAIL] - [Notes]
- Multi-Agent Analysis: [PASS/FAIL] - [Notes]
- Progress Callbacks: [PASS/FAIL] - [Notes]

## Performance
- Average Response Time: [X] seconds
- Quality vs Direct API: [Same/Better/Worse]
- Notes: [Your observations]

## Issues Found
1. [Description]
2. [Description]

## Recommendations
1. [Recommendation]
2. [Recommendation]
```

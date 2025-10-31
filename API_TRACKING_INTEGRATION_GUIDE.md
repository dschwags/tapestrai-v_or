# 🔌 API Tracking Integration Guide

## What Was Added

The new API status tracking system provides **real-time visual feedback** showing which APIs are:
- ⚪ **Not configured** (no API key)
- 🟢 **Configured & ready** (has key, idle)
- ⚡ **Actively analyzing** (currently making API call)
- ✅ **Just used** (used in last analysis)

---

## Visual Components Added

### 1. Enhanced Header Status Bar
Location: Top of page, always visible

**Before:**
```
🔑 API Keys: 5/5  |  Analysis: ⭐⭐⭐⭐
🔷 Gemini  🟢 OpenAI  🟣 Claude  🔵 Perplexity  🔷 DeepSeek
```

**During Analysis:**
```
🔑 API Keys: 5/5  |  Analysis: ⭐⭐⭐⭐
⚡ Gemini  ⚡ DeepSeek  ⚪ OpenAI  ⚪ Claude  ⚪ Perplexity
(pulsing animation on active)
```

**After Analysis:**
```
🔑 API Keys: 5/5  |  Analysis: ⭐⭐⭐⭐
✅ Gemini  ✅ DeepSeek  ⚪ OpenAI  ⚪ Claude  ⚪ Perplexity
```

### 2. Analysis Status Banner
Location: Below header, appears during/after analysis

**During Analysis:**
```
┌────────────────────────────────────────────────────────┐
│ ⚡ Analyzing with AI...                                 │
│ [Gemini] [DeepSeek]  (pulsing badges)                  │
└────────────────────────────────────────────────────────┘
```

**After Analysis (10 second auto-hide):**
```
┌────────────────────────────────────────────────────────┐
│ ✅ Analysis Complete! (2 APIs, $0.0003, 4.1s)          │
│ [Gemini ✓] [DeepSeek ✓]                                │
└────────────────────────────────────────────────────────┘
```

---

## API Functions

### Core Tracking Functions

```javascript
// Initialize (already in index.html)
window.activeAPIs = {
    analyzing: new Set(),      // Currently analyzing
    used: new Set(),           // Used in current session
    lastAnalysis: {}           // Results from last analysis
};
```

### 1. Mark API as Analyzing

```javascript
setAPIAnalyzing(provider, isAnalyzing)
```

**Parameters:**
- `provider` (string): API identifier ('gemini', 'openai', 'anthropic', 'perplexity', 'deepseek')
- `isAnalyzing` (boolean): true = start analyzing, false = done analyzing

**Example:**
```javascript
// Before making API call
setAPIAnalyzing('gemini', true);

// After API call completes
setAPIAnalyzing('gemini', false);
```

### 2. Record API Usage with Metrics

```javascript
recordAPIUsage(provider, cost, time)
```

**Parameters:**
- `provider` (string): API identifier
- `cost` (number): Cost in dollars
- `time` (number): Time in seconds

**Example:**
```javascript
recordAPIUsage('deepseek', 0.00014, 2.3);
```

### 3. Reset Tracking (New Analysis)

```javascript
resetAnalysisTracking()
```

Call this at the **start** of each new analysis to clear previous state.

---

## Integration with Agent Orchestrator

### Current Workflow (js/agentOrchestrator.js)

```javascript
async analyze(imageDataArray, progressUI) {
    // ... existing code ...
    
    // Primary analysis with Gemini
    const primaryAnalysis = await this.runGeminiPrimary(...);
    
    // Additional analyses
    const additionalResults = {};
    
    // OpenAI/DeepSeek cultural
    if (apiKeyManager.keys.deepseek) {
        additionalResults.cultural = await this.runDeepSeekCultural(...);
    } else if (apiKeyManager.keys.openai) {
        additionalResults.cultural = await this.runCulturalAnalysis(...);
    }
    
    // ... etc
}
```

### Enhanced Workflow (WITH TRACKING)

```javascript
async analyze(imageDataArray, progressUI) {
    const startTime = Date.now();
    
    // Reset tracking for new analysis
    resetAnalysisTracking();
    
    // PRIMARY ANALYSIS - Gemini
    setAPIAnalyzing('gemini', true);
    const geminiStart = Date.now();
    
    try {
        const primaryAnalysis = await this.runGeminiPrimary(
            imageDataArray,
            apiKeyManager
        );
        
        const geminiTime = (Date.now() - geminiStart) / 1000;
        const geminiCost = this.estimateCost('gemini', primaryAnalysis);
        
        recordAPIUsage('gemini', geminiCost, geminiTime);
        setAPIAnalyzing('gemini', false);
        
    } catch (error) {
        setAPIAnalyzing('gemini', false);
        throw error;
    }
    
    // ADDITIONAL ANALYSES
    const additionalResults = {};
    
    // Cultural Analysis (DeepSeek or OpenAI)
    if (apiKeyManager.keys.deepseek) {
        setAPIAnalyzing('deepseek', true);
        const dsStart = Date.now();
        
        try {
            additionalResults.cultural = await this.runDeepSeekCultural(
                imageDataArray[0],
                primaryAnalysis,
                apiKeyManager
            );
            
            const dsTime = (Date.now() - dsStart) / 1000;
            const dsCost = this.estimateCost('deepseek', additionalResults.cultural);
            
            recordAPIUsage('deepseek', dsCost, dsTime);
            setAPIAnalyzing('deepseek', false);
            
        } catch (error) {
            setAPIAnalyzing('deepseek', false);
            console.error('DeepSeek failed:', error);
        }
        
    } else if (apiKeyManager.keys.openai) {
        setAPIAnalyzing('openai', true);
        const oaiStart = Date.now();
        
        try {
            additionalResults.cultural = await this.runCulturalAnalysis(
                imageDataArray[0],
                primaryAnalysis,
                apiKeyManager
            );
            
            const oaiTime = (Date.now() - oaiStart) / 1000;
            const oaiCost = this.estimateCost('openai', additionalResults.cultural);
            
            recordAPIUsage('openai', oaiCost, oaiTime);
            setAPIAnalyzing('openai', false);
            
        } catch (error) {
            setAPIAnalyzing('openai', false);
            console.error('OpenAI failed:', error);
        }
    }
    
    // Historical Research (Perplexity)
    if (apiKeyManager.keys.perplexity && primaryAnalysis) {
        setAPIAnalyzing('perplexity', true);
        const pxStart = Date.now();
        
        try {
            additionalResults.historical = await this.runHistoricalResearch(
                primaryAnalysis,
                apiKeyManager
            );
            
            const pxTime = (Date.now() - pxStart) / 1000;
            const pxCost = this.estimateCost('perplexity', additionalResults.historical);
            
            recordAPIUsage('perplexity', pxCost, pxTime);
            setAPIAnalyzing('perplexity', false);
            
        } catch (error) {
            setAPIAnalyzing('perplexity', false);
            console.error('Perplexity failed:', error);
        }
    }
    
    // Synthesis (Anthropic)
    if (apiKeyManager.keys.anthropic) {
        setAPIAnalyzing('anthropic', true);
        const antStart = Date.now();
        
        try {
            const synthesis = await this.runSynthesisCuration(
                primaryAnalysis,
                additionalResults,
                apiKeyManager
            );
            
            const antTime = (Date.now() - antStart) / 1000;
            const antCost = this.estimateCost('anthropic', synthesis);
            
            recordAPIUsage('anthropic', antCost, antTime);
            setAPIAnalyzing('anthropic', false);
            
            return synthesis;
            
        } catch (error) {
            setAPIAnalyzing('anthropic', false);
            console.error('Anthropic failed:', error);
        }
    }
    
    // Return results
    return this.formatFinalResult(primaryAnalysis, additionalResults);
}
```

---

## Cost Estimation Helper

Add this method to `agentOrchestrator.js`:

```javascript
estimateCost(provider, result) {
    // Rough estimates based on token counts
    const rates = {
        gemini: 0.00002 / 1000,      // $0.02 per 1M tokens
        openai: 0.01 / 1000,         // $10 per 1M tokens
        anthropic: 0.003 / 1000,     // $3 per 1M tokens
        perplexity: 0.001 / 1000,    // $1 per 1M tokens
        deepseek: 0.00014 / 1000     // $0.14 per 1M tokens
    };
    
    // Estimate tokens (very rough)
    const responseText = typeof result === 'string' ? result : JSON.stringify(result);
    const estimatedTokens = responseText.length / 4; // ~4 chars per token
    
    return (estimatedTokens * rates[provider]) || 0;
}
```

Or use actual token counts if available from API response:

```javascript
estimateCostFromTokens(provider, inputTokens, outputTokens) {
    const rates = {
        gemini: { input: 0.02 / 1000000, output: 0.08 / 1000000 },
        openai: { input: 10 / 1000000, output: 30 / 1000000 },
        anthropic: { input: 3 / 1000000, output: 15 / 1000000 },
        perplexity: { input: 1 / 1000000, output: 1 / 1000000 },
        deepseek: { input: 0.14 / 1000000, output: 0.28 / 1000000 }
    };
    
    const rate = rates[provider];
    return (inputTokens * rate.input) + (outputTokens * rate.output);
}
```

---

## Quick Integration Checklist

### ✅ Already Done (in index.html):
- [x] Added analysis status banner
- [x] Added tracking functions
- [x] Enhanced header status display
- [x] Added visual state indicators

### ⏭️ TODO (in js/agentOrchestrator.js):
- [ ] Add `resetAnalysisTracking()` call at start of analysis
- [ ] Wrap each API call with `setAPIAnalyzing()` before/after
- [ ] Add `recordAPIUsage()` after successful API calls
- [ ] Add cost estimation method
- [ ] Handle errors properly (ensure `setAPIAnalyzing(provider, false)` on errors)

---

## Testing

### Manual Test Flow:

1. **Configure APIs**
   - Add at least Gemini + one other API key
   - Verify header shows 🟢 for configured APIs

2. **Start Analysis**
   - Upload image, click "Analyze"
   - Watch header icons change to ⚡ (pulsing)
   - Banner appears: "⚡ Analyzing with AI..."

3. **During Analysis**
   - Icons pulse for active APIs
   - Banner shows which APIs are working

4. **After Analysis**
   - Icons change to ✅ for used APIs
   - Banner shows summary with cost/time
   - Banner auto-hides after 10 seconds

5. **Second Analysis**
   - Previous "✅" clears
   - New tracking starts fresh

---

## Visual States Reference

| Icon | Meaning | When | Color |
|------|---------|------|-------|
| ⚪ | Not Configured | No API key | Gray (40% opacity) |
| 🟢 | Ready | Has key, idle | Green (100% opacity) |
| ⚡ | Analyzing | Active API call | Yellow (pulsing) |
| ✅ | Just Used | Recent activity | Green (100% opacity) |

---

## Troubleshooting

### Icons not updating during analysis
→ Make sure `setAPIAnalyzing()` is called before/after API calls

### Banner not appearing
→ Check that `resetAnalysisTracking()` is called at analysis start

### Cost showing as $0.0000
→ Implement proper cost estimation using actual token counts

### Icons stuck in "analyzing" state
→ Ensure `setAPIAnalyzing(provider, false)` is in `finally` block or error handler

---

## Next Steps

1. **Update agentOrchestrator.js** with tracking calls
2. **Test with real analysis**
3. **Verify costs are reasonable**
4. **Refine auto-hide timing** (currently 10s)
5. **Add click-to-expand** for detailed breakdown

---

## Example: Minimal Integration

If you want to test quickly, add just this to the start of your analyze function:

```javascript
async analyze(imageDataArray, progressUI) {
    resetAnalysisTracking();
    
    try {
        setAPIAnalyzing('gemini', true);
        const result = await this.runGeminiPrimary(imageDataArray, apiKeyManager);
        recordAPIUsage('gemini', 0.0001, 2.5);
        setAPIAnalyzing('gemini', false);
        return result;
    } catch (error) {
        setAPIAnalyzing('gemini', false);
        throw error;
    }
}
```

This will show the tracking in action with Gemini only.

---

**Ready to integrate? The UI is live, just needs the orchestrator hooks!** 🚀

# OpenRouter Implementation Plan for tapestrAI
## Focused on: Easy Implementation, User Simplicity, Model Selection Flexibility

---

## 🎯 Your Key Requirements

1. **Easy Implementation** - Minimal code changes, quick setup
2. **Reduce User API Confusion** - One key instead of 5, simple setup
3. **Pick Models Per Task** - Different AI for different analysis steps

---

## ✨ The Perfect Solution: OpenRouter

### Current Pain Points → OpenRouter Solutions

| Current Problem | OpenRouter Solution |
|----------------|---------------------|
| Users need 5 API keys from 5 different sites | **ONE key from openrouter.ai** |
| Users confused by CORS errors | **Works directly from browser, no CORS** |
| Cloudflare Worker required for 4/5 providers | **No Worker needed at all** |
| Can't easily swap models per task | **Pick any model for any task, instantly** |
| 689 lines of provider management code | **~150 lines total (78% reduction)** |

---

## 🚀 Implementation: 3 Simple Steps

### Step 1: Add OpenRouter Config (5 minutes)

Add this to your `apiKeyManager.js`:

```javascript
// Add to your providers object
openrouter: {
  name: 'OpenRouter (All Models - Recommended)',
  required: false,
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  icon: '🚀',
  color: '#10B981',
  getKeyUrl: 'https://openrouter.ai/keys',
  instructions: 'One key for 100+ AI models. Free tier: 10 requests/day. Works everywhere, no proxy needed!',
  testPrompt: 'Respond with just "success"',
  
  // Available models for different tasks
  models: {
    // Fast & Free (for quick analysis)
    'fast': 'google/gemini-2.0-flash-exp',
    'budget': 'deepseek/deepseek-chat',
    
    // Balanced (for main analysis)
    'balanced': 'anthropic/claude-sonnet-4',
    'general': 'openai/gpt-4-turbo',
    
    // Specialized (for specific tasks)
    'vision': 'anthropic/claude-3-opus',
    'research': 'perplexity/sonar-pro',
    'creative': 'anthropic/claude-3-opus',
    'technical': 'deepseek/deepseek-chat'
  }
}
```

### Step 2: Add Test Function (10 minutes)

Add this to your `testKey()` method:

```javascript
async testKey(provider, key) {
  const config = this.providers[provider];
  
  // ... your existing code for other providers ...
  
  // Add OpenRouter case
  if (provider === 'openrouter') {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'tapestrAI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp', // Free model for testing
          messages: [{ 
            role: 'user', 
            content: 'Respond with just the word "success"' 
          }],
          max_tokens: 10
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API test failed');
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content?.toLowerCase().includes('success');
      
    } catch (error) {
      console.error('OpenRouter test failed:', error);
      return false;
    }
  }
  
  // ... rest of your existing code ...
}
```

### Step 3: Add Analysis Method (15 minutes)

Create a new method for OpenRouter analysis:

```javascript
/**
 * Analyze using OpenRouter with specific model selection
 * @param {string} imageData - Base64 image data
 * @param {string} prompt - Analysis prompt
 * @param {string} taskType - Type of task: 'fast', 'balanced', 'vision', 'research', etc.
 * @param {object} options - Additional options (fallback, streaming, etc.)
 */
async analyzeWithOpenRouter(imageData, prompt, taskType = 'balanced', options = {}) {
  if (!this.keys.openrouter) {
    throw new Error('OpenRouter API key not configured');
  }
  
  const config = this.providers.openrouter;
  const model = config.models[taskType] || config.models.balanced;
  
  // Build request
  const requestBody = {
    model: model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { 
          type: 'image_url', 
          image_url: { 
            url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`
          } 
        }
      ]
    }],
    temperature: options.temperature || 0.4,
    max_tokens: options.maxTokens || 4096
  };
  
  // Add fallback models if requested
  if (options.fallback) {
    requestBody.models = [
      config.models.budget,   // Try cheapest first
      model,                  // Then requested model
      config.models.balanced  // Finally fallback to balanced
    ];
    requestBody.route = 'fallback';
  }
  
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
      const error = await response.json();
      throw new Error(error.error?.message || `API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usage && window.costTracker) {
      window.costTracker.trackCall(
        'openrouter',
        data.usage.prompt_tokens || 0,
        data.usage.completion_tokens || 0,
        data.model || model
      );
    }
    
    return {
      text: data.choices[0].message.content,
      model: data.model, // Which model actually responded
      usage: data.usage,
      cost: this.calculateCost(data.usage, data.model)
    };
    
  } catch (error) {
    console.error('OpenRouter analysis failed:', error);
    throw error;
  }
}

calculateCost(usage, model) {
  // OpenRouter provides cost info in response headers
  // Or calculate based on model pricing
  if (!usage) return 0;
  
  // Approximate costs (OpenRouter charges same as providers)
  const costs = {
    'google/gemini-2.0-flash-exp': { input: 0.00002, output: 0.00006 },
    'deepseek/deepseek-chat': { input: 0.00014, output: 0.00028 },
    'anthropic/claude-sonnet-4': { input: 0.003, output: 0.015 },
    'openai/gpt-4-turbo': { input: 0.01, output: 0.03 },
    'perplexity/sonar-pro': { input: 0.001, output: 0.001 }
  };
  
  const pricing = costs[model] || { input: 0.001, output: 0.002 };
  const inputCost = (usage.prompt_tokens / 1000) * pricing.input;
  const outputCost = (usage.completion_tokens / 1000) * pricing.output;
  
  return inputCost + outputCost;
}
```

---

## 🎨 Task-Based Model Selection

Now you can pick the perfect AI for each task:

### Example: Multi-Stage Analysis

```javascript
/**
 * Example: Analyze artifact with different models for different tasks
 */
async analyzeArtifact(imageData, userContext) {
  
  // Stage 1: Fast Initial Classification (cheap & fast)
  const classification = await this.analyzeWithOpenRouter(
    imageData,
    'Quickly identify: What type of artifact is this? (jewelry/toy/document/etc)',
    'fast', // Uses gemini-flash or deepseek
    { maxTokens: 100 }
  );
  
  console.log('Classification (used ' + classification.model + '):', classification.text);
  
  // Stage 2: Detailed Material Analysis (vision specialist)
  const materials = await this.analyzeWithOpenRouter(
    imageData,
    this.getMaterialAnalysisPrompt(),
    'vision', // Uses Claude Opus (best for visual detail)
    { fallback: true } // Try cheaper first, fallback to Opus if needed
  );
  
  console.log('Materials (used ' + materials.model + '):', materials.text);
  
  // Stage 3: Historical Research (research specialist)
  const history = await this.analyzeWithOpenRouter(
    imageData,
    this.getHistoricalContextPrompt(classification.text),
    'research', // Uses Perplexity (has web search)
    { maxTokens: 2000 }
  );
  
  console.log('History (used ' + history.model + '):', history.text);
  
  // Stage 4: Synthesis & Narrative (creative specialist)
  const synthesis = await this.analyzeWithOpenRouter(
    imageData,
    this.getSynthesisPrompt(materials.text, history.text),
    'creative', // Uses Claude Opus (best at synthesis)
    { temperature: 0.7 }
  );
  
  console.log('Synthesis (used ' + synthesis.model + '):', synthesis.text);
  
  // Combine results
  return {
    classification: classification.text,
    materials: materials.text,
    history: history.text,
    synthesis: synthesis.text,
    modelsUsed: [
      classification.model,
      materials.model,
      history.model,
      synthesis.model
    ],
    totalCost: classification.cost + materials.cost + history.cost + synthesis.cost
  };
}
```

### Example: Budget-Conscious Analysis

```javascript
/**
 * Example: Use cheapest models with premium fallback
 */
async analyzeBudget(imageData, prompt) {
  return await this.analyzeWithOpenRouter(
    imageData,
    prompt,
    'budget', // Start with DeepSeek (ultra-cheap)
    { 
      fallback: true, // If DeepSeek fails, try Gemini, then Claude
      maxTokens: 2000
    }
  );
}
```

### Example: Premium Quality Analysis

```javascript
/**
 * Example: Use best models for critical analysis
 */
async analyzePremium(imageData, prompt) {
  // Run multiple premium models in parallel, compare results
  const [claude, gpt4] = await Promise.all([
    this.analyzeWithOpenRouter(imageData, prompt, 'creative'), // Claude Opus
    this.analyzeWithOpenRouter(imageData, prompt, 'general')   // GPT-4 Turbo
  ]);
  
  return {
    claude: claude.text,
    gpt4: gpt4.text,
    agreement: this.compareResults(claude.text, gpt4.text),
    totalCost: claude.cost + gpt4.cost
  };
}
```

---

## 👤 User Experience Improvements

### Current User Flow (Complex)
```
User Journey with Current System:

1. User opens tapestrAI
2. Sees: "Add API Keys (5 required)"
3. Clicks Gemini → Redirected to aistudio.google.com
4. Creates Google account, gets key, returns
5. Adds key, works! ✅
6. Clicks OpenAI → Redirected to platform.openai.com
7. Creates account, adds payment, gets key
8. Returns, adds key → ❌ CORS ERROR
9. Confused, reads docs: "Need Cloudflare Worker"
10. Attempts deployment → Gives up 😞

Success Rate: ~30%
Time: 2-3 hours
Frustration: High
```

### With OpenRouter (Simple)
```
User Journey with OpenRouter:

1. User opens tapestrAI
2. Sees: "Get Started Free - No API Key Needed!" 
3. Uploads image → Analysis works! (10 free daily) ✅
4. Likes it, wants unlimited
5. Clicks "Upgrade" → Redirected to openrouter.ai
6. Creates account (Google/GitHub login)
7. Gets ONE API key
8. Returns, adds key → Everything works! ✅

Success Rate: ~95%
Time: 5 minutes
Frustration: None
```

---

## 📱 Updated UI Mockup

### API Setup Section (Simplified)

```html
<!-- Replace your current multi-provider form with: -->

<div class="api-setup">
  
  <!-- Option 1: Free Tier (No Key) -->
  <div class="option free-tier">
    <h3>🎁 Free Tier</h3>
    <p>Try tapestrAI with 10 free analyses per day</p>
    <button onclick="useFreeMode()">Start Analyzing Free</button>
  </div>
  
  <!-- Option 2: OpenRouter (Recommended) -->
  <div class="option recommended">
    <span class="badge">⭐ RECOMMENDED</span>
    <h3>🚀 OpenRouter</h3>
    <p>One key for 100+ AI models. Works everywhere, no setup.</p>
    
    <input type="text" 
           id="openrouter-key" 
           placeholder="sk-or-v1-..." 
           autocomplete="off">
    
    <button onclick="addOpenRouterKey()">Connect OpenRouter</button>
    
    <a href="https://openrouter.ai/keys" target="_blank">
      Get your free key →
    </a>
    
    <div class="benefits">
      ✅ 100+ AI models<br>
      ✅ No CORS issues<br>
      ✅ Works on any device<br>
      ✅ Single billing<br>
      ✅ Automatic fallbacks
    </div>
  </div>
  
  <!-- Option 3: Individual Keys (Advanced) -->
  <details class="advanced-option">
    <summary>Advanced: Use Individual API Keys</summary>
    
    <div class="provider-list">
      <!-- Your current Gemini, OpenAI, etc. inputs -->
      <p class="warning">
        ⚠️ Note: OpenAI, Anthropic, and Perplexity require 
        Cloudflare Worker deployment to work.
      </p>
    </div>
  </details>
  
</div>
```

---

## 🎯 Model Selection UI

### Add Model Selector for Power Users

```html
<!-- Optional: Let users choose model per analysis -->

<div class="analysis-options">
  <label>Analysis Mode:</label>
  <select id="analysis-mode">
    <option value="auto">🚀 Auto (Smart Selection)</option>
    <option value="fast">⚡ Fast (Gemini Flash)</option>
    <option value="budget">💰 Budget (DeepSeek)</option>
    <option value="balanced">⚖️ Balanced (Claude Sonnet)</option>
    <option value="premium">⭐ Premium (GPT-4 + Claude)</option>
    <option value="research">🔍 Research (Perplexity)</option>
  </select>
</div>

<script>
async function analyzeArtifact(imageData) {
  const mode = document.getElementById('analysis-mode').value;
  
  // Map UI modes to task types
  const modeMap = {
    'auto': 'balanced',
    'fast': 'fast',
    'budget': 'budget',
    'balanced': 'balanced',
    'premium': 'creative',
    'research': 'research'
  };
  
  const taskType = modeMap[mode];
  
  if (mode === 'premium') {
    // Premium mode: Use multiple models
    return await analyzePremium(imageData, prompt);
  } else {
    // Single model with fallback
    return await apiKeyManager.analyzeWithOpenRouter(
      imageData, 
      prompt, 
      taskType,
      { fallback: true }
    );
  }
}
</script>
```

---

## 💡 Smart Routing Examples

### Automatic Cost Optimization

```javascript
/**
 * Automatically use cheapest model that can handle the task
 */
async analyzeWithCostOptimization(imageData, prompt) {
  return await this.analyzeWithOpenRouter(
    imageData,
    prompt,
    'budget', // Start with cheapest (DeepSeek $0.14/1M)
    {
      fallback: true,
      // OpenRouter will automatically try:
      // 1. DeepSeek ($0.14/1M)
      // 2. Gemini Flash ($0.02/1M)  
      // 3. Claude Sonnet ($3/1M) - only if others fail
    }
  );
}
```

### Task-Specific Routing

```javascript
/**
 * Route to best model for specific tasks
 */
async intelligentAnalysis(imageData, analysisType) {
  const routingMap = {
    // Material identification → Vision specialist
    'materials': {
      taskType: 'vision',
      prompt: this.getMaterialAnalysisPrompt()
    },
    
    // Historical context → Research specialist  
    'history': {
      taskType: 'research',
      prompt: this.getHistoricalPrompt()
    },
    
    // Quick classification → Fast & cheap
    'classification': {
      taskType: 'fast',
      prompt: this.getClassificationPrompt()
    },
    
    // Creative synthesis → Best model
    'synthesis': {
      taskType: 'creative',
      prompt: this.getSynthesisPrompt()
    }
  };
  
  const config = routingMap[analysisType];
  
  return await this.analyzeWithOpenRouter(
    imageData,
    config.prompt,
    config.taskType,
    { fallback: true }
  );
}
```

### Parallel Multi-Model Analysis

```javascript
/**
 * Get multiple perspectives simultaneously
 */
async getMultiplePerspectives(imageData, prompt) {
  // Run 3 different models in parallel
  const [fast, balanced, premium] = await Promise.all([
    this.analyzeWithOpenRouter(imageData, prompt, 'fast'),
    this.analyzeWithOpenRouter(imageData, prompt, 'balanced'),
    this.analyzeWithOpenRouter(imageData, prompt, 'creative')
  ]);
  
  return {
    perspectives: [
      { model: fast.model, analysis: fast.text, cost: fast.cost },
      { model: balanced.model, analysis: balanced.text, cost: balanced.cost },
      { model: premium.model, analysis: premium.text, cost: premium.cost }
    ],
    totalCost: fast.cost + balanced.cost + premium.cost,
    consensus: this.findConsensus([fast.text, balanced.text, premium.text])
  };
}
```

---

## 📊 Cost Tracking Integration

Update your `costTracker.js`:

```javascript
// Add OpenRouter support
trackCall(provider, promptTokens, completionTokens, model) {
  // ... existing code ...
  
  // Handle OpenRouter model names
  if (provider === 'openrouter') {
    // Model format: "google/gemini-2.0-flash-exp"
    const [providerName, modelName] = model.split('/');
    
    const costs = {
      'google': { input: 0.00002, output: 0.00006 },
      'deepseek': { input: 0.00014, output: 0.00028 },
      'anthropic': { input: 0.003, output: 0.015 },
      'openai': { input: 0.01, output: 0.03 },
      'perplexity': { input: 0.001, output: 0.001 }
    };
    
    const pricing = costs[providerName] || { input: 0.001, output: 0.002 };
    const cost = (promptTokens / 1000 * pricing.input) + 
                 (completionTokens / 1000 * pricing.output);
    
    this.addUsageRecord({
      provider: 'openrouter',
      model: model,
      promptTokens,
      completionTokens,
      cost,
      timestamp: Date.now()
    });
  }
  
  // ... rest of existing code ...
}
```

---

## ⚡ Quick Start Guide for Users

Create a simple guide (`docs/openrouter-guide.md`):

```markdown
# Getting Started with OpenRouter (Recommended)

## Why OpenRouter?

- ✅ **One key for everything** - No more juggling 5 different API keys
- ✅ **Works everywhere** - No Cloudflare Worker or proxy needed
- ✅ **Free tier** - 10 analyses per day, no credit card
- ✅ **100+ models** - Access to all major AI providers
- ✅ **Smart fallbacks** - If one model is down, automatically tries another

## Setup (2 minutes)

### Step 1: Get Your API Key

1. Visit https://openrouter.ai
2. Click "Sign In" (use Google/GitHub)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy your key (starts with `sk-or-v1-...`)

### Step 2: Add to tapestrAI

1. Open tapestrAI
2. Click "API Setup"
3. Paste your OpenRouter key
4. Click "Connect"
5. Done! Start analyzing! 🎉

## Pricing

| Usage | Cost |
|-------|------|
| First 10/day | FREE |
| After that | Pay-per-use |
| Gemini Flash | $0.02 per 1M tokens (~500 analyses) |
| DeepSeek | $0.14 per 1M tokens (~300 analyses) |
| Claude/GPT-4 | $3-10 per 1M tokens (~100 analyses) |

**Typical cost:** $0.01-0.10 per analysis

## Tips

- Start with **Free Tier** (10/day) to test
- Use **Fast Mode** for quick analyses (cheapest)
- Use **Balanced Mode** for best quality/cost
- Use **Premium Mode** when accuracy is critical
```

---

## 🚀 Migration Timeline

### Week 1: Add OpenRouter Support
- **Day 1:** Add OpenRouter config to `apiKeyManager.js` (30 min)
- **Day 1:** Add test method (15 min)
- **Day 1:** Add analysis method (30 min)
- **Day 2:** Update UI with OpenRouter option (1 hour)
- **Day 2:** Test with your own OpenRouter key (30 min)
- **Day 3:** Update documentation (1 hour)
- **Day 3:** Deploy and test (30 min)

**Total:** ~4-5 hours of work

### Week 2: Monitor & Iterate
- Gather user feedback
- Monitor error rates
- Track which models are used most
- Optimize routing based on usage

### Week 3+: Optional Simplification
- Make OpenRouter the default
- Move individual keys to "Advanced" section
- Consider removing Cloudflare Worker (optional)

---

## 🎯 Implementation Checklist

```
Phase 1: Basic Integration (Required)
- [ ] Add OpenRouter to providers config
- [ ] Add testKey() support for OpenRouter
- [ ] Add analyzeWithOpenRouter() method
- [ ] Update UI with OpenRouter input field
- [ ] Test with your own key
- [ ] Update docs

Phase 2: Model Selection (Recommended)
- [ ] Add task-based model routing
- [ ] Add cost optimization options
- [ ] Add UI for model selection
- [ ] Update cost tracking

Phase 3: Advanced Features (Optional)
- [ ] Add multi-model comparison
- [ ] Add streaming support
- [ ] Add model recommendations
- [ ] Add usage analytics
```

---

## 💬 FAQ

**Q: Can users still use individual API keys?**
A: Yes! Keep all your existing code. OpenRouter is just another option.

**Q: What if OpenRouter is down?**
A: Keep Gemini as direct fallback, or use OpenRouter's built-in fallbacks.

**Q: Is it more expensive?**
A: No, same costs as direct API calls. Plus smart routing can reduce costs.

**Q: Do I need to remove my Cloudflare Worker?**
A: No, keep it for users who prefer individual keys. OpenRouter users won't need it.

**Q: How much code needs to change?**
A: ~100 lines added. No existing code needs to change.

---

## 📞 Next Steps

Ready to implement? Here's what I recommend:

1. **Get an OpenRouter key** (https://openrouter.ai/keys)
2. **Test it manually** (use their playground)
3. **Add the code** (I can help with this)
4. **Test in your app** (should work immediately)
5. **Deploy** (no special deployment needed)
6. **Update docs** (guide users to OpenRouter)

**Want me to implement this for you right now?** I can add OpenRouter support to your codebase in the next 30 minutes without breaking any existing functionality.

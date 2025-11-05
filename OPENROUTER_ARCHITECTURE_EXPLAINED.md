# OpenRouter Architecture Explained

## Overview

OpenRouter is configured as a **unified API gateway** that provides access to 100+ AI models through a single endpoint. Here's exactly how it's set up and how the multi-agent analysis works.

---

## OpenRouter Configuration

### API Endpoint
```
https://openrouter.ai/api/v1/chat/completions
```

**Single endpoint for ALL models** - Unlike the traditional setup where each provider has its own endpoint (OpenAI, Anthropic, Perplexity, etc.), OpenRouter uses ONE endpoint and you just specify which model you want in the request body.

### Task-Based Model Routing

OpenRouter is configured with 8 different task types, each mapped to a specific AI model:

```javascript
models: {
  'fast': 'google/gemini-2.0-flash-exp',      // Quick analysis, free tier
  'budget': 'deepseek/deepseek-chat',          // Ultra-cheap option ($0.14/1M tokens)
  'balanced': 'anthropic/claude-sonnet-4',     // Main analysis workhorse
  'general': 'openai/gpt-4-turbo',             // General purpose
  'vision': 'anthropic/claude-3-opus',         // Image analysis specialist
  'research': 'perplexity/sonar-pro',          // Web search & fact-checking
  'creative': 'anthropic/claude-3-opus',       // Creative synthesis
  'technical': 'deepseek/deepseek-chat'        // Technical/coding tasks
}
```

**Location in code:** `js/apiKeyManager.js`, lines 86-113

---

## API Request Format

### Basic Request Structure

```javascript
POST https://openrouter.ai/api/v1/chat/completions

Headers:
  Authorization: Bearer sk-or-v1-{your-key}
  HTTP-Referer: https://your-app.com
  X-Title: tapestrAI
  Content-Type: application/json

Body:
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [{
    "role": "user",
    "content": [
      { "type": "text", "text": "Your analysis prompt here" },
      { 
        "type": "image_url", 
        "image_url": { 
          "url": "data:image/jpeg;base64,..." 
        } 
      }
    ]
  }],
  "temperature": 0.4,
  "max_tokens": 4096
}
```

### With Fallback Routing (Cost Optimization)

```javascript
{
  "models": [
    "deepseek/deepseek-chat",           // Try this first (cheapest)
    "anthropic/claude-sonnet-4",        // Then this
    "openai/gpt-4-turbo"                // Finally this (most expensive)
  ],
  "route": "fallback",
  "messages": [...]
}
```

OpenRouter will automatically try each model in order until one succeeds.

---

## How Multi-Agent Analysis Works

### Traditional Setup (Without OpenRouter)

In the traditional setup, tapestrAI uses **individual provider APIs**:

```
┌─────────────────────────────────────────────────────────┐
│                     tapestrAI                           │
│                                                          │
│  1. Material Analyst ──────────► Gemini API             │
│     (Physical examination)       (Direct)               │
│                                                          │
│  2. Cultural Specialist ───────► OpenAI API             │
│     (Social context)             (via Cloudflare Worker)│
│                                                          │
│  3. Historical Researcher ─────► Perplexity API         │
│     (Web research)               (via Cloudflare Worker)│
│                                                          │
│  4. Synthesis Curator ─────────► Anthropic API          │
│     (Final synthesis)            (via Cloudflare Worker)│
│                                                          │
│  5. Fact Checker ──────────────► Perplexity API         │
│     (Verify claims)              (via Cloudflare Worker)│
└─────────────────────────────────────────────────────────┘
```

**Problems:**
- Need 5+ different API keys
- CORS issues with OpenAI, Anthropic, Perplexity
- Requires Cloudflare Worker proxy
- Complex setup and maintenance

### With OpenRouter (Simplified)

```
┌─────────────────────────────────────────────────────────┐
│                     tapestrAI                           │
│                                                          │
│  All Agents ──────────────────► OpenRouter Gateway      │
│                                  (Single endpoint)       │
│                                         │                │
│                                         ├─► Gemini       │
│                                         ├─► GPT-4        │
│                                         ├─► Claude       │
│                                         ├─► Perplexity   │
│                                         └─► DeepSeek     │
└─────────────────────────────────────────────────────────┘
```

**Benefits:**
- ONE API key for everything
- NO CORS issues (OpenRouter is CORS-friendly)
- NO proxy/Worker needed
- Same functionality, simpler setup

---

## Analysis Flow with OpenRouter

### Step 1: Material Analysis (Primary Agent)

```javascript
// Location: js/agentOrchestrator.js, lines 38-45

// Uses Gemini through OpenRouter for initial material examination
const primaryAnalysis = await universalAnalyzer.analyze(
  imageData,
  userContext,
  apiKeyManager
);

// OR if using OpenRouter directly:
const result = await apiKeyManager.analyzeWithOpenRouter(
  imageData,
  materialAnalysisPrompt,
  'vision',  // Use Claude Opus for detailed visual analysis
  { temperature: 0.4, maxTokens: 4096 }
);
```

**What it does:**
- Physical examination of artifact
- Material identification
- Age indicators
- Craftsmanship analysis
- Initial dating estimate

### Step 2: Cultural Context (Secondary Agent)

```javascript
// Location: js/agentOrchestrator.js, lines 50-74

if (apiKeyManager.keys.openrouter) {
  additionalResults.cultural = await apiKeyManager.analyzeWithOpenRouter(
    imageData,
    culturalContextPrompt,
    'general',  // Use GPT-4 Turbo for cultural analysis
    { temperature: 0.7, maxTokens: 1500 }
  );
}
```

**What it does:**
- Cultural significance
- Social context (class, gender, occasion)
- Symbolic meaning
- Regional variations
- Evolution of meaning over time

### Step 3: Historical Research (Tertiary Agent)

```javascript
// Location: js/agentOrchestrator.js, lines 76-89

if (apiKeyManager.keys.openrouter) {
  additionalResults.research = await apiKeyManager.analyzeWithOpenRouter(
    null,  // Text-only, no image needed
    historicalResearchPrompt,
    'research',  // Use Perplexity for web research
    { temperature: 0.3, maxTokens: 2000 }
  );
}
```

**What it does:**
- Web search for similar artifacts
- Historical documentation
- Museum records
- Provenance research
- Expert opinions

### Step 4: Synthesis & Narrative (Final Agent)

```javascript
// Location: js/agentOrchestrator.js, lines 91-105

if (apiKeyManager.keys.openrouter) {
  additionalResults.synthesis = await apiKeyManager.analyzeWithOpenRouter(
    imageData,
    synthesisPrompt,
    'creative',  // Use Claude Opus for narrative synthesis
    { temperature: 0.6, maxTokens: 3000 }
  );
}
```

**What it does:**
- Combines all previous analyses
- Resolves contradictions
- Creates coherent narrative
- Fact-checks claims
- Provides confidence levels

### Step 5: Final Gemini Synthesis

```javascript
// Location: js/agentOrchestrator.js, lines 117-124

if (perspectiveCount > 0) {
  finalAnalysis = await runGeminiSynthesis(
    primaryAnalysis,
    additionalResults,
    apiKeyManager
  );
}
```

**What it does:**
- Final quality check
- Ensures consistency
- Removes redundancy
- Formats final output
- Generates summary

---

## Method: analyzeWithOpenRouter()

**Location:** `js/apiKeyManager.js`, lines 721-798

### Method Signature

```javascript
async analyzeWithOpenRouter(imageData, prompt, taskType = 'balanced', options = {})
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `imageData` | string | Base64-encoded image data (with or without data URI prefix) |
| `prompt` | string | Analysis prompt/instructions |
| `taskType` | string | One of: 'fast', 'budget', 'balanced', 'general', 'vision', 'research', 'creative', 'technical' |
| `options` | object | Optional: `{ temperature, maxTokens, fallback }` |

### Example Usage

```javascript
// Quick analysis with free Gemini
const result = await apiKeyManager.analyzeWithOpenRouter(
  imageData,
  "Describe this artifact",
  'fast'
);

// Detailed vision analysis with Claude Opus
const result = await apiKeyManager.analyzeWithOpenRouter(
  imageData,
  "Analyze materials and craftsmanship in detail",
  'vision',
  { temperature: 0.4, maxTokens: 4096 }
);

// Cost-optimized with fallback routing
const result = await apiKeyManager.analyzeWithOpenRouter(
  imageData,
  "Provide historical context",
  'balanced',
  { fallback: true, temperature: 0.5 }
);
```

### Return Value

```javascript
{
  text: "The AI's analysis response...",
  model: "anthropic/claude-sonnet-4",  // Which model actually responded
  usage: {
    prompt_tokens: 1234,
    completion_tokens: 567,
    total_tokens: 1801
  },
  cost: 0.00456  // Calculated cost in USD
}
```

---

## API Paths for Different Agents

### All agents use the SAME endpoint but different models:

```
https://openrouter.ai/api/v1/chat/completions
```

**Model selection happens in the request body:**

```javascript
// Agent 1: Material Analyst
{
  "model": "anthropic/claude-3-opus",  // Vision specialist
  "messages": [{ /* material analysis prompt */ }]
}

// Agent 2: Cultural Specialist
{
  "model": "openai/gpt-4-turbo",  // General purpose
  "messages": [{ /* cultural context prompt */ }]
}

// Agent 3: Historical Researcher
{
  "model": "perplexity/sonar-pro",  // Web search
  "messages": [{ /* research prompt */ }]
}

// Agent 4: Synthesis Curator
{
  "model": "anthropic/claude-sonnet-4",  // Balanced synthesis
  "messages": [{ /* synthesis prompt */ }]
}
```

### There is NO separate API path for different agents!

The "routing" happens by:
1. **Task type** → selects model (e.g., 'research' → perplexity/sonar-pro)
2. **Prompt content** → determines what the AI does
3. **Same endpoint** → all requests go to `https://openrouter.ai/api/v1/chat/completions`

---

## Cost Tracking

### Per-Model Costs

**Location:** `js/apiKeyManager.js`, lines 803-821

```javascript
const costs = {
  'google/gemini-2.0-flash-exp': { 
    input: $0.00002/1K, 
    output: $0.00006/1K 
  },
  'deepseek/deepseek-chat': { 
    input: $0.00014/1K, 
    output: $0.00028/1K 
  },
  'anthropic/claude-sonnet-4': { 
    input: $0.003/1K, 
    output: $0.015/1K 
  },
  'anthropic/claude-3-opus': { 
    input: $0.015/1K, 
    output: $0.075/1K 
  },
  'openai/gpt-4-turbo': { 
    input: $0.01/1K, 
    output: $0.03/1K 
  },
  'perplexity/sonar-pro': { 
    input: $0.001/1K, 
    output: $0.001/1K 
  }
};
```

### Usage Tracking

Every OpenRouter call tracks:
- Provider: 'openrouter'
- Input tokens
- Output tokens
- Model used
- Calculated cost

**Location:** `js/apiKeyManager.js`, lines 778-785

```javascript
if (data.usage && window.costTracker) {
  window.costTracker.trackCall(
    'openrouter',
    data.usage.prompt_tokens || 0,
    data.usage.completion_tokens || 0,
    data.model || model  // Actual model that responded
  );
}
```

---

## Fallback Routing (Advanced Feature)

### How It Works

When `fallback: true` is set in options:

```javascript
const result = await apiKeyManager.analyzeWithOpenRouter(
  imageData,
  prompt,
  'balanced',
  { fallback: true }
);
```

**Request body includes:**

```javascript
{
  "models": [
    "deepseek/deepseek-chat",      // Try cheapest first ($0.14/1M)
    "anthropic/claude-sonnet-4",   // Then balanced ($3/1M)
    "openai/gpt-4-turbo"           // Finally premium ($10/1M)
  ],
  "route": "fallback",
  "messages": [...]
}
```

**OpenRouter automatically:**
1. Tries DeepSeek first
2. If it fails/refuses → tries Claude
3. If that fails → tries GPT-4
4. Returns first successful response

**Benefits:**
- Cost optimization
- Reliability (automatic failover)
- No code changes needed
- Same API call structure

---

## Comparison: Old Way vs. OpenRouter

### Old Multi-Provider Setup

```javascript
// Material analysis with Gemini
const material = await analyzeWithGemini(imageData, prompt1);

// Cultural analysis with OpenAI
const cultural = await analyzeWithOpenAI(imageData, prompt2);

// Historical research with Perplexity
const research = await analyzeWithPerplexity(prompt3);

// Synthesis with Claude
const synthesis = await analyzeWithClaude(imageData, prompt4);
```

**Required:**
- 4 different API keys
- 4 different endpoint URLs
- 4 different authentication methods
- Cloudflare Worker for CORS
- 200+ lines of provider-specific code

### With OpenRouter

```javascript
// All analyses use same method, different task types
const material = await apiKeyManager.analyzeWithOpenRouter(
  imageData, prompt1, 'vision'
);

const cultural = await apiKeyManager.analyzeWithOpenRouter(
  imageData, prompt2, 'general'
);

const research = await apiKeyManager.analyzeWithOpenRouter(
  null, prompt3, 'research'
);

const synthesis = await apiKeyManager.analyzeWithOpenRouter(
  imageData, prompt4, 'creative'
);
```

**Required:**
- 1 API key
- 1 endpoint URL
- 1 authentication method
- No proxy needed
- 50 lines of unified code

---

## Summary

### OpenRouter Configuration
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions` (single endpoint for all)
- **Authentication:** Bearer token in Authorization header
- **Model Selection:** Via `model` field in request body
- **Task Types:** 8 predefined mappings (fast, budget, balanced, general, vision, research, creative, technical)

### API Path for Different Agents
**There is only ONE API path:**
```
https://openrouter.ai/api/v1/chat/completions
```

**Different agents = different models in request:**
- Material Analyst → `anthropic/claude-3-opus` (vision task)
- Cultural Specialist → `openai/gpt-4-turbo` (general task)
- Historical Researcher → `perplexity/sonar-pro` (research task)
- Synthesis Curator → `anthropic/claude-sonnet-4` (creative task)

### Final Summarization
The **final summarization** uses one of two approaches:

1. **If only using OpenRouter:**
   - Synthesis step uses `analyzeWithOpenRouter(imageData, synthesisPrompt, 'creative')`
   - Uses Claude Opus via OpenRouter
   - Location: `js/agentOrchestrator.js`, lines 91-105

2. **If using mixed providers:**
   - Final synthesis uses Gemini directly
   - Location: `js/agentOrchestrator.js`, lines 117-124
   - Method: `runGeminiSynthesis()`

**The key insight:** OpenRouter doesn't change the multi-agent workflow—it just makes it simpler by providing ONE API endpoint for ALL models instead of managing 5+ separate provider APIs.

---

## Code Locations Reference

| Component | File | Lines |
|-----------|------|-------|
| OpenRouter config | `js/apiKeyManager.js` | 86-113 |
| analyzeWithOpenRouter() | `js/apiKeyManager.js` | 721-798 |
| Cost calculation | `js/apiKeyManager.js` | 803-821 |
| Multi-agent orchestration | `js/agentOrchestrator.js` | 14-171 |
| Material analysis | `js/agentOrchestrator.js` | 38-45 |
| Cultural analysis | `js/agentOrchestrator.js` | 50-74 |
| Historical research | `js/agentOrchestrator.js` | 76-89 |
| Synthesis | `js/agentOrchestrator.js` | 91-105 |
| Final synthesis | `js/agentOrchestrator.js` | 117-124 |

---

## Next Steps

To fully leverage OpenRouter for multi-agent analysis:

1. **Update agentOrchestrator.js** to use OpenRouter for all agents (currently it still uses individual provider APIs)
2. **Add OpenRouter fallback routing** to optimize costs automatically
3. **Simplify the codebase** by removing provider-specific analysis methods
4. **Update UI** to show which OpenRouter model handled each agent task

This would reduce the codebase by ~78% while maintaining full functionality! 🚀

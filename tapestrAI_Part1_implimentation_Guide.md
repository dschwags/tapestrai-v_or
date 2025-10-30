# tapestrAI Implementation Guide - Part 1
## Foundation, Setup & Core Systems - Complete Reference

**Version:** 1.0  
**Date:** October 29, 2025  
**Status:** Production Ready  
**Estimated Completion Time:** 3-4 weeks

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Implementation Timeline](#3-implementation-timeline)
4. [API Key Management System](#4-api-key-management-system)
5. [Universal Analysis Engine](#5-universal-analysis-engine)
6. [Image Processing Pipeline](#6-image-processing-pipeline)
7. [Progress & Loading UI](#7-progress--loading-ui)
8. [Cost Tracking System](#8-cost-tracking-system)
9. [Error Handling & Recovery](#9-error-handling--recovery)
10. [BugX Integration](#10-bugx-integration)
11. [Implementation Checklist](#11-implementation-checklist)
12. [Testing Strategy](#12-testing-strategy)
13. [Success Metrics & Part 2 Triggers](#13-success-metrics--part-2-triggers)

---

## 1. Project Overview

### Mission Statement
> "Unlock the stories behind your treasures. Expert AI-powered analysis revealing the history, cultural significance, and fascinating context of historic artifacts. The treasure you hold leads to the legacy it holds."

### Core Principles
1. **Accessible**: Free tier with user-supplied API keys
2. **Intelligent**: Multi-agent research system for comprehensive analysis
3. **Educational**: Every analysis teaches something meaningful
4. **Transparent**: Show how AI reaches conclusions
5. **Scalable**: Easy to add new categories and specializations

### Target Users
- **Collectors**: Amateur and professional collectors seeking item information
- **Inheritors**: People who've inherited mystery items
- **Sellers**: Individuals preparing items for sale
- **Enthusiasts**: History buffs, antique lovers, curiosity-driven users
- **Educators**: Teachers using artifacts for educational purposes

### Phase 1 Goals
By the end of Part 1, users will be able to:
- ✅ Add and manage multiple AI API keys
- ✅ Upload artifact photos (with automatic compression)
- ✅ Receive comprehensive universal analysis
- ✅ Use single or multiple AI agents
- ✅ Track costs and usage
- ✅ Handle errors gracefully

**What Part 1 Does NOT Include** (saved for Part 2):
- Category-specific templates
- Smart routing to specialized analysis
- Export to PDF/MD/HTML
- Advanced personalization

---

## 2. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  (Single Page Application - HTML/CSS/JavaScript)            │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────────┐   ┌────────▼─────────┐
│ IMAGE          │   │ API KEY          │
│ PROCESSOR      │   │ MANAGER          │
│                │   │                  │
│ - Upload       │   │ - Store keys     │
│ - Compress     │   │ - Validate       │
│ - Optimize     │   │ - Test           │
└───┬────────────┘   └────────┬─────────┘
    │                         │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ UNIVERSAL ANALYZER      │
    │ (Core Analysis Engine)  │
    │                         │
    │ - Material analysis     │
    │ - Visual examination    │
    │ - Feature extraction    │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ AGENT ORCHESTRATOR      │
    │ (Multi-Agent System)    │
    │                         │
    │ - Deploy agents         │
    │ - Coordinate research   │
    │ - Aggregate results     │
    └─┬─────────┬─────────┬───┘
      │         │         │
┌─────▼───┐ ┌──▼─────┐ ┌─▼──────┐
│ Agent 1 │ │Agent 2 │ │Agent 3 │
│ Gemini  │ │GPT-4   │ │Claude  │
│ Material│ │Cultural│ │Synth   │
└─────┬───┘ └───┬────┘ └───┬────┘
      │         │          │
      └─────────┴──────────┘
                │
    ┌───────────▼────────────┐
    │ OUTPUT GENERATOR       │
    │                        │
    │ - Format results       │
    │ - Display to user      │
    │ - Track costs          │
    └────────────────────────┘
```

### Technology Stack

**Frontend:**
- HTML5 (semantic, accessible markup)
- CSS3 (Tailwind CSS for rapid development)
- Vanilla JavaScript (ES6+, no framework overhead)

**AI Providers (User API Keys):**
- Google Gemini 2.0 Flash (required) - $0.02 per 1M tokens
- OpenAI GPT-4 Turbo (optional) - $10 per 1M tokens
- Anthropic Claude Sonnet (optional) - $3 per 1M tokens
- Perplexity AI Sonar (optional) - $1 per 1M tokens

**Storage:**
- LocalStorage (encrypted) for API keys
- LocalStorage for cost tracking history
- No server required (100% client-side)

**Libraries:**
- None required (pure vanilla JS)
- Optional: Tailwind CSS via CDN

### File Structure

```
tapestrAI/
│
├── index.html                          # Main application
│
├── css/
│   └── styles.css                      # Custom styles
│
├── js/
│   ├── main.js                         # Application entry point
│   ├── apiKeyManager.js                # API key management
│   ├── universalAnalyzer.js            # Core analysis engine
│   ├── agentOrchestrator.js            # Multi-agent coordination
│   ├── imageProcessor.js               # Image handling
│   ├── progressUI.js                   # Progress tracking
│   ├── costTracker.js                  # Usage monitoring
│   ├── errorHandler.js                 # Error handling
│   └── bugx-tapestrAI.js               # BugX validation
│
├── tests/
│   ├── bugx-framework.js               # BugX test framework
│   ├── bugx-api-key-tests.js           # API key tests
│   ├── bugx-state-tests.js             # State management tests
│   └── bugx-analysis-tests.js          # Analysis tests
│
├── docs/
│   ├── getting-started.md              # User guide
│   ├── api-keys-guide.md               # How to get API keys
│   └── troubleshooting.md              # Common issues
│
└── README.md                           # Project overview
```

---

## 3. Implementation Timeline

### Week 1: Foundation (Days 1-7)
**Goal:** Working file structure, API key system, basic UI

```
Day 1-2: Project Setup
├─ File structure creation
├─ HTML/CSS foundation
├─ Tailwind CSS integration
└─ Local storage setup

Day 3-4: API Key Management
├─ APIKeyManager class
├─ Encryption system
├─ UI for key input
└─ Status indicators

Day 5-6: Test API Functionality
├─ Test button implementation
├─ Eyeball toggles
├─ Validation logic
└─ Error handling

Day 7: Polish & Documentation
├─ User instructions
├─ Help text
├─ Getting started guide
└─ Code documentation

✅ CHECKPOINT: Can users add/test API keys successfully?
```

### Week 2: Core Analysis (Days 8-14)
**Goal:** Single-agent analysis working end-to-end

```
Day 8-9: Universal Analyzer
├─ UniversalAnalyzer class
├─ Basic analysis prompt
├─ Gemini API integration
└─ Response parsing

Day 10-11: Image Upload System
├─ File input UI
├─ Drag & drop
├─ Image preview
└─ Basic validation

Day 12-13: Analysis Flow
├─ Upload → Analysis pipeline
├─ Loading states
├─ Progress indicators
└─ Results display

Day 14: Testing & Refinement
├─ Test with 10+ different items
├─ Verify output quality
├─ Check error handling
└─ Cost tracking

✅ CHECKPOINT: Can users successfully analyze one item with Gemini?
```

### Week 3: Multi-Agent System (Days 15-21)
**Goal:** Multiple AI agents working together

```
Day 15-16: Agent Orchestration
├─ AgentOrchestrator class
├─ Parallel execution
├─ Agent coordination
└─ Result aggregation

Day 17-18: Additional Agent Integration
├─ OpenAI GPT-4 integration
├─ Anthropic Claude integration
├─ Perplexity integration
└─ Error handling for each

Day 19-20: Synthesis System
├─ Combine agent results
├─ Conflict resolution
├─ Unified narrative
└─ Confidence scoring

Day 21: Multi-Agent Testing
├─ Test with 1, 2, 3, 4 agents
├─ Verify quality improvements
├─ Check cost scaling
└─ Performance optimization

✅ CHECKPOINT: Do multiple agents produce better results?
```

### Week 4: Polish & Optimization (Days 22-28)
**Goal:** Production-ready Phase 1 system

```
Day 22-23: Image Processing
├─ High-res upload support
├─ Automatic compression
├─ Size optimization
└─ Format validation

Day 24-25: User Experience
├─ Loading animations
├─ Progressive disclosure
├─ Error messages
└─ Help documentation

Day 26-27: Cost Tracking
├─ Token usage monitoring
├─ Cost dashboard
├─ Monthly summaries
└─ Optimization recommendations

Day 28: Launch Prep
├─ Final testing
├─ Documentation
├─ User guide
└─ Deployment

✅ CHECKPOINT: Ready for beta users?
```

---

## 4. API Key Management System

### Overview
The API Key Manager handles secure storage, validation, and testing of user-provided API keys for four AI providers.

### Complete Implementation

```javascript
/**
 * tapestrAI - API Key Manager
 * Phase 1: User-supplied API keys for multi-agent system
 */

class APIKeyManager {
  constructor() {
    // Supported AI providers
    this.providers = {
      gemini: {
        name: 'Google Gemini',
        required: true,
        model: 'gemini-2.0-flash-exp',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        icon: '🔷',
        color: '#4285F4',
        getKeyUrl: 'https://aistudio.google.com/apikey',
        instructions: 'Get a free API key from Google AI Studio. No credit card required for basic tier (60 requests/minute).',
        testPrompt: 'Respond with just the word "success"',
        costPer1kTokens: 0.00002
      },
      
      openai: {
        name: 'OpenAI',
        required: false,
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        icon: '🟢',
        color: '#10A37F',
        getKeyUrl: 'https://platform.openai.com/api-keys',
        instructions: 'Create an API key from OpenAI Platform. Requires account with payment method. $5 free credit for new users.',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.01
      },
      
      anthropic: {
        name: 'Anthropic Claude',
        required: false,
        model: 'claude-sonnet-4-20250514',
        endpoint: 'https://api.anthropic.com/v1/messages',
        icon: '🟣',
        color: '#8B5CF6',
        getKeyUrl: 'https://console.anthropic.com/',
        instructions: 'Generate API key from Anthropic Console. New users get $5 free credit.',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.003
      },
      
      perplexity: {
        name: 'Perplexity AI',
        required: false,
        model: 'sonar-pro',
        endpoint: 'https://api.perplexity.ai/chat/completions',
        icon: '🔵',
        color: '#3B82F6',
        getKeyUrl: 'https://www.perplexity.ai/settings/api',
        instructions: 'Get API key from Perplexity Settings. Free tier: 5 requests/day.',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.001
      }
    };
    
    this.keys = {};
    this.status = {};
    
    this.loadKeys();
    this.initializeUI();
  }
  
  /**
   * Generate device-specific salt for encryption
   */
  getDeviceSalt() {
    let salt = localStorage.getItem('device_salt');
    if (!salt) {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      localStorage.setItem('device_salt', salt);
    }
    return salt;
  }
  
  /**
   * Simple XOR cipher for API key encryption
   */
  encrypt(text) {
    const salt = this.getDeviceSalt();
    let encrypted = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted);
  }
  
  /**
   * Decrypt API key
   */
  decrypt(encrypted) {
    const salt = this.getDeviceSalt();
    const decoded = atob(encrypted);
    let decrypted = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  }
  
  /**
   * Load saved API keys from localStorage
   */
  loadKeys() {
    Object.keys(this.providers).forEach(provider => {
      const encrypted = localStorage.getItem(`tapestrAI_key_${provider}`);
      
      if (encrypted) {
        try {
          this.keys[provider] = this.decrypt(encrypted);
          this.status[provider] = 'saved';
        } catch (error) {
          console.error(`Failed to decrypt ${provider} key:`, error);
          this.status[provider] = 'error';
        }
      } else {
        this.status[provider] = this.providers[provider].required ? 'required' : 'optional';
      }
    });
  }
  
  /**
   * Save API key
   */
  async saveKey(provider, key) {
    if (!this.providers[provider]) {
      throw new Error(`Unknown provider: ${provider}`);
    }
    
    if (!key || key.trim().length < 20) {
      throw new Error('API key appears invalid (too short)');
    }
    
    this.updateStatus(provider, 'testing');
    
    try {
      const isValid = await this.testKey(provider, key.trim());
      
      if (isValid) {
        const encrypted = this.encrypt(key.trim());
        localStorage.setItem(`tapestrAI_key_${provider}`, encrypted);
        this.keys[provider] = key.trim();
        this.updateStatus(provider, 'active');
        
        this.showNotification('success', 
          `✓ ${this.providers[provider].name} connected successfully!`);
        
        this.updateAvailableFeatures();
        return true;
      } else {
        this.updateStatus(provider, 'invalid');
        throw new Error('API key test failed. Please check the key and try again.');
      }
    } catch (error) {
      this.updateStatus(provider, 'error');
      throw error;
    }
  }
  
  /**
   * Test API key by making a minimal API call
   */
  async testKey(provider, key) {
    const config = this.providers[provider];
    
    try {
      let response;
      
      switch(provider) {
        case 'gemini':
          response = await fetch(
            `${config.endpoint}/${config.model}:generateContent?key=${key}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: config.testPrompt }]
                }],
                generationConfig: { maxOutputTokens: 10 }
              })
            }
          );
          break;
          
        case 'openai':
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: 'user', content: config.testPrompt }],
              max_tokens: 10
            })
          });
          break;
          
        case 'anthropic':
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              model: config.model,
              max_tokens: 10,
              messages: [{ role: 'user', content: config.testPrompt }]
            })
          });
          break;
          
        case 'perplexity':
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: 'user', content: config.testPrompt }],
              max_tokens: 10
            })
          });
          break;
      }
      
      if (!response) return false;
      
      if (response.ok || response.status === 200) {
        return true;
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.error(`API test failed for ${provider}:`, errorData);
      return false;
      
    } catch (error) {
      console.error(`API test error for ${provider}:`, error);
      return false;
    }
  }
  
  /**
   * Remove API key
   */
  removeKey(provider) {
    if (this.providers[provider].required) {
      throw new Error(`Cannot remove required provider: ${provider}`);
    }
    
    localStorage.removeItem(`tapestrAI_key_${provider}`);
    delete this.keys[provider];
    this.updateStatus(provider, 'optional');
    
    this.showNotification('info', 
      `${this.providers[provider].name} disconnected`);
    
    this.updateAvailableFeatures();
  }
  
  /**
   * Get list of available agents based on active API keys
   */
  getAvailableAgents() {
    const agents = [];
    
    if (this.keys.gemini) {
      agents.push({
        id: 'material_analyst',
        name: 'Material Analyst',
        provider: 'gemini',
        model: this.providers.gemini.model,
        specialty: 'Physical examination, material identification, age indicators',
        icon: '🔬',
        primary: true
      });
    }
    
    if (this.keys.openai) {
      agents.push({
        id: 'cultural_specialist',
        name: 'Cultural Context Specialist',
        provider: 'openai',
        model: this.providers.openai.model,
        specialty: 'Cultural significance, social context, symbolic meaning',
        icon: '🌍',
        primary: false
      });
    }
    
    if (this.keys.anthropic) {
      agents.push({
        id: 'synthesis_curator',
        name: 'Synthesis Curator',
        provider: 'anthropic',
        model: this.providers.anthropic.model,
        specialty: 'Narrative synthesis, fact-checking, story weaving',
        icon: '📖',
        primary: false
      });
    }
    
    if (this.keys.perplexity) {
      agents.push({
        id: 'historical_researcher',
        name: 'Historical Researcher',
        provider: 'perplexity',
        model: this.providers.perplexity.model,
        specialty: 'Web research, historical documentation, provenance',
        icon: '🔍',
        primary: false
      });
    }
    
    return agents;
  }
  
  /**
   * Get analysis depth level based on number of active agents
   */
  getAnalysisLevel() {
    const count = Object.keys(this.keys).length;
    
    const levels = {
      0: { stars: '', name: 'No Analysis', description: 'Add Gemini API key to begin' },
      1: { stars: '⭐', name: 'Basic Analysis', description: 'Single-agent material examination' },
      2: { stars: '⭐⭐', name: 'Enhanced Analysis', description: 'Cross-verified insights' },
      3: { stars: '⭐⭐⭐', name: 'Comprehensive Analysis', description: 'Multi-perspective research' },
      4: { stars: '⭐⭐⭐⭐', name: 'Professional Analysis', description: 'Expert-level synthesis' }
    };
    
    return levels[count] || levels[0];
  }
  
  /**
   * Update status indicator for provider
   */
  updateStatus(provider, status) {
    this.status[provider] = status;
    
    const statusElement = document.getElementById(`${provider}-status`);
    if (statusElement) {
      statusElement.className = `status ${status}`;
      statusElement.setAttribute('data-status', status);
    }
    
    const testButton = document.getElementById(`${provider}-test-btn`);
    if (testButton) {
      testButton.className = `btn-test ${status}`;
      testButton.disabled = (status === 'testing');
    }
  }
  
  /**
   * Show notification to user
   */
  showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  /**
   * Update UI to show available features
   */
  updateAvailableFeatures() {
    const agents = this.getAvailableAgents();
    const level = this.getAnalysisLevel();
    
    const container = document.getElementById('available-agents');
    if (!container) return;
    
    container.innerHTML = `
      <div class="analysis-level">
        <h3>${level.stars} ${level.name}</h3>
        <p>${level.description}</p>
      </div>
      
      ${agents.length > 0 ? `
        <div class="agent-list">
          <h4>Your AI Research Team:</h4>
          ${agents.map(agent => `
            <div class="agent-card">
              <span class="agent-icon">${agent.icon}</span>
              <div class="agent-info">
                <strong>${agent.name}</strong>
                <p>${agent.specialty}</p>
              </div>
              ${agent.primary ? '<span class="badge primary">Primary</span>' : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${agents.length < 4 && agents.length > 0 ? `
        <div class="upgrade-prompt">
          <p>💡 Add more AI agents for deeper analysis</p>
        </div>
      ` : ''}
    `;
  }
  
  /**
   * Initialize UI components
   */
  initializeUI() {
    Object.keys(this.providers).forEach(provider => {
      const toggle = document.getElementById(`${provider}-toggle`);
      const input = document.getElementById(`${provider}-key-input`);
      
      if (toggle && input) {
        toggle.addEventListener('click', () => {
          const isVisible = input.type === 'text';
          input.type = isVisible ? 'password' : 'text';
          toggle.textContent = isVisible ? '👁️' : '🙈';
          toggle.title = isVisible ? 'Show Key' : 'Hide Key';
        });
      }
    });
    
    this.updateAvailableFeatures();
  }
}

// Initialize global instance
const apiKeyManager = new APIKeyManager();
```

### UI Implementation

```html
<!-- API Key Setup Section -->
<section id="api-key-setup" class="container mx-auto p-6">
  <h2 class="text-2xl font-bold mb-4">🔑 Configure Your AI Research Team</h2>
  <p class="text-gray-600 mb-6">Add API keys to unlock more powerful analysis</p>
  
  <!-- Gemini (Required) -->
  <div class="api-provider required mb-4 p-4 border rounded-lg">
    <div class="provider-header flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🔷</span>
        <div>
          <h3 class="font-bold">Google Gemini <span class="badge bg-red-500 text-white text-xs px-2 py-1 rounded">Required</span></h3>
          <p class="text-sm text-gray-600">Material analysis & physical examination</p>
        </div>
      </div>
      <div class="status-indicator flex items-center gap-2">
        <span id="gemini-status" class="status missing"></span>
        <button id="gemini-toggle" class="eyeball-toggle text-2xl" title="Show/Hide Key">👁️</button>
      </div>
    </div>
    
    <div class="key-input-group flex gap-2 mb-2">
      <input 
        type="password" 
        id="gemini-key-input" 
        placeholder="Paste your Gemini API key here"
        class="flex-1 px-3 py-2 border rounded"
      />
      <button 
        id="gemini-test-btn"
        onclick="testAPIKey('gemini')"
        class="btn-test px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Test
      </button>
      <button 
        onclick="saveAPIKey('gemini')"
        class="btn-save px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Save
      </button>
    </div>
    
    <div class="help-text text-sm text-gray-500">
      <a href="https://aistudio.google.com/apikey" target="_blank" class="text-blue-500 hover:underline">
        Get free API key →
      </a>
      <span class="ml-2">No credit card required</span>
    </div>
  </div>
  
  <!-- OpenAI (Optional) -->
  <div class="api-provider optional mb-4 p-4 border rounded-lg">
    <div class="provider-header flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🟢</span>
        <div>
          <h3 class="font-bold">OpenAI GPT-4 <span class="badge bg-gray-500 text-white text-xs px-2 py-1 rounded">Optional</span></h3>
          <p class="text-sm text-gray-600">Cultural context & social significance</p>
        </div>
      </div>
      <div class="status-indicator flex items-center gap-2">
        <span id="openai-status" class="status missing"></span>
        <button id="openai-toggle" class="eyeball-toggle text-2xl">👁️</button>
      </div>
    </div>
    
    <div class="key-input-group flex gap-2 mb-2">
      <input type="password" id="openai-key-input" placeholder="OpenAI API key" class="flex-1 px-3 py-2 border rounded" />
      <button onclick="testAPIKey('openai')" class="btn-test px-4 py-2 bg-blue-500 text-white rounded">Test</button>
      <button onclick="saveAPIKey('openai')" class="btn-save px-4 py-2 bg-green-500 text-white rounded">Save</button>
    </div>
    
    <div class="unlock-info text-sm text-gray-600">
      <strong>Unlocks:</strong> ⭐⭐ Enhanced cultural analysis
    </div>
  </div>
  
  <!-- Similar blocks for Anthropic and Perplexity -->
  
  <!-- Available Agents Display -->
  <div id="available-agents" class="mt-6 p-4 bg-gray-50 rounded-lg">
    <!-- Populated by JavaScript -->
  </div>
</section>

<script>
// Helper functions for UI
function testAPIKey(provider) {
  const input = document.getElementById(`${provider}-key-input`);
  const key = input.value.trim();
  
  if (!key) {
    alert('Please enter an API key first');
    return;
  }
  
  apiKeyManager.testKey(provider, key)
    .then(valid => {
      if (valid) {
        alert(`✓ ${provider} API key is valid!`);
      } else {
        alert(`✗ ${provider} API key test failed`);
      }
    })
    .catch(error => {
      alert(`Error testing key: ${error.message}`);
    });
}

function saveAPIKey(provider) {
  const input = document.getElementById(`${provider}-key-input`);
  const key = input.value.trim();
  
  if (!key) {
    alert('Please enter an API key first');
    return;
  }
  
  apiKeyManager.saveKey(provider, key)
    .then(() => {
      input.value = ''; // Clear input after save
    })
    .catch(error => {
      alert(`Error saving key: ${error.message}`);
    });
}
</script>
```

### CSS for API Key UI

```css
/* API Key Status Indicators */
.status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

.status.missing { background: #9ca3af; animation: none; }
.status.testing { background: #fbbf24; }
.status.active { background: #10b981; }
.status.invalid { background: #ef4444; }
.status.error { background: #f97316; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.eyeball-toggle {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.eyeball-toggle:hover { transform: scale(1.2); }
.eyeball-toggle:active { transform: scale(0.9); }

/* Button states */
.btn-test {
  transition: all 0.2s;
}

.btn-test.testing {
  background: #fbbf24;
  cursor: wait;
}

.btn-test.testing::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.btn-test.success { background: #10b981; }
.btn-test.success::before { content: '✓ '; }
.btn-test.error { background: #ef4444; }
.btn-test.error::before { content: '✗ '; }

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success { background: #10b981; color: white; }
.notification.error { background: #ef4444; color: white; }
.notification.info { background: #3b82f6; color: white; }

.notification.fade-out { animation: slideOut 0.3s ease-out; }

@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
}
```

---

## 5. Universal Analysis Engine

### Overview
The Universal Analysis Engine performs category-agnostic analysis that works for ANY artifact type. It uses a comprehensive structured prompt to extract all relevant information.

### Complete Implementation

```javascript
/**
 * tapestrAI - Universal Artifact Analyzer
 * Single analysis engine that works for all categories
 */

class UniversalAnalyzer {
  constructor(apiKeyManager) {
    this.apiKeyManager = apiKeyManager;
    this.analysisHistory = [];
    this.currentAnalysis = null;
  }
  
  /**
   * Main analysis method
   */
  async analyze(imageData, userContext = '', options = {}) {
    this.currentAnalysis = {
      id: this.generateAnalysisId(),
      startTime: Date.now(),
      imageData: imageData,
      userContext: userContext,
      options: options,
      status: 'initializing'
    };
    
    try {
      // BugX Phase 0: Pre-flight validation
      const preCheck = this.validateInput(imageData, userContext);
      if (!preCheck.valid) {
        throw new Error(`Pre-flight check failed: ${preCheck.errors.join(', ')}`);
      }
      
      // Get available agents
      const agents = this.apiKeyManager.getAvailableAgents();
      if (agents.length === 0) {
        throw new Error('No API keys configured. Add at least Gemini API key.');
      }
      
      // Update status
      this.currentAnalysis.status = 'analyzing';
      this.updateProgress(10, 'Starting analysis...');
      
      // Run primary analysis (always Gemini)
      const primaryResult = await this.runPrimaryAnalysis(imageData, userContext);
      this.updateProgress(40, 'Primary analysis complete');
      
      // Parse structured sections
      const parsed = this.parseAnalysisResult(primaryResult);
      this.updateProgress(50, 'Parsing results...');
      
      // Extract keywords for routing
      const keywords = this.extractKeywords(parsed);
      
      // Calculate confidence scores
      const confidence = this.calculateConfidence(parsed);
      
      // Prepare final result
      const result = {
        id: this.currentAnalysis.id,
        timestamp: new Date().toISOString(),
        success: true,
        
        // Raw data
        rawAnalysis: primaryResult,
        
        // Structured sections
        materials: parsed.materials,
        construction: parsed.construction,
        markings: parsed.markings,
        ageIndicators: parsed.ageIndicators,
        purpose: parsed.purpose,
        design: parsed.design,
        origin: parsed.origin,
        period: parsed.period,
        socialContext: parsed.socialContext,
        categoryHints: parsed.category,
        
        // Extracted metadata
        keywords: keywords,
        descriptiveTerms: parsed.descriptiveTerms,
        researchRecommendations: parsed.researchRecommendations,
        
        // Confidence scoring
        confidence: confidence,
        
        // Analysis metadata
        analysisTime: Date.now() - this.currentAnalysis.startTime,
        agentsUsed: ['material_analyst'],
        tokensUsed: this.estimateTokens(primaryResult),
        costEstimate: this.estimateCost(['gemini'])
      };
      
      // Save to history
      this.analysisHistory.push(result);
      this.currentAnalysis.status = 'complete';
      this.updateProgress(100, 'Analysis complete!');
      
      return result;
      
    } catch (error) {
      this.currentAnalysis.status = 'error';
      this.currentAnalysis.error = error.message;
      
      console.error('Analysis failed:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }
  
  /**
   * Validate input before expensive API calls (BugX Phase 0)
   */
  validateInput(imageData, userContext) {
    const errors = [];
    
    // Image validation
    if (!imageData) {
      errors.push('No image provided');
    } else {
      if (!imageData.startsWith('data:image/')) {
        errors.push('Invalid image format (must be data URL)');
      }
      
      const sizeInBytes = imageData.length * 0.75;
      if (sizeInBytes > 20_000_000) {
        errors.push(`Image too large (${(sizeInBytes / 1_000_000).toFixed(1)}MB, max 20MB)`);
      }
      
      try {
        const base64Data = imageData.split(',')[1];
        atob(base64Data);
      } catch {
        errors.push('Image encoding invalid (corrupted base64)');
      }
    }
    
    // API key validation
    if (!this.apiKeyManager.keys.gemini) {
      errors.push('Gemini API key required for analysis');
    }
    
    // User context validation
    if (userContext && userContext.length > 5000) {
      errors.push('User context too long (max 5000 characters)');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * Run primary analysis using Gemini
   */
  async runPrimaryAnalysis(imageData, userContext) {
    const prompt = this.getUniversalAnalysisPrompt();
    
    const apiKey = this.apiKeyManager.keys.gemini;
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          ...(userContext ? [{ 
            text: `\n\n### USER CONTEXT:\n${userContext}\n\nConsider this context when analyzing the artifact.` 
          }] : []),
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageData.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
        stopSequences: []
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    };
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed with status ${response.status}`
      );
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API returned no results');
    }
    
    const text = data.candidates[0].content.parts[0].text;
    return text;
  }
  
  /**
   * Universal analysis prompt (works for any artifact)
   */
  getUniversalAnalysisPrompt() {
    return `You are an expert artifact analyst with decades of experience across multiple domains: antiques, collectibles, art history, material science, and cultural anthropology. Your specialty is examining objects and extracting comprehensive information systematically.

# ANALYSIS FRAMEWORK

Analyze this artifact using the following structured approach. Be thorough, precise, and evidence-based. When uncertain, provide multiple possibilities with confidence levels.

## 1. PHYSICAL ANALYSIS

### Materials Identification
Identify ALL materials used in this object:
- **Primary materials**: What is the main structure made of? (Be specific: "sterling silver" not just "metal", "mahogany wood" not just "wood")
- **Secondary materials**: What other materials are present? (linings, inlays, decorations, etc.)
- **Material quality**: Assessment of material grade/quality
- **Material condition**: Current state (oxidation, patina, wear, damage)
- **Manufacturing evidence**: Machine-made vs handmade indicators

### Construction Method
How was this object made?
- **Primary technique**: Main construction method (cast, forged, carved, woven, molded, assembled, etc.)
- **Joinery/Assembly**: How are parts connected? (riveted, welded, sewn, glued, pegged, etc.)
- **Tool marks**: Visible evidence of tools used
- **Craftsmanship level**: Assessment of skill (crude, competent, skilled, masterful)
- **Production method**: Individual vs mass-produced indicators

### Physical Characteristics
Describe observable features:
- **Approximate dimensions**: Estimate size (small enough to hold, tabletop size, furniture-scale, etc.)
- **Weight indicators**: Does it appear heavy or light for its size?
- **Symmetry**: Perfectly symmetrical or asymmetrical?
- **Surface finish**: Polished, matte, textured, worn?
- **Color palette**: Primary and secondary colors
- **Decorative elements**: Patterns, motifs, embellishments

## 2. MARKINGS & TEXT ANALYSIS

### Visible Marks
Document any text, symbols, or marks:
- **Maker's marks**: Signatures, stamps, hallmarks, logos
- **Text content**: Any words, numbers, or phrases (transcribe exactly)
- **Symbols**: Decorative or functional symbols
- **Location of marks**: Where on the object are these found?
- **Mark clarity**: Are they crisp and clear or worn/faint?
- **Language**: If text is present, what language?

### Dating Clues from Marks
What do the marks tell us about age?
- **Dating from hallmarks**: If hallmarks are visible, what do they indicate?
- **Manufacturing codes**: Any date codes or serial numbers?
- **Style evolution**: How does the marking style help date this?

## 3. AGE INDICATORS

### Wear Patterns
Evidence of age through use:
- **Use wear**: Where is the object worn from use? (This shows how it was handled)
- **Patina development**: Natural aging of materials (oxidation, darkening, etc.)
- **Repairs**: Evidence of historical repairs or modifications
- **Stress patterns**: Cracks, warping, or deformation from age

### Stylistic Dating
Period identification from design:
- **Design style**: What artistic/historical period does the style suggest? (Victorian, Art Deco, Mid-Century Modern, etc.)
- **Manufacturing technology**: What does the construction method tell us about when this could have been made?
- **Material availability**: Were these materials available in certain periods?
- **Estimated date range**: Based on all evidence, when was this made? (Be specific: "1880-1900" not "late 19th century")

## 4. FUNCTIONAL ANALYSIS

### Original Purpose
What was this designed to do?
- **Primary function**: Main intended use
- **Usage context**: Where/how would this be used? (domestic, commercial, ceremonial, personal, etc.)
- **User interaction**: How would someone use this? (grip points, openings, moving parts, etc.)
- **Wear evidence**: Does the wear pattern confirm the suspected use?

### Design Intention
Understanding the creator's goals:
- **Functional design**: Features that serve the practical purpose
- **Aesthetic design**: Features that serve visual/artistic purposes
- **Ergonomics**: Was user comfort/ease-of-use considered?
- **Status indicators**: Was this designed to show wealth/status?

## 5. CULTURAL & HISTORICAL CONTEXT

### Geographic Origin
Where was this likely made or used?
- **Regional style indicators**: Design elements that suggest origin
- **Cultural motifs**: Symbols or patterns associated with specific cultures
- **Manufacturing location**: Based on construction method, where might this have been made?
- **Market vs. origin**: Was this made locally or imported?

### Historical Period Context
What was happening when this was made?
- **Era identification**: Specific historical period (with date range)
- **Historical events**: Relevant context from that time
- **Technological context**: What manufacturing capabilities existed?
- **Social context**: Who would have owned/used this?

### Social Significance
Understanding the object's place in society:
- **Class indicators**: Economic class of typical owner
- **Gender associations**: Was this gendered? (men's, women's, neutral)
- **Occasion**: Everyday use or special occasions?
- **Cultural meaning**: Any symbolic or ceremonial significance?

## 6. CATEGORY CLASSIFICATION

### Primary Category
Based on all evidence, this object best fits into:
- **Category name**: Most appropriate classification
- **Confidence level**: 0-100% (be honest about uncertainty)
- **Reasoning**: Why this category? (cite specific evidence)

### Secondary Categories (if applicable)
Does this object cross categories?
- **Crossover categories**: Other possible classifications
- **Crossover reasoning**: Why multiple categories apply

### Category Keywords
List 10-15 descriptive terms useful for classification:
[Material type, function, style period, origin, decorative style, etc.]

## 7. RESEARCH RECOMMENDATIONS

### Further Investigation
Suggest specific avenues for deeper research:
- **Specific topics**: What should be researched further?
- **Key search terms**: Best keywords for finding more information
- **Potential resources**: Museums, databases, books, experts
- **Authentication needs**: If valuable, what authentication is recommended?

## 8. CONFIDENCE ASSESSMENT

For each major conclusion, provide confidence level:
- **Materials identification**: X% confident
- **Dating**: X% confident (with range)
- **Origin**: X% confident
- **Purpose**: X% confident
- **Category**: X% confident

When confidence is below 70%, explain what additional information would help.

---

# ANALYSIS QUALITY STANDARDS

**Precision**: Use specific terminology ("sterling silver hallmarked 1894" not "old silver")
**Evidence-based**: Every conclusion should reference observable evidence
**Uncertainty**: When uncertain, say so and provide alternatives
**Completeness**: Address all sections systematically
**Clarity**: Write for an educated but non-expert audience

Begin your analysis now. Be thorough and systematic.`;
  }
  
  /**
   * Parse AI response into structured sections
   */
  parseAnalysisResult(rawText) {
    const sections = {};
    
    const sectionPatterns = {
      materials: /##?\s*1\.\s*PHYSICAL ANALYSIS[\s\S]*?###?\s*Materials Identification([\s\S]*?)(?=###|##\s*\d|$)/i,
      construction: /###?\s*Construction Method([\s\S]*?)(?=###|##\s*\d|$)/i,
      markings: /##?\s*2\.\s*MARKINGS[\s\S]*?([\s\S]*?)(?=##\s*3|$)/i,
      ageIndicators: /##?\s*3\.\s*AGE INDICATORS[\s\S]*?([\s\S]*?)(?=##\s*4|$)/i,
      purpose: /##?\s*4\.\s*FUNCTIONAL ANALYSIS[\s\S]*?([\s\S]*?)(?=##\s*5|$)/i,
      origin: /##?\s*5\.\s*CULTURAL.*?###?\s*Geographic Origin([\s\S]*?)(?=###|##\s*\d|$)/i,
      period: /###?\s*Historical Period Context([\s\S]*?)(?=###|##\s*\d|$)/i,
      socialContext: /###?\s*Social Significance([\s\S]*?)(?=###|##\s*\d|$)/i,
      category: /##?\s*6\.\s*CATEGORY CLASSIFICATION[\s\S]*?([\s\S]*?)(?=##\s*7|$)/i,
      researchRecommendations: /##?\s*7\.\s*RESEARCH RECOMMENDATIONS[\s\S]*?([\s\S]*?)(?=##\s*8|$)/i,
      confidence: /##?\s*8\.\s*CONFIDENCE ASSESSMENT[\s\S]*?([\s\S]*?)$/i
    };
    
    for (const [key, pattern] of Object.entries(sectionPatterns)) {
      const match = rawText.match(pattern);
      sections[key] = match ? match[1].trim() : '';
    }
    
    sections.descriptiveTerms = this.extractDescriptiveTerms(sections.category);
    sections.rawText = rawText;
    
    return sections;
  }
  
  /**
   * Extract descriptive keywords from text
   */
  extractKeywords(parsedSections) {
    const keywords = new Set();
    
    if (parsedSections.descriptiveTerms) {
      parsedSections.descriptiveTerms.forEach(term => keywords.add(term.toLowerCase()));
    }
    
    const categoryText = parsedSections.category || '';
    const categoryKeywords = categoryText
      .match(/\[([^\]]+)\]/g)?.[0]
      ?.replace(/[\[\]]/g, '')
      .split(',')
      .map(k => k.trim().toLowerCase()) || [];
    
    categoryKeywords.forEach(k => keywords.add(k));
    
    const materialKeywords = this.extractMaterialKeywords(parsedSections.materials);
    materialKeywords.forEach(k => keywords.add(k));
    
    const functionKeywords = this.extractFunctionKeywords(parsedSections.purpose);
    functionKeywords.forEach(k => keywords.add(k));
    
    return Array.from(keywords);
  }
  
  extractDescriptiveTerms(categoryText) {
    if (!categoryText) return [];
    
    const match = categoryText.match(/\[([^\]]+)\]/);
    if (match) {
      return match[1]
        .split(',')
        .map(term => term.trim())
        .filter(term => term.length > 0);
    }
    
    return [];
  }
  
  extractMaterialKeywords(materialsText) {
    if (!materialsText) return [];
    
    const commonMaterials = [
      'silver', 'gold', 'brass', 'copper', 'bronze', 'iron', 'steel',
      'wood', 'oak', 'mahogany', 'walnut', 'pine',
      'ceramic', 'porcelain', 'pottery', 'earthenware',
      'glass', 'crystal',
      'fabric', 'silk', 'cotton', 'wool', 'linen',
      'leather', 'suede',
      'plastic', 'bakelite',
      'stone', 'marble', 'granite'
    ];
    
    const found = [];
    const lowerText = materialsText.toLowerCase();
    
    for (const material of commonMaterials) {
      if (lowerText.includes(material)) {
        found.push(material);
      }
    }
    
    return found;
  }
  
  extractFunctionKeywords(purposeText) {
    if (!purposeText) return [];
    
    const commonFunctions = [
      'container', 'storage', 'holder',
      'tool', 'implement', 'utensil',
      'decoration', 'ornament', 'display',
      'furniture', 'seating', 'table',
      'jewelry', 'accessory', 'adornment',
      'lighting', 'lamp', 'candle',
      'vessel', 'bowl', 'vase',
      'toy', 'game', 'plaything'
    ];
    
    const found = [];
    const lowerText = purposeText.toLowerCase();
    
    for (const func of commonFunctions) {
      if (lowerText.includes(func)) {
        found.push(func);
      }
    }
    
    return found;
  }
  
  /**
   * Calculate confidence scores for key conclusions
   */
  calculateConfidence(parsedSections) {
    const confidenceText = parsedSections.confidence || '';
    
    const scores = {
      materials: this.extractConfidenceScore(confidenceText, 'materials'),
      dating: this.extractConfidenceScore(confidenceText, 'dating'),
      origin: this.extractConfidenceScore(confidenceText, 'origin'),
      purpose: this.extractConfidenceScore(confidenceText, 'purpose'),
      category: this.extractConfidenceScore(confidenceText, 'category'),
      overall: 0
    };
    
    const validScores = Object.values(scores).filter(s => s > 0);
    scores.overall = validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 50;
    
    return scores;
  }
  
  extractConfidenceScore(text, category) {
    const pattern = new RegExp(`${category}[^:]*:\\s*(\\d+)%`, 'i');
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
  }
  
  /**
   * Estimate tokens used
   */
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Estimate cost based on providers used
   */
  estimateCost(providers) {
    const costs = {
      gemini: 0.00002,
      openai: 0.01,
      anthropic: 0.003,
      perplexity: 0.001
    };
    
    const tokensPerAnalysis = 3000;
    
    let total = 0;
    for (const provider of providers) {
      if (costs[provider]) {
        total += (costs[provider] * tokensPerAnalysis / 1000);
      }
    }
    
    return parseFloat(total.toFixed(4));
  }
  
  /**
   * Generate unique analysis ID
   */
  generateAnalysisId() {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Update progress (for UI feedback)
   */
  updateProgress(percent, message) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('analysisProgress', {
        detail: { percent, message }
      }));
    }
  }
  
  /**
   * Get analysis history
   */
  getHistory() {
    return this.analysisHistory;
  }
  
  /**
   * Clear analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
  }
}

// Export for use in application
window.UniversalAnalyzer = UniversalAnalyzer;
```

---

## 6. Image Processing Pipeline

### Overview
Handles image upload, validation, compression, and optimization for AI analysis while preserving quality for user preview.

### Complete Implementation

```javascript
/**
 * tapestrAI - Image Processor
 * Handles image upload and compression
 */

class ImageProcessor {
  constructor() {
    this.settings = {
      maxDimension: 2048,
      quality: 0.85,
      format: 'image/jpeg',
      maxSizeBytes: 5_000_000
    };
    
    this.supportedFormats = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
  }
  
  /**
   * Process uploaded image file
   */
  async processUpload(file) {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    const originalDataUrl = await this.readFileAsDataURL(file);
    const compressedDataUrl = await this.compressImage(originalDataUrl);
    
    const originalSize = this.calculateSize(originalDataUrl);
    const compressedSize = this.calculateSize(compressedDataUrl);
    
    return {
      original: {
        dataUrl: originalDataUrl,
        size: originalSize,
        dimensions: await this.getImageDimensions(originalDataUrl)
      },
      compressed: {
        dataUrl: compressedDataUrl,
        size: compressedSize,
        dimensions: await this.getImageDimensions(compressedDataUrl)
      },
      compressionRatio: (1 - (compressedSize / originalSize)) * 100,
      savings: originalSize - compressedSize
    };
  }
  
  /**
   * Validate file before processing
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }
    
    if (!this.supportedFormats.includes(file.type.toLowerCase())) {
      return { 
        valid: false, 
        error: `Unsupported format: ${file.type}. Supported: JPEG, PNG, WebP` 
      };
    }
    
    const maxUploadSize = 50_000_000;
    if (file.size > maxUploadSize) {
      return { 
        valid: false, 
        error: `File too large: ${(file.size / 1_000_000).toFixed(1)}MB (max 50MB)` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Read file as base64 data URL
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Compress image for AI analysis
   */
  async compressImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = this.calculateTargetDimensions(
          img.width,
          img.height,
          this.settings.maxDimension
        );
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL(
          this.settings.format,
          this.settings.quality
        );
        
        const size = this.calculateSize(compressed);
        if (size > this.settings.maxSizeBytes) {
          const reducedQuality = this.settings.quality * 0.7;
          const furtherCompressed = canvas.toDataURL(
            this.settings.format,
            reducedQuality
          );
          resolve(furtherCompressed);
        } else {
          resolve(compressed);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }
  
  /**
   * Calculate target dimensions maintaining aspect ratio
   */
  calculateTargetDimensions(width, height, maxDimension) {
    if (width <= maxDimension && height <= maxDimension) {
      return { width, height };
    }
    
    const ratio = width / height;
    
    if (width > height) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / ratio)
      };
    } else {
      return {
        width: Math.round(maxDimension * ratio),
        height: maxDimension
      };
    }
  }
  
  /**
   * Get image dimensions from data URL
   */
  getImageDimensions(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = dataUrl;
    });
  }
  
  /**
   * Calculate size in bytes from data URL
   */
  calculateSize(dataUrl) {
    const base64Length = dataUrl.split(',')[1].length;
    return Math.ceil(base64Length * 0.75);
  }
  
  /**
   * Format size for display
   */
  formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

window.ImageProcessor = ImageProcessor;
```

---

## 7. Progress & Loading UI

### Complete Implementation

```javascript
/**
 * tapestrAI - Progress Manager
 * Manages loading states and progress tracking
 */

class ProgressManager {
  constructor() {
    this.currentProcess = null;
    this.steps = [];
    this.currentStep = 0;
    this.startTime = null;
  }
  
  /**
   * Start a new progress-tracked process
   */
  start(processName, steps) {
    this.currentProcess = processName;
    this.steps = steps;
    this.currentStep = 0;
    this.startTime = Date.now();
    
    this.showProgressModal();
    this.updateUI();
  }
  
  /**
   * Update to next step
   */
  nextStep(message) {
    this.currentStep++;
    if (this.currentStep <= this.steps.length) {
      this.updateUI(message);
    }
  }
  
  /**
   * Update progress within current step
   */
  updateProgress(percent, message) {
    this.updateUI(message, percent);
  }
  
  /**
   * Complete the process
   */
  complete(successMessage) {
    this.currentStep = this.steps.length;
    this.updateUI(successMessage, 100);
    
    setTimeout(() => {
      this.hideProgressModal();
    }, 1500);
  }
  
  /**
   * Handle error
   */
  error(errorMessage) {
    this.showError(errorMessage);
    this.hideProgressModal();
  }
  
  /**
   * Show progress modal
   */
  showProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (!modal) {
      this.createProgressModal();
    }
    
    document.getElementById('progress-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Hide progress modal
   */
  hideProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
    document.body.style.overflow = '';
    
    this.currentProcess = null;
    this.steps = [];
    this.currentStep = 0;
    this.startTime = null;
  }
  
  /**
   * Update UI elements
   */
  updateUI(message, percentOverride) {
    const percent = percentOverride !== undefined 
      ? percentOverride 
      : Math.round((this.currentStep / this.steps.length) * 100);
    
    const progressBar = document.getElementById('progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    
    const percentText = document.getElementById('progress-percent');
    if (percentText) {
      percentText.textContent = `${percent}%`;
    }
    
    const statusMessage = document.getElementById('progress-message');
    if (statusMessage) {
      statusMessage.textContent = message || this.getCurrentStepMessage();
    }
    
    this.updateStepIndicators();
    this.updateElapsedTime();
  }
  
  /**
   * Get message for current step
   */
  getCurrentStepMessage() {
    if (this.currentStep === 0) return 'Initializing...';
    if (this.currentStep <= this.steps.length) {
      return this.steps[this.currentStep - 1];
    }
    return 'Complete!';
  }
  
  /**
   * Update visual step indicators
   */
  updateStepIndicators() {
    const container = document.getElementById('step-indicators');
    if (!container) return;
    
    container.innerHTML = this.steps.map((step, index) => {
      const status = index < this.currentStep ? 'complete' :
                     index === this.currentStep ? 'active' : 'pending';
      
      return `
        <div class="step-indicator ${status}">
          <div class="step-icon">
            ${status === 'complete' ? '✓' : 
              status === 'active' ? '⟳' : 
              (index + 1)}
          </div>
          <div class="step-label">${step}</div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Update elapsed time display
   */
  updateElapsedTime() {
    if (!this.startTime) return;
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const timeElement = document.getElementById('elapsed-time');
    
    if (timeElement) {
      timeElement.textContent = `${elapsed}s`;
    }
  }
  
  /**
   * Create progress modal HTML
   */
  createProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'progress-modal';
    modal.className = 'modal progress-modal hidden';
    
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="progress-header">
          <h3>Analyzing Your Artifact</h3>
          <div class="elapsed-time">
            <span id="elapsed-time">0s</span> elapsed
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div id="progress-bar-fill" class="progress-bar-fill"></div>
          </div>
          <div id="progress-percent" class="progress-percent">0%</div>
        </div>
        
        <div id="progress-message" class="progress-message">
          Initializing...
        </div>
        
        <div id="step-indicators" class="step-indicators"></div>
        
        <div class="progress-animation">
          <div class="spinner"></div>
        </div>
        
        <div class="progress-tip">
          💡 <span id="progress-tip">This usually takes 30-60 seconds</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  /**
   * Show error message
   */
  showError(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h3>Analysis Failed</h3>
        <p>${message}</p>
        <button onclick="this.closest('.error-modal').remove()" class="btn-primary">
          OK
        </button>
      </div>
    `;
    
    document.body.appendChild(errorModal);
    setTimeout(() => errorModal.remove(), 10000);
  }
}

window.ProgressManager = ProgressManager;
```

---

## 8. Cost Tracking System

### Complete Implementation

```javascript
/**
 * tapestrAI - Cost Tracker
 * Tracks API usage and estimates costs
 */

class CostTracker {
  constructor() {
    this.history = this.loadHistory();
    this.currentMonth = this.getCurrentMonth();
    
    this.rates = {
      gemini: 0.00002,
      openai: 0.01,
      anthropic: 0.003,
      perplexity: 0.001
    };
  }
  
  /**
   * Record an analysis
   */
  recordAnalysis(analysisData) {
    const record = {
      id: analysisData.id,
      timestamp: Date.now(),
      providers: analysisData.agentsUsed || ['gemini'],
      tokensUsed: analysisData.tokensUsed || 0,
      estimatedCost: analysisData.costEstimate || 0,
      category: analysisData.categoryHints || 'unknown',
      success: analysisData.success !== false
    };
    
    this.history.push(record);
    this.saveHistory();
    this.updateDashboard();
    
    return record;
  }
  
  /**
   * Get statistics for current month
   */
  getMonthlyStats() {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthData = this.history.filter(record => 
      record.timestamp >= monthStart.getTime()
    );
    
    return {
      totalAnalyses: monthData.length,
      totalTokens: monthData.reduce((sum, r) => sum + r.tokensUsed, 0),
      totalCost: monthData.reduce((sum, r) => sum + r.estimatedCost, 0),
      byProvider: this.aggregateByProvider(monthData),
      byCategory: this.aggregateByCategory(monthData),
      averageCostPerAnalysis: monthData.length > 0
        ? monthData.reduce((sum, r) => sum + r.estimatedCost, 0) / monthData.length
        : 0,
      successRate: monthData.length > 0
        ? (monthData.filter(r => r.success).length / monthData.length) * 100
        : 0
    };
  }
  
  /**
   * Aggregate data by provider
   */
  aggregateByProvider(records) {
    const byProvider = {};
    
    records.forEach(record => {
      record.providers.forEach(provider => {
        if (!byProvider[provider]) {
          byProvider[provider] = { count: 0, tokens: 0, cost: 0 };
        }
        
        byProvider[provider].count++;
        byProvider[provider].tokens += record.tokensUsed;
        byProvider[provider].cost += record.estimatedCost;
      });
    });
    
    return byProvider;
  }
  
  /**
   * Aggregate data by category
   */
  aggregateByCategory(records) {
    const byCategory = {};
    
    records.forEach(record => {
      const cat = record.category || 'unknown';
      
      if (!byCategory[cat]) {
        byCategory[cat] = { count: 0, totalCost: 0 };
      }
      
      byCategory[cat].count++;
      byCategory[cat].totalCost += record.estimatedCost;
    });
    
    return byCategory;
  }
  
  /**
   * Update dashboard UI
   */
  updateDashboard() {
    const dashboard = document.getElementById('cost-dashboard');
    if (!dashboard || dashboard.classList.contains('hidden')) return;
    
    const monthlyStats = this.getMonthlyStats();
    
    document.getElementById('monthly-analyses').textContent = monthlyStats.totalAnalyses;
    document.getElementById('monthly-cost').textContent = `$${monthlyStats.totalCost.toFixed(4)}`;
    document.getElementById('avg-cost').textContent = `$${monthlyStats.averageCostPerAnalysis.toFixed(4)}`;
    document.getElementById('success-rate').textContent = `${monthlyStats.successRate.toFixed(1)}%`;
  }
  
  /**
   * Load history from localStorage
   */
  loadHistory() {
    try {
      const stored = localStorage.getItem('tapestrAI_cost_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  /**
   * Save history to localStorage
   */
  saveHistory() {
    try {
      localStorage.setItem('tapestrAI_cost_history', JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save cost history:', error);
    }
  }
  
  /**
   * Get current month identifier
   */
  getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  
  /**
   * Export history as CSV
   */
  exportHistory() {
    const csv = [
      ['Date', 'Providers', 'Tokens', 'Cost', 'Category', 'Success'].join(','),
      ...this.history.map(record => [
        new Date(record.timestamp).toISOString(),
        record.providers.join(';'),
        record.tokensUsed,
        record.estimatedCost,
        record.category,
        record.success
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestrAI_costs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

window.CostTracker = new CostTracker();
```

---

## 9. Error Handling & Recovery

### Complete Implementation

```javascript
/**
 * tapestrAI - Error Handler
 * Centralized error handling with user-friendly messages
 */

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.setupGlobalErrorHandling();
  }
  
  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handle(event.reason, 'Unhandled Promise Rejection');
      event.preventDefault();
    });
    
    window.addEventListener('error', (event) => {
      this.handle(event.error, 'Global Error');
      event.preventDefault();
    });
  }
  
  /**
   * Main error handling method
   */
  handle(error, context = '') {
    const errorInfo = this.classifyError(error);
    this.logError(error, context, errorInfo);
    this.showErrorToUser(errorInfo);
    
    if (errorInfo.recoverable) {
      this.suggestRecovery(errorInfo);
    }
    
    return errorInfo;
  }
  
  /**
   * Classify error type
   */
  classifyError(error) {
    const message = error?.message || String(error);
    
    // API key errors
    if (message.includes('API key') || message.includes('unauthorized')) {
      return {
        type: 'API_KEY_ERROR',
        title: 'API Key Issue',
        userMessage: 'There\'s a problem with your API key',
        technicalMessage: message,
        recoverable: true,
        recovery: [
          'Check that your API key is entered correctly',
          'Verify your API key hasn\'t expired',
          'Test your API key using the Test button',
          'Try removing and re-adding the API key'
        ]
      };
    }
    
    // Network errors
    if (message.includes('fetch') || message.includes('network')) {
      return {
        type: 'NETWORK_ERROR',
        title: 'Connection Problem',
        userMessage: 'Unable to connect to the AI service',
        technicalMessage: message,
        recoverable: true,
        recovery: [
          'Check your internet connection',
          'Try again in a few moments',
          'Check if the API service is experiencing issues'
        ]
      };
    }
    
    // Image errors
    if (message.includes('image')) {
      return {
        type: 'IMAGE_ERROR',
        title: 'Image Problem',
        userMessage: 'There\'s an issue with the uploaded image',
        technicalMessage: message,
        recoverable: true,
        recovery: [
          'Try uploading a different image',
          'Ensure image is in JPEG, PNG, or WebP format',
          'Try a smaller image (under 20MB)'
        ]
      };
    }
    
    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return {
        type: 'RATE_LIMIT_ERROR',
        title: 'Rate Limit Reached',
        userMessage: 'You\'ve hit the API rate limit',
        technicalMessage: message,
        recoverable: true,
        recovery: [
          'Wait a few minutes before trying again',
          'Check your API provider\'s rate limits',
          'Consider upgrading your API plan'
        ]
      };
    }
    
    // Default unknown error
    return {
      type: 'UNKNOWN_ERROR',
      title: 'Unexpected Error',
      userMessage: 'Something unexpected happened',
      technicalMessage: message,
      recoverable: true,
      recovery: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Try again in a few minutes'
      ]
    };
  }
  
  /**
   * Log error for debugging
   */
  logError(error, context, errorInfo) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      context: context,
      type: errorInfo.type,
      message: errorInfo.technicalMessage,
      stack: error?.stack,
      userAgent: navigator.userAgent
    };
    
    this.errorLog.push(logEntry);
    
    if (this.errorLog.length > 50) {
      this.errorLog = this.errorLog.slice(-50);
    }
    
    try {
      localStorage.setItem('tapestrAI_error_log', JSON.stringify(this.errorLog));
    } catch {}
    
    console.error('[tapestrAI Error]', logEntry);
  }
  
  /**
   * Show error to user
   */
  showErrorToUser(errorInfo) {
    const existing = document.getElementById('error-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'error-notification';
    notification.className = 'error-notification';
    
    notification.innerHTML = `
      <div class="error-content">
        <div class="error-header">
          <span class="error-icon">⚠️</span>
          <h3>${errorInfo.title}</h3>
          <button class="error-close" onclick="this.closest('.error-notification').remove()">×</button>
        </div>
        
        <p class="error-message">${errorInfo.userMessage}</p>
        
        ${errorInfo.recoverable ? `
          <div class="error-recovery">
            <strong>What you can try:</strong>
            <ul>
              ${errorInfo.recovery.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <details class="error-technical">
          <summary>Technical Details</summary>
          <pre>${errorInfo.technicalMessage}</pre>
        </details>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    if (errorInfo.recoverable) {
      setTimeout(() => notification.remove(), 30000);
    }
  }
  
  /**
   * Export error log
   */
  exportErrorLog() {
    const json = JSON.stringify(this.errorLog, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestrAI_errors_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

window.errorHandler = new ErrorHandler();
```

---

## 10. BugX Integration

### Overview
BugX validation is integrated at key checkpoints to prevent expensive errors before they happen.

### Key Integration Points

```javascript
/**
 * BugX integration points in tapestrAI
 */

// 1. Before Analysis (Phase 0)
async function startAnalysis(imageData, userContext) {
  // BugX Phase 0 validation
  const preCheck = TapestrAIBugX.preAnalysisCheck(
    imageData,
    apiKeyManager.keys,
    userContext
  );
  
  if (!preCheck.passed) {
    errorHandler.handle(new Error(preCheck.failures.join(', ')));
    return;
  }
  
  // Proceed with analysis...
}

// 2. Before Multi-Agent (Level 1)
async function deployMultipleAgents(agents, analysisData) {
  const agentCheck = TapestrAIBugX.multiAgentCheck(agents, analysisData);
  
  if (!agentCheck.passed) {
    console.warn('Multi-agent check failed, using single agent');
    return await singleAgentAnalysis(analysisData);
  }
  
  // Proceed with multi-agent...
}

// 3. Before Export (Level 4 - Part 2)
async function exportResults(format, content) {
  const exportCheck = TapestrAIBugX.exportValidationCheck(
    format,
    content,
    compressionSettings
  );
  
  if (!exportCheck.passed) {
    errorHandler.handle(new Error('Export validation failed'));
    return;
  }
  
  // Proceed with export...
}
```

### BugX Test Integration

Your existing test files work perfectly:
- `tests/bugx-framework.js` - Test framework
- `tests/bugx-api-key-tests.js` - API key tests (45 tests)
- `tests/bugx-state-tests.js` - State tests (45 tests)

Add new test file for analysis:

```javascript
// tests/bugx-analysis-tests.js
const framework = new BugXFramework('Analysis Tests');
const assert = framework.assert;

framework.suite('Universal Analyzer', () => {
  
  framework.test('validates input', () => {
    const analyzer = new UniversalAnalyzer(apiKeyManager);
    
    const result = analyzer.validateInput(null, '');
    assert.isFalse(result.valid, 'Should reject null image');
  });
  
  framework.test('extracts keywords', () => {
    const analyzer = new UniversalAnalyzer(apiKeyManager);
    
    const mockParsed = {
      materials: 'silver, brass',
      category: '[jewelry, box]'
    };
    
    const keywords = analyzer.extractKeywords(mockParsed);
    assert.contains(keywords, 'silver');
    assert.contains(keywords, 'jewelry');
  });
});

framework.runAll();
```

---

## 11. Implementation Checklist

### Pre-Development

```
□ Development environment setup
□ Project folder created
□ API keys obtained (at least Gemini)
□ Basic HTML structure created
```

### Week 1: Foundation

**Days 1-2: Setup**
```
□ index.html created
□ CSS files setup
□ File structure organized
□ Tailwind CSS added
```

**Days 3-4: API Key Manager**
```
□ apiKeyManager.js created
□ Encryption working
□ UI components added
□ Test buttons functional
□ Status indicators working
```

**Days 5-6: Testing**
```
□ Can add Gemini key
□ Can test API connection
□ Keys persist after refresh
□ Eyeball toggles work
```

**Day 7: Documentation**
```
□ Getting started guide written
□ API key instructions complete
□ Code comments added
```

✅ **Week 1 Checkpoint:** Users can successfully add and test API keys

### Week 2: Core Analysis

**Days 8-9: Universal Analyzer**
```
□ universalAnalyzer.js created
□ Analysis prompt complete
□ Gemini API integration working
□ Response parsing implemented
```

**Days 10-11: Image Upload**
```
□ imageProcessor.js created
□ File upload UI complete
□ Drag & drop working
□ Compression functional
```

**Days 12-13: Analysis Flow**
```
□ Upload → Analyze pipeline working
□ Progress indicators showing
□ Results displaying
□ Keywords extracting
```

**Day 14: Testing**
```
□ 10+ different items analyzed
□ Output quality verified
□ Cost tracking accurate
```

✅ **Week 2 Checkpoint:** Single-agent analysis working end-to-end

### Week 3: Multi-Agent

**Days 15-16: Orchestration**
```
□ agentOrchestrator.js created
□ Parallel execution working
□ Result aggregation functional
```

**Days 17-18: Additional Agents**
```
□ OpenAI integration complete
□ Anthropic integration complete
□ Perplexity integration complete
```

**Days 19-20: Synthesis**
```
□ Multi-agent results combining
□ Conflict resolution working
□ Unified narrative generated
```

**Day 21: Testing**
```
□ Tested with 1, 2, 3, 4 agents
□ Quality improvement verified
□ Cost scaling acceptable
```

✅ **Week 3 Checkpoint:** Multi-agent system producing better results

### Week 4: Polish

**Days 22-23: Image Processing**
```
□ High-res uploads supported
□ Automatic compression working
□ Size optimization confirmed
```

**Days 24-25: UX Polish**
```
□ progressUI.js complete
□ Loading states clear
□ Error messages helpful
□ Help documentation complete
```

**Days 26-27: Cost Tracking**
```
□ costTracker.js complete
□ Dashboard functional
□ CSV export working
```

**Day 28: Launch Prep**
```
□ Final testing complete
□ Documentation reviewed
□ Ready for beta users
```

✅ **Week 4 Checkpoint:** Production-ready Phase 1

---

## 12. Testing Strategy

### BugX Test Framework

You already have:
- ✅ `bugx-framework.js` (90+ test capability)
- ✅ `bugx-api-key-tests.js` (45 tests)
- ✅ `bugx-state-tests.js` (45 tests)

Add:
- `bugx-analysis-tests.js` (25 tests for analysis pipeline)
- `bugx-image-tests.js` (20 tests for image processing)

### Manual Testing Checklist

```
API Key Management:
□ Add valid Gemini key → Success
□ Add invalid key → Error shown
□ Test button updates status
□ Eyeball toggle works
□ Keys persist after refresh
□ Can add optional keys
□ Can remove optional keys

Image Upload:
□ Drag and drop works
□ Click to browse works
□ Invalid file rejected
□ Large file compresses
□ Preview displays
□ Compression info accurate

Analysis:
□ Single agent completes
□ Multi-agent completes
□ Progress shown
□ Results display
□ Keywords extracted
□ Confidence scores shown

Cost Tracking:
□ Analysis recorded
□ Cost calculated
□ Dashboard updates
□ CSV export works

Error Handling:
□ Network error handled
□ API error handled
□ Image error handled
□ Rate limit handled
```

### Test Artifacts

Test with diverse items:
- Jewelry with hallmarks
- Furniture with maker's mark
- Glassware
- Books
- Tools
- Textiles
- Mystery items

---

## 13. Success Metrics & Part 2 Triggers

### Required Metrics (Must Pass All)

```
□ Technical Stability
  ✓ API success rate: >95%
  ✓ Zero critical bugs for 7 days
  ✓ Console errors: 0
  ✓ Analysis time: <60s (single), <120s (multi)

□ User Testing
  ✓ 5+ users tested
  ✓ 20+ analyses completed
  ✓ Success rate: >90%
  ✓ Setup without help: >80%

□ Quality
  ✓ Image compression: 100%
  ✓ API key encryption: 100%
  ✓ Cost tracking: 100%
  ✓ BugX preventing errors: >80%

□ Coverage
  ✓ 10+ artifact types analyzed
  ✓ All 4 APIs tested (if available)
  ✓ Mobile and desktop tested
  ✓ 3+ browsers tested
```

### Ready for Part 2 Checklist

**DO NOT START PART 2 until ALL checked:**

```
□ Phase 1 Complete
  ✓ All files created and working
  ✓ API key system functional
  ✓ Image processing reliable
  ✓ Universal analyzer producing output
  ✓ Multi-agent working (if keys added)
  ✓ Progress UI clear
  ✓ Cost tracking accurate
  ✓ Error handling comprehensive
  ✓ BugX integrated
  ✓ Documentation complete

□ Testing Complete
  ✓ BugX tests passing (90+)
  ✓ Manual testing done
  ✓ 10+ artifacts analyzed
  ✓ Beta testing complete
  ✓ Browser compatibility verified

□ User Validation
  ✓ 5+ users successful
  ✓ Feedback collected
  ✓ Critical issues addressed
  ✓ Users operate independently

□ Stability Proven
  ✓ 7 days bug-free
  ✓ Error rate <5%
  ✓ Costs accurate
  ✓ Data persists
```

### Decision Matrix

| Metric | Target | Status | Ready? |
|--------|--------|--------|--------|
| Total analyses | 20+ | ___ | ☐ |
| Unique users | 5+ | ___ | ☐ |
| Success rate | >90% | ___% | ☐ |
| API success | >95% | ___% | ☐ |
| Days bug-free | 7+ | ___ | ☐ |
| Tests passing | 90+ | ___ | ☐ |
| Documentation | 100% | ___% | ☐ |
| Browser compat | 3+ | ___ | ☐ |
| Mobile tested | Yes | ___ | ☐ |
| Cost tracking | Yes | ___ | ☐ |

**If ANY unchecked: Do more Part 1 work**

---

## 🎯 PART 1 COMPLETE!

### What You've Built

✅ Complete API key management (4 providers)  
✅ Universal analysis engine  
✅ Image processing with compression  
✅ Multi-agent coordination  
✅ Progress tracking UI  
✅ Cost tracking system  
✅ Comprehensive error handling  
✅ BugX validation framework  
✅ 90+ tests  
✅ Complete documentation  

### Files Created

```
tapestrAI/
├── index.html
├── css/styles.css
├── js/
│   ├── main.js
│   ├── apiKeyManager.js
│   ├── universalAnalyzer.js
│   ├── imageProcessor.js
│   ├── agentOrchestrator.js
│   ├── progressUI.js
│   ├── costTracker.js
│   ├── errorHandler.js
│   └── bugx-tapestrAI.js
├── tests/
│   ├── bugx-framework.js
│   ├── bugx-api-key-tests.js
│   ├── bugx-state-tests.js
│   └── bugx-analysis-tests.js
└── docs/
    ├── getting-started.md
    ├── api-keys-guide.md
    └── troubleshooting.md
```

### Next Steps

**When ready for Part 2:**
> "Start tapestrAI Part 2 - Smart Category Routing"

Part 2 will add:
- 12 specialized category detectors
- Template system with adaptive narratives
- Export to PDF, Markdown, HTML
- Category-specific research prompts
- Advanced personalization

**Don't start Part 2 until Part 1 metrics are achieved!**

---

**End of Part 1 Complete Guide**

*This document contains everything needed to implement tapestrAI Phase 1 from start to finish.*

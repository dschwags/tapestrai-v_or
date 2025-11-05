/**
 * tapestrAI v3.1.0 - API Key Manager (with DeepSeek)
 * Manages API keys for 5 AI providers with encrypted storage
 * Last updated: 2025-10-31 00:28 EDT
 */

class APIKeyManager {
  constructor() {
    // Detect if we're using Cloudflare Worker proxy
    // This will be set to the Worker URL after deployment
    this.workerUrl = this.getWorkerUrl();
    this.useWorker = !!this.workerUrl;
    
    // Supported AI providers
    this.providers = {
      gemini: {
        name: 'Google Gemini',
        required: true,
        model: 'gemini-2.0-flash-exp',
        endpoint: this.useWorker ? `${this.workerUrl}/api/gemini` : 'https://generativelanguage.googleapis.com/v1beta/models',
        directEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
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
        endpoint: this.useWorker ? `${this.workerUrl}/api/openai` : 'https://api.openai.com/v1/chat/completions',
        directEndpoint: 'https://api.openai.com/v1/chat/completions',
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
        endpoint: this.useWorker ? `${this.workerUrl}/api/anthropic` : 'https://api.anthropic.com/v1/messages',
        directEndpoint: 'https://api.anthropic.com/v1/messages',
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
        endpoint: this.useWorker ? `${this.workerUrl}/api/perplexity` : 'https://api.perplexity.ai/chat/completions',
        directEndpoint: 'https://api.perplexity.ai/chat/completions',
        icon: '🔵',
        color: '#3B82F6',
        getKeyUrl: 'https://www.perplexity.ai/settings/api',
        instructions: 'Get API key from Perplexity Settings. Free tier: 5 requests/day.',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.001
      },
      
      deepseek: {
        name: 'DeepSeek',
        required: false,
        model: 'deepseek-chat', // V3 model
        endpoint: this.useWorker ? `${this.workerUrl}/api/deepseek` : 'https://api.deepseek.com/chat/completions',
        directEndpoint: 'https://api.deepseek.com/chat/completions',
        icon: '🔷',
        color: '#1E90FF',
        getKeyUrl: 'https://platform.deepseek.com/api_keys',
        instructions: 'Get free API key from DeepSeek Platform. 5M tokens/day free for 30 days! Ultra-low cost after: $0.14/1M input tokens.',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.00014 // Input cost - 100x cheaper than OpenAI!
      },
      
      openrouter: {
        name: 'OpenRouter',
        required: false,
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        icon: '🚀',
        color: '#10B981',
        getKeyUrl: 'https://openrouter.ai/keys',
        instructions: 'One key for 100+ AI models. Free tier: 10 requests/day. Works everywhere, no proxy needed!',
        testPrompt: 'Respond with just "success"',
        costPer1kTokens: 0.00002, // Using Gemini as default for cost estimate
        
        // Available models for different tasks
        models: {
          // Fast & Free (for quick analysis)
          'fast': 'google/gemini-flash-1.5',
          'budget': 'deepseek/deepseek-chat',
          
          // Balanced (for main analysis)
          'balanced': 'anthropic/claude-3.5-sonnet',
          'general': 'openai/gpt-4-turbo',
          
          // Specialized (for specific tasks)
          'vision': 'anthropic/claude-3-opus',
          'research': 'perplexity/llama-3.1-sonar-large-128k-online',
          'creative': 'anthropic/claude-3-opus',
          'technical': 'deepseek/deepseek-chat'
        }
      }
    };
    
    this.keys = {};
    this.status = {};
    
    this.loadKeys();
    // Don't call initializeUI here - let main.js handle initialization
  }
  
  /**
   * Get Worker URL from environment or config
   */
  getWorkerUrl() {
    // Check for Worker URL in various places
    // 1. Environment variable (if bundled)
    if (typeof WORKER_URL !== 'undefined') {
      return WORKER_URL;
    }
    
    // 2. Check if deployed on Cloudflare Pages (detect by hostname)
    if (window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('tapestrai')) {
      // Deployed on Cloudflare - use worker
      return 'https://tapestrai-worker.david-ec6.workers.dev';
    }
    
    // 3. Local development - no worker
    return null;
  }
  
  /**
   * Generate device-specific salt for encryption
   */
  getDeviceSalt() {
    let salt = localStorage.getItem('tapestrAI_device_salt');
    if (!salt) {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      localStorage.setItem('tapestrAI_device_salt', salt);
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
          this.status[provider] = 'active';
        } catch (error) {
          console.error(`Failed to decrypt ${provider} key:`, error);
          this.status[provider] = 'error';
        }
      } else {
        this.status[provider] = this.providers[provider].required ? 'missing' : 'missing';
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
      this.showNotification('error', 'API key appears invalid (too short)');
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
        
        // Show masked key in input field instead of clearing it
        const input = document.getElementById(`${provider}-key-input`);
        if (input) {
          input.value = this.maskKey(key.trim());
          input.setAttribute('data-masked', 'true');
          input.setAttribute('data-has-key', 'true');
        }
        
        this.updateAvailableFeatures();
        
        // Dispatch event for main.js to update UI
        window.dispatchEvent(new CustomEvent('apiKeyUpdated', { 
          detail: { provider, status: 'active' } 
        }));
        
        return true;
      } else {
        this.updateStatus(provider, 'invalid');
        this.showNotification('error', 'API key test failed. Please check the key and try again.');
        throw new Error('API key test failed');
      }
    } catch (error) {
      this.updateStatus(provider, 'error');
      this.showNotification('error', `Error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Test API key by making a minimal API call
   */
  async testKey(provider, key) {
    const config = this.providers[provider];
    
    console.log(`Testing ${provider} API key...`);
    
    try {
      let response;
      
      switch(provider) {
        case 'gemini':
          if (this.useWorker) {
            // Using Worker proxy
            response = await fetch(
              `${config.endpoint}?key=${key}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: config.model,
                  payload: {
                    contents: [{
                      parts: [{ text: config.testPrompt }]
                    }],
                    generationConfig: { maxOutputTokens: 10 }
                  }
                })
              }
            );
          } else {
            // Direct API call
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
          }
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
          
        case 'deepseek':
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
              model: config.models.fast, // Use free Gemini model for testing
              messages: [{ role: 'user', content: config.testPrompt }],
              max_tokens: 10
            })
          });
          break;
      }
      
      if (!response) {
        console.error(`No response received for ${provider}`);
        return false;
      }
      
      console.log(`${provider} response status:`, response.status);
      
      if (response.ok || response.status === 200) {
        console.log(`✓ ${provider} API key test successful`);
        this.showNotification('success', `✓ ${config.name} API key is valid!`);
        return true;
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.error(`API test failed for ${provider}:`, errorData);
      console.error(`Response status: ${response.status}, statusText: ${response.statusText}`);
      
      // Show more specific error message
      if (response.status === 401) {
        this.showNotification('error', 'Invalid API key - check your key and try again');
      } else if (response.status === 429) {
        this.showNotification('error', 'Rate limit exceeded - wait a moment and try again');
      } else {
        this.showNotification('error', `API error: ${response.statusText}`);
      }
      
      return false;
      
    } catch (error) {
      console.error(`API test error for ${provider}:`, error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Check for CORS error
      if (error.message.includes('CORS') || error.message.includes('fetch') || error.name === 'TypeError') {
        console.error(`⚠️ POSSIBLE CORS ERROR: ${provider} API may not allow direct browser requests`);
        this.showNotification('error', `CORS Error: ${config.name} cannot be accessed directly from browser. This is a known limitation.`);
      } else {
        this.showNotification('error', `Error: ${error.message}`);
      }
      
      return false;
    }
  }
  
  /**
   * Remove API key
   */
  removeKey(provider) {
    if (this.providers[provider].required) {
      this.showNotification('error', `Cannot remove required provider: ${provider}`);
      throw new Error(`Cannot remove required provider: ${provider}`);
    }
    
    localStorage.removeItem(`tapestrAI_key_${provider}`);
    delete this.keys[provider];
    this.updateStatus(provider, 'missing');
    
    // Clear input field
    const input = document.getElementById(`${provider}-key-input`);
    if (input) {
      input.value = '';
      input.removeAttribute('data-masked');
      input.removeAttribute('data-has-key');
      const config = this.providers[provider];
      input.placeholder = config.name === 'Google Gemini' ? 'AIza...' : 
                          config.name === 'OpenAI' ? 'sk-...' :
                          config.name === 'Anthropic Claude' ? 'sk-ant-...' :
                          config.name === 'Perplexity AI' ? 'pplx-...' :
                          config.name === 'DeepSeek' ? 'sk-...' :
                          config.name === 'OpenRouter' ? 'sk-or-v1-...' : '';
    }
    
    this.showNotification('info', 
      `${this.providers[provider].name} disconnected`);
    
    this.updateAvailableFeatures();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('apiKeyUpdated', { 
      detail: { provider, status: 'removed' } 
    }));
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
      0: { stars: '', name: 'Not Configured', description: 'Add Gemini or OpenRouter API key to begin' },
      1: { stars: '⭐', name: 'Basic Analysis', description: 'Single-agent material examination' },
      2: { stars: '⭐⭐', name: 'Enhanced Analysis', description: 'Cross-verified insights' },
      3: { stars: '⭐⭐⭐', name: 'Comprehensive Analysis', description: 'Multi-perspective research' },
      4: { stars: '⭐⭐⭐⭐', name: 'Professional Analysis', description: 'Expert-level synthesis' },
      5: { stars: '⭐⭐⭐⭐⭐', name: 'Elite Analysis', description: 'Full AI research team activated' },
      6: { stars: '⭐⭐⭐⭐⭐🎉', name: 'Ultimate Analysis', description: 'Complete AI arsenal with unified routing' }
    };
    
    return levels[count] || levels[0];
  }
  
  /**
   * Check if analysis can proceed (Gemini or OpenRouter key required)
   */
  canAnalyze() {
    return !!(this.keys.gemini || this.keys.openrouter);
  }
  
  /**
   * Get provider config
   */
  getProvider(provider) {
    return this.providers[provider];
  }
  
  /**
   * Get API key for provider
   */
  getKey(provider) {
    return this.keys[provider];
  }
  
  /**
   * Update status indicator for provider
   */
  updateStatus(provider, status) {
    this.status[provider] = status;
    
    // Update new status badge system
    if (typeof updateStatusBadge === 'function') {
      updateStatusBadge(provider, status);
    }
    
    // Legacy support for old status indicators
    const statusElement = document.getElementById(`${provider}-status`);
    if (statusElement) {
      statusElement.className = `status-indicator ${status}`;
      statusElement.setAttribute('data-status', status);
      statusElement.title = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    const testButton = document.getElementById(`${provider}-test-btn`);
    if (testButton) {
      testButton.disabled = (status === 'testing');
      if (status === 'testing') {
        testButton.classList.add('testing');
      } else {
        testButton.classList.remove('testing');
      }
    }
  }
  
  /**
   * Show notification to user
   */
  showNotification(type, message) {
    // Remove any existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
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
        <div class="agent-list mt-4">
          <h4 class="font-semibold mb-3 text-gray-800">Your AI Research Team:</h4>
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
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">💡 <strong>Tip:</strong> Add more AI agents for deeper, more comprehensive analysis</p>
        </div>
      ` : ''}
    `;
  }
  
  /**
   * Mask API key for display (show first 8 and last 4 characters)
   */
  maskKey(key) {
    if (!key || key.length < 12) return '••••••••••••';
    const start = key.substring(0, 8);
    const end = key.substring(key.length - 4);
    const middle = '•'.repeat(Math.max(12, key.length - 12));
    return `${start}${middle}${end}`;
  }
  
  /**
   * Handle input field focus - clear masked key to allow new entry
   */
  handleKeyInputFocus(provider) {
    const input = document.getElementById(`${provider}-key-input`);
    if (!input) return;
    
    const isMasked = input.getAttribute('data-masked') === 'true';
    if (isMasked) {
      input.value = '';
      input.removeAttribute('data-masked');
      input.placeholder = 'Enter new API key or leave blank to keep existing';
    }
  }
  
  /**
   * Handle input field blur - restore masked key if user didn't enter anything
   */
  handleKeyInputBlur(provider) {
    const input = document.getElementById(`${provider}-key-input`);
    if (!input) return;
    
    const hasKey = input.getAttribute('data-has-key') === 'true';
    if (hasKey && input.value.trim() === '') {
      // Restore masked key if user left field empty
      input.value = this.maskKey(this.keys[provider]);
      input.setAttribute('data-masked', 'true');
      const config = this.providers[provider];
      input.placeholder = config.name === 'Google Gemini' ? 'AIza...' : 
                          config.name === 'OpenAI' ? 'sk-...' :
                          config.name === 'Anthropic Claude' ? 'sk-ant-...' :
                          config.name === 'Perplexity AI' ? 'pplx-...' :
                          config.name === 'DeepSeek' ? 'sk-...' :
                          config.name === 'OpenRouter' ? 'sk-or-v1-...' : '';
    }
  }
  
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
        const error = await response.json().catch(() => ({}));
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
        cost: this.calculateOpenRouterCost(data.usage, data.model)
      };
      
    } catch (error) {
      console.error('OpenRouter analysis failed:', error);
      throw error;
    }
  }
  
  /**
   * Calculate cost for OpenRouter analysis
   */
  calculateOpenRouterCost(usage, model) {
    if (!usage) return 0;
    
    // Approximate costs (OpenRouter charges same as providers)
    const costs = {
      'google/gemini-2.0-flash-exp': { input: 0.00002, output: 0.00006 },
      'deepseek/deepseek-chat': { input: 0.00014, output: 0.00028 },
      'anthropic/claude-sonnet-4': { input: 0.003, output: 0.015 },
      'anthropic/claude-3-opus': { input: 0.015, output: 0.075 },
      'openai/gpt-4-turbo': { input: 0.01, output: 0.03 },
      'perplexity/sonar-pro': { input: 0.001, output: 0.001 }
    };
    
    const pricing = costs[model] || { input: 0.001, output: 0.002 };
    const inputCost = (usage.prompt_tokens / 1000) * pricing.input;
    const outputCost = (usage.completion_tokens / 1000) * pricing.output;
    
    return inputCost + outputCost;
  }
  
  /**
   * Initialize UI - call after DOM is loaded
   */
  initializeUI() {
    // Update status indicators for already loaded keys
    Object.keys(this.providers).forEach(provider => {
      if (this.keys[provider]) {
        this.updateStatus(provider, 'active');
        
        // Populate input field with masked key
        const input = document.getElementById(`${provider}-key-input`);
        if (input) {
          input.value = this.maskKey(this.keys[provider]);
          input.setAttribute('data-masked', 'true');
          input.setAttribute('data-has-key', 'true');
        }
      }
    });
    
    this.updateAvailableFeatures();
  }
}

// Create global instance (will be initialized in main.js)
window.APIKeyManager = APIKeyManager;

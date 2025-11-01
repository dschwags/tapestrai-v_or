/**
 * PuterAIProvider - Adapter class for integrating Puter.js AI API with tapestrAI
 * 
 * This class provides a unified interface compatible with the existing
 * UniversalAnalyzer, allowing Puter AI to work seamlessly with the
 * multi-agent orchestration system.
 */

class PuterAIProvider {
  constructor(puterIntegration) {
    if (!puterIntegration) {
      throw new Error('PuterIntegration instance required');
    }
    
    this.puter = puterIntegration;
    this.modelMap = this.initializeModelMap();
  }

  /**
   * Map tapestrAI model identifiers to Puter AI model names
   */
  initializeModelMap() {
    return {
      // Gemini models
      'gemini': 'gemini-2.0-flash-exp',
      'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
      'gemini-1.5-pro': 'gemini-pro',
      'gemini-pro': 'gemini-pro',
      
      // OpenAI models
      'openai': 'gpt-4o',
      'gpt-4o': 'gpt-4o',
      'gpt-4': 'gpt-4',
      'gpt-4-turbo': 'gpt-4-turbo',
      
      // Anthropic models
      'anthropic': 'claude-3.5-sonnet',
      'claude-3.5-sonnet': 'claude-3-5-sonnet',
      'claude-3-sonnet': 'claude-3-sonnet',
      'claude-3-opus': 'claude-3-opus',
      
      // DeepSeek (if supported by Puter)
      'deepseek': 'deepseek-chat',
      'deepseek-chat': 'deepseek-chat'
    };
  }

  /**
   * Analyze artifact using Puter AI
   * Compatible with UniversalAnalyzer.analyzeArtifact signature
   * 
   * @param {Array} images - Array of base64-encoded image data
   * @param {string} prompt - Analysis prompt
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeArtifact(images, prompt, options = {}) {
    try {
      // Check authentication
      if (!this.puter.isAuthenticated) {
        throw new Error('Not authenticated with Puter. Please sign in first.');
      }

      // Map model name
      const model = this.modelMap[options.model] || options.model || 'gpt-4o';

      console.log(`🤖 Analyzing with Puter AI (${model})...`);

      // Prepare image data for Puter
      const processedImages = images.map(img => {
        // Ensure proper data URI format
        if (!img.startsWith('data:')) {
          return `data:image/jpeg;base64,${img}`;
        }
        return img;
      });

      // Call Puter AI
      const response = await this.puter.callAI(prompt, processedImages, {
        model,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 4000
      });

      // Format response to match expected structure
      return {
        content: response.content,
        model: model,
        provider: this.getProviderFromModel(model),
        usage: response.usage || {},
        timestamp: new Date().toISOString(),
        source: 'puter'
      };

    } catch (error) {
      console.error('❌ Puter AI analysis failed:', error);
      throw new Error(`Puter AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Stream analysis (if Puter supports streaming)
   * Currently returns a non-streaming response
   */
  async analyzeArtifactStream(images, prompt, options = {}) {
    // For now, just call non-streaming version
    // TODO: Implement streaming if Puter supports it
    return await this.analyzeArtifact(images, prompt, options);
  }

  /**
   * Determine provider from model name
   */
  getProviderFromModel(model) {
    if (model.includes('gemini')) return 'Google';
    if (model.includes('gpt') || model.includes('openai')) return 'OpenAI';
    if (model.includes('claude')) return 'Anthropic';
    if (model.includes('deepseek')) return 'DeepSeek';
    return 'Unknown';
  }

  /**
   * Test Puter AI with a simple prompt
   */
  async testConnection(model = 'gpt-4o') {
    try {
      const puterModel = this.modelMap[model] || model;
      const result = await this.puter.testAI(puterModel);
      
      return {
        success: true,
        model: puterModel,
        response: result.content,
        message: 'Puter AI connection successful'
      };
    } catch (error) {
      return {
        success: false,
        model: model,
        error: error.message,
        message: 'Puter AI connection failed'
      };
    }
  }

  /**
   * Check if provider is ready to use
   */
  isReady() {
    return this.puter.isAuthenticated;
  }

  /**
   * Get current authentication status
   */
  getAuthStatus() {
    return this.puter.getAuthStatus();
  }

  /**
   * Get list of available models
   */
  async getAvailableModels() {
    try {
      const models = await this.puter.getAvailableModels();
      return models.map(m => ({
        ...m,
        enabled: true,
        source: 'puter'
      }));
    } catch (error) {
      console.error('Error getting available models:', error);
      return [];
    }
  }

  /**
   * Estimate cost for analysis
   * Note: Puter handles billing differently, so this is approximate
   */
  estimateCost(images, promptLength, model) {
    // Puter uses credit-based system
    // Return a placeholder estimate
    return {
      estimated: true,
      credits: Math.ceil(images.length * 0.1 + promptLength * 0.001),
      note: 'Puter uses a credit-based system. Actual cost may vary.'
    };
  }
}

/**
 * PuterAgentOrchestrator - Adapter for multi-agent analysis
 * 
 * This class extends the agent orchestration capabilities to work with Puter AI,
 * allowing all agents to run through Puter's unified API.
 */
class PuterAgentOrchestrator {
  constructor(puterProvider) {
    if (!puterProvider) {
      throw new Error('PuterAIProvider instance required');
    }
    
    this.provider = puterProvider;
    this.agents = this.initializeAgents();
  }

  /**
   * Initialize agent configurations for Puter
   */
  initializeAgents() {
    return {
      primary: {
        name: 'Material Analyst',
        model: 'gemini-2.0-flash-exp',
        role: 'primary',
        description: 'Physical examination and material analysis'
      },
      cultural: {
        name: 'Cultural Context Expert',
        model: 'gpt-4o',
        role: 'cultural',
        description: 'Historical and cultural significance'
      },
      synthesis: {
        name: 'Research Synthesizer',
        model: 'claude-3.5-sonnet',
        role: 'synthesis',
        description: 'Multi-perspective synthesis'
      },
      research: {
        name: 'Web Researcher',
        model: 'gpt-4o', // Can use Perplexity if Puter supports it
        role: 'research',
        description: 'Fact-checking and documentation'
      }
    };
  }

  /**
   * Run multi-agent analysis through Puter
   */
  async analyzeWithAgents(images, prompts, progressCallback = null) {
    try {
      if (!this.provider.isReady()) {
        throw new Error('Puter provider not ready. Please sign in first.');
      }

      const results = {};
      const totalAgents = Object.keys(prompts).length;
      let completed = 0;

      // Run each agent analysis
      for (const [agentKey, prompt] of Object.entries(prompts)) {
        if (progressCallback) {
          progressCallback({
            agent: agentKey,
            progress: (completed / totalAgents) * 100,
            status: 'analyzing'
          });
        }

        const agent = this.agents[agentKey];
        if (!agent) {
          console.warn(`Unknown agent: ${agentKey}`);
          continue;
        }

        try {
          const result = await this.provider.analyzeArtifact(images, prompt, {
            model: agent.model,
            temperature: 0.7
          });

          results[agentKey] = {
            ...result,
            agent: agent.name,
            role: agent.role
          };

          completed++;

          if (progressCallback) {
            progressCallback({
              agent: agentKey,
              progress: (completed / totalAgents) * 100,
              status: 'completed'
            });
          }

        } catch (error) {
          console.error(`Agent ${agentKey} failed:`, error);
          results[agentKey] = {
            error: error.message,
            agent: agent.name,
            role: agent.role
          };
          completed++;
        }
      }

      return {
        success: true,
        results,
        source: 'puter',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Multi-agent analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get agent configuration
   */
  getAgentConfig(agentKey) {
    return this.agents[agentKey];
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return this.agents;
  }
}

// Export for use in other modules
window.PuterAIProvider = PuterAIProvider;
window.PuterAgentOrchestrator = PuterAgentOrchestrator;

console.log('✅ PuterAIProvider and PuterAgentOrchestrator loaded');

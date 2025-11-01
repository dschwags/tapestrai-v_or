/**
 * Puter.js Integration for tapestrAI
 * Provides authentication and AI API access through Puter platform
 */

class PuterIntegration {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.authStatusCallbacks = [];
    this.initialized = false;
  }

  /**
   * Initialize Puter integration
   */
  async init() {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing Puter.js integration...');
      
      // Check if user is already authenticated
      if (window.puter && puter.auth) {
        const user = await puter.auth.getUser();
        if (user) {
          this.isAuthenticated = true;
          this.user = user;
          console.log('✅ User already authenticated:', user.username);
          this.notifyAuthStatusChange(true);
        } else {
          console.log('ℹ️  User not authenticated');
        }
      } else {
        console.warn('⚠️  Puter SDK not loaded');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('❌ Puter initialization failed:', error);
      throw error;
    }
  }

  /**
   * Sign in with Puter
   */
  async signIn() {
    try {
      console.log('🔐 Starting Puter sign-in...');
      
      if (!window.puter || !puter.auth) {
        throw new Error('Puter SDK not loaded');
      }

      // Trigger Puter authentication
      const user = await puter.auth.signIn();
      
      if (user) {
        this.isAuthenticated = true;
        this.user = user;
        console.log('✅ Signed in successfully:', user.username);
        this.notifyAuthStatusChange(true);
        return user;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('❌ Puter sign-in failed:', error);
      throw error;
    }
  }

  /**
   * Sign out from Puter
   */
  async signOut() {
    try {
      console.log('🚪 Signing out from Puter...');
      
      if (!window.puter || !puter.auth) {
        throw new Error('Puter SDK not loaded');
      }

      await puter.auth.signOut();
      
      this.isAuthenticated = false;
      this.user = null;
      console.log('✅ Signed out successfully');
      this.notifyAuthStatusChange(false);
    } catch (error) {
      console.error('❌ Puter sign-out failed:', error);
      throw error;
    }
  }

  /**
   * Get current authentication status
   */
  getAuthStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user
    };
  }

  /**
   * Register callback for authentication status changes
   */
  onAuthStatusChange(callback) {
    this.authStatusCallbacks.push(callback);
  }

  /**
   * Notify all listeners of auth status change
   */
  notifyAuthStatusChange(isAuthenticated) {
    this.authStatusCallbacks.forEach(callback => {
      try {
        callback(isAuthenticated, this.user);
      } catch (error) {
        console.error('Error in auth status callback:', error);
      }
    });
  }

  /**
   * Call AI model through Puter
   * @param {string} prompt - The prompt to send to the AI
   * @param {Array} images - Array of base64 image data
   * @param {Object} options - AI options (model, temperature, etc.)
   */
  async callAI(prompt, images = [], options = {}) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated. Please sign in with Puter first.');
      }

      if (!window.puter || !puter.ai) {
        throw new Error('Puter AI API not available');
      }

      console.log(`🤖 Calling Puter AI (${options.model || 'default'})...`);

      // Prepare messages with images if provided
      let messages = [{ role: 'user', content: prompt }];
      
      if (images && images.length > 0) {
        // Add images to the message
        const imageContent = images.map(img => ({
          type: 'image_url',
          image_url: { url: img }
        }));
        messages = [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...imageContent
          ]
        }];
      }

      // Call Puter AI API
      const response = await puter.ai.chat(messages, {
        model: options.model || 'gpt-4o',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000
      });

      console.log('✅ Puter AI response received');
      
      return {
        content: response.message?.content || response.content || '',
        model: options.model,
        usage: response.usage || {}
      };
    } catch (error) {
      console.error('❌ Puter AI call failed:', error);
      throw error;
    }
  }

  /**
   * Test Puter AI with a simple prompt
   */
  async testAI(model = 'gpt-4o') {
    try {
      console.log(`🧪 Testing Puter AI with ${model}...`);
      
      const response = await this.callAI(
        'Hello! Please respond with "Puter AI is working!" to confirm the integration.',
        [],
        { model }
      );
      
      console.log('✅ Test response:', response.content);
      return response;
    } catch (error) {
      console.error('❌ Puter AI test failed:', error);
      throw error;
    }
  }

  /**
   * Get list of available AI models
   */
  async getAvailableModels() {
    try {
      // This is a placeholder - Puter may have an API to list models
      // For now, return the known supported models
      return [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
        { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
        { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'Google' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' }
      ];
    } catch (error) {
      console.error('Error getting available models:', error);
      return [];
    }
  }

  /**
   * Save data to Puter cloud storage
   */
  async saveToCloud(filename, data) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated');
      }

      if (!window.puter || !puter.fs) {
        throw new Error('Puter FS API not available');
      }

      await puter.fs.write(filename, JSON.stringify(data));
      console.log(`✅ Saved ${filename} to Puter cloud`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save to cloud:', error);
      throw error;
    }
  }

  /**
   * Load data from Puter cloud storage
   */
  async loadFromCloud(filename) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated');
      }

      if (!window.puter || !puter.fs) {
        throw new Error('Puter FS API not available');
      }

      const data = await puter.fs.read(filename);
      console.log(`✅ Loaded ${filename} from Puter cloud`);
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Failed to load from cloud:', error);
      throw error;
    }
  }

  /**
   * Check if Puter SDK is available
   */
  static isPuterAvailable() {
    return typeof window !== 'undefined' && 
           window.puter !== undefined &&
           window.puter.auth !== undefined;
  }
}

// Export for use in other modules
window.PuterIntegration = PuterIntegration;

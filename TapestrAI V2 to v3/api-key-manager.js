/**
 * Global API Key Manager for tapestrAI
 * Manages API keys across all verticals using localStorage
 */

class APIKeyManager {
    constructor() {
        this.STORAGE_KEYS = {
            gemini: 'tapestrai_gemini_key',
            claude: 'tapestrai_claude_key',
            activeProvider: 'tapestrai_active_provider'
        };
    }

    /**
     * Get the active provider (gemini or claude)
     */
    getActiveProvider() {
        return localStorage.getItem(this.STORAGE_KEYS.activeProvider) || 'gemini';
    }

    /**
     * Set the active provider
     */
    setActiveProvider(provider) {
        if (provider !== 'gemini' && provider !== 'claude') {
            throw new Error('Invalid provider. Must be "gemini" or "claude"');
        }
        localStorage.setItem(this.STORAGE_KEYS.activeProvider, provider);
    }

    /**
     * Get API key for a specific provider
     */
    getKey(provider) {
        const key = provider === 'gemini' 
            ? this.STORAGE_KEYS.gemini 
            : this.STORAGE_KEYS.claude;
        return localStorage.getItem(key) || '';
    }

    /**
     * Set API key for a specific provider
     */
    setKey(provider, apiKey) {
        const key = provider === 'gemini' 
            ? this.STORAGE_KEYS.gemini 
            : this.STORAGE_KEYS.claude;
        
        if (apiKey && apiKey.trim()) {
            localStorage.setItem(key, apiKey.trim());
        } else {
            localStorage.removeItem(key);
        }
    }

    /**
     * Get the active API key (based on active provider)
     */
    getActiveKey() {
        const provider = this.getActiveProvider();
        return this.getKey(provider);
    }

    /**
     * Check if any API key is configured
     */
    hasAnyKey() {
        return this.getKey('gemini') || this.getKey('claude');
    }

    /**
     * Check if active provider has a key
     */
    hasActiveKey() {
        return !!this.getActiveKey();
    }

    /**
     * Get status object with all key information
     */
    getStatus() {
        return {
            hasGemini: !!this.getKey('gemini'),
            hasClaude: !!this.getKey('claude'),
            activeProvider: this.getActiveProvider(),
            hasActiveKey: this.hasActiveKey(),
            hasAnyKey: this.hasAnyKey()
        };
    }

    /**
     * Clear all API keys
     */
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEYS.gemini);
        localStorage.removeItem(this.STORAGE_KEYS.claude);
        localStorage.removeItem(this.STORAGE_KEYS.activeProvider);
    }

    /**
     * Show API key setup modal (to be implemented in the page)
     */
    showSetupModal() {
        const event = new CustomEvent('show-api-setup');
        window.dispatchEvent(event);
    }

    /**
     * Validate API key format (basic validation)
     */
    validateKeyFormat(provider, key) {
        if (!key || !key.trim()) {
            return { valid: false, message: 'API key cannot be empty' };
        }

        if (provider === 'gemini') {
            // Gemini keys typically start with "AIza"
            if (!key.startsWith('AIza')) {
                return { 
                    valid: false, 
                    message: 'Gemini API keys usually start with "AIza". Please verify your key.' 
                };
            }
        } else if (provider === 'claude') {
            // Claude keys typically start with "sk-ant-"
            if (!key.startsWith('sk-ant-')) {
                return { 
                    valid: false, 
                    message: 'Claude API keys usually start with "sk-ant-". Please verify your key.' 
                };
            }
        }

        return { valid: true, message: 'Key format looks good' };
    }
}

// Create global instance
window.apiKeyManager = new APIKeyManager();

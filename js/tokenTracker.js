/**
 * tapestrAI v3.2.0 - Token Tracker
 * Monitor API token usage and quotas
 */

class TokenTracker {
    constructor() {
        this.usage = {
            gemini: { used: 0, limit: null, remaining: null, resetDate: null },
            openai: { used: 0, limit: null, remaining: null, resetDate: null },
            anthropic: { used: 0, limit: null, remaining: null, resetDate: null },
            perplexity: { used: 0, limit: null, remaining: null, resetDate: null },
            deepseek: { used: 0, limit: null, remaining: null, resetDate: null }
        };
        
        this.loadFromStorage();
    }
    
    /**
     * Extract token usage from API response headers
     */
    parseResponseHeaders(provider, response) {
        if (!response.headers) return;
        
        try {
            // Common header patterns across different APIs
            const headers = {
                // OpenAI style
                'x-ratelimit-limit-tokens': response.headers.get('x-ratelimit-limit-tokens'),
                'x-ratelimit-remaining-tokens': response.headers.get('x-ratelimit-remaining-tokens'),
                'x-ratelimit-reset-tokens': response.headers.get('x-ratelimit-reset-tokens'),
                
                // Anthropic style
                'anthropic-ratelimit-tokens-limit': response.headers.get('anthropic-ratelimit-tokens-limit'),
                'anthropic-ratelimit-tokens-remaining': response.headers.get('anthropic-ratelimit-tokens-remaining'),
                'anthropic-ratelimit-tokens-reset': response.headers.get('anthropic-ratelimit-tokens-reset'),
                
                // Generic
                'x-quota-limit': response.headers.get('x-quota-limit'),
                'x-quota-remaining': response.headers.get('x-quota-remaining')
            };
            
            // Update based on available headers
            if (headers['x-ratelimit-limit-tokens']) {
                this.usage[provider].limit = parseInt(headers['x-ratelimit-limit-tokens']);
                this.usage[provider].remaining = parseInt(headers['x-ratelimit-remaining-tokens']);
                this.usage[provider].resetDate = headers['x-ratelimit-reset-tokens'];
            } else if (headers['anthropic-ratelimit-tokens-limit']) {
                this.usage[provider].limit = parseInt(headers['anthropic-ratelimit-tokens-limit']);
                this.usage[provider].remaining = parseInt(headers['anthropic-ratelimit-tokens-remaining']);
                this.usage[provider].resetDate = headers['anthropic-ratelimit-tokens-reset'];
            } else if (headers['x-quota-limit']) {
                this.usage[provider].limit = parseInt(headers['x-quota-limit']);
                this.usage[provider].remaining = parseInt(headers['x-quota-remaining']);
            }
            
            this.saveToStorage();
        } catch (error) {
            console.warn('Could not parse rate limit headers:', error);
        }
    }
    
    /**
     * Record token usage from response
     */
    recordUsage(provider, tokensUsed) {
        if (!this.usage[provider]) return;
        
        this.usage[provider].used += tokensUsed;
        
        // If we have remaining count, update it
        if (this.usage[provider].remaining !== null) {
            this.usage[provider].remaining = Math.max(0, this.usage[provider].remaining - tokensUsed);
        }
        
        this.saveToStorage();
        this.updateUI();
        this.checkWarnings(provider);
    }
    
    /**
     * Estimate tokens from text (rough approximation)
     */
    estimateTokens(text) {
        // Rough estimate: ~4 characters per token
        return Math.ceil(text.length / 4);
    }
    
    /**
     * Get usage percentage
     */
    getUsagePercentage(provider) {
        const data = this.usage[provider];
        if (!data.limit || data.limit === 0) return null;
        
        if (data.remaining !== null) {
            return ((data.limit - data.remaining) / data.limit) * 100;
        }
        
        return null;
    }
    
    /**
     * Get status for provider
     */
    getStatus(provider) {
        const percentage = this.getUsagePercentage(provider);
        const data = this.usage[provider];
        
        if (percentage === null) {
            return {
                level: 'unknown',
                color: '#9CA3AF',
                text: 'Unknown',
                icon: '❓'
            };
        }
        
        if (data.remaining === 0) {
            return {
                level: 'depleted',
                color: '#EF4444',
                text: 'Out of Tokens',
                icon: '🚫'
            };
        }
        
        if (percentage >= 90) {
            return {
                level: 'critical',
                color: '#F59E0B',
                text: `${Math.round(percentage)}% Used`,
                icon: '⚠️'
            };
        }
        
        if (percentage >= 70) {
            return {
                level: 'warning',
                color: '#FBBF24',
                text: `${Math.round(percentage)}% Used`,
                icon: '🔶'
            };
        }
        
        return {
            level: 'good',
            color: '#10B981',
            text: `${Math.round(100 - percentage)}% Available`,
            icon: '✓'
        };
    }
    
    /**
     * Format remaining tokens for display
     */
    formatRemaining(provider) {
        const data = this.usage[provider];
        
        if (data.remaining === null) {
            return 'Unknown';
        }
        
        if (data.remaining >= 1000000) {
            return `${(data.remaining / 1000000).toFixed(1)}M`;
        }
        
        if (data.remaining >= 1000) {
            return `${(data.remaining / 1000).toFixed(1)}K`;
        }
        
        return data.remaining.toString();
    }
    
    /**
     * Check and show warnings
     */
    checkWarnings(provider) {
        const status = this.getStatus(provider);
        
        if (status.level === 'depleted') {
            this.showNotification(
                'error',
                `${provider.toUpperCase()}: Out of tokens! Please check your quota or use a different API.`
            );
        } else if (status.level === 'critical') {
            this.showNotification(
                'warning',
                `${provider.toUpperCase()}: Running low on tokens (${status.text}). Consider switching APIs.`
            );
        }
    }
    
    /**
     * Update UI with token information
     */
    updateUI() {
        // Add token indicators to quick status
        if (window.updateQuickStatusWithActivity) {
            window.updateQuickStatusWithActivity();
        }
        
        // Update detailed view if visible
        this.updateDetailedView();
    }
    
    /**
     * Update detailed token view
     */
    updateDetailedView() {
        const container = document.getElementById('token-details-container');
        if (!container) return;
        
        const providers = ['gemini', 'openai', 'anthropic', 'perplexity', 'deepseek'];
        const html = providers.map(provider => {
            const data = this.usage[provider];
            const status = this.getStatus(provider);
            const remaining = this.formatRemaining(provider);
            
            return `
                <div class="token-detail-item">
                    <div class="flex items-center justify-between">
                        <span class="font-semibold">${provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
                        <span class="text-xs" style="color: ${status.color}">${status.icon} ${status.text}</span>
                    </div>
                    ${data.remaining !== null ? `
                        <div class="mt-1">
                            <div class="text-xs text-gray-600">Remaining: ${remaining} tokens</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="h-2 rounded-full transition-all duration-300" 
                                     style="width: ${100 - this.getUsagePercentage(provider)}%; background-color: ${status.color}">
                                </div>
                            </div>
                        </div>
                    ` : '<div class="text-xs text-gray-500 mt-1">No usage data available</div>'}
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * Show notification
     */
    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    /**
     * Save to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('tapestrAI_tokenUsage', JSON.stringify(this.usage));
        } catch (error) {
            console.warn('Could not save token usage to storage:', error);
        }
    }
    
    /**
     * Load from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('tapestrAI_tokenUsage');
            if (stored) {
                this.usage = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Could not load token usage from storage:', error);
        }
    }
    
    /**
     * Reset usage for a provider
     */
    resetProvider(provider) {
        if (this.usage[provider]) {
            this.usage[provider] = { used: 0, limit: null, remaining: null, resetDate: null };
            this.saveToStorage();
            this.updateUI();
        }
    }
    
    /**
     * Reset all usage data
     */
    resetAll() {
        Object.keys(this.usage).forEach(provider => {
            this.usage[provider] = { used: 0, limit: null, remaining: null, resetDate: null };
        });
        this.saveToStorage();
        this.updateUI();
    }
    
    /**
     * Get summary for display
     */
    getSummary() {
        const summary = {};
        Object.keys(this.usage).forEach(provider => {
            const status = this.getStatus(provider);
            const remaining = this.formatRemaining(provider);
            summary[provider] = {
                status: status.level,
                remaining: remaining,
                icon: status.icon,
                color: status.color
            };
        });
        return summary;
    }
}

// Initialize global token tracker
window.tokenTracker = new TokenTracker();

/**
 * tapestrAI v3.6.6 - Token Tracker
 * Monitor API token usage and quotas
 * Last updated: 2025-01-05 17:45 EST
 */

class TokenTracker {
    constructor() {
        this.usage = {
            gemini: { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 },
            openai: { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 },
            anthropic: { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 },
            perplexity: { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 },
            deepseek: { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 }
        };
        
        // Cost per 1M tokens (approximate, for display purposes)
        this.costPer1M = {
            gemini: 0,        // Free tier
            openai: 30,       // GPT-4 input
            anthropic: 15,    // Claude 3
            perplexity: 5,    // Sonar
            deepseek: 0.3     // 100x cheaper!
        };
        
        // Session tracking (resets on page reload)
        this.sessionStart = Date.now();
        this.sessionData = {
            totalCost: 0,
            totalTokens: 0,
            analyses: 0
        };
        
        // Historical analytics (persisted)
        this.analytics = {
            allTime: {
                totalCost: 0,
                totalTokens: 0,
                analyses: 0,
                byProvider: {}
            },
            history: [] // Array of analysis records
        };
        
        this.loadFromStorage();
        this.loadAnalytics();
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
    recordUsage(provider, tokensUsed, cost = null) {
        if (!this.usage[provider]) return;
        
        // Calculate cost if not provided
        if (cost === null) {
            cost = (tokensUsed / 1000000) * this.costPer1M[provider];
        }
        
        // Update provider stats
        this.usage[provider].used += tokensUsed;
        this.usage[provider].sessionTokens += tokensUsed;
        this.usage[provider].sessionCost += cost;
        
        // Update session totals
        this.sessionData.totalTokens += tokensUsed;
        this.sessionData.totalCost += cost;
        
        // Update all-time analytics
        this.analytics.allTime.totalTokens += tokensUsed;
        this.analytics.allTime.totalCost += cost;
        
        if (!this.analytics.allTime.byProvider[provider]) {
            this.analytics.allTime.byProvider[provider] = {
                tokens: 0,
                cost: 0,
                analyses: 0
            };
        }
        this.analytics.allTime.byProvider[provider].tokens += tokensUsed;
        this.analytics.allTime.byProvider[provider].cost += cost;
        
        // If we have remaining count, update it
        if (this.usage[provider].remaining !== null) {
            this.usage[provider].remaining = Math.max(0, this.usage[provider].remaining - tokensUsed);
        }
        
        this.saveToStorage();
        this.saveAnalytics();
        this.updateUI();
        this.updateSessionDisplay();
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
        const container = document.getElementById('provider-token-details');
        if (!container) return;
        
        const providers = ['gemini', 'openai', 'anthropic', 'perplexity', 'deepseek'];
        const html = providers.map(provider => {
            const data = this.usage[provider];
            const status = this.getStatus(provider);
            const remaining = this.formatRemaining(provider);
            const costStr = data.sessionCost > 0 ? `$${data.sessionCost.toFixed(4)}` : '$0.00';
            const tokensStr = this.formatNumber(data.sessionTokens);
            
            return `
                <div class="token-detail-item bg-white">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-semibold text-sm">${provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
                        <span class="text-xs" style="color: ${status.color}">${status.icon} ${status.text}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs mb-1">
                        <div>
                            <span class="text-gray-600">Session:</span> <span class="font-bold">${tokensStr} tokens</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-600">Cost:</span> <span class="font-bold text-brand">${costStr}</span>
                        </div>
                    </div>
                    ${data.remaining !== null ? `
                        <div class="mt-1">
                            <div class="text-xs text-gray-600">Available: ${remaining} tokens</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="h-2 rounded-full transition-all duration-300" 
                                     style="width: ${100 - this.getUsagePercentage(provider)}%; background-color: ${status.color}">
                                </div>
                            </div>
                        </div>
                    ` : '<div class="text-xs text-gray-500 mt-1">No quota data available</div>'}
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * Update session display
     */
    updateSessionDisplay() {
        const costEl = document.getElementById('session-total-cost');
        const tokensEl = document.getElementById('session-total-tokens');
        
        if (costEl) {
            costEl.textContent = `$${this.sessionData.totalCost.toFixed(4)}`;
        }
        
        if (tokensEl) {
            tokensEl.textContent = this.formatNumber(this.sessionData.totalTokens);
        }
    }
    
    /**
     * Format number with K/M suffix
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
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
                const data = JSON.parse(stored);
                // Merge with default structure to handle version upgrades
                Object.keys(this.usage).forEach(provider => {
                    if (data[provider]) {
                        this.usage[provider] = { ...this.usage[provider], ...data[provider] };
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load token usage from storage:', error);
        }
    }
    
    /**
     * Load analytics from localStorage
     */
    loadAnalytics() {
        try {
            const stored = localStorage.getItem('tapestrAI_analytics');
            if (stored) {
                this.analytics = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Could not load analytics from storage:', error);
        }
    }
    
    /**
     * Save analytics to localStorage
     */
    saveAnalytics() {
        try {
            localStorage.setItem('tapestrAI_analytics', JSON.stringify(this.analytics));
        } catch (error) {
            console.warn('Could not save analytics to storage:', error);
        }
    }
    
    /**
     * Record analysis completion
     */
    recordAnalysis(providers, totalTokens, totalCost) {
        this.sessionData.analyses++;
        this.analytics.allTime.analyses++;
        
        // Add to history
        this.analytics.history.push({
            timestamp: Date.now(),
            providers: providers,
            tokens: totalTokens,
            cost: totalCost
        });
        
        // Keep only last 100 analyses in history
        if (this.analytics.history.length > 100) {
            this.analytics.history = this.analytics.history.slice(-100);
        }
        
        providers.forEach(provider => {
            if (!this.analytics.allTime.byProvider[provider]) {
                this.analytics.allTime.byProvider[provider] = {
                    tokens: 0,
                    cost: 0,
                    analyses: 0
                };
            }
            this.analytics.allTime.byProvider[provider].analyses++;
        });
        
        this.saveAnalytics();
    }
    
    /**
     * Get cost/value insights
     */
    getInsights() {
        const providers = Object.keys(this.analytics.allTime.byProvider);
        const insights = [];
        
        // Find most cost-effective provider
        let bestValue = null;
        let lowestCostPerAnalysis = Infinity;
        
        providers.forEach(provider => {
            const data = this.analytics.allTime.byProvider[provider];
            if (data.analyses > 0) {
                const costPerAnalysis = data.cost / data.analyses;
                if (costPerAnalysis < lowestCostPerAnalysis) {
                    lowestCostPerAnalysis = costPerAnalysis;
                    bestValue = provider;
                }
            }
        });
        
        if (bestValue) {
            insights.push({
                type: 'best_value',
                message: `${bestValue.charAt(0).toUpperCase() + bestValue.slice(1)} offers best value at $${lowestCostPerAnalysis.toFixed(4)} per analysis`
            });
        }
        
        // Check if user is paying for expensive APIs unnecessarily
        if (this.analytics.allTime.byProvider.openai && 
            this.analytics.allTime.byProvider.deepseek) {
            const openaiCost = this.analytics.allTime.byProvider.openai.cost;
            const deepseekCost = this.analytics.allTime.byProvider.deepseek.cost;
            if (openaiCost > deepseekCost * 50) {
                const savings = openaiCost - (deepseekCost * 100);
                insights.push({
                    type: 'savings_opportunity',
                    message: `You could save ~$${savings.toFixed(2)} by using DeepSeek more often`
                });
            }
        }
        
        return insights;
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
     * Reset session data (but keep analytics)
     */
    resetSession() {
        Object.keys(this.usage).forEach(provider => {
            this.usage[provider].sessionTokens = 0;
            this.usage[provider].sessionCost = 0;
        });
        this.sessionData = {
            totalCost: 0,
            totalTokens: 0,
            analyses: 0
        };
        this.updateUI();
        this.updateSessionDisplay();
    }
    
    /**
     * Reset all usage data
     */
    resetAll() {
        Object.keys(this.usage).forEach(provider => {
            this.usage[provider] = { used: 0, limit: null, remaining: null, resetDate: null, sessionCost: 0, sessionTokens: 0 };
        });
        this.saveToStorage();
        this.updateUI();
    }
    
    /**
     * Reset analytics (with confirmation)
     */
    resetAnalytics() {
        this.analytics = {
            allTime: {
                totalCost: 0,
                totalTokens: 0,
                analyses: 0,
                byProvider: {}
            },
            history: []
        };
        this.saveAnalytics();
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

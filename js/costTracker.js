/**
 * tapestrAI v3.0 - Cost Tracker
 * Tracks API usage and costs across all providers
 */

class CostTracker {
  constructor() {
    this.currentAnalysis = {
      providers: {},
      totalCost: 0,
      totalTokens: 0,
      startTime: null,
      endTime: null
    };
    
    this.history = this.loadHistory();
  }
  
  /**
   * Start tracking a new analysis
   */
  startAnalysis() {
    this.currentAnalysis = {
      providers: {},
      totalCost: 0,
      totalTokens: 0,
      startTime: Date.now(),
      endTime: null,
      imageCount: 0
    };
  }
  
  /**
   * Track API call for a provider
   */
  trackCall(provider, inputTokens, outputTokens, model) {
    if (!this.currentAnalysis.providers[provider]) {
      this.currentAnalysis.providers[provider] = {
        calls: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        cost: 0,
        model: model
      };
    }
    
    const p = this.currentAnalysis.providers[provider];
    p.calls++;
    p.inputTokens += inputTokens;
    p.outputTokens += outputTokens;
    p.totalTokens += (inputTokens + outputTokens);
    
    // Calculate cost based on provider
    // These are approximate rates - should match apiKeyManager.js
    const rates = {
      gemini: { input: 0.02 / 1000000, output: 0.08 / 1000000 },
      openai: { input: 10 / 1000000, output: 30 / 1000000 },
      anthropic: { input: 3 / 1000000, output: 15 / 1000000 },
      perplexity: { input: 1 / 1000000, output: 1 / 1000000 },
      deepseek: { input: 0.14 / 1000000, output: 0.28 / 1000000 } // 100x cheaper than OpenAI!
    };
    
    const rate = rates[provider] || { input: 0, output: 0 };
    p.cost = (p.inputTokens * rate.input) + (p.outputTokens * rate.output);
    
    // Update totals
    this.currentAnalysis.totalTokens = Object.values(this.currentAnalysis.providers)
      .reduce((sum, p) => sum + p.totalTokens, 0);
    
    this.currentAnalysis.totalCost = Object.values(this.currentAnalysis.providers)
      .reduce((sum, p) => sum + p.cost, 0);
  }
  
  /**
   * Complete current analysis and save to history
   */
  completeAnalysis(imageCount = 1) {
    this.currentAnalysis.endTime = Date.now();
    this.currentAnalysis.duration = this.currentAnalysis.endTime - this.currentAnalysis.startTime;
    this.currentAnalysis.imageCount = imageCount;
    
    // Add to history
    this.history.push({
      ...this.currentAnalysis,
      timestamp: this.currentAnalysis.startTime
    });
    
    // Keep only last 100 analyses
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }
    
    this.saveHistory();
    
    return this.currentAnalysis;
  }
  
  /**
   * Get current analysis summary
   */
  getCurrentSummary() {
    return {
      cost: this.formatCost(this.currentAnalysis.totalCost),
      tokens: this.formatNumber(this.currentAnalysis.totalTokens),
      providers: Object.keys(this.currentAnalysis.providers).length,
      details: this.currentAnalysis.providers
    };
  }
  
  /**
   * Get monthly summary
   */
  getMonthlySummary() {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recentAnalyses = this.history.filter(a => a.timestamp > thirtyDaysAgo);
    
    const summary = {
      totalAnalyses: recentAnalyses.length,
      totalCost: recentAnalyses.reduce((sum, a) => sum + a.totalCost, 0),
      totalTokens: recentAnalyses.reduce((sum, a) => sum + a.totalTokens, 0),
      byProvider: {}
    };
    
    // Aggregate by provider
    recentAnalyses.forEach(analysis => {
      Object.entries(analysis.providers).forEach(([provider, data]) => {
        if (!summary.byProvider[provider]) {
          summary.byProvider[provider] = {
            calls: 0,
            tokens: 0,
            cost: 0
          };
        }
        summary.byProvider[provider].calls += data.calls;
        summary.byProvider[provider].tokens += data.totalTokens;
        summary.byProvider[provider].cost += data.cost;
      });
    });
    
    return summary;
  }
  
  /**
   * Export history to CSV
   */
  exportToCSV() {
    if (this.history.length === 0) {
      alert('No analysis history to export');
      return;
    }
    
    const headers = [
      'Date',
      'Duration (s)',
      'Images',
      'Total Cost',
      'Total Tokens',
      'Providers Used',
      'Gemini Cost',
      'OpenAI Cost',
      'Claude Cost',
      'Perplexity Cost',
      'DeepSeek Cost'
    ];
    
    const rows = this.history.map(analysis => {
      const date = new Date(analysis.timestamp).toISOString();
      const duration = ((analysis.duration || 0) / 1000).toFixed(1);
      const providers = Object.keys(analysis.providers).join(', ');
      
      return [
        date,
        duration,
        analysis.imageCount || 1,
        analysis.totalCost.toFixed(4),
        analysis.totalTokens,
        providers,
        (analysis.providers.gemini?.cost || 0).toFixed(4),
        (analysis.providers.openai?.cost || 0).toFixed(4),
        (analysis.providers.anthropic?.cost || 0).toFixed(4),
        (analysis.providers.perplexity?.cost || 0).toFixed(4),
        (analysis.providers.deepseek?.cost || 0).toFixed(4)
      ];
    });
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestrAI-costs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * Display cost summary in UI
   */
  displaySummary() {
    const container = document.getElementById('cost-summary');
    if (!container) return;
    
    const current = this.getCurrentSummary();
    const monthly = this.getMonthlySummary();
    
    container.innerHTML = `
      <div class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 mt-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">💰 Cost Summary</h3>
          <button 
            onclick="window.costTracker.exportToCSV()" 
            class="text-sm text-blue-600 hover:underline">
            Export CSV
          </button>
        </div>
        
        <!-- Current Analysis -->
        <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 mb-4">
          <h4 class="font-semibold text-gray-800 mb-2">This Analysis</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-600">Total Cost</div>
              <div class="text-2xl font-bold text-green-600">${current.cost}</div>
            </div>
            <div>
              <div class="text-gray-600">Tokens Used</div>
              <div class="text-2xl font-bold text-blue-600">${current.tokens}</div>
            </div>
          </div>
          
          ${current.providers > 0 ? `
            <div class="mt-3 pt-3 border-t border-gray-200">
              <div class="text-xs font-semibold text-gray-600 mb-2">Provider Breakdown:</div>
              ${Object.entries(current.details).map(([provider, data]) => `
                <div class="flex justify-between text-xs mb-1">
                  <span class="capitalize">${provider}:</span>
                  <span class="font-medium">$${data.cost.toFixed(4)} (${this.formatNumber(data.totalTokens)} tokens)</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Monthly Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-800 mb-2">Last 30 Days</h4>
          <div class="grid grid-cols-3 gap-3 text-sm text-center">
            <div>
              <div class="text-gray-600 text-xs">Analyses</div>
              <div class="text-lg font-bold text-gray-800">${monthly.totalAnalyses}</div>
            </div>
            <div>
              <div class="text-gray-600 text-xs">Total Cost</div>
              <div class="text-lg font-bold text-green-600">${this.formatCost(monthly.totalCost)}</div>
            </div>
            <div>
              <div class="text-gray-600 text-xs">Avg/Analysis</div>
              <div class="text-lg font-bold text-blue-600">${this.formatCost(monthly.totalAnalyses > 0 ? monthly.totalCost / monthly.totalAnalyses : 0)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.classList.remove('hidden');
  }
  
  /**
   * Format cost for display
   */
  formatCost(cost) {
    if (cost < 0.01) {
      return '<$0.01';
    }
    return `$${cost.toFixed(2)}`;
  }
  
  /**
   * Format number with commas
   */
  formatNumber(num) {
    return num.toLocaleString();
  }
  
  /**
   * Load history from localStorage
   */
  loadHistory() {
    try {
      const saved = localStorage.getItem('tapestrAI_cost_history');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load cost history:', error);
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
      console.error('Failed to save cost history:', error);
    }
  }
  
  /**
   * Clear all history
   */
  clearHistory() {
    if (confirm('Are you sure you want to clear all cost history?')) {
      this.history = [];
      this.saveHistory();
      alert('Cost history cleared');
    }
  }
}

// Create global instance
window.CostTracker = CostTracker;

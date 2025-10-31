/**
 * tapestrAI v3.0 - Main Application Controller
 * Coordinates all modules and manages application state
 */

class TapestrAI {
  constructor() {
    // Initialize all modules
    this.apiKeyManager = null;
    this.imageProcessor = null;
    this.agentOrchestrator = null;
    this.progressUI = null;
    this.costTracker = null;
    this.errorHandler = null;
    
    this.isAnalyzing = false;
    this.currentResults = null;
  }
  
  /**
   * Initialize application
   */
  async init() {
    console.log('🚀 Initializing tapestrAI v3.0...');
    
    try {
      // Create module instances
      this.apiKeyManager = new window.APIKeyManager();
      this.imageProcessor = new window.ImageProcessor();
      this.agentOrchestrator = new window.AgentOrchestrator();
      this.progressUI = new window.ProgressUI();
      this.costTracker = new window.CostTracker();
      this.errorHandler = new window.ErrorHandler();
      
      // Make globally accessible
      window.apiKeyManager = this.apiKeyManager;
      window.imageProcessor = this.imageProcessor;
      window.costTracker = this.costTracker;
      window.errorHandler = this.errorHandler;
      
      // Initialize UI
      this.apiKeyManager.initializeUI();
      
      // Initialize global status summary
      if (typeof updateGlobalSummary === 'function') {
        updateGlobalSummary();
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check for existing API keys and auto-minimize if present
      this.checkInitialState();
      
      console.log('✓ tapestrAI initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize tapestrAI:', error);
      this.errorHandler.handle(error, { phase: 'initialization' });
    }
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for API key updates
    window.addEventListener('apiKeyUpdated', () => {
      this.updateAnalyzeButtonState();
      this.checkAPISetupMinimize();
    });
    
    // Listen for image updates
    window.addEventListener('imagesUpdated', () => {
      this.updateAnalyzeButtonState();
    });
  }
  
  /**
   * Check initial state and auto-minimize API setup if keys present
   */
  checkInitialState() {
    if (this.apiKeyManager.canAnalyze()) {
      const container = document.getElementById('api-setup-container');
      const content = document.getElementById('api-setup-content');
      const minimizedMsg = document.getElementById('api-setup-minimized');
      const skipOption = document.getElementById('skip-api-option');
      
      if (container && content && minimizedMsg) {
        container.classList.add('minimized');
        content.classList.add('hidden');
        minimizedMsg.classList.remove('hidden');
        if (skipOption) skipOption.style.display = 'none';
      }
    }
  }
  
  /**
   * Toggle API setup visibility
   */
  toggleAPISetup() {
    const container = document.getElementById('api-setup-container');
    const content = document.getElementById('api-setup-content');
    const minimizedMsg = document.getElementById('api-setup-minimized');
    
    if (container && content && minimizedMsg) {
      const isMinimized = container.classList.contains('minimized');
      
      if (isMinimized) {
        // Expand
        container.classList.remove('minimized');
        content.classList.remove('hidden');
        minimizedMsg.classList.add('hidden');
      } else {
        // Minimize
        container.classList.add('minimized');
        content.classList.add('hidden');
        minimizedMsg.classList.remove('hidden');
      }
    }
  }
  
  /**
   * Skip API setup (minimize it)
   */
  skipAPISetup() {
    this.toggleAPISetup();
  }
  
  /**
   * Check if API setup should auto-minimize
   */
  checkAPISetupMinimize() {
    if (this.apiKeyManager.canAnalyze()) {
      const container = document.getElementById('api-setup-container');
      if (container && !container.classList.contains('minimized')) {
        this.toggleAPISetup();
      }
    }
  }
  
  /**
   * Update agents display
   */
  updateAgentsDisplay() {
    if (this.apiKeyManager) {
      this.apiKeyManager.updateAvailableFeatures();
    }
    if (typeof updateGlobalSummary === 'function') {
      updateGlobalSummary();
    }
  }
  
  /**
   * Update analyze button state
   */
  updateAnalyzeButtonState() {
    const button = document.getElementById('analyze-btn');
    const statusText = document.getElementById('analyze-status');
    
    if (!button || !statusText) return;
    
    const hasGemini = this.apiKeyManager && this.apiKeyManager.canAnalyze();
    const hasImages = this.imageProcessor && this.imageProcessor.getCount() > 0;
    
    if (hasGemini && hasImages) {
      button.disabled = false;
      statusText.textContent = `Ready to analyze ${this.imageProcessor.getCount()} image(s) with ${this.apiKeyManager.getAvailableAgents().length} agent(s)`;
    } else if (!hasGemini) {
      button.disabled = true;
      statusText.textContent = 'Add Gemini API key to begin';
    } else if (!hasImages) {
      button.disabled = true;
      statusText.textContent = 'Upload at least one image to analyze';
    }
  }
  
  /**
   * Start analysis
   */
  async startAnalysis() {
    if (this.isAnalyzing) {
      console.warn('Analysis already in progress');
      return;
    }
    
    try {
      this.isAnalyzing = true;
      
      // Update UI
      const button = document.getElementById('analyze-btn');
      if (button) {
        button.disabled = true;
        button.textContent = '🔬 Analyzing...';
      }
      
      // Hide previous results
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.classList.add('hidden');
      }
      
      // Get images
      const images = this.imageProcessor.getImages();
      
      if (images.length === 0) {
        throw new Error('No images to analyze');
      }
      
      // Run analysis with orchestrator
      console.log(`Starting analysis with ${images.length} image(s)...`);
      
      const results = await this.agentOrchestrator.analyzeWithAgents(
        images,
        this.apiKeyManager,
        this.progressUI,
        this.costTracker
      );
      
      console.log('✓ Analysis complete:', results);
      
      // Store results
      this.currentResults = results;
      
      // Display results
      this.displayResults(results);
      
      // Display cost summary
      if (this.costTracker) {
        this.costTracker.displaySummary();
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      this.errorHandler.handle(error, { phase: 'analysis' });
      
      // Show error to user
      this.showErrorMessage(error);
      
    } finally {
      this.isAnalyzing = false;
      
      // Reset button
      const button = document.getElementById('analyze-btn');
      if (button) {
        button.disabled = false;
        button.textContent = '🔬 Analyze Artifact';
      }
      
      this.updateAnalyzeButtonState();
    }
  }
  
  /**
   * Display analysis results
   */
  displayResults(results) {
    const container = document.getElementById('results-section');
    if (!container) return;
    
    const primary = results.primary;
    const synthesis = results.synthesis;
    const factCheck = results.factCheck;
    const additional = results.additional || {};
    
    // Build HTML
    container.innerHTML = `
      <div class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">📊 Analysis Results</h2>
        
        <!-- Primary Analysis -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">🔬</span>
            <h3 class="text-xl font-bold text-gray-800">Material Analysis</h3>
          </div>
          
          ${this.renderSection('Materials', primary.materials)}
          ${this.renderSection('Construction', primary.construction)}
          ${this.renderSection('Markings & Text', primary.markings)}
          ${this.renderSection('Age Indicators', primary.ageIndicators)}
          ${this.renderSection('Purpose & Function', primary.purpose)}
          ${this.renderSection('Cultural Context', primary.culturalContext)}
          ${this.renderSection('Category', primary.category)}
          ${this.renderSection('Confidence Assessment', primary.confidence)}
        ${primary.keyClaims ? this.renderSection('Key Claims for Verification', primary.keyClaims) : ''}
        </div>
        
        <!-- Synthesis (if multiple perspectives) -->
        ${synthesis ? `
          <div class="mb-6 border-t-4 border-blue-300 pt-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🎯</span>
              <h3 class="text-xl font-bold text-blue-900">Integrated Analysis</h3>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Multi-Perspective Synthesis</span>
            </div>
            <div class="prose max-w-none bg-blue-50 rounded-lg p-4">
              ${this.formatText(synthesis)}
            </div>
          </div>
        ` : ''}
        
        <!-- Fact-Check Section -->
        ${factCheck ? `
          <div class="mb-6 border-t-4 border-green-300 pt-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">✓</span>
              <h3 class="text-xl font-bold text-green-900">Fact Verification</h3>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Research-Verified Claims</span>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="prose max-w-none">
                ${this.formatText(factCheck.verification)}
              </div>
              ${factCheck.citations && factCheck.citations.length > 0 ? `
                <div class="mt-4 pt-4 border-t border-green-200">
                  <h4 class="font-semibold text-green-900 mb-2">📚 Sources:</h4>
                  <ul class="space-y-1">
                    ${factCheck.citations.map(url => `
                      <li><a href="${url}" target="_blank" class="text-blue-600 hover:underline text-sm break-all">${url}</a></li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        <!-- Additional Agent Results -->
        ${additional.cultural ? `
          <div class="mb-6 border-t pt-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🌍</span>
              <h3 class="text-xl font-bold text-gray-800">Cultural Context Specialist</h3>
            </div>
            <div class="prose max-w-none">
              ${this.formatText(additional.cultural)}
            </div>
          </div>
        ` : ''}
        
        ${additional.research ? `
          <div class="mb-6 border-t pt-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🔍</span>
              <h3 class="text-xl font-bold text-gray-800">Historical Research</h3>
            </div>
            <div class="prose max-w-none">
              ${this.formatText(additional.research)}
            </div>
          </div>
        ` : ''}
        

        
        <!-- Keywords -->
        ${primary.keywords && primary.keywords.length > 0 ? `
          <div class="mt-6 pt-6 border-t">
            <h4 class="font-semibold text-gray-800 mb-2">🏷️ Keywords:</h4>
            <div class="flex flex-wrap gap-2">
              ${primary.keywords.map(kw => `
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${kw}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Actions -->
        <div class="mt-6 pt-6 border-t flex gap-3">
          <button 
            onclick="window.main.exportResults()" 
            class="btn btn-primary">
            📥 Export Results
          </button>
          <button 
            onclick="window.main.startNewAnalysis()" 
            class="btn bg-gray-500 text-white hover:bg-gray-600">
            🔄 New Analysis
          </button>
        </div>
      </div>
    `;
    
    container.classList.remove('hidden');
    
    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  /**
   * Render analysis section
   */
  renderSection(title, content) {
    if (!content || content.trim() === '') return '';
    
    return `
      <div class="mb-4">
        <h4 class="font-semibold text-gray-800 mb-2">${title}:</h4>
        <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">${this.formatText(content)}</div>
      </div>
    `;
  }
  
  /**
   * Format text (basic markdown-like formatting)
   */
  formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  }
  
  /**
   * Export results to text file
   */
  exportResults() {
    if (!this.currentResults) {
      alert('No results to export');
      return;
    }
    
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    let exportText = `TAPESTRAI ARTIFACT ANALYSIS
Generated: ${new Date().toLocaleString()}
Agents Used: ${this.currentResults.agents.join(', ')}

==========================================

${primary.rawText}

`;
    
    if (additional.cultural) {
      exportText += `\n\n=== CULTURAL CONTEXT ===\n\n${additional.cultural}`;
    }
    
    if (additional.research) {
      exportText += `\n\n=== HISTORICAL RESEARCH ===\n\n${additional.research}`;
    }
    
    if (this.currentResults.synthesis) {
      exportText += `\n\n=== INTEGRATED ANALYSIS ===\n\n${this.currentResults.synthesis}`;
    }
    
    if (this.currentResults.factCheck) {
      exportText += `\n\n=== FACT VERIFICATION ===\n\n${this.currentResults.factCheck.verification}`;
      if (this.currentResults.factCheck.citations && this.currentResults.factCheck.citations.length > 0) {
        exportText += `\n\nSources:\n${this.currentResults.factCheck.citations.map(url => `- ${url}`).join('\n')}`;
      }
    }
    
    // Download as text file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestrAI-analysis-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * Start new analysis
   */
  startNewAnalysis() {
    this.imageProcessor.clearAll();
    this.currentResults = null;
    
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.classList.add('hidden');
    }
    
    const costSummary = document.getElementById('cost-summary');
    if (costSummary) {
      costSummary.classList.add('hidden');
    }
    
    // Scroll to upload
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Show error message
   */
  showErrorMessage(error) {
    const container = document.getElementById('results-section');
    if (!container) return;
    
    container.innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6">
        <div class="flex items-start gap-3">
          <span class="text-3xl">⚠️</span>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-red-800 mb-2">Analysis Failed</h3>
            <p class="text-red-700 mb-4">${error.message}</p>
            
            <div class="bg-white/50 rounded-lg p-3">
              <h4 class="font-semibold text-red-800 mb-2">Suggestions:</h4>
              <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
                ${this.errorHandler.getRecoverySuggestions(error).map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            
            <button 
              onclick="window.main.startAnalysis()" 
              class="btn btn-primary mt-4">
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    `;
    
    container.classList.remove('hidden');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.main = new TapestrAI();
  window.main.init();
});

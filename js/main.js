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
      // Don't auto-close API setup section - let user close it manually
      // this.checkAPISetupMinimize();
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
      const arrow = document.getElementById('minimize-api-setup');
      
      if (container && content && minimizedMsg) {
        container.classList.add('minimized');
        content.classList.add('hidden');
        minimizedMsg.classList.remove('hidden');
        if (skipOption) skipOption.style.display = 'none';
        if (arrow) arrow.classList.remove('rotate-90');
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
    const arrow = document.getElementById('minimize-api-setup');
    
    if (container && content && minimizedMsg) {
      const isMinimized = container.classList.contains('minimized');
      
      if (isMinimized) {
        // Expand
        container.classList.remove('minimized');
        content.classList.remove('hidden');
        minimizedMsg.classList.add('hidden');
        if (arrow) arrow.classList.add('rotate-90');
      } else {
        // Minimize
        container.classList.add('minimized');
        content.classList.add('hidden');
        minimizedMsg.classList.remove('hidden');
        if (arrow) arrow.classList.remove('rotate-90');
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
   * Note: Disabled - let user manually close the section
   */
  checkAPISetupMinimize() {
    // Removed auto-close behavior - user can close the section manually
    // This allows them to see their saved keys and add more if needed
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
   * Collect material details from form
   */
  collectMaterialDetails() {
    const details = [];
    
    // Size & Weight
    const size = document.getElementById('artifact-size')?.value?.trim();
    const weight = document.getElementById('artifact-weight')?.value?.trim();
    if (size) details.push(`Size/Dimensions: ${size}`);
    if (weight) details.push(`Weight: ${weight}`);
    
    // Bead/Embellishment Details
    const beadTypes = Array.from(document.querySelectorAll('input[name="bead-type"]:checked'))
      .map(el => el.value);
    if (beadTypes.length > 0) {
      details.push(`Bead/Embellishment Types: ${beadTypes.join(', ')}`);
    }
    
    const beadMetal = Array.from(document.querySelectorAll('input[name="bead-metal"]:checked'))
      .map(el => el.value);
    if (beadMetal.length > 0) {
      details.push(`Metal Condition: ${beadMetal.join(', ')}`);
    }
    
    const beadColor = document.getElementById('bead-color')?.value?.trim();
    if (beadColor) details.push(`Colors: ${beadColor}`);
    
    // Clasp/Opening Details
    const claspTypes = Array.from(document.querySelectorAll('input[name="clasp-type"]:checked'))
      .map(el => {
        if (el.value === 'Other') {
          const otherText = document.getElementById('clasp-type-other-text')?.value?.trim();
          return otherText ? `Other (${otherText})` : 'Other';
        }
        return el.value;
      });
    if (claspTypes.length > 0) {
      details.push(`Clasp/Opening Type: ${claspTypes.join(', ')}`);
    }
    
    const claspMaterials = Array.from(document.querySelectorAll('input[name="clasp-material"]:checked'))
      .map(el => {
        if (el.value === 'Other') {
          const otherText = document.getElementById('clasp-material-other-text')?.value?.trim();
          return otherText ? `Other (${otherText})` : 'Other';
        }
        return el.value;
      });
    if (claspMaterials.length > 0) {
      details.push(`Clasp/Opening Material: ${claspMaterials.join(', ')}`);
    }
    
    // Thread/String Details
    const threadMaterials = Array.from(document.querySelectorAll('input[name="thread-material"]:checked'))
      .map(el => {
        if (el.value === 'Other') {
          const otherText = document.getElementById('thread-material-other-text')?.value?.trim();
          return otherText ? `Other (${otherText})` : 'Other';
        }
        return el.value;
      });
    if (threadMaterials.length > 0) {
      details.push(`Thread/String Material: ${threadMaterials.join(', ')}`);
    }
    
    // Other Notes
    const notes = document.getElementById('general-notes')?.value?.trim();
    if (notes) details.push(`Additional Notes: ${notes}`);
    
    return details.length > 0 ? details.join('\n') : '';
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
      
      // Collect material details from form
      const materialDetails = this.collectMaterialDetails();
      if (materialDetails) {
        console.log('📋 User-provided material details:', materialDetails);
      }
      
      // Run analysis with orchestrator
      console.log(`Starting analysis with ${images.length} image(s)...`);
      
      const results = await this.agentOrchestrator.analyzeWithAgents(
        images,
        this.apiKeyManager,
        this.progressUI,
        this.costTracker,
        materialDetails // Pass material details to orchestrator
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
          
          ${this.renderSection('Category', primary.category)}
          ${this.renderSection('Confidence Assessment', primary.confidence)}
          ${this.renderSection('Cultural Context & Historical Context', primary.culturalContext)}
          ${this.renderSection('Materials', primary.materials)}
          ${this.renderSection('Construction', primary.construction)}
          ${this.renderSection('Markings & Text', primary.markings)}
          ${this.renderSection('Age Indicators', primary.ageIndicators)}
          ${this.renderSection('Purpose & Function', primary.purpose)}
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
        
        <!-- Research Links for Further Learning -->
        ${results.researchLinks && results.researchLinks.length > 0 ? `
          <div class="mt-6 pt-6 border-t">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🔗</span>
              <h3 class="text-lg font-bold text-gray-900">Suggested Resources for Further Research</h3>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4">
              <p class="text-sm text-gray-700 mb-4">
                <strong>Want to learn more?</strong> These curated links will help you verify information, explore this artifact's history, and find similar items.
              </p>
              
              <!-- Museums & Research -->
              <div class="mb-4">
                <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Museums & Academic Research</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${results.researchLinks.slice(0, 6).map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                       class="flex items-start gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors">
                      <span class="text-2xl flex-shrink-0">${link.icon}</span>
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-gray-900 text-sm">${link.title}</div>
                        <div class="text-xs text-gray-600 mt-1">${link.description}</div>
                      </div>
                      <span class="text-orange-500 text-sm flex-shrink-0">↗</span>
                    </a>
                  `).join('')}
                </div>
              </div>
              
              <!-- Similar Items for Sale -->
              <div class="mb-3">
                <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>🛒</span>
                  <span>Similar Items & Market Values</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${results.researchLinks.slice(6).map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                       class="flex items-start gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors">
                      <span class="text-2xl flex-shrink-0">${link.icon}</span>
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-gray-900 text-sm">${link.title}</div>
                        <div class="text-xs text-gray-600 mt-1">${link.description}</div>
                      </div>
                      <span class="text-orange-500 text-sm flex-shrink-0">↗</span>
                    </a>
                  `).join('')}
                </div>
              </div>
              
              <p class="text-xs text-gray-600 mt-3 italic">
                💡 Tip: Cross-reference multiple sources to verify information and research current market values for similar items.
              </p>
            </div>
          </div>
        ` : ''}
        
        <!-- Generate Sales Description Feature (Gemini only) -->
        ${this.apiKeyManager.keys.gemini ? `
          <div class="mt-6 pt-6 border-t">
            <details id="sales-description-section" class="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg">
              <summary class="cursor-pointer p-4 font-semibold text-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors">
                ✨ Generate Sales Description (Optional)
              </summary>
              <div class="p-4 pt-0 space-y-4">
                <p class="text-sm text-gray-700 mb-3">
                  Create a compelling sales description based on the analysis. Perfect for listing this artifact online.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="desc-dimensions" class="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (will use from details if provided)
                    </label>
                    <input 
                      type="text" 
                      id="desc-dimensions" 
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                      placeholder="e.g., 6 inches wide"
                    />
                  </div>
                  <div>
                    <label for="desc-materials" class="block text-sm font-medium text-gray-700 mb-1">
                      Key Materials (optional override)
                    </label>
                    <input 
                      type="text" 
                      id="desc-materials" 
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                      placeholder="e.g., Silk brocade"
                    />
                  </div>
                </div>
                <div>
                  <label for="desc-style" class="block text-sm font-medium text-gray-700 mb-1">
                    Description Style
                  </label>
                  <select 
                    id="desc-style" 
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Factual">Factual & Concise</option>
                    <option value="Story-telling">Story-telling (Evoke owner & era)</option>
                    <option value="Craftsmanship">Craftsmanship Focus</option>
                  </select>
                </div>
                <button 
                  id="generate-desc-btn"
                  onclick="window.main.generateSalesDescription()" 
                  class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  <span id="generate-desc-text">Generate Description</span>
                </button>
                <div id="sales-description-result" class="hidden mt-4">
                  <div class="bg-white rounded-lg p-4 border border-indigo-300">
                    <h4 class="font-semibold text-gray-900 mb-2">Generated Description:</h4>
                    <div id="sales-description-content" class="text-gray-800 text-sm leading-relaxed"></div>
                    <button 
                      onclick="window.main.copySalesDescription()" 
                      class="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      📋 Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>
        ` : ''}
        
        <!-- Conservation Advice Feature (Gemini only) -->
        ${this.apiKeyManager.keys.gemini ? `
          <div class="mt-6 pt-6 border-t">
            <details id="conservation-advice-section" class="bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-200 rounded-lg">
              <summary class="cursor-pointer p-4 font-semibold text-teal-900 hover:bg-teal-100 rounded-lg transition-colors">
                ✨ Get Conservation Advice
              </summary>
              <div class="p-4 pt-0 space-y-4">
                <p class="text-sm text-gray-700 mb-3">
                  Get expert advice on how to preserve and care for this artifact based on its materials and condition.
                </p>
                <button 
                  id="get-conservation-btn"
                  onclick="window.main.getConservationAdvice()" 
                  class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  <span id="get-conservation-text">Get Advice Based on Analysis</span>
                </button>
                <div id="conservation-advice-result" class="hidden mt-4">
                  <div class="bg-white rounded-lg p-4 border border-teal-300">
                    <h4 class="font-semibold text-gray-900 mb-2">Conservation Advice:</h4>
                    <div id="conservation-advice-content" class="text-gray-800 text-sm leading-relaxed"></div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        ` : ''}
        
        <!-- Follow-up Questions Section -->
        <div class="mt-6 pt-6 border-t">
          <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>💬</span>
            <span>Have Questions or Need More Details?</span>
          </h3>
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <p class="text-sm text-gray-700 mb-3">
              You can ask follow-up questions about this analysis or upload additional photos for more accurate identification.
            </p>
            <textarea 
              id="followup-question"
              placeholder="Example: Can you tell me more about the markings? What period is this from? Should I upload photos from different angles?"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows="3"></textarea>
            <div class="mt-3 flex gap-3 flex-wrap">
              <button 
                onclick="window.main.submitFollowupQuestion()" 
                class="btn btn-primary text-sm">
                ❓ Ask Follow-up Question
              </button>
              <button 
                onclick="window.main.addMorePhotos()" 
                class="btn bg-purple-500 text-white hover:bg-purple-600 text-sm">
                📸 Add More Photos
              </button>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-6 pt-6 border-t">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Export Format:</label>
              <div class="flex gap-2 flex-wrap">
                <button 
                  onclick="window.main.exportResults('txt')" 
                  class="btn bg-gray-600 text-white hover:bg-gray-700 text-sm">
                  📄 Text (.txt)
                </button>
                <button 
                  onclick="window.main.exportResults('md')" 
                  class="btn bg-blue-600 text-white hover:bg-blue-700 text-sm">
                  📝 Markdown (.md)
                </button>
                <button 
                  onclick="window.main.exportResults('html')" 
                  class="btn bg-green-600 text-white hover:bg-green-700 text-sm">
                  🌐 HTML (.html)
                </button>
                <button 
                  onclick="window.main.exportResults('pdf')" 
                  class="btn bg-red-600 text-white hover:bg-red-700 text-sm">
                  📜 PDF (.pdf)
                </button>
              </div>
            </div>
            <div class="flex items-end">
              <button 
                onclick="window.main.startNewAnalysis()" 
                class="btn bg-gray-500 text-white hover:bg-gray-600 whitespace-nowrap">
                🔄 New Analysis
              </button>
            </div>
          </div>
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
   * Generate Sales Description
   */
  async generateSalesDescription() {
    if (!this.currentResults || !this.apiKeyManager.keys.gemini) {
      alert('Gemini API key required for this feature');
      return;
    }
    
    const btn = document.getElementById('generate-desc-btn');
    const btnText = document.getElementById('generate-desc-text');
    const resultDiv = document.getElementById('sales-description-result');
    const contentDiv = document.getElementById('sales-description-content');
    
    try {
      // Update button state
      btn.disabled = true;
      btnText.textContent = 'Generating...';
      
      // Get user inputs
      const dimensions = document.getElementById('desc-dimensions')?.value?.trim() || 
                        document.getElementById('artifact-size')?.value?.trim() || 'Not specified';
      const materials = document.getElementById('desc-materials')?.value?.trim() || 'As analyzed';
      const style = document.getElementById('desc-style')?.value || 'Factual';
      
      // Build prompt
      const analysisText = this.currentResults.primary.rawText || '';
      
      const prompt = `Based on this artifact analysis, create a compelling sales description.

ANALYSIS:
${analysisText.substring(0, 1500)}

DIMENSIONS: ${dimensions}
KEY MATERIALS: ${materials}
STYLE: ${style}

Create a ${style.toLowerCase()} sales description (150-250 words) that:
- Highlights key features and historical significance
- Uses persuasive but accurate language
- Includes condition notes if relevant
- Appeals to collectors and history enthusiasts
- Maintains authenticity and accuracy

Format the description in paragraphs, ready to use for online listings.`;
      
      // Call Gemini API
      const apiKey = this.apiKeyManager.keys.gemini;
      const config = this.apiKeyManager.providers.gemini;
      const endpoint = `${config.directEndpoint}/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const description = data.candidates[0].content.parts[0].text;
      
      // Display result
      contentDiv.innerHTML = this.formatText(description);
      resultDiv.classList.remove('hidden');
      
      // Store for copy function
      this.salesDescription = description;
      
      // Track usage
      if (data.usageMetadata && window.costTracker) {
        window.costTracker.trackCall(
          'gemini',
          data.usageMetadata.promptTokenCount || 0,
          data.usageMetadata.candidatesTokenCount || 0,
          'gemini-2.0-flash-exp'
        );
      }
      
    } catch (error) {
      console.error('Failed to generate sales description:', error);
      alert(`Failed to generate description: ${error.message}`);
    } finally {
      // Reset button
      btn.disabled = false;
      btnText.textContent = 'Generate Description';
    }
  }
  
  /**
   * Copy Sales Description to Clipboard
   */
  async copySalesDescription() {
    if (!this.salesDescription) return;
    
    try {
      // Remove HTML formatting for plain text copy
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.salesDescription;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(plainText);
      alert('✅ Sales description copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  }
  
  /**
   * Get Conservation Advice
   */
  async getConservationAdvice() {
    if (!this.currentResults || !this.apiKeyManager.keys.gemini) {
      alert('Gemini API key required for this feature');
      return;
    }
    
    const btn = document.getElementById('get-conservation-btn');
    const btnText = document.getElementById('get-conservation-text');
    const resultDiv = document.getElementById('conservation-advice-result');
    const contentDiv = document.getElementById('conservation-advice-content');
    
    try {
      // Update button state
      btn.disabled = true;
      btnText.textContent = 'Generating Advice...';
      
      // Build prompt from analysis
      const analysisText = this.currentResults.primary.rawText || '';
      const materials = this.currentResults.primary.materials || '';
      const condition = this.currentResults.primary.ageIndicators || '';
      
      const prompt = `Based on this artifact analysis, provide expert conservation and care advice.

ANALYSIS:
${analysisText.substring(0, 1500)}

MATERIALS:
${materials}

CONDITION:
${condition}

Provide comprehensive conservation advice covering:
1. Storage recommendations (temperature, humidity, light exposure)
2. Handling guidelines
3. Cleaning and maintenance (what to do and what to avoid)
4. Display considerations
5. Signs of deterioration to watch for
6. When to consult a professional conservator

Be specific to the materials and condition identified. Format with clear sections and bullet points where helpful.`;
      
      // Call Gemini API
      const apiKey = this.apiKeyManager.keys.gemini;
      const config = this.apiKeyManager.providers.gemini;
      const endpoint = `${config.directEndpoint}/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const advice = data.candidates[0].content.parts[0].text;
      
      // Display result
      contentDiv.innerHTML = this.formatText(advice);
      resultDiv.classList.remove('hidden');
      
      // Track usage
      if (data.usageMetadata && window.costTracker) {
        window.costTracker.trackCall(
          'gemini',
          data.usageMetadata.promptTokenCount || 0,
          data.usageMetadata.candidatesTokenCount || 0,
          'gemini-2.0-flash-exp'
        );
      }
      
    } catch (error) {
      console.error('Failed to get conservation advice:', error);
      alert(`Failed to generate advice: ${error.message}`);
    } finally {
      // Reset button
      btn.disabled = false;
      btnText.textContent = 'Get Advice Based on Analysis';
    }
  }
  
  /**
   * Generate filename from artifact name
   */
  generateFilename(extension) {
    // Extract artifact name from analysis
    let artifactName = 'artifact';
    
    if (this.currentResults && this.currentResults.primary) {
      const analysis = this.currentResults.primary.rawText || '';
      
      // Try to extract artifact name from common patterns
      // Pattern 1: "This is a [artifact name]" or "This appears to be a [artifact name]"
      const pattern1 = /(?:This (?:is|appears to be) (?:a|an) )([^.,\n]{3,40})(?:[.,])/i;
      const match1 = analysis.match(pattern1);
      
      // Pattern 2: Look for capitalized phrases near the beginning
      const pattern2 = /^[^\n]{0,50}([A-Z][a-z]+(?: [A-Z][a-z]+){0,3})/;
      const match2 = analysis.match(pattern2);
      
      // Pattern 3: Category field if available
      if (this.currentResults.primary.category) {
        artifactName = this.currentResults.primary.category;
      } else if (match1 && match1[1]) {
        artifactName = match1[1].trim();
      } else if (match2 && match2[1]) {
        artifactName = match2[1].trim();
      }
    }
    
    // Clean up the artifact name for filename
    artifactName = artifactName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
      .substring(0, 30);              // Limit length
    
    // Generate 4 random numbers
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    return `${artifactName}-${randomNum}.${extension}`;
  }
  
  /**
   * Export results in specified format
   */
  exportResults(format = 'txt') {
    if (!this.currentResults) {
      alert('No results to export');
      return;
    }
    
    switch(format) {
      case 'txt':
        this.exportAsText();
        break;
      case 'md':
        this.exportAsMarkdown();
        break;
      case 'html':
        this.exportAsHTML();
        break;
      case 'pdf':
        this.exportAsPDF();
        break;
      default:
        this.exportAsText();
    }
  }
  
  /**
   * Export as plain text
   */
  exportAsText() {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    // Get image count
    const imageCount = this.imageProcessor.getCount();
    
    let exportText = `TAPESTRAI ARTIFACT ANALYSIS
Generated: ${new Date().toLocaleString()}
Agents Used: ${this.currentResults.agents.join(', ')}
${imageCount > 0 ? `Images Analyzed: ${imageCount}` : ''}

==========================================

`;
    
    if (imageCount > 0) {
      exportText += `NOTE: This text export does not include images.
For exports with embedded images, use HTML, Markdown, or PDF format.

==========================================

`;
    }
    
    exportText += `${primary.rawText}

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
    
    // Add research links
    if (this.currentResults.researchLinks && this.currentResults.researchLinks.length > 0) {
      exportText += `\n\n=== SUGGESTED RESOURCES FOR FURTHER RESEARCH ===\n\n`;
      exportText += `These curated links will help you verify information and explore this artifact's history in greater depth:\n\n`;
      this.currentResults.researchLinks.forEach(link => {
        exportText += `${link.icon} ${link.title}\n`;
        exportText += `   ${link.url}\n`;
        exportText += `   ${link.description}\n\n`;
      });
    }
    
    const filename = this.generateFilename('txt');
    this.downloadFile(exportText, filename, 'text/plain');
  }
  
  /**
   * Export as Markdown
   */
  async exportAsMarkdown() {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    // Get compressed images for export
    const exportImages = await this.imageProcessor.getCompressedImagesForExport();
    
    let md = `# tapestrAI Artifact Analysis\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}  \n`;
    md += `**AI Agents Used:** ${this.currentResults.agents.join(', ')}  \n\n`;
    md += `---\n\n`;
    
    // Add images section if there are any
    if (exportImages.length > 0) {
      md += `## 📷 Analyzed Artifacts\n\n`;
      exportImages.forEach(img => {
        md += `![${img.name}](${img.data})\n\n`;
        md += `*${img.name} (${img.width}×${img.height})*\n\n`;
      });
      md += `---\n\n`;
    }
    
    md += `## Primary Analysis\n\n`;
    md += `${primary.rawText}\n\n`;
    
    if (additional.cultural) {
      md += `## Cultural Context\n\n${additional.cultural}\n\n`;
    }
    
    if (additional.research) {
      md += `## Historical Research\n\n${additional.research}\n\n`;
    }
    
    if (this.currentResults.synthesis) {
      md += `## Integrated Analysis\n\n${this.currentResults.synthesis}\n\n`;
    }
    
    if (this.currentResults.factCheck) {
      md += `## Fact Verification\n\n${this.currentResults.factCheck.verification}\n\n`;
      if (this.currentResults.factCheck.citations && this.currentResults.factCheck.citations.length > 0) {
        md += `### Sources\n\n`;
        this.currentResults.factCheck.citations.forEach(url => {
          md += `- [${url}](${url})\n`;
        });
        md += `\n`;
      }
    }
    
    // Add research links
    if (this.currentResults.researchLinks && this.currentResults.researchLinks.length > 0) {
      md += `## Suggested Resources for Further Research\n\n`;
      md += `These curated links will help you verify information and explore this artifact's history in greater depth:\n\n`;
      this.currentResults.researchLinks.forEach(link => {
        md += `- ${link.icon} **[${link.title}](${link.url})**\n  ${link.description}\n`;
      });
      md += `\n💡 *Tip: Cross-reference multiple sources to verify information and gain deeper understanding.*\n\n`;
    }
    
    md += `---\n\n`;
    md += `*Generated by tapestrAI - Unravel your artifact's story*\n`;
    
    const filename = this.generateFilename('md');
    this.downloadFile(md, filename, 'text/markdown');
  }
  
  /**
   * Export as HTML
   */
  async exportAsHTML() {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    // Get compressed images for export
    const exportImages = await this.imageProcessor.getCompressedImagesForExport();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tapestrAI Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 900px; margin: 40px auto; padding: 20px; color: #333; }
        h1 { color: #6B46C1; border-bottom: 3px solid #6B46C1; padding-bottom: 10px; }
        h2 { color: #4A5568; margin-top: 30px; border-left: 4px solid #6B46C1; padding-left: 15px; }
        .meta { background: #F7FAFC; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .section { margin: 30px 0; padding: 20px; background: white; border: 1px solid #E2E8F0; border-radius: 8px; }
        .sources { background: #F0FFF4; padding: 15px; border-left: 4px solid #48BB78; border-radius: 4px; }
        .sources a { color: #2B6CB0; text-decoration: none; }
        .sources a:hover { text-decoration: underline; }
        .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .image-item { text-align: center; }
        .image-item img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .image-caption { font-size: 12px; color: #718096; margin-top: 8px; }
        footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #718096; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🏛️ tapestrAI Artifact Analysis Report</h1>
    
    <div class="meta">
        <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
        <strong>AI Agents Used:</strong> ${this.currentResults.agents.join(', ')}
    </div>`;
    
    // Add images section if there are any
    if (exportImages.length > 0) {
      html += `
    <div class="section">
        <h2>📷 Analyzed Artifacts</h2>
        <div class="images-grid">`;
      
      exportImages.forEach(img => {
        html += `
          <div class="image-item">
            <img src="${img.data}" alt="${img.name}">
            <div class="image-caption">${img.name} (${img.width}×${img.height})</div>
          </div>`;
      });
      
      html += `
        </div>
    </div>`;
    }
    
    html += `
    <div class="section">
        <h2>📊 Primary Analysis</h2>
        <p>${primary.rawText.replace(/\n/g, '<br>')}</p>
    </div>
`;
    
    if (additional.cultural) {
      html += `
    <div class="section">
        <h2>🌍 Cultural Context</h2>
        <p>${additional.cultural.replace(/\n/g, '<br>')}</p>
    </div>`;
    }
    
    if (additional.research) {
      html += `
    <div class="section">
        <h2>🔍 Historical Research</h2>
        <p>${additional.research.replace(/\n/g, '<br>')}</p>
    </div>`;
    }
    
    if (this.currentResults.synthesis) {
      html += `
    <div class="section">
        <h2>🎯 Integrated Analysis</h2>
        <p>${this.currentResults.synthesis.replace(/\n/g, '<br>')}</p>
    </div>`;
    }
    
    if (this.currentResults.factCheck) {
      html += `
    <div class="section">
        <h2>✓ Fact Verification</h2>
        <p>${this.currentResults.factCheck.verification.replace(/\n/g, '<br>')}</p>`;
      
      if (this.currentResults.factCheck.citations && this.currentResults.factCheck.citations.length > 0) {
        html += `
        <div class="sources">
            <strong>📚 Sources:</strong><br>`;
        this.currentResults.factCheck.citations.forEach(url => {
          html += `<a href="${url}" target="_blank">${url}</a><br>`;
        });
        html += `
        </div>`;
      }
      html += `
    </div>`;
    }
    
    // Add research links
    if (this.currentResults.researchLinks && this.currentResults.researchLinks.length > 0) {
      html += `
    <div class="section" style="background: linear-gradient(135deg, #FFFBEB 0%, #FED7AA 100%); border-color: #FB923C;">
        <h2>🔗 Suggested Resources for Further Research</h2>
        <p><strong>Want to learn more?</strong> These curated links will help you verify information and explore this artifact's history in greater depth.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">`;
      
      this.currentResults.researchLinks.forEach(link => {
        html += `
          <div style="background: white; padding: 12px; border-radius: 8px; border: 2px solid #FDBA74;">
            <div style="font-weight: 600; margin-bottom: 5px;">${link.icon} <a href="${link.url}" target="_blank" style="color: #EA580C;">${link.title}</a></div>
            <div style="font-size: 12px; color: #6B7280;">${link.description}</div>
          </div>`;
      });
      
      html += `
        </div>
        <p style="font-size: 12px; font-style: italic; color: #6B7280; margin-top: 15px;">
          💡 Tip: Cross-reference multiple sources to verify information and gain deeper understanding.
        </p>
    </div>`;
    }
    
    html += `
    <footer>
        <p>Generated by <strong>tapestrAI</strong> - Unravel your artifact's story</p>
    </footer>
</body>
</html>`;
    
    const filename = this.generateFilename('html');
    this.downloadFile(html, filename, 'text/html');
  }
  
  /**
   * Export as PDF (using browser print dialog)
   */
  async exportAsPDF() {
    // Create a styled HTML version and open in new window for printing
    const html = await this.generatePDFHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = function() {
      printWindow.print();
    };
    
    // Show instructions
    this.showNotification('info', 'PDF export: Please use "Save as PDF" in the print dialog.');
  }
  
  /**
   * Generate HTML for PDF export
   */
  async generatePDFHTML() {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    // Get compressed images for export
    const exportImages = await this.imageProcessor.getCompressedImagesForExport();
    
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>tapestrAI Analysis Report</title>
    <style>
        @media print {
            body { margin: 0; }
            .page-break { page-break-before: always; }
        }
        body { font-family: Georgia, serif; line-height: 1.8; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #6B46C1; font-size: 28px; margin-bottom: 10px; }
        h2 { color: #4A5568; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; }
        .meta { background: #F7FAFC; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px; }
        p { margin: 15px 0; }
        .section { margin: 25px 0; }
        .sources { margin-top: 15px; padding: 15px; background: #F0FFF4; border-left: 3px solid #48BB78; }
        .sources a { color: #2B6CB0; }
        .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .image-item { text-align: center; page-break-inside: avoid; }
        .image-item img { max-width: 100%; height: auto; border: 1px solid #E2E8F0; border-radius: 5px; }
        .image-caption { font-size: 11px; color: #718096; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>tapestrAI Artifact Analysis Report</h1>
    <div class="meta">
        <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
        <strong>AI Agents:</strong> ${this.currentResults.agents.join(', ')}
    </div>`;
    
    // Add images section if there are any
    if (exportImages.length > 0) {
      html += `
    <div class="section">
        <h2>Analyzed Artifacts</h2>
        <div class="images-grid">`;
      
      exportImages.forEach(img => {
        html += `
          <div class="image-item">
            <img src="${img.data}" alt="${img.name}">
            <div class="image-caption">${img.name} (${img.width}×${img.height})</div>
          </div>`;
      });
      
      html += `
        </div>
    </div>`;
    }
    
    html += `
    <div class="section">
        <h2>Primary Analysis</h2>
        <p>${primary.rawText.replace(/\n/g, '<br>')}</p>
    </div>
    
    ${additional.cultural ? `
    <div class="section page-break">
        <h2>Cultural Context</h2>
        <p>${additional.cultural.replace(/\n/g, '<br>')}</p>
    </div>` : ''}
    
    ${additional.research ? `
    <div class="section">
        <h2>Historical Research</h2>
        <p>${additional.research.replace(/\n/g, '<br>')}</p>
    </div>` : ''}
    
    ${this.currentResults.synthesis ? `
    <div class="section">
        <h2>Integrated Analysis</h2>
        <p>${this.currentResults.synthesis.replace(/\n/g, '<br>')}</p>
    </div>` : ''}
    
    ${this.currentResults.factCheck ? `
    <div class="section">
        <h2>Fact Verification</h2>
        <p>${this.currentResults.factCheck.verification.replace(/\n/g, '<br>')}</p>
        ${this.currentResults.factCheck.citations && this.currentResults.factCheck.citations.length > 0 ? `
        <div class="sources">
            <strong>Sources:</strong><br>
            ${this.currentResults.factCheck.citations.map(url => `<a href="${url}">${url}</a><br>`).join('')}
        </div>` : ''}
    </div>` : ''}
</body>
</html>`;
    
    return html;
  }
  
  /**
   * Download file helper
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * Submit follow-up question
   */
  async submitFollowupQuestion() {
    const textarea = document.getElementById('followup-question');
    const question = textarea ? textarea.value.trim() : '';
    
    if (!question) {
      alert('Please enter a question.');
      return;
    }
    
    if (!this.currentResults) {
      alert('No analysis results available.');
      return;
    }
    
    // Find the submit button
    const button = document.querySelector('[onclick*="submitFollowupQuestion"]');
    const originalText = button ? button.textContent : 'Ask Follow-up Question';
    
    try {
      // Show loading state
      if (button) {
        button.disabled = true;
        button.textContent = '⏳ Processing...';
      }
      
      // Get the primary agent (Gemini) to answer the follow-up
      const images = this.imageProcessor.getImages();
      const analysisContext = this.currentResults.primary.rawText;
      
      const prompt = `Based on this artifact analysis:\n\n${analysisContext}\n\nThe user has a follow-up question:\n${question}\n\nPlease provide a detailed answer based on the analysis and images.`;
      
      // Use Gemini for follow-up (primary agent)
      const response = await this.agentOrchestrator.askFollowup(
        images,
        prompt,
        this.apiKeyManager
      );
      
      // Display follow-up response
      this.displayFollowupResponse(question, response);
      
      // Clear textarea
      if (textarea) textarea.value = '';
      
      // Reset button
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
      
    } catch (error) {
      console.error('Follow-up question failed:', error);
      alert('Failed to process follow-up question. Please try again.');
      
      // Reset button
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }
  
  /**
   * Display follow-up response
   */
  displayFollowupResponse(question, response) {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    // Find the follow-up section or create one
    let followupSection = document.getElementById('followup-responses');
    if (!followupSection) {
      const followupContainer = resultsSection.querySelector('.bg-gradient-to-br.from-blue-50');
      if (followupContainer && followupContainer.parentElement) {
        followupSection = document.createElement('div');
        followupSection.id = 'followup-responses';
        followupSection.className = 'mt-4 space-y-3';
        followupContainer.parentElement.insertBefore(followupSection, followupContainer);
      }
    }
    
    if (followupSection) {
      const responseHTML = `
        <div class="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
          <div class="mb-2">
            <span class="text-xs font-semibold text-gray-500 uppercase">Your Question:</span>
            <p class="text-sm font-medium text-gray-800 mt-1">${this.escapeHtml(question)}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-200">
            <span class="text-xs font-semibold text-gray-500 uppercase">Answer:</span>
            <div class="text-sm text-gray-700 mt-1 prose max-w-none">${this.formatText(response)}</div>
          </div>
        </div>
      `;
      followupSection.insertAdjacentHTML('afterbegin', responseHTML);
    }
  }
  
  /**
   * Add more photos to existing analysis
   */
  addMorePhotos() {
    // Scroll to upload section
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show notification
    this.showNotification('info', 'Upload additional photos, then click "Analyze Artifact" to update the analysis.');
  }
  
  /**
   * Show notification
   */
  showNotification(type, message) {
    // Use existing notification system from apiKeyManager
    if (this.apiKeyManager) {
      this.apiKeyManager.showNotification(type, message);
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

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
   * Export results in specified format
   */
  exportResults(format = 'txt') {
    if (!this.currentResults) {
      alert('No results to export');
      return;
    }
    
    const timestamp = Date.now();
    
    switch(format) {
      case 'txt':
        this.exportAsText(timestamp);
        break;
      case 'md':
        this.exportAsMarkdown(timestamp);
        break;
      case 'html':
        this.exportAsHTML(timestamp);
        break;
      case 'pdf':
        this.exportAsPDF(timestamp);
        break;
      default:
        this.exportAsText(timestamp);
    }
  }
  
  /**
   * Export as plain text
   */
  exportAsText(timestamp) {
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
    
    this.downloadFile(exportText, `tapestrAI-analysis-${timestamp}.txt`, 'text/plain');
  }
  
  /**
   * Export as Markdown
   */
  exportAsMarkdown(timestamp) {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    let md = `# tapestrAI Artifact Analysis\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}  \n`;
    md += `**AI Agents Used:** ${this.currentResults.agents.join(', ')}  \n\n`;
    md += `---\n\n`;
    
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
    
    md += `---\n\n`;
    md += `*Generated by tapestrAI - Unravel your artifact's story*\n`;
    
    this.downloadFile(md, `tapestrAI-analysis-${timestamp}.md`, 'text/markdown');
  }
  
  /**
   * Export as HTML
   */
  exportAsHTML(timestamp) {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
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
        footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #718096; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🏛️ tapestrAI Artifact Analysis Report</h1>
    
    <div class="meta">
        <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
        <strong>AI Agents Used:</strong> ${this.currentResults.agents.join(', ')}
    </div>
    
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
    
    html += `
    <footer>
        <p>Generated by <strong>tapestrAI</strong> - Unravel your artifact's story</p>
    </footer>
</body>
</html>`;
    
    this.downloadFile(html, `tapestrAI-analysis-${timestamp}.html`, 'text/html');
  }
  
  /**
   * Export as PDF (using browser print dialog)
   */
  exportAsPDF(timestamp) {
    // Create a styled HTML version and open in new window for printing
    const html = this.generatePDFHTML();
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
  generatePDFHTML() {
    const primary = this.currentResults.primary;
    const additional = this.currentResults.additional || {};
    
    return `<!DOCTYPE html>
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
    </style>
</head>
<body>
    <h1>tapestrAI Artifact Analysis Report</h1>
    <div class="meta">
        <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
        <strong>AI Agents:</strong> ${this.currentResults.agents.join(', ')}
    </div>
    
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
    
    try {
      // Show loading state
      const button = event.target;
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = '⏳ Processing...';
      
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
      textarea.value = '';
      
      // Reset button
      button.disabled = false;
      button.textContent = originalText;
      
    } catch (error) {
      console.error('Follow-up question failed:', error);
      alert('Failed to process follow-up question. Please try again.');
      
      // Reset button
      const button = event.target;
      button.disabled = false;
      button.textContent = '❓ Ask Follow-up Question';
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

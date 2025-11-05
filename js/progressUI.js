/**
 * tapestrAI v3.6.4 - Progress UI
 * Manages progress tracking and loading states during analysis
 * Last updated: 2025-01-05 17:15 EST
 */

class ProgressUI {
  constructor() {
    this.currentStep = 0;
    this.steps = [];
    this.isActive = false;
  }
  
  /**
   * Initialize progress tracking for analysis
   */
  start(agents) {
    this.isActive = true;
    this.currentStep = 0;
    
    // Build steps based on active agents
    this.steps = [
      { id: 'upload', name: 'Processing Images', icon: '📸', status: 'pending' },
      { id: 'material', name: 'Material Analysis', icon: '🔬', status: 'pending', agent: 'gemini' }
    ];
    
    // Add optional agent steps
    if (agents.find(a => a.id === 'cultural_specialist')) {
      this.steps.push({ 
        id: 'cultural', 
        name: 'Cultural Context', 
        icon: '🌍', 
        status: 'pending',
        agent: 'openai'
      });
    }
    
    if (agents.find(a => a.id === 'historical_researcher')) {
      this.steps.push({ 
        id: 'research', 
        name: 'Historical Research', 
        icon: '🔍', 
        status: 'pending',
        agent: 'perplexity'
      });
    }
    
    if (agents.find(a => a.id === 'synthesis_curator')) {
      this.steps.push({ 
        id: 'synthesis', 
        name: 'Synthesis & Narrative', 
        icon: '📖', 
        status: 'pending',
        agent: 'anthropic'
      });
    }
    
    this.steps.push({ 
      id: 'complete', 
      name: 'Finalizing Results', 
      icon: '✨', 
      status: 'pending' 
    });
    
    this.render();
    this.show();
  }
  
  /**
   * Update progress to next step
   */
  nextStep(stepId = null) {
    if (!this.isActive) return;
    
    // Mark current step as complete
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep].status = 'complete';
    }
    
    // Move to next step
    this.currentStep++;
    
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep].status = 'active';
    }
    
    this.render();
  }
  
  /**
   * Mark specific step as active
   */
  setStep(stepId, status = 'active') {
    const stepIndex = this.steps.findIndex(s => s.id === stepId);
    if (stepIndex >= 0) {
      this.steps[stepIndex].status = status;
      this.currentStep = stepIndex;
      this.render();
    }
  }
  
  /**
   * Mark step as error
   */
  setError(stepId, errorMessage) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.status = 'error';
      step.errorMessage = errorMessage;
      this.render();
    }
  }
  
  /**
   * Complete all progress
   */
  complete() {
    this.steps.forEach(step => {
      if (step.status !== 'error') {
        step.status = 'complete';
      }
    });
    this.currentStep = this.steps.length;
    this.render();
    
    // Hide after a delay
    setTimeout(() => {
      this.hide();
    }, 2000);
  }
  
  /**
   * Reset progress
   */
  reset() {
    this.isActive = false;
    this.currentStep = 0;
    this.steps = [];
    this.hide();
  }
  
  /**
   * Show progress section
   */
  show() {
    const section = document.getElementById('progress-section');
    if (section) {
      section.classList.remove('hidden');
    }
  }
  
  /**
   * Hide progress section
   */
  hide() {
    const section = document.getElementById('progress-section');
    if (section) {
      section.classList.add('hidden');
    }
  }
  
  /**
   * Render progress UI
   */
  render() {
    const container = document.getElementById('progress-section');
    if (!container) return;
    
    const completedSteps = this.steps.filter(s => s.status === 'complete').length;
    const totalSteps = this.steps.length;
    const progressPercent = (completedSteps / totalSteps * 100).toFixed(0);
    
    container.innerHTML = `
      <div class="progress-container">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="spinner text-2xl">⚙️</span>
            <h3 class="text-xl font-bold text-gray-900">Analysis in Progress</h3>
          </div>
          <span class="text-sm font-medium text-gray-600">${completedSteps}/${totalSteps} steps</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
        </div>
        
        <!-- Steps -->
        <div class="mt-6 space-y-2">
          ${this.steps.map((step, index) => this.renderStep(step, index)).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Render individual step
   */
  renderStep(step, index) {
    const statusIcons = {
      pending: '<span class="text-gray-400">⏺</span>',
      active: '<span class="spinner text-brand">⚙️</span>',
      complete: '<span class="text-green-500">✓</span>',
      error: '<span class="text-red-500">✗</span>'
    };
    
    const statusColors = {
      pending: 'text-gray-400',
      active: 'text-brand font-semibold',
      complete: 'text-gray-600',
      error: 'text-red-600'
    };
    
    return `
      <div class="progress-step ${step.status === 'active' ? 'active' : ''}">
        <div class="flex items-center gap-3 flex-1">
          <span class="text-2xl">${statusIcons[step.status]}</span>
          <span class="text-xl">${step.icon}</span>
          <div class="flex-1">
            <div class="${statusColors[step.status]}">${step.name}</div>
            ${step.status === 'error' && step.errorMessage ? `
              <div class="text-xs text-red-500 mt-1">${step.errorMessage}</div>
            ` : ''}
            ${step.status === 'active' ? `
              <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>Working</span>
                <div class="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Show intermediate result
   */
  showIntermediateResult(stepId, summary) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.summary = summary;
      this.render();
    }
  }
}

// Create global instance
window.ProgressUI = ProgressUI;

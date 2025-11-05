/**
 * tapestrAI v3.6.4 - Error Handler
 * Comprehensive error handling and recovery system
 * Last updated: 2025-01-05 17:15 EST
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxRetries = 3;
    this.retryDelay = 2000; // ms
  }
  
  /**
   * Handle error with appropriate user messaging
   */
  handle(error, context = {}) {
    const errorObj = {
      message: error.message || 'An unknown error occurred',
      type: this.categorizeError(error),
      context,
      timestamp: Date.now(),
      stack: error.stack
    };
    
    this.errors.push(errorObj);
    this.log(errorObj);
    
    // Show user-friendly message
    this.showUserMessage(errorObj);
    
    return errorObj;
  }
  
  /**
   * Categorize error type
   */
  categorizeError(error) {
    const message = error.message.toLowerCase();
    const statusCode = error.status || error.statusCode || 0;
    
    // Out of tokens / quota exceeded detection
    if (message.includes('insufficient_quota') || 
        message.includes('quota_exceeded') ||
        message.includes('out of tokens') ||
        message.includes('billing') ||
        message.includes('usage limit') ||
        statusCode === 429 ||
        message.includes('rate limit') || 
        message.includes('quota')) {
      return 'quota_exceeded';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('api') || message.includes('key') || message.includes('auth') || 
        message.includes('invalid_api_key') ||
        statusCode === 401 || statusCode === 403) {
      return 'api';
    }
    if (message.includes('timeout')) {
      return 'timeout';
    }
    if (message.includes('parse') || message.includes('json')) {
      return 'parsing';
    }
    return 'unknown';
  }
  
  /**
   * Show user-friendly error message
   */
  showUserMessage(errorObj) {
    const messages = {
      network: {
        title: 'Connection Error',
        message: 'Unable to connect to the AI service. Please check your internet connection and try again.',
        actions: ['Retry', 'Check Connection']
      },
      api: {
        title: 'API Error',
        message: 'There was a problem with your API key. Please verify it is correct and has not expired.',
        actions: ['Check Keys', 'Retry']
      },
      quota_exceeded: {
        title: '⚠️ Out of Tokens',
        message: 'You have run out of API tokens or exceeded your quota for this provider. Please check your billing status or add more credits.',
        actions: ['Check Billing', 'Use Different API']
      },
      timeout: {
        title: 'Request Timeout',
        message: 'The request took too long to complete. This can happen with complex analyses. Try again or reduce image count.',
        actions: ['Retry', 'Use Fewer Images']
      },
      parsing: {
        title: 'Processing Error',
        message: 'Unable to process the response from the AI service. This is usually temporary.',
        actions: ['Retry']
      },
      unknown: {
        title: 'Unexpected Error',
        message: errorObj.message || 'An unexpected error occurred. Please try again.',
        actions: ['Retry']
      }
    };
    
    const template = messages[errorObj.type] || messages.unknown;
    
    this.showNotification('error', `${template.title}: ${template.message}`);
    
    // Log detailed error to console for debugging
    console.error('Error Details:', errorObj);
  }
  
  /**
   * Retry with exponential backoff
   */
  async retry(fn, context = '', maxRetries = this.maxRetries) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} for ${context}`);
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
  }
  
  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Check if error is recoverable
   */
  isRecoverable(error) {
    const type = this.categorizeError(error);
    return ['network', 'timeout', 'rate_limit'].includes(type);
  }
  
  /**
   * Get recovery suggestions
   */
  getRecoverySuggestions(error) {
    const type = this.categorizeError(error);
    
    const suggestions = {
      network: [
        'Check your internet connection',
        'Verify you can access the internet',
        'Try refreshing the page',
        'Disable VPN or proxy if using one'
      ],
      api: [
        'Verify your API key is correct',
        'Check if the API key has expired',
        'Ensure the API key has necessary permissions',
        'Try regenerating the API key',
        'Check provider status page'
      ],
      quota_exceeded: [
        'Check your API provider\'s billing dashboard',
        'Verify you have sufficient credits/tokens',
        'Add payment method if required',
        'Use a different API provider',
        'Wait until your quota resets (if on free tier)'
      ],
      timeout: [
        'Try with fewer images',
        'Ensure images are not too large',
        'Check your internet speed',
        'Try again later'
      ],
      parsing: [
        'Try the analysis again',
        'Report this error if it persists',
        'Check console for details'
      ],
      unknown: [
        'Try refreshing the page',
        'Clear browser cache',
        'Try a different browser',
        'Report this error if it persists'
      ]
    };
    
    return suggestions[type] || suggestions.unknown;
  }
  
  /**
   * Log error
   */
  log(errorObj) {
    console.group(`❌ Error: ${errorObj.type}`);
    console.error('Message:', errorObj.message);
    console.error('Context:', errorObj.context);
    console.error('Timestamp:', new Date(errorObj.timestamp).toISOString());
    if (errorObj.stack) {
      console.error('Stack:', errorObj.stack);
    }
    console.groupEnd();
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
    }, 7000); // Longer for errors
  }
  
  /**
   * Get error history
   */
  getErrors() {
    return this.errors;
  }
  
  /**
   * Clear error history
   */
  clearErrors() {
    this.errors = [];
  }
  
  /**
   * Check API health
   */
  async checkAPIHealth(provider, apiKey) {
    // This would make a test call to verify the API is accessible
    // For now, just a placeholder
    console.log(`Checking health for ${provider}...`);
    return true;
  }
  
  /**
   * Format error for display
   */
  formatError(error) {
    if (typeof error === 'string') {
      return error;
    }
    return error.message || 'Unknown error';
  }
  
  /**
   * Handle specific API errors
   */
  handleAPIError(provider, error, response = null) {
    let message = '';
    
    if (response) {
      switch (response.status) {
        case 401:
          message = `${provider}: Invalid API key. Please check your key and try again.`;
          break;
        case 403:
          message = `${provider}: Access forbidden. Your key may lack necessary permissions.`;
          break;
        case 429:
          message = `${provider}: Rate limit exceeded. Please wait a moment and try again.`;
          break;
        case 500:
        case 502:
        case 503:
          message = `${provider}: Service temporarily unavailable. Please try again later.`;
          break;
        default:
          message = `${provider}: ${error.message}`;
      }
    } else {
      message = `${provider}: ${error.message}`;
    }
    
    return new Error(message);
  }
}

// Create global instance
window.ErrorHandler = ErrorHandler;

/**
 * tapestrAI v3.0 - Image Processor
 * Handles image upload, compression, optimization, and validation
 */

class ImageProcessor {
  constructor() {
    this.maxSizeMB = 20;
    this.targetSizeMB = 4; // Compress to 4MB for API efficiency
    this.maxImages = 5;
    this.allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    this.images = [];
  }
  
  /**
   * Handle file selection from input
   */
  handleFileSelect(event) {
    const files = Array.from(event.target.files);
    this.processFiles(files);
  }
  
  /**
   * Handle drag and drop
   */
  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
      uploadArea.classList.remove('dragover');
    }
    
    const files = Array.from(event.dataTransfer.files);
    this.processFiles(files);
  }
  
  /**
   * Process uploaded files
   */
  async processFiles(files) {
    // Filter valid image files
    const imageFiles = files.filter(file => this.allowedFormats.includes(file.type));
    
    if (imageFiles.length === 0) {
      this.showNotification('error', 'Please upload valid image files (JPG, PNG, or WEBP)');
      return;
    }
    
    // Check if adding these would exceed max images
    if (this.images.length + imageFiles.length > this.maxImages) {
      this.showNotification('warning', `Maximum ${this.maxImages} images allowed. Only first ${this.maxImages - this.images.length} will be added.`);
      imageFiles.splice(this.maxImages - this.images.length);
    }
    
    // Process each file
    for (const file of imageFiles) {
      await this.processFile(file);
    }
    
    // Update UI
    this.updatePreviews();
    
    // Dispatch event to notify main.js
    window.dispatchEvent(new CustomEvent('imagesUpdated', {
      detail: { count: this.images.length }
    }));
  }
  
  /**
   * Process single file
   */
  async processFile(file) {
    try {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > this.maxSizeMB) {
        this.showNotification('error', `${file.name} is too large (max ${this.maxSizeMB}MB)`);
        return;
      }
      
      // Read and compress image
      const compressedData = await this.compressImage(file);
      
      // Create image object
      const imageObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        originalSize: file.size,
        compressedSize: compressedData.size,
        type: file.type,
        data: compressedData.dataUrl,
        width: compressedData.width,
        height: compressedData.height
      };
      
      this.images.push(imageObj);
      
      const compressionRatio = ((1 - imageObj.compressedSize / imageObj.originalSize) * 100).toFixed(1);
      console.log(`✓ Processed ${file.name}: ${(imageObj.originalSize / 1024 / 1024).toFixed(2)}MB → ${(imageObj.compressedSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% reduction)`);
      
    } catch (error) {
      console.error('Error processing file:', error);
      this.showNotification('error', `Failed to process ${file.name}`);
    }
  }
  
  /**
   * Compress image to target size
   */
  async compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate dimensions (max 2048px on longest side)
          let width = img.width;
          let height = img.height;
          const maxDimension = 2048;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels to get under target size
          let quality = 0.9;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          let size = this.dataUrlToSize(dataUrl);
          
          // Reduce quality until under target size
          while (size > this.targetSizeMB * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            size = this.dataUrlToSize(dataUrl);
          }
          
          resolve({
            dataUrl,
            size,
            width,
            height,
            quality
          });
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Calculate size of data URL in bytes
   */
  dataUrlToSize(dataUrl) {
    const base64 = dataUrl.split(',')[1];
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 0.75) - padding;
  }
  
  /**
   * Remove image
   */
  removeImage(id) {
    this.images = this.images.filter(img => img.id !== id);
    this.updatePreviews();
    
    window.dispatchEvent(new CustomEvent('imagesUpdated', {
      detail: { count: this.images.length }
    }));
  }
  
  /**
   * Clear all images
   */
  clearAll() {
    this.images = [];
    this.updatePreviews();
    
    window.dispatchEvent(new CustomEvent('imagesUpdated', {
      detail: { count: 0 }
    }));
  }
  
  /**
   * Get all images
   */
  getImages() {
    return this.images;
  }
  
  /**
   * Get image count
   */
  getCount() {
    return this.images.length;
  }
  
  /**
   * Update preview display
   */
  updatePreviews() {
    const container = document.getElementById('image-previews');
    if (!container) return;
    
    if (this.images.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = this.images.map(img => `
      <div class="image-preview relative">
        <img src="${img.data}" alt="${img.name}" class="rounded-lg shadow-md">
        <button 
          class="image-preview-remove"
          onclick="window.imageProcessor.removeImage(${img.id})"
          title="Remove image">
          ✕
        </button>
        <div class="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
          <div class="font-semibold truncate">${img.name}</div>
          <div>${img.width}×${img.height} • ${(img.compressedSize / 1024 / 1024).toFixed(2)}MB</div>
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Show notification
   */
  showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  /**
   * Convert image to base64 for API
   */
  async imageToBase64(imageObj) {
    // Already in data URL format, extract base64
    const base64 = imageObj.data.split(',')[1];
    return base64;
  }
  
  /**
   * Prepare images for analysis (returns array of base64 strings)
   */
  async prepareForAnalysis() {
    return Promise.all(
      this.images.map(img => this.imageToBase64(img))
    );
  }
}

// Create global instance
window.ImageProcessor = ImageProcessor;

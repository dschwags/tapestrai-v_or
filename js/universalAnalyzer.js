/**
 * tapestrAI v3.0 - Universal Analyzer
 * Category-agnostic analysis engine that works for any artifact
 */

class UniversalAnalyzer {
  constructor() {
    this.analysisHistory = [];
    this.currentAnalysis = null;
  }
  
  /**
   * Main analysis method
   */
  async analyze(imageData, userContext = '', apiKeyManager) {
    this.currentAnalysis = {
      id: Date.now() + Math.random(),
      startTime: Date.now(),
      status: 'initializing'
    };
    
    try {
      // Validate Gemini key (required for primary analysis)
      if (!apiKeyManager.keys.gemini) {
        throw new Error('Gemini API key required for analysis. Please add it in the API Setup section.');
      }
      
      // Run primary analysis
      const rawResult = await this.runGeminiAnalysis(imageData, userContext, apiKeyManager);
      
      // Parse structured sections
      const parsed = this.parseAnalysisResult(rawResult);
      
      // Extract keywords
      const keywords = this.extractKeywords(parsed);
      
      // Build final result
      const result = {
        id: this.currentAnalysis.id,
        timestamp: new Date().toISOString(),
        success: true,
        
        // Raw analysis
        rawAnalysis: rawResult,
        
        // Structured sections
        ...parsed,
        
        // Metadata
        keywords,
        analysisTime: Date.now() - this.currentAnalysis.startTime,
        agentsUsed: ['gemini']
      };
      
      this.analysisHistory.push(result);
      this.currentAnalysis.status = 'complete';
      
      return result;
      
    } catch (error) {
      this.currentAnalysis.status = 'error';
      console.error('Analysis failed:', error);
      throw error;
    }
  }
  
  /**
   * Run analysis with Gemini
   */
  async runGeminiAnalysis(imageData, userContext, apiKeyManager) {
    const prompt = this.getUniversalAnalysisPrompt();
    const apiKey = apiKeyManager.keys.gemini;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    // Extract base64 from data URL
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          ...(userContext ? [{
            text: `\n\n### USER CONTEXT:\n${userContext}\n\nConsider this context when analyzing the artifact.`
          }] : []),
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API returned no results');
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    // Track usage if available
    if (data.usageMetadata && window.costTracker) {
      window.costTracker.trackCall(
        'gemini',
        data.usageMetadata.promptTokenCount || 0,
        data.usageMetadata.candidatesTokenCount || 0,
        'gemini-2.0-flash-exp'
      );
    }
    
    return text;
  }
  
  /**
   * Universal analysis prompt
   */
  getUniversalAnalysisPrompt() {
    return `You are an expert artifact analyst with decades of experience across multiple domains: antiques, collectibles, art history, material science, and cultural anthropology.

# ANALYSIS FRAMEWORK

Analyze this artifact systematically using the following structure. Be thorough, precise, and evidence-based.

## 1. PHYSICAL ANALYSIS

### Materials Identification
- **Primary materials**: Main structure (be specific: "sterling silver" not just "metal")
- **Secondary materials**: Other materials present
- **Material quality**: Grade/quality assessment
- **Material condition**: Current state
- **Manufacturing evidence**: Machine vs handmade indicators

### Construction Method
- **Primary technique**: Main construction method
- **Joinery/Assembly**: How parts connect
- **Tool marks**: Evidence of tools used
- **Craftsmanship level**: Skill assessment
- **Production method**: Individual vs mass-produced

### Physical Characteristics
- **Dimensions**: Approximate size
- **Weight indicators**: Heavy or light for size?
- **Symmetry**: Symmetrical or asymmetrical?
- **Surface finish**: Polished, matte, textured, worn?
- **Colors**: Primary and secondary colors
- **Decorative elements**: Patterns, motifs, embellishments

## 2. MARKINGS & TEXT ANALYSIS
- **Maker's marks**: Signatures, stamps, hallmarks, logos
- **Text content**: Words, numbers, phrases (transcribe exactly)
- **Symbols**: Decorative or functional symbols
- **Location**: Where are marks found?
- **Dating clues**: What marks indicate about age

## 3. AGE INDICATORS
- **Wear patterns**: Use wear showing how it was handled
- **Patina**: Natural aging of materials
- **Repairs**: Historical repairs or modifications
- **Style period**: Artistic/historical period
- **Date range**: Estimated when made (be specific)

## 4. FUNCTIONAL ANALYSIS
- **Primary function**: Main intended use
- **Usage context**: Where/how would this be used?
- **User interaction**: How would someone use this?
- **Design intention**: Functional vs aesthetic features

## 5. CULTURAL & HISTORICAL CONTEXT
- **Geographic origin**: Where likely made/used
- **Historical period**: Specific era with date range
- **Social context**: Who would have owned/used this?
- **Cultural significance**: Symbolic or ceremonial meaning

## 6. CATEGORY CLASSIFICATION
- **Primary category**: Best classification
- **Confidence level**: 0-100%
- **Category keywords**: [10-15 descriptive terms for classification]

## 7. RESEARCH RECOMMENDATIONS
- **Further investigation**: What to research
- **Key search terms**: Best keywords
- **Authentication needs**: If valuable, what authentication needed

## 8. CONFIDENCE ASSESSMENT
For each major conclusion, provide confidence level:
- Materials: X%
- Dating: X%
- Origin: X%
- Purpose: X%

---

Be precise, evidence-based, and acknowledge uncertainty. Begin your analysis now.`;
  }
  
  /**
   * Parse structured sections from AI response
   */
  parseAnalysisResult(rawText) {
    return {
      rawText,
      materials: this.extractSection(rawText, /##?\s*1\..*?PHYSICAL.*?###?\s*Materials/i, /###?\s*Construction/i),
      construction: this.extractSection(rawText, /###?\s*Construction Method/i, /###?\s*Physical Char/i),
      markings: this.extractSection(rawText, /##?\s*2\..*?MARKINGS/i, /##?\s*3\./i),
      ageIndicators: this.extractSection(rawText, /##?\s*3\..*?AGE/i, /##?\s*4\./i),
      purpose: this.extractSection(rawText, /##?\s*4\..*?FUNCTIONAL/i, /##?\s*5\./i),
      culturalContext: this.extractSection(rawText, /##?\s*5\..*?CULTURAL/i, /##?\s*6\./i),
      category: this.extractSection(rawText, /##?\s*6\..*?CATEGORY/i, /##?\s*7\./i),
      researchRecommendations: this.extractSection(rawText, /##?\s*7\..*?RESEARCH/i, /##?\s*8\./i),
      confidence: this.extractSection(rawText, /##?\s*8\..*?CONFIDENCE/i, null)
    };
  }
  
  /**
   * Extract section from text between two patterns
   */
  extractSection(text, startPattern, endPattern) {
    const startMatch = text.match(startPattern);
    if (!startMatch) return '';
    
    const startIndex = startMatch.index + startMatch[0].length;
    
    if (!endPattern) {
      return text.substring(startIndex).trim();
    }
    
    const endMatch = text.substring(startIndex).match(endPattern);
    const endIndex = endMatch ? startIndex + endMatch.index : text.length;
    
    return text.substring(startIndex, endIndex).trim();
  }
  
  /**
   * Extract keywords from analysis
   */
  extractKeywords(parsed) {
    const keywords = new Set();
    
    // Extract from category section
    const categoryMatch = parsed.category.match(/\[([^\]]+)\]/);
    if (categoryMatch) {
      categoryMatch[1].split(',').forEach(term => {
        keywords.add(term.trim().toLowerCase());
      });
    }
    
    // Extract materials
    const materials = ['silver', 'gold', 'brass', 'copper', 'bronze', 'iron', 'steel', 
                      'wood', 'oak', 'mahogany', 'ceramic', 'porcelain', 'glass', 
                      'fabric', 'silk', 'leather', 'plastic'];
    materials.forEach(mat => {
      if (parsed.materials.toLowerCase().includes(mat)) {
        keywords.add(mat);
      }
    });
    
    return Array.from(keywords);
  }
}

// Create global class (instances created by agentOrchestrator)
window.UniversalAnalyzer = UniversalAnalyzer;

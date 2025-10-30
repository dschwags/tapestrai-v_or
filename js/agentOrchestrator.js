/**
 * tapestrAI v3.0 - Agent Orchestrator
 * Coordinates multiple AI agents for comprehensive analysis
 */

class AgentOrchestrator {
  constructor() {
    this.universalAnalyzer = new window.UniversalAnalyzer();
  }
  
  /**
   * Run complete multi-agent analysis
   */
  async analyzeWithAgents(images, apiKeyManager, progressUI, costTracker) {
    try {
      // Start cost tracking
      if (costTracker) {
        costTracker.startAnalysis();
      }
      
      // Get available agents
      const agents = apiKeyManager.getAvailableAgents();
      
      if (agents.length === 0) {
        throw new Error('No API keys configured. Please add at least Gemini API key.');
      }
      
      // Initialize progress
      if (progressUI) {
        progressUI.start(agents);
      }
      
      // Step 1: Process images
      if (progressUI) progressUI.setStep('upload', 'active');
      const imageDataArray = await this.prepareImages(images);
      if (progressUI) progressUI.nextStep();
      
      // Step 2: Run primary analysis (Gemini - Material Analyst)
      if (progressUI) progressUI.setStep('material', 'active');
      const primaryAnalysis = await this.universalAnalyzer.analyze(
        imageDataArray[0], // Use first image for now
        '',
        apiKeyManager
      );
      if (progressUI) progressUI.nextStep();
      
      // Step 3: Run additional agents if available
      const additionalResults = {};
      
      // Cultural Specialist (OpenAI)
      if (apiKeyManager.keys.openai && progressUI) {
        progressUI.setStep('cultural', 'active');
        try {
          additionalResults.cultural = await this.runCulturalAnalysis(
            imageDataArray[0],
            primaryAnalysis,
            apiKeyManager
          );
        } catch (error) {
          console.error('Cultural analysis failed:', error);
          if (progressUI) progressUI.setError('cultural', error.message);
        }
        if (progressUI) progressUI.nextStep();
      }
      
      // Historical Researcher (Perplexity)
      if (apiKeyManager.keys.perplexity && progressUI) {
        progressUI.setStep('research', 'active');
        try {
          additionalResults.research = await this.runHistoricalResearch(
            primaryAnalysis,
            apiKeyManager
          );
        } catch (error) {
          console.error('Historical research failed:', error);
          if (progressUI) progressUI.setError('research', error.message);
        }
        if (progressUI) progressUI.nextStep();
      }
      
      // Synthesis Curator (Claude)
      if (apiKeyManager.keys.anthropic && progressUI) {
        progressUI.setStep('synthesis', 'active');
        try {
          additionalResults.synthesis = await this.runSynthesis(
            primaryAnalysis,
            additionalResults,
            apiKeyManager
          );
        } catch (error) {
          console.error('Synthesis failed:', error);
          if (progressUI) progressUI.setError('synthesis', error.message);
        }
        if (progressUI) progressUI.nextStep();
      }
      
      // Step 4: Complete analysis
      if (progressUI) progressUI.setStep('complete', 'active');
      
      // Combine all results
      const finalResult = {
        primary: primaryAnalysis,
        additional: additionalResults,
        agents: agents.map(a => a.name),
        timestamp: new Date().toISOString(),
        imageCount: images.length
      };
      
      // Complete cost tracking
      if (costTracker) {
        costTracker.completeAnalysis(images.length);
      }
      
      if (progressUI) {
        progressUI.complete();
      }
      
      return finalResult;
      
    } catch (error) {
      if (progressUI) {
        progressUI.reset();
      }
      throw error;
    }
  }
  
  /**
   * Prepare images for analysis
   */
  async prepareImages(images) {
    return images.map(img => {
      // Images from imageProcessor are already in the right format
      return img.data;
    });
  }
  
  /**
   * Run cultural analysis with OpenAI
   */
  async runCulturalAnalysis(imageData, primaryAnalysis, apiKeyManager) {
    const apiKey = apiKeyManager.keys.openai;
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    const contextPrompt = `Based on this primary artifact analysis, provide deep cultural and social context:

PRIMARY ANALYSIS SUMMARY:
${primaryAnalysis.rawText.substring(0, 1000)}...

FOCUS ON:
1. Cultural significance and symbolism
2. Social context of use (class, gender, occasion)
3. Historical cultural practices related to this type of object
4. Regional cultural variations
5. Evolution of cultural meaning over time

Provide a comprehensive cultural narrative (500-800 words).`;
    
    const requestBody = {
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a cultural historian and anthropologist specializing in material culture and social history.'
        },
        {
          role: 'user',
          content: contextPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usage && window.costTracker) {
      window.costTracker.trackCall(
        'openai',
        data.usage.prompt_tokens || 0,
        data.usage.completion_tokens || 0,
        'gpt-4-turbo'
      );
    }
    
    return data.choices[0].message.content;
  }
  
  /**
   * Run historical research with Perplexity
   */
  async runHistoricalResearch(primaryAnalysis, apiKeyManager) {
    const apiKey = apiKeyManager.keys.perplexity;
    const endpoint = 'https://api.perplexity.ai/chat/completions';
    
    // Extract keywords for research
    const keywords = primaryAnalysis.keywords.slice(0, 5).join(', ');
    
    const researchPrompt = `Research historical documentation and provenance information about: ${keywords}

Context from analysis: ${primaryAnalysis.category.substring(0, 200)}

Find:
1. Historical records of similar items
2. Museum collections with comparable pieces
3. Market history and notable sales
4. Manufacturing history and makers
5. Evolution of this type of object

Provide factual, cited information with web sources.`;
    
    const requestBody = {
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'You are a historical researcher with access to web sources. Provide factual, well-sourced information.'
        },
        {
          role: 'user',
          content: researchPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Perplexity API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usage && window.costTracker) {
      window.costTracker.trackCall(
        'perplexity',
        data.usage.prompt_tokens || 0,
        data.usage.completion_tokens || 0,
        'sonar-pro'
      );
    }
    
    return data.choices[0].message.content;
  }
  
  /**
   * Run synthesis with Claude
   */
  async runSynthesis(primaryAnalysis, additionalResults, apiKeyManager) {
    const apiKey = apiKeyManager.keys.anthropic;
    const endpoint = 'https://api.anthropic.com/v1/messages';
    
    const synthesisPrompt = `Create a comprehensive, narrative synthesis of this artifact analysis:

PRIMARY ANALYSIS:
${primaryAnalysis.rawText.substring(0, 800)}

CULTURAL CONTEXT:
${additionalResults.cultural || 'Not available'}

HISTORICAL RESEARCH:
${additionalResults.research || 'Not available'}

YOUR TASK:
Weave these perspectives into a compelling, cohesive narrative that:
1. Tells the artifact's story in an engaging way
2. Resolves any conflicts between sources
3. Highlights what we know with high confidence
4. Acknowledges uncertainties
5. Provides practical next steps for the owner

Write 600-1000 words as a unified expert assessment.`;
    
    const requestBody = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: synthesisPrompt
        }
      ],
      temperature: 0.7
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Claude API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usage && window.costTracker) {
      window.costTracker.trackCall(
        'anthropic',
        data.usage.input_tokens || 0,
        data.usage.output_tokens || 0,
        'claude-sonnet-4'
      );
    }
    
    return data.content[0].text;
  }
}

// Create global class
window.AgentOrchestrator = AgentOrchestrator;

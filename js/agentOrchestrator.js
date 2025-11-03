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
  async analyzeWithAgents(images, apiKeyManager, progressUI, costTracker, userContext = '') {
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
        userContext, // Pass user-provided material details
        apiKeyManager
      );
      if (progressUI) progressUI.nextStep();
      
      // Step 3: Run additional agents if available
      const additionalResults = {};
      
      // Cultural Specialist (OpenAI or DeepSeek)
      const hasCulturalAnalysis = apiKeyManager.keys.openai || apiKeyManager.keys.deepseek;
      if (hasCulturalAnalysis && progressUI) {
        progressUI.setStep('cultural', 'active');
        try {
          // Prioritize DeepSeek if available (100x cheaper!), otherwise use OpenAI
          if (apiKeyManager.keys.deepseek) {
            additionalResults.cultural = await this.runDeepSeekCultural(
              imageDataArray[0],
              primaryAnalysis,
              apiKeyManager
            );
          } else if (apiKeyManager.keys.openai) {
            additionalResults.cultural = await this.runCulturalAnalysis(
              imageDataArray[0],
              primaryAnalysis,
              apiKeyManager
            );
          }
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
      
      //Decide if we need synthesis
      const perspectiveCount = Object.keys(additionalResults).length;
      const needsSynthesis = perspectiveCount > 0; // 2+ perspectives = synthesize
      
      let finalAnalysis = primaryAnalysis;
      let factCheck = null;
      
      // If we have multiple perspectives, run Gemini synthesis
      if (needsSynthesis) {
        finalAnalysis = await this.runGeminiSynthesis(
          primaryAnalysis,
          additionalResults,
          apiKeyManager
        );
      }
      
      // If Perplexity available, fact-check key claims
      if (apiKeyManager.keys.perplexity && primaryAnalysis.keyClaims) {
        try {
          const claims = this.universalAnalyzer.extractKeyClaims(primaryAnalysis.rawText);
          if (claims && claims.length > 0) {
            factCheck = await this.runFactCheck(claims, apiKeyManager);
          }
        } catch (error) {
          console.error('Fact-checking failed:', error);
          // Don't fail entire analysis if fact-checking fails
        }
      }
      
      // Generate research links for further learning
      const researchLinks = this.generateResearchLinks(primaryAnalysis);
      
      // Combine all results
      const finalResult = {
        primary: primaryAnalysis,
        synthesis: needsSynthesis ? finalAnalysis : null,
        factCheck: factCheck,
        additional: additionalResults,
        researchLinks: researchLinks,
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
    const config = apiKeyManager.providers.openai;
    const endpoint = config.endpoint; // Uses Worker proxy or direct API
    
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
   * Run cultural analysis with DeepSeek
   */
  async runDeepSeekCultural(imageData, primaryAnalysis, apiKeyManager) {
    const apiKey = apiKeyManager.keys.deepseek;
    const config = apiKeyManager.providers.deepseek;
    const endpoint = config.endpoint; // Uses Worker proxy or direct API
    
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
      model: 'deepseek-chat',
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
      throw new Error(errorData.error?.message || `DeepSeek API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usage && window.costTracker) {
      window.costTracker.trackCall(
        'deepseek',
        data.usage.prompt_tokens || 0,
        data.usage.completion_tokens || 0,
        'deepseek-chat'
      );
    }
    
    return data.choices[0].message.content;
  }
  
  /**
   * Run historical research with Perplexity
   */
  async runHistoricalResearch(primaryAnalysis, apiKeyManager) {
    const apiKey = apiKeyManager.keys.perplexity;
    const config = apiKeyManager.providers.perplexity;
    const endpoint = config.endpoint; // Uses Worker proxy or direct API
    
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
  
  /**
   * Run Gemini synthesis of multiple perspectives
   */
  async runGeminiSynthesis(primaryAnalysis, additionalResults, apiKeyManager) {
    const apiKey = apiKeyManager.keys.gemini;
    const config = apiKeyManager.providers.gemini;
    
    // Use Worker proxy if available
    const useWorker = apiKeyManager.useWorker;
    const endpoint = useWorker 
      ? `${config.endpoint}?key=${apiKey}`
      : `${config.directEndpoint}/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    // Build synthesis prompt based on available perspectives
    let synthesisPrompt = `You previously analyzed an artifact. Now synthesize multiple perspectives:

YOUR MATERIAL ANALYSIS (key points):
${primaryAnalysis.rawText.substring(0, 1000)}...

`;
    
    if (additionalResults.cultural) {
      synthesisPrompt += `CULTURAL CONTEXT (from historian):
${additionalResults.cultural.substring(0, 800)}...

`;
    }
    
    if (additionalResults.research) {
      synthesisPrompt += `RESEARCH FINDINGS (from web):
${additionalResults.research.substring(0, 800)}...

`;
    }
    
    synthesisPrompt += `Create a comprehensive synthesis (800-1200 words):

`;
    
    if (additionalResults.cultural && additionalResults.research) {
      synthesisPrompt += `1. VALIDATED FINDINGS
   - What does research confirm about your analysis?
   - Adjust confidence based on evidence

2. CULTURAL ENRICHMENT  
   - How does cultural context explain physical features?
   - What social meaning did this artifact carry?

3. INTEGRATED NARRATIVE
   - Combine material, cultural, and historical research
   - Tell the artifact's story with supporting evidence

4. CONFIDENCE ASSESSMENT
   - Update your confidence scores
   - Mark what's confirmed vs. speculative`;
    } else if (additionalResults.cultural) {
      synthesisPrompt += `1. INTEGRATED NARRATIVE
   - Combine material facts with cultural meaning
   - How physical features relate to social use

2. CULTURAL ENRICHMENT
   - Symbolic meanings and social context
   - Historical cultural practices

3. CONFIDENCE ASSESSMENT
   - Maintain your confidence scores
   - Note areas cultural context enriches`;
    } else if (additionalResults.research) {
      synthesisPrompt += `1. VALIDATION
   - What research confirms or contradicts your analysis?
   - Adjust confidence based on evidence

2. RESEARCH INTEGRATION
   - New information from sources
   - Comparable items found

3. CONFIDENCE UPDATE
   - Updated confidence scores with evidence
   - Verified facts vs. educated guesses`;
    }
    
    const geminiPayload = {
      contents: [{
        parts: [{ text: synthesisPrompt }]
      }],
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048
      }
    };
    
    const requestBody = useWorker ? {
      model: config.model,
      payload: geminiPayload
    } : geminiPayload;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini synthesis failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini synthesis returned no results');
    }
    
    const synthesisText = data.candidates[0].content.parts[0].text;
    
    // Track usage
    if (data.usageMetadata && window.costTracker) {
      window.costTracker.trackCall(
        'gemini',
        data.usageMetadata.promptTokenCount || 0,
        data.usageMetadata.candidatesTokenCount || 0,
        'gemini-2.0-flash-exp'
      );
    }
    
    return synthesisText;
  }
  
  /**
   * Run fact-checking on key claims with Perplexity
   */
  async runFactCheck(claims, apiKeyManager) {
    const apiKey = apiKeyManager.keys.perplexity;
    const config = apiKeyManager.providers.perplexity;
    const endpoint = config.endpoint; // Uses Worker proxy or direct API
    
    const factCheckPrompt = `Verify these artifact-related claims using reliable sources:

${claims.map((c, i) => `${i+1}. ${c}`).join('\n')}

For each claim, provide:
- Verification status (Confirmed/Contradicted/Unclear)
- Brief explanation (1-2 sentences)
- Source URL if available

Focus on factual accuracy, not opinions.`;
    
    const requestBody = {
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'You are a fact-checker specializing in art history and antiques. Verify claims using authoritative sources.'
        },
        {
          role: 'user',
          content: factCheckPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.2
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
      throw new Error(errorData.error?.message || `Fact-checking failed: ${response.status}`);
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
    
    return {
      claims: claims,
      verification: data.choices[0].message.content,
      citations: this.extractCitations(data.choices[0].message.content)
    };
  }
  
  /**
   * Extract citations from fact-check response
   */
  extractCitations(text) {
    const urls = [];
    const urlPattern = /https?:\/\/[^\s)]+/g;
    const matches = text.match(urlPattern);
    if (matches) {
      urls.push(...matches);
    }
    return [...new Set(urls)]; // Remove duplicates
  }
  
  /**
   * Handle follow-up questions using Gemini
   */
  async askFollowup(images, prompt, apiKeyManager) {
    const apiKey = apiKeyManager.keys.gemini;
    if (!apiKey) {
      throw new Error('Gemini API key required for follow-up questions');
    }
    
    const config = apiKeyManager.providers.gemini;
    const model = config.model;
    const endpoint = config.useWorker ? config.endpoint : config.directEndpoint;
    
    // Prepare image parts if images provided
    const imageParts = images && images.length > 0 ? images.map(img => ({
      inline_data: {
        mime_type: 'image/jpeg',
        data: img.data.split(',')[1] // Remove data:image/jpeg;base64, prefix
      }
    })) : [];
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...imageParts
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };
    
    const url = apiKeyManager.useWorker 
      ? `${endpoint}?key=${apiKey}`
      : `${endpoint}/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    if (data.usageMetadata && window.costTracker) {
      window.costTracker.trackCall(
        'gemini',
        data.usageMetadata.promptTokenCount || 0,
        data.usageMetadata.candidatesTokenCount || 0,
        model
      );
    }
    
    return data.candidates[0].content.parts[0].text;
  }
  
  /**
   * Generate suggested research links for further learning
   * Creates links to Wikipedia, Google Scholar, and museum databases
   */
  generateResearchLinks(primaryAnalysis) {
    const links = [];
    
    // Extract key terms from keywords and category
    const keywords = primaryAnalysis.keywords || [];
    const category = primaryAnalysis.category || '';
    
    // Build search terms
    const searchTerms = [];
    
    // Add category if available
    if (category && category.trim()) {
      searchTerms.push(category.trim());
    }
    
    // Add top 3 keywords
    keywords.slice(0, 3).forEach(kw => {
      if (kw && kw.trim()) {
        searchTerms.push(kw.trim());
      }
    });
    
    // If no terms, use generic artifact search
    if (searchTerms.length === 0) {
      searchTerms.push('historical artifact');
    }
    
    // Generate Wikipedia link (no special characters in URL path)
    const wikiTerm = searchTerms[0].replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    links.push({
      title: `Wikipedia: ${searchTerms[0]}`,
      url: `https://en.wikipedia.org/wiki/${wikiTerm}`,
      description: 'Encyclopedia information and history',
      icon: '📖'
    });
    
    // Generate Google Scholar link
    const scholarQuery = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `Google Scholar Research`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(scholarQuery)}`,
      description: 'Academic research and publications',
      icon: '🎓'
    });
    
    // Generate Smithsonian link (corrected URL format)
    const smithsonianQuery = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `Smithsonian Collections`,
      url: `https://collections.si.edu/search/?q=${encodeURIComponent(smithsonianQuery)}`,
      description: 'Museum artifacts and collections',
      icon: '🏛️'
    });
    
    // Generate Google Arts & Culture link (corrected URL format)
    const artsQuery = searchTerms[0];
    links.push({
      title: `Google Arts & Culture`,
      url: `https://artsandculture.google.com/search?q=${encodeURIComponent(artsQuery)}`,
      description: 'Virtual museum tours and exhibits',
      icon: '🎨'
    });
    
    // Generate Met Museum link (corrected URL format)
    const metQuery = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `Metropolitan Museum of Art`,
      url: `https://www.metmuseum.org/art/collection/search?q=${encodeURIComponent(metQuery)}`,
      description: 'Met Museum collections',
      icon: '🏺'
    });
    
    // Generate V&A Museum link
    const vaQuery = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `Victoria & Albert Museum`,
      url: `https://collections.vam.ac.uk/search/?q=${encodeURIComponent(vaQuery)}`,
      description: 'V&A collections and archives',
      icon: '🏛️'
    });
    
    // === Similar Items for Sale/Research ===
    
    // eBay - similar items
    const ebayQuery = searchTerms.slice(0, 2).join(' ') + ' antique vintage';
    links.push({
      title: `eBay: Similar Items`,
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(ebayQuery)}`,
      description: 'Find similar items and current market values',
      icon: '🛒'
    });
    
    // Etsy - similar vintage/antique items
    const etsyQuery = searchTerms.slice(0, 2).join(' ') + ' vintage antique';
    links.push({
      title: `Etsy: Vintage Similar Items`,
      url: `https://www.etsy.com/search?q=${encodeURIComponent(etsyQuery)}`,
      description: 'Vintage and handmade similar items',
      icon: '🎁'
    });
    
    // Ruby Lane - antiques and collectibles
    const rubyQuery = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `Ruby Lane: Antiques`,
      url: `https://www.rubylane.com/search?q=${encodeURIComponent(rubyQuery)}`,
      description: 'High-end antiques and collectibles',
      icon: '💎'
    });
    
    // 1stDibs - luxury antiques
    const stdibs = searchTerms.slice(0, 2).join(' ');
    links.push({
      title: `1stDibs: Luxury Antiques`,
      url: `https://www.1stdibs.com/search/?q=${encodeURIComponent(stdibs)}`,
      description: 'High-end similar items and valuations',
      icon: '✨'
    });
    
    // Generate general Google search link
    const googleQuery = searchTerms.join(' ') + ' antique history';
    links.push({
      title: `Google Search`,
      url: `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`,
      description: 'General web search for more info',
      icon: '🔍'
    });
    
    return links;
  }
}

// Create global class
window.AgentOrchestrator = AgentOrchestrator;

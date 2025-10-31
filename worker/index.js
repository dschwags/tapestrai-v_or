/**
 * Cloudflare Worker for tapestrAI API Proxy
 * Handles all external API calls to bypass CORS
 * Supports: Gemini, OpenAI, Anthropic, Perplexity
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Route to appropriate API handler
      if (url.pathname.startsWith('/api/gemini')) {
        return await handleGemini(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/openai')) {
        return await handleOpenAI(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/anthropic')) {
        return await handleAnthropic(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/perplexity')) {
        return await handlePerplexity(request, corsHeaders);
      } else if (url.pathname.startsWith('/api/deepseek')) {
        return await handleDeepSeek(request, corsHeaders);
      } else {
        return new Response('API endpoint not found', { 
          status: 404,
          headers: corsHeaders 
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Gemini API Handler
async function handleGemini(request, corsHeaders) {
  const body = await request.json();
  const apiKey = new URL(request.url).searchParams.get('key');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${body.model || 'gemini-2.0-flash-exp'}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload)
    }
  );
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// OpenAI API Handler
async function handleOpenAI(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Anthropic API Handler
async function handleAnthropic(request, corsHeaders) {
  const body = await request.json();
  const apiKey = request.headers.get('x-api-key');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Perplexity API Handler
async function handlePerplexity(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// DeepSeek API Handler
async function handleDeepSeek(request, corsHeaders) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');
  
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

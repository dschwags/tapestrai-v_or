# Getting Started with OpenRouter (Recommended)

## Why OpenRouter?

- ✅ **One key for everything** - No more juggling 6 different API keys
- ✅ **Works everywhere** - No Cloudflare Worker or proxy needed (no CORS issues!)
- ✅ **Free tier** - 10 analyses per day, no credit card
- ✅ **100+ models** - Access to all major AI providers
- ✅ **Smart fallbacks** - If one model is down, automatically tries another
- ✅ **Better pricing** - Same costs as direct APIs, with intelligent routing

## Setup (2 minutes)

### Step 1: Get Your API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Click "Sign In" (use Google/GitHub)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy your key (starts with `sk-or-v1-...`)

### Step 2: Add to tapestrAI

1. Open [tapestrAI](https://tapestrai.pages.dev)
2. Find the **OpenRouter** card (green with ⭐ RECOMMENDED badge)
3. Paste your OpenRouter key
4. Click "Test & Save"
5. Done! Start analyzing! 🎉

## Pricing

| Usage | Cost |
|-------|------|
| First 10/day | **FREE** |
| After that | Pay-per-use |
| Gemini Flash | $0.02 per 1M tokens (~500 analyses) |
| DeepSeek | $0.14 per 1M tokens (~300 analyses) |
| Claude/GPT-4 | $3-10 per 1M tokens (~100 analyses) |

**Typical cost per analysis:** $0.01-0.10

## Available Models Through OpenRouter

OpenRouter gives you access to 100+ AI models. Here are the ones tapestrAI can use:

### Fast & Free Models
- **Gemini 2.0 Flash** - Free tier, very fast, good quality
- **DeepSeek Chat** - Ultra-low cost ($0.14/1M tokens)

### Balanced Models  
- **Claude Sonnet 4** - Excellent quality, balanced cost
- **GPT-4 Turbo** - OpenAI's flagship model

### Specialized Models
- **Claude 3 Opus** - Best for vision and creative tasks
- **Perplexity Sonar** - Web-connected research
- **Llama 3.1** - Open source alternative

## How It Works

1. **You provide ONE key** to OpenRouter
2. **tapestrAI selects the best model** for each task automatically
3. **OpenRouter routes your request** to the appropriate AI provider
4. **You get charged** based on actual usage (same as direct API costs)

### Behind the Scenes
- Material analysis → Uses Gemini Flash (fastest, cheapest)
- Cultural context → Uses GPT-4 or Claude (higher quality)
- Research → Uses Perplexity (web search enabled)
- Synthesis → Uses Claude Opus (best at combining info)

## Comparison: OpenRouter vs Individual Keys

### With Individual Keys (Old Way)
```
❌ Get Gemini key from Google AI Studio
❌ Get OpenAI key from OpenAI Platform  
❌ Get Anthropic key from Anthropic Console
❌ Get Perplexity key from Perplexity Settings
❌ Get DeepSeek key from DeepSeek Platform
❌ Deploy Cloudflare Worker (most don't work in browser!)
❌ Debug CORS errors
⏱️ Time: 2-3 hours
😤 Frustration: High
```

### With OpenRouter (New Way)
```
✅ Get ONE key from OpenRouter
✅ Works immediately in browser
✅ No proxy needed
✅ All models available
⏱️ Time: 5 minutes
😊 Frustration: None
```

## Advanced Features

### Cost Optimization
OpenRouter automatically tries cheaper models first, falling back to premium models only if needed.

### Fallback Routing
If your preferred model is down or rate-limited, OpenRouter automatically tries alternatives.

### Usage Dashboard
Visit [openrouter.ai/activity](https://openrouter.ai/activity) to see:
- Detailed usage statistics
- Cost breakdown by model
- Request history
- Spending limits (optional)

## Frequently Asked Questions

### Q: Can I still use my individual API keys?
**A:** Yes! OpenRouter is just another option. You can use both.

### Q: Is it more expensive?
**A:** No, OpenRouter charges the same as direct API calls. Sometimes cheaper with smart routing.

### Q: What about privacy?
**A:** OpenRouter acts as a proxy - your data goes through them to the AI providers. Read their [privacy policy](https://openrouter.ai/privacy).

### Q: Can I set spending limits?
**A:** Yes! In your OpenRouter dashboard, you can set daily/monthly limits.

### Q: What if OpenRouter is down?
**A:** Keep Gemini as a direct fallback, or wait a few minutes. OpenRouter has 99.9% uptime.

### Q: Do I need to remove my Cloudflare Worker?
**A:** No, keep it for users who prefer individual keys. OpenRouter users won't need it.

## Tips for Best Results

1. **Start with Free Tier** - Test with 10 free requests/day
2. **Use Auto Mode** - Let tapestrAI pick the best model
3. **Monitor Costs** - Check OpenRouter dashboard regularly
4. **Set Limits** - Enable spending limits for peace of mind

## Support

- **OpenRouter Docs:** [openrouter.ai/docs](https://openrouter.ai/docs)
- **Discord:** Join OpenRouter's community
- **Email:** support@openrouter.ai

## Quick Start Checklist

- [ ] Sign up at openrouter.ai
- [ ] Create API key
- [ ] Add key to tapestrAI
- [ ] Test with an artifact
- [ ] Check cost in OpenRouter dashboard
- [ ] (Optional) Set spending limits

---

**Ready to simplify your AI workflow?** Get started with OpenRouter today! 🚀

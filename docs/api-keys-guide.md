# API Keys Guide - tapestrAI v3.0

Complete guide to obtaining and managing API keys for all supported AI providers.

---

## 🎯 Overview

tapestrAI uses **your own API keys** from AI providers. This approach:

✅ Keeps costs transparent  
✅ Gives you direct control  
✅ Ensures privacy (no middleman)  
✅ Allows free tier usage  
✅ Scales with your needs  

---

## 🔷 Google Gemini (Required)

### Why Gemini?
- **Free tier**: 60 requests/minute
- **No credit card**: Start immediately
- **Low cost**: $0.02 per 1M tokens
- **Fast**: Optimized for speed
- **Multimodal**: Native image analysis

### Getting Your Key

1. **Visit**: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

2. **Sign In**: Use your Google account

3. **Create Key**:
   - Click "Create API Key"
   - Choose "Create API key in new project"
   - Or select existing project

4. **Copy Key**: Starts with `AIzaSy...`

5. **Add to tapestrAI**:
   - Paste in Gemini field
   - Click Test
   - Click Save

### Limitations
- Free tier: 60 req/min, 1,500 req/day
- Rate limits reset daily
- No credit card required

### Pricing (If upgrading)
- **Input**: $0.01 per 1M tokens
- **Output**: $0.04 per 1M tokens
- **Typical analysis**: <$0.001

---

## 🟢 OpenAI GPT-4 (Optional)

### Why OpenAI?
- **Cultural expertise**: Best for historical context
- **Reasoning**: Deep analytical thinking
- **Reliability**: Industry standard
- **Free credit**: $5 for new users

### Getting Your Key

1. **Visit**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. **Create Account**:
   - Sign up with email
   - Verify your email
   - Add phone number

3. **Add Payment**:
   - Go to Billing
   - Add credit/debit card
   - $5 minimum purchase
   - Or use $5 free credit (new users)

4. **Create Key**:
   - Click "Create new secret key"
   - Name it "tapestrAI"
   - Copy key (starts with `sk-...`)
   - **Important**: Save immediately (shown once)

5. **Add to tapestrAI**:
   - Paste in OpenAI field
   - Click Test
   - Click Save

### Limitations
- Requires payment method
- $5 minimum purchase
- Rate limits by tier:
  - **Free**: 3 req/min
  - **Tier 1**: 500 req/min ($5+ spent)
  - **Tier 2**: 5,000 req/min ($50+ spent)

### Pricing
- **GPT-4 Turbo**: $10 per 1M input tokens, $30 per 1M output
- **GPT-4**: $30 per 1M input, $60 per 1M output
- **Typical analysis**: ~$0.01-0.02

### Tips
- Monitor usage in OpenAI dashboard
- Set monthly spending limits
- Start with GPT-4 Turbo (cheaper)

---

## 🟣 Anthropic Claude (Optional)

### Why Claude?
- **Synthesis**: Best at weaving narratives
- **Accuracy**: Excellent fact-checking
- **Safety**: Built-in guardrails
- **Free credit**: $5 for new users

### Getting Your Key

1. **Visit**: [https://console.anthropic.com/](https://console.anthropic.com/)

2. **Create Account**:
   - Sign up with email
   - Verify email
   - Complete onboarding

3. **Add Payment**:
   - Navigate to Billing
   - Add credit card
   - Receive $5 free credit

4. **Generate Key**:
   - Go to API Keys
   - Click "Create Key"
   - Name it "tapestrAI"
   - Copy key (starts with `sk-ant-...`)

5. **Add to tapestrAI**:
   - Paste in Claude field
   - Click Test
   - Click Save

### Limitations
- Requires payment method
- $5 free credit (one-time)
- Rate limits:
  - **Tier 1**: 50 req/min (default)
  - **Tier 2**: 1,000 req/min (after $100 spent)

### Pricing
- **Claude Sonnet**: $3 per 1M input tokens, $15 per 1M output
- **Claude Opus**: $15 per 1M input, $75 per 1M output
- **Typical analysis**: ~$0.003-0.005

### Tips
- Sonnet is best value for quality
- Monitor in Anthropic console
- Free credit lasts ~1,000 analyses

---

## 🔵 Perplexity AI (Optional)

### Why Perplexity?
- **Web search**: Real-time internet research
- **Citations**: Links to sources
- **Current info**: Up-to-date data
- **Free tier**: 5 requests/day

### Getting Your Key

1. **Visit**: [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)

2. **Create Account**:
   - Sign up with email or Google
   - Verify email

3. **Free Tier**:
   - Navigate to API settings
   - Generate API key
   - 5 free requests/day

4. **Paid Tier** (optional):
   - Subscribe to Pro ($20/month)
   - Or pay-per-use
   - Higher rate limits

5. **Add to tapestrAI**:
   - Paste in Perplexity field
   - Click Test
   - Click Save

### Limitations
- **Free**: 5 requests/day
- **Pro**: 600 requests/day
- **API**: Pay-per-use with limits

### Pricing
- **Sonar**: $1 per 1M tokens
- **Sonar Pro**: $3 per 1M tokens
- **Typical analysis**: ~$0.001

### Tips
- Use free tier first
- Upgrade if you analyze daily
- Best for researching rare items

---

## 🔐 Security Best Practices

### Do's ✅
- Store keys only in tapestrAI
- Test keys after creating
- Rotate keys periodically
- Monitor usage regularly
- Set spending limits
- Use unique keys per app

### Don'ts ❌
- Don't share keys publicly
- Don't commit to GitHub
- Don't email keys
- Don't reuse across services
- Don't use root account keys
- Don't ignore usage alerts

---

## 💰 Cost Management

### Budgeting Guidelines

**Light Use** (1-5 analyses/month)
- Gemini only: FREE
- Total cost: $0

**Moderate Use** (10-50 analyses/month)
- Gemini + OpenAI: ~$0.50/month
- Gemini + Claude: ~$0.15/month
- Total cost: < $1/month

**Heavy Use** (100+ analyses/month)
- All 4 providers: ~$10-20/month
- Professional level: $50-100/month

### Optimization Strategies

1. **Start with Gemini**: Free and fast
2. **Add Claude**: Best value after Gemini
3. **Use OpenAI selectively**: For complex items
4. **Perplexity for research**: When you need citations

---

## 📊 Monitoring Usage

### In tapestrAI
- Real-time cost tracking
- Per-analysis breakdown
- Monthly summaries
- CSV export for records

### In Provider Dashboards

**Gemini**:
- [https://aistudio.google.com/](https://aistudio.google.com/)
- Check quota usage

**OpenAI**:
- [https://platform.openai.com/usage](https://platform.openai.com/usage)
- Detailed billing

**Claude**:
- [https://console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage)
- Usage dashboard

**Perplexity**:
- [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
- API usage

---

## 🚨 Troubleshooting

### "Invalid API Key"

**Gemini**:
- Check it starts with `AIzaSy`
- Verify project has Gemini API enabled
- Regenerate if needed

**OpenAI**:
- Starts with `sk-proj-` or `sk-`
- Check organization ID correct
- Verify billing active

**Claude**:
- Starts with `sk-ant-`
- Ensure billing added
- Check key not revoked

**Perplexity**:
- Verify account active
- Check free tier quota
- Try regenerating

### "Rate Limit Exceeded"

1. Check provider dashboard
2. Wait for quota reset
3. Upgrade tier if needed
4. Use alternative provider

### "Insufficient Credits"

1. Add payment method
2. Purchase credits
3. Check for free credits
4. Switch to free provider

---

## 🔄 Key Rotation

### When to Rotate
- Every 90 days (security best practice)
- If key exposed accidentally
- When leaving shared device
- After suspicious activity

### How to Rotate
1. Generate new key in provider dashboard
2. Test new key in tapestrAI
3. Save new key
4. Revoke old key in dashboard

---

## 📋 Quick Reference

| Provider | Required | Free Tier | Cost/Analysis | Best For |
|----------|----------|-----------|---------------|----------|
| Gemini | ✅ Yes | ✅ Yes | ~$0.0001 | Material analysis |
| OpenAI | ❌ No | ⚠️ $5 credit | ~$0.01 | Cultural context |
| Claude | ❌ No | ⚠️ $5 credit | ~$0.003 | Synthesis |
| Perplexity | ❌ No | ✅ 5/day | ~$0.001 | Web research |

---

## 📞 Support

### Provider Support
- **Gemini**: [Google AI Studio Help](https://ai.google.dev/docs)
- **OpenAI**: [Platform Docs](https://platform.openai.com/docs)
- **Claude**: [Anthropic Support](https://support.anthropic.com/)
- **Perplexity**: [Help Center](https://www.perplexity.ai/hub)

### tapestrAI Issues
- Check [Getting Started Guide](getting-started.md)
- Review [Troubleshooting](getting-started.md#troubleshooting)
- Open GitHub issue

---

**You're all set!** Add your keys and start analyzing. 🚀

---

*Last updated: October 2025*  
*tapestrAI v3.0*

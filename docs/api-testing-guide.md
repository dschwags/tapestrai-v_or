# API Integration Testing Guide

## Overview
Task 12 requires testing all 4 AI provider integrations with **actual API keys** to verify real-world functionality.

**Important**: The BugX tests verify internal module logic but do NOT test live API connections. This guide covers end-to-end API testing.

---

## Prerequisites

Before starting API integration testing, you need:

### 1. API Keys (at least Gemini required)
- ✅ **Google Gemini** (Required) - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- 🔧 **OpenAI** (Optional) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- 🔧 **Anthropic** (Optional) - Get from [Anthropic Console](https://console.anthropic.com/)
- 🔧 **Perplexity** (Optional) - Get from [Perplexity Settings](https://www.perplexity.ai/settings/api)

### 2. Test Images
Prepare 2-3 sample artifact images:
- JPG, PNG, or WEBP format
- Various sizes (test compression)
- Different artifact types (pottery, textiles, tools, etc.)

### 3. Test Environment
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Active internet connection
- Browser console access (F12 or Cmd+Option+I)

---

## Testing Procedure

### Phase 1: Single Provider Test (Gemini Only)

**Goal**: Verify basic analysis works with minimum configuration

1. **Launch Application**
   ```bash
   # Project should already be running on browser-sync
   # If not, run: npm start or browser-sync start --server
   ```

2. **Configure API Key**
   - Open the application in browser
   - Expand the "🔑 API Setup" section
   - Enter your Gemini API key in the "Google Gemini" field
   - Click "Test Connection" - should show ✓ Active
   - Click "Save API Key"
   - Verify "Analysis Level: Basic Analysis ⭐" appears

3. **Upload Test Image**
   - Click "📸 Upload Images" or drag-and-drop
   - Select 1 artifact image
   - Verify image preview appears
   - Check image info (size, dimensions, compression status)

4. **Run Analysis**
   - Click "🚀 Start Analysis"
   - Watch progress indicators:
     - ✓ Processing Images
     - ✓ Material Analysis (Gemini)
     - ✓ Generating Report
   - Verify no errors in browser console

5. **Validate Results**
   - Check "📊 Analysis Results" section displays
   - Verify all 8 sections present:
     1. Physical Analysis
     2. Markings & Text Analysis
     3. Age Indicators
     4. Functional Analysis
     5. Cultural & Historical Context
     6. Category Classification
     7. Research Recommendations
     8. Confidence Assessment
   - Verify "💰 Cost Summary" shows:
     - Gemini usage (tokens, cost)
     - Total cost < $0.10 for single image
   - Check timestamp and session ID

6. **Error Handling Test**
   - Try invalid API key - should show error message
   - Try uploading oversized image (>20MB) - should reject
   - Try uploading non-image file - should reject
   - Verify error messages are user-friendly

---

### Phase 2: Multi-Provider Test (All 4 Providers)

**Goal**: Verify multi-agent orchestration with all providers

1. **Configure All Keys**
   - Add OpenAI API key → Test → Save
   - Add Anthropic API key → Test → Save
   - Add Perplexity API key → Test → Save
   - Verify "Analysis Level: Professional Analysis ⭐⭐⭐⭐"

2. **Upload Multiple Images**
   - Upload 3 different artifact images
   - Verify all 3 appear in preview
   - Check total compressed size

3. **Run Comprehensive Analysis**
   - Click "🚀 Start Analysis"
   - Watch multi-agent progress:
     - ✓ Processing Images
     - ✓ Material Analysis (Gemini)
     - ✓ Cultural Analysis (OpenAI)
     - ✓ Historical Research (Perplexity)
     - ✓ Synthesis & Report (Anthropic)
   - Verify progress bar advances smoothly
   - Check estimated time updates

4. **Validate Enhanced Results**
   - Verify Primary Analysis (Gemini) section
   - Verify Cultural Insights (OpenAI) section
   - Verify Historical Context (Perplexity) section
   - Verify Synthesis Report (Anthropic) section
   - Check all sections have substantive content
   - Verify cross-references between sections

5. **Validate Cost Tracking**
   - Check cost breakdown by provider:
     - Gemini: $X.XX (X tokens)
     - OpenAI: $X.XX (X tokens)
     - Anthropic: $X.XX (X tokens)
     - Perplexity: $X.XX (X tokens)
   - Verify total cost is sum of all providers
   - Click "Export CSV" - verify download works
   - Check monthly summary displays correctly

---

### Phase 3: Edge Cases & Error Recovery

**Goal**: Verify robust error handling

1. **Network Interruption**
   - Start analysis
   - Disconnect network mid-analysis
   - Verify error message displays
   - Reconnect network
   - Verify retry mechanism works

2. **Rate Limiting**
   - Run 5+ analyses rapidly
   - If rate limit hit, verify:
     - Clear error message
     - Retry suggestion appears
     - Analysis can resume after delay

3. **Invalid Responses**
   - Test with corrupted/blank image
   - Verify graceful error handling
   - Check error logged to console

4. **API Key Expiry**
   - Remove/invalidate one API key
   - Run analysis
   - Verify other agents continue
   - Check degraded analysis message

---

## Acceptance Criteria

### ✅ Core Functionality
- [ ] Gemini API integration works (required)
- [ ] Image upload and compression works
- [ ] Single-image analysis completes successfully
- [ ] Results display all 8 required sections
- [ ] Cost tracking displays correctly

### ✅ Multi-Agent System
- [ ] OpenAI integration works (when key provided)
- [ ] Anthropic integration works (when key provided)
- [ ] Perplexity integration works (when key provided)
- [ ] Agent orchestration completes in sequence
- [ ] All agent results integrate into final report

### ✅ Error Handling
- [ ] Invalid API key shows clear error
- [ ] Network errors handled gracefully
- [ ] Rate limiting detected and communicated
- [ ] Retry logic works for recoverable errors
- [ ] User-friendly error messages displayed

### ✅ Performance
- [ ] Single image analysis < 30 seconds
- [ ] Multi-image (3) analysis < 90 seconds
- [ ] Progress indicators update smoothly
- [ ] No console errors during normal operation
- [ ] Memory usage remains stable

### ✅ User Experience
- [ ] API setup flow is intuitive
- [ ] Image upload is smooth (drag-drop works)
- [ ] Results are well-formatted and readable
- [ ] Cost summary is clear and accurate
- [ ] Error messages include recovery suggestions

---

## Test Results Template

Copy this template to document your testing:

```markdown
## API Integration Test Results

**Date**: YYYY-MM-DD
**Tester**: [Your Name]
**Browser**: [Chrome/Firefox/Safari/Edge] [Version]

### Phase 1: Single Provider (Gemini)
- [ ] API key saved successfully
- [ ] Image upload works
- [ ] Analysis completes
- [ ] Results display correctly
- [ ] Cost tracking accurate
- **Issues Found**: None / [Describe issues]

### Phase 2: Multi-Provider (All 4)
- [ ] All API keys configured
- [ ] Multi-agent orchestration works
- [ ] Enhanced results display
- [ ] Cost breakdown accurate
- **Issues Found**: None / [Describe issues]

### Phase 3: Edge Cases
- [ ] Network error handling works
- [ ] Rate limiting handled
- [ ] Invalid inputs rejected
- [ ] API key validation works
- **Issues Found**: None / [Describe issues]

### Overall Assessment
- **Pass/Fail**: [Pass/Fail]
- **Critical Issues**: [None/List]
- **Minor Issues**: [None/List]
- **Recommendations**: [Any suggestions]

### Sample Costs
- Single image (Gemini only): $X.XX
- Multi-image (all 4 providers): $X.XX
- Estimated cost per 100 analyses: $X.XX
```

---

## Known Limitations

1. **API Quotas**: Free tier API keys have usage limits
2. **Rate Limits**: Rapid requests may trigger rate limiting
3. **Response Times**: API latency varies (5-30 seconds typical)
4. **Token Limits**: Very large images may approach token limits
5. **Browser Storage**: Limited to ~5MB for encrypted keys

---

## Troubleshooting

### Issue: "API Key Invalid" Error
**Solution**: 
- Verify key copied correctly (no spaces)
- Check API key is active in provider dashboard
- Verify billing is enabled (if required)
- Try regenerating API key

### Issue: "Network Error" 
**Solution**:
- Check internet connection
- Verify firewall not blocking requests
- Try different browser
- Check browser console for CORS errors

### Issue: Analysis Stuck/Frozen
**Solution**:
- Check browser console for errors
- Verify API key hasn't expired
- Refresh page and try again
- Reduce image size/count

### Issue: Cost Seems Wrong
**Solution**:
- Check provider pricing pages (rates change)
- Verify token counts in console
- Export CSV and review calculations
- Compare with provider usage dashboard

---

## Next Steps After Testing

Once API integration testing passes:

1. **Document Results**: Fill out test results template
2. **Report Issues**: Create list of any bugs found
3. **Optimize**: Identify performance improvements
4. **User Testing**: Share with 5+ users for feedback
5. **Phase 2 Planning**: Begin category templates & features

---

## Support Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Anthropic API Docs**: https://docs.anthropic.com/
- **Perplexity API Docs**: https://docs.perplexity.ai/

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0 (tapestrAI v3.0)

# TapestrAI Deployment Guide - Option B Implementation

## 🚀 Quick Deployment Checklist

- [ ] Code changes committed to repository
- [ ] Cloudflare Worker deployed at `https://tapestrai-worker.david-ec6.workers.dev`
- [ ] Frontend deployed to Cloudflare Pages
- [ ] Test with Gemini-only configuration
- [ ] Test with all API combinations
- [ ] Verify fact-checking works
- [ ] Verify synthesis appears correctly

---

## 📦 What's New in This Deployment

### New Features
1. **Confidence Scoring** - Structured 0-100% scores for materials, dating, origin, purpose
2. **Key Claims Extraction** - Gemini outputs 3-5 verifiable claims
3. **Perplexity Fact-Checking** - External validation with web citations
4. **Gemini Synthesis** - Cost-effective multi-perspective integration
5. **Smart Agent Orchestration** - Works with any API combination (1-4 APIs)

### Modified Files
```
js/universalAnalyzer.js      (+78 lines)  - Enhanced prompt & extraction
js/agentOrchestrator.js      (+241 lines) - Synthesis & fact-checking
js/main.js                   (+53 lines)  - Updated UI display
```

### New Documentation
```
MULTI_AGENT_ANALYSIS.md              - Research on multi-agent systems
VALIDATION_FLOW_OPTIONS.md           - Comparison of validation approaches
AGENT_ROLES_BY_SCENARIO.md           - Agent roles for different API combos
OPTION_B_IMPLEMENTATION_SUMMARY.md   - Implementation details
DEPLOYMENT_GUIDE.md                  - This file
```

---

## 🔄 Deployment Steps

### Option 1: Cloudflare Pages (Recommended)

**Prerequisites:**
- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- Worker already deployed

**Steps:**
1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Implement Option B: Fact-checking and Gemini synthesis"
   git push origin main
   ```

2. **Cloudflare Pages auto-deploys:**
   - Go to https://dash.cloudflare.com/pages
   - Find your project: "tapestrai"
   - Wait for build to complete (~2-3 minutes)
   - New deployment will be at: `https://main.tapestrai.pages.dev`

3. **Verify Worker URL:**
   - Open browser DevTools console
   - Visit your deployed site
   - Check console for: `Worker URL detected: https://tapestrai-worker.david-ec6.workers.dev`

4. **Test basic functionality:**
   - Upload an artifact image
   - Add Gemini API key
   - Run analysis
   - Verify confidence scores appear

---

### Option 2: Re-deploy Worker (If Changed)

**Only needed if you modified `worker/index.js`**

```bash
cd worker
wrangler deploy
```

Expected output:
```
✨ Built successfully
✨ Published tapestrai-worker (0.xx sec)
   https://tapestrai-worker.david-ec6.workers.dev
```

---

## 🧪 Testing Plan

### Test 1: Gemini Only (Baseline)
**Goal:** Verify basic analysis with new confidence scoring

1. Visit deployed site
2. Add Gemini API key only
3. Upload artifact image (any antique/collectible)
4. Click "Analyze Artifact"

**Expected Results:**
- ✅ Analysis completes successfully
- ✅ Confidence Assessment section shows percentages
- ✅ "Key Claims for Verification" section appears
- ✅ 3-5 specific claims listed
- ❌ No "Integrated Analysis" section (single perspective)
- ❌ No "Fact Verification" section (no Perplexity)

---

### Test 2: Gemini + OpenAI
**Goal:** Verify synthesis with cultural context

1. Add OpenAI API key
2. Re-run analysis

**Expected Results:**
- ✅ "Cultural Context Specialist" section appears
- ✅ "Integrated Analysis" section appears (blue highlight)
- ✅ Synthesis combines material + cultural perspectives
- ❌ No fact-checking (no Perplexity)

---

### Test 3: Gemini + Perplexity
**Goal:** Verify fact-checking functionality

1. Remove OpenAI key (test with Gemini + Perplexity only)
2. Add Perplexity API key
3. Re-run analysis

**Expected Results:**
- ✅ "Historical Research" section appears
- ✅ "Integrated Analysis" section appears
- ✅ **"Fact Verification" section appears** (green highlight) ⭐
- ✅ Each claim has verification status
- ✅ Source URLs are clickable links
- ✅ Synthesis integrates research findings

---

### Test 4: Gemini + OpenAI + Perplexity (IDEAL)
**Goal:** Full multi-agent experience

1. Add all 3 API keys
2. Re-run analysis

**Expected Results:**
- ✅ All individual agent sections appear
- ✅ "Integrated Analysis" synthesizes all 3 perspectives
- ✅ "Fact Verification" validates key claims
- ✅ Citations provided
- ✅ Cultural context integrated
- ✅ Research findings validated

---

### Test 5: All 4 APIs
**Goal:** Maximum validation

1. Add Claude API key
2. Re-run analysis

**Expected Results:**
- ✅ All features from Test 4
- ✅ Claude validation runs (check console logs)
- ✅ Synthesis compares Gemini vs Claude findings
- ⚠️ Higher cost (~$0.10-0.15 per analysis)

---

### Test 6: Edge Cases

**Test 6a: Perplexity Failure**
- Temporarily use invalid Perplexity key
- Analysis should complete without fact-checking
- No "Fact Verification" section appears
- Rest of analysis unaffected

**Test 6b: No Claims Extracted**
- Use simple image with minimal text
- Analysis completes
- Fact-checking skipped gracefully

**Test 6c: Worker Unavailable**
- Test locally (http://localhost:8080)
- Should fall back to direct API calls
- Only Gemini works (CORS blocks others)

---

## 📊 Cost Estimation

### Per Analysis Costs (Estimated)

| Configuration | API Calls | Cost Range | Use Case |
|---------------|-----------|------------|----------|
| Gemini only | 1 | $0.001-0.002 | Quick preview |
| G + OpenAI | 3 | $0.03-0.06 | Cultural analysis |
| G + Perplexity | 4 | $0.01-0.03 | Fact-checked analysis |
| G + O + P | 5 | $0.04-0.08 | **Recommended default** |
| All 4 | 6 | $0.06-0.12 | High-value items |

**Monthly Cost Examples:**
- 10 analyses/month (G+O+P): ~$0.40-0.80
- 50 analyses/month (G+O+P): ~$2.00-4.00
- 100 analyses/month (G+O+P): ~$4.00-8.00

**Savings vs. Original Design:**
- Original: Claude for synthesis (~$0.008 per synthesis)
- New: Gemini for synthesis (~$0.0004 per synthesis)
- **Savings: ~95% on synthesis cost** 🎉

---

## 🔍 Troubleshooting

### Issue: "No fact verification section"
**Cause:** Perplexity not configured or no claims extracted

**Solution:**
1. Check Perplexity API key is added and tested
2. Verify claims appear in "Key Claims for Verification" section
3. Check browser console for fact-check errors

---

### Issue: "Synthesis not appearing"
**Cause:** Only 1 API configured (Gemini)

**Solution:**
- This is expected behavior
- Synthesis only appears with 2+ perspectives
- Add OpenAI or Perplexity to see synthesis

---

### Issue: "CORS error on API calls"
**Cause:** Worker URL not detected

**Solution:**
1. Check browser console for Worker URL log
2. Verify Worker is deployed: `curl https://tapestrai-worker.david-ec6.workers.dev/api/gemini`
3. Check `js/apiKeyManager.js` line 92 for correct Worker URL

---

### Issue: "Worker returns 404"
**Cause:** Worker not deployed or wrong URL

**Solution:**
```bash
cd worker
wrangler deploy
# Note the URL in output
# Update js/apiKeyManager.js if URL changed
```

---

### Issue: "Analysis takes too long"
**Cause:** Multiple sequential API calls

**Improvement:**
- Current: OpenAI, Perplexity run in parallel
- Synthesis: Sequential after gathering perspectives
- Fact-check: Sequential after synthesis

**Expected Times:**
- 1 API: 5-10 seconds
- 2 APIs: 15-25 seconds
- 3 APIs: 30-45 seconds (most calls parallel)
- 4 APIs: 35-55 seconds

---

## 🎯 Success Criteria

Your deployment is successful when:

- [ ] All 5 API combinations work without errors
- [ ] Confidence scores display correctly
- [ ] Fact-checking appears with Perplexity
- [ ] Synthesis appears with 2+ APIs
- [ ] Citations are clickable
- [ ] Export includes all new sections
- [ ] No CORS errors in browser console
- [ ] Analysis completes in <60 seconds
- [ ] Cost tracking shows reasonable numbers

---

## 📝 Post-Deployment Tasks

### Immediate
1. ✅ Test all API combinations
2. ✅ Monitor error rates
3. ✅ Verify cost tracking accuracy

### Short-term (1 week)
1. Gather user feedback on fact-checking
2. Monitor Perplexity API usage/costs
3. Track which claims get verified most
4. Identify common errors

### Long-term (1 month)
1. Analyze which API combos users prefer
2. Measure fact-check accuracy
3. Optimize synthesis prompts based on results
4. Consider confidence-triggered validation

---

## 🆘 Rollback Plan

If critical issues occur:

**Option A: Rollback via Git**
```bash
git revert HEAD
git push origin main
# Cloudflare Pages auto-deploys previous version
```

**Option B: Manual Rollback in Cloudflare**
1. Go to Cloudflare Pages dashboard
2. Find previous successful deployment
3. Click "Rollback to this deployment"

**What gets rolled back:**
- Frontend code (HTML, JS, CSS)
- Analysis logic
- UI display

**What stays:**
- Worker (separate deployment)
- User API keys (localStorage)
- Previous analysis results

---

## 🎉 Deployment Complete!

You now have a production-ready multi-agent artifact analysis system with:
- ✅ External fact-checking
- ✅ Multi-perspective synthesis
- ✅ Confidence scoring
- ✅ CORS-free operation
- ✅ Cost-optimized design

**Next steps:**
1. Run comprehensive tests
2. Monitor usage and costs
3. Gather user feedback
4. Iterate based on data

**Questions or issues?**
- Check browser console for errors
- Review `OPTION_B_IMPLEMENTATION_SUMMARY.md`
- Test locally first if issues persist

---

**Deployment Date:** [Fill in]
**Deployed By:** [Fill in]
**Worker URL:** https://tapestrai-worker.david-ec6.workers.dev
**Frontend URL:** https://main.tapestrai.pages.dev
**Version:** Option B (Fact-Checking + Gemini Synthesis)

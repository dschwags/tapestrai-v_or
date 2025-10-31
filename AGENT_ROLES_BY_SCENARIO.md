# Agent Roles by API Combination (Option B Flow)

## Core Principle
**Gemini acts as both Primary Analyst AND Final Synthesizer** in all scenarios to maintain consistency and reduce costs.

---

## Scenario 1: Gemini Only (Minimum Viable)

```
┌─────────────┐
│   GEMINI    │  Role: Complete Analyst
│  (Primary)  │  • Full analysis
│             │  • Confidence scores
│  Cost: LOW  │  • Self-assessment
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RESULTS    │  • Shows confidence scores
│             │  • Highlights uncertainties
└─────────────┘
```

**Gemini Prompt:** Full universal analysis + confidence scoring

**No synthesis needed** - Single perspective

**User sees:**
- ✅ Complete material analysis
- ✅ Confidence scores per attribute
- ⚠️ No cultural context
- ⚠️ No external research
- ⚠️ No fact-checking

---

## Scenario 2A: Gemini + OpenAI

```
┌─────────────┐
│   GEMINI    │  Role: Material Analyst
│  (Primary)  │  • Physical analysis
│             │  • Materials, construction
│  Cost: LOW  │  • Dating, origin
└──────┬──────┘  • Confidence scores
       │
       ▼
┌─────────────┐
│   OPENAI    │  Role: Cultural Historian
│ (Secondary) │  • Social context
│             │  • Cultural significance
│  Cost: MED  │  • Usage customs
└──────┬──────┘  • Symbolic meaning
       │
       ▼
┌─────────────┐
│   GEMINI    │  Role: Synthesizer
│ (Synthesis) │  • Combine material + cultural
│             │  • Create narrative
│  Cost: LOW  │  • Highlight agreement/gaps
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RESULTS    │  • Integrated analysis
│             │  • Cultural depth added
└─────────────┘
```

**Gemini Synthesis Prompt:**
```
You have two perspectives on this artifact:

MATERIAL ANALYSIS (your previous analysis):
[Gemini's primary analysis]

CULTURAL CONTEXT (from cultural historian):
[OpenAI's response]

Create a unified narrative that:
1. Integrates the material facts with cultural meaning
2. Shows how physical features relate to social use
3. Highlights areas where cultural context enriches material understanding
4. Maintains your confidence assessments
5. Notes any gaps that research could fill

Keep synthesis concise (500-800 words).
```

**User sees:**
- ✅ Material analysis + cultural depth
- ✅ How artifact was used in society
- ✅ Symbolic meanings explained
- ⚠️ No external fact-checking
- ⚠️ No comparative research

---

## Scenario 2B: Gemini + Perplexity

```
┌─────────────┐
│   GEMINI    │  Role: Material Analyst
│  (Primary)  │  • Full analysis
│             │  • Extract research keywords
│  Cost: LOW  │  • Confidence scores
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PERPLEXITY  │  Role: Research Librarian
│ (Secondary) │  • Web search for comparables
│             │  • Museum collections
│  Cost: MED  │  • Auction records
└──────┬──────┘  • Maker information
       │
       ▼
┌─────────────┐
│   GEMINI    │  Role: Synthesizer
│ (Synthesis) │  • Validate with research
│             │  • Compare to documented items
│  Cost: LOW  │  • Confidence adjustment
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RESULTS    │  • Analysis + external validation
│             │  • Research citations
└─────────────┘
```

**Gemini Synthesis Prompt:**
```
You analyzed an artifact. Now we have research data:

YOUR ANALYSIS:
[Gemini's primary analysis]

RESEARCH FINDINGS (from web sources):
[Perplexity's response with citations]

Review and synthesize:
1. Does research confirm or contradict your analysis?
2. Adjust confidence levels based on evidence
3. Highlight verified facts vs. educated guesses
4. Note any new information from research
5. Flag discrepancies for user attention

Format:
- CONFIRMED: [What research supports]
- ADJUSTED: [What changed based on evidence]
- UNCERTAIN: [What remains unclear]
- SOURCES: [Key references]
```

**User sees:**
- ✅ Material analysis + research validation
- ✅ External citations
- ✅ Fact-checking via web
- ⚠️ No cultural/social depth
- ⚠️ Limited to publicly available info

---

## Scenario 3A: Gemini + OpenAI + Perplexity (Recommended Default)

```
┌─────────────┐
│   GEMINI    │  Role: Material Analyst
│  (Primary)  │  • Full physical analysis
│             │  • Confidence scores
│  Cost: LOW  │  • Research keywords
└──────┬──────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────┐
│   OPENAI    │      │ PERPLEXITY  │
│ (Cultural)  │      │ (Research)  │
│             │      │             │
│ Social      │      │ Web search  │
│ context     │      │ Citations   │
│             │      │             │
│  Cost: MED  │      │  Cost: MED  │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └──────────┬─────────┘
                  ▼
          ┌─────────────┐
          │   GEMINI    │  Role: Master Synthesizer
          │ (Synthesis) │  • Weave 3 perspectives
          │             │  • Fact-check with research
          │  Cost: LOW  │  • Cultural enrichment
          └──────┬──────┘  • Confidence validation
                 │
                 ▼
          ┌─────────────┐
          │  RESULTS    │  • Comprehensive analysis
          │             │  • Validated & enriched
          └─────────────┘
```

**Gemini Synthesis Prompt:**
```
You analyzed an artifact. Now you have two additional perspectives:

YOUR MATERIAL ANALYSIS:
[Gemini's primary analysis - truncated to 1000 tokens]

CULTURAL CONTEXT (from historian):
[OpenAI's response - truncated to 800 tokens]

RESEARCH FINDINGS (from web):
[Perplexity's response - truncated to 800 tokens]

Create a comprehensive synthesis:

1. VALIDATED FINDINGS
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
   - Mark what's confirmed vs. speculative

5. FACT-CHECK SUMMARY
   - Key claims verified by sources
   - Areas needing further investigation

Keep synthesis 800-1200 words, well-structured.
```

**User sees:**
- ✅ Complete analysis (material + cultural + research)
- ✅ Fact-checked claims
- ✅ External citations
- ✅ Cultural depth
- ✅ Validated confidence
- 🎯 **This is the ideal experience**

---

## Scenario 3B: Gemini + OpenAI + Claude

```
┌─────────────┐
│   GEMINI    │  Role: Material Analyst
│  (Primary)  │  • Full physical analysis
│             │  • Confidence scores
│  Cost: LOW  │  
└──────┬──────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────┐
│   OPENAI    │      │   CLAUDE    │
│ (Cultural)  │      │ (Validator) │
│             │      │             │
│ Social      │      │ SHORT       │
│ context     │      │ validation  │
│             │      │ of key      │
│  Cost: MED  │      │ attributes  │
└──────┬──────┘      │             │
       │             │  Cost: MED  │
       │             └──────┬──────┘
       │                    │
       └──────────┬─────────┘
                  ▼
          ┌─────────────┐
          │   GEMINI    │  Role: Synthesizer + Validator
          │ (Synthesis) │  • Compare Gemini vs Claude
          │             │  • Add cultural context
          │  Cost: LOW  │  • Flag disagreements
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │  RESULTS    │  • Validated analysis
          │             │  • Cultural enrichment
          └─────────────┘
```

**Claude's Validation Prompt (SHORT):**
```
Validate these key attributes of an artifact (be concise):

IMAGE: [attached]

Focus only on:
1. Primary material (one word)
2. Date range (specific decades)
3. Geographic origin (country/region)
4. Primary purpose
5. Confidence (0-100%) for each

Limit response to 300 tokens.
```

**Gemini Synthesis Prompt:**
```
You analyzed an artifact. Compare with validation check:

YOUR ANALYSIS (selected attributes):
Material: [your answer]
Dating: [your answer]  
Origin: [your answer]
Purpose: [your answer]

VALIDATION CHECK (from second opinion):
Material: [Claude's answer]
Dating: [Claude's answer]
Origin: [Claude's answer]  
Purpose: [Claude's answer]

CULTURAL CONTEXT (from historian):
[OpenAI's response]

Synthesis task:
1. AGREEMENT vs DISAGREEMENT
   - Where do analyses agree? (high confidence)
   - Where do they differ? (flag for user)
   - Your final assessment for each attribute

2. CULTURAL INTEGRATION
   - Add cultural context from historian
   - Explain social significance

3. CONFIDENCE UPDATE
   - Agreement = higher confidence
   - Disagreement = flag uncertainty

Format clearly with "VALIDATED" vs "UNCERTAIN" sections.
```

**User sees:**
- ✅ Cross-validated key attributes
- ✅ Cultural context
- ✅ Disagreements flagged
- ⚠️ No external web research
- ⚠️ Still correlated errors possible

---

## Scenario 4: All Four APIs (Maximum Validation)

```
┌─────────────┐
│   GEMINI    │  Role: Material Analyst
│  (Primary)  │  • Full analysis
│             │  • Confidence scores
│  Cost: LOW  │  • Research keywords
└──────┬──────┘
       │
       ├──────────────────────┬─────────────┐
       │                      │             │
       ▼                      ▼             ▼
┌─────────────┐      ┌─────────────┐  ┌─────────┐
│   CLAUDE    │      │   OPENAI    │  │PERPLEX- │
│ (Validator) │      │ (Cultural)  │  │ITY      │
│             │      │             │  │(Research│
│ SHORT       │      │ Social      │  │         │
│ validation  │      │ context     │  │Web      │
│             │      │             │  │search   │
│  Cost: MED  │      │  Cost: MED  │  │         │
└──────┬──────┘      └──────┬──────┘  │Cost: MED│
       │                    │          └────┬────┘
       │                    │               │
       └────────────────────┴───────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │   GEMINI    │  Role: Master Synthesizer
                    │ (Synthesis) │  • Cross-validate Gemini vs Claude
                    │             │  • Integrate cultural context
                    │  Cost: LOW  │  • Fact-check with research
                    └──────┬──────┘  • Comprehensive narrative
                           │
                           ▼
                    ┌─────────────┐
                    │  RESULTS    │  • Maximum validation
                    │             │  • All perspectives integrated
                    └─────────────┘
```

**Gemini Synthesis Prompt (Complex):**
```
You analyzed an artifact. Now synthesize four perspectives:

YOUR ANALYSIS (selected key points):
[Gemini primary - 800 tokens]

VALIDATION CHECK:
[Claude's key attributes - 300 tokens]

CULTURAL CONTEXT:
[OpenAI's response - 700 tokens]

RESEARCH FINDINGS:
[Perplexity's citations - 700 tokens]

Comprehensive synthesis (1200-1500 words):

1. CROSS-VALIDATION
   Where you and the validator agree/disagree
   → Agreement = HIGH CONFIDENCE
   → Disagreement = FLAG FOR USER

2. FACT-CHECKING
   What research confirms or contradicts
   → Cite sources for verified claims
   → Note areas lacking documentation

3. CULTURAL INTEGRATION
   How cultural context explains physical features
   Social significance and historical use

4. FINAL ASSESSMENT
   Confidence-rated conclusions
   What we know vs. what's uncertain
   Recommended next steps for owner

5. SOURCES
   Key references from research
```

**User sees:**
- ✅ Maximum validation (4 AI perspectives)
- ✅ Cross-validated key attributes  
- ✅ Fact-checked with citations
- ✅ Cultural depth
- ✅ Comprehensive confidence scoring
- 💰 **Most expensive option** (~$0.20-0.30)

---

## 📊 Role Summary Matrix

| API Combo | Gemini Primary | OpenAI | Perplexity | Claude | Gemini Synthesis |
|-----------|----------------|--------|------------|--------|------------------|
| **Gemini only** | ✅ Complete | - | - | - | ❌ None needed |
| **G + O** | ✅ Material | ✅ Cultural | - | - | ✅ Simple merge |
| **G + P** | ✅ Material | - | ✅ Research | - | ✅ Fact-check integration |
| **G + O + P** | ✅ Material | ✅ Cultural | ✅ Research | - | ✅ **3-way synthesis** ⭐ |
| **G + O + C** | ✅ Material | ✅ Cultural | - | ✅ Validator | ✅ Compare + cultural |
| **G + P + C** | ✅ Material | - | ✅ Research | ✅ Validator | ✅ Validate + fact-check |
| **All 4** | ✅ Material | ✅ Cultural | ✅ Research | ✅ Validator | ✅ **Master synthesis** 🏆 |

---

## 🎯 Recommended Flow Logic

```javascript
// agentOrchestrator.js pseudocode

async analyzeWithAgents(images, apiKeyManager) {
  const hasGemini = apiKeyManager.keys.gemini;
  const hasOpenAI = apiKeyManager.keys.openai;
  const hasPerplexity = apiKeyManager.keys.perplexity;
  const hasClaude = apiKeyManager.keys.anthropic;
  
  // ALWAYS start with Gemini primary
  const primaryAnalysis = await runGeminiAnalysis(images[0], apiKeyManager);
  
  const perspectives = { primary: primaryAnalysis };
  
  // Gather additional perspectives in parallel
  await Promise.all([
    hasOpenAI && runOpenAICulturalContext(primaryAnalysis, apiKeyManager)
      .then(result => perspectives.cultural = result),
    
    hasPerplexity && runPerplexityResearch(primaryAnalysis, apiKeyManager)
      .then(result => perspectives.research = result),
    
    hasClaude && runClaudeValidation(images[0], apiKeyManager)
      .then(result => perspectives.validation = result)
  ]);
  
  // DECISION: Do we need Gemini synthesis?
  const perspectiveCount = Object.keys(perspectives).length;
  
  if (perspectiveCount === 1) {
    // Gemini only - no synthesis needed
    return { final: primaryAnalysis, perspectives };
  }
  
  // Multiple perspectives - Gemini synthesizes
  const synthesis = await runGeminiSynthesis(perspectives, apiKeyManager);
  
  return { final: synthesis, perspectives };
}
```

---

## 💡 Key Design Principles

1. **Gemini is the anchor** - Always primary analyst, often synthesizer
2. **Parallel when possible** - OpenAI, Perplexity, Claude run simultaneously
3. **Synthesis only when needed** - 1 API = no synthesis, 2+ APIs = synthesize
4. **Cost-conscious** - Use Gemini for synthesis (cheap) instead of Claude
5. **Role clarity** - Each agent has a distinct purpose
6. **Confidence-driven** - All outputs include confidence assessments

---

## 🚀 Next Steps

Implement this logic in `agentOrchestrator.js`:
1. ✅ Add Gemini synthesis method
2. ✅ Make synthesis conditional (skip if only 1 API)
3. ✅ Update synthesis prompts per scenario
4. ✅ Add confidence scoring extraction
5. ✅ Display synthesis prominently in UI

This gives users the best of all worlds - flexible agent combinations with consistent, cost-effective synthesis! 🎯

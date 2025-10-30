# tapestrAI v3.0

**Unravel your artifact's story**

Expert AI-powered analysis revealing the history, cultural significance, and fascinating context of historic artifacts.

> *"The treasure you hold leads to the legacy it holds."*

---

## 🎯 What is tapestrAI?

tapestrAI is a free, client-side web application that uses multiple AI agents to analyze historic artifacts, antiques, collectibles, and treasures. Upload a photo, and receive comprehensive research combining material analysis, cultural context, historical documentation, and expert synthesis.

---

## ✨ Features (v3.0)

### Multi-Agent Analysis System
- **Material Analyst** (Gemini) - Physical examination and age indicators
- **Cultural Specialist** (OpenAI) - Social context and symbolic meaning
- **Synthesis Curator** (Claude) - Narrative synthesis and fact-checking
- **Historical Researcher** (Perplexity) - Web research and provenance

### Smart Image Processing
- Automatic compression for faster analysis
- High-resolution upload support
- Multi-image analysis
- Format validation

### Cost Tracking & Transparency
- Real-time usage monitoring
- Per-analysis cost breakdown
- Monthly summaries
- CSV export for records

### Comprehensive Error Handling
- Graceful API failures
- Automatic retry logic
- Detailed error messages
- Recovery suggestions

---

## 🚀 Quick Start

### 1. Get API Keys (At least Gemini is required)

**Google Gemini** (Required - Free)
- Visit: https://aistudio.google.com/apikey
- No credit card required
- 60 requests/minute free tier

**OpenAI GPT-4** (Optional - Paid)
- Visit: https://platform.openai.com/api-keys
- $5 free credit for new users

**Anthropic Claude** (Optional - Paid)
- Visit: https://console.anthropic.com/
- $5 free credit for new users

**Perplexity AI** (Optional - Freemium)
- Visit: https://www.perplexity.ai/settings/api
- 5 free requests/day

### 2. Add Your Keys

Open tapestrAI and add at least your Gemini key. Optional keys unlock deeper analysis:
- ⭐ 1 key = Basic Analysis
- ⭐⭐ 2 keys = Enhanced Analysis
- ⭐⭐⭐ 3 keys = Comprehensive Analysis
- ⭐⭐⭐⭐ 4 keys = Professional Analysis

### 3. Upload & Analyze

Upload a clear photo of your artifact and let the AI research team analyze it!

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JavaScript (ES6+)
- **AI Providers**: Gemini, OpenAI, Anthropic, Perplexity
- **Storage**: LocalStorage (encrypted)
- **Deployment**: Static hosting (Netlify, Vercel, GitHub Pages)

### File Structure
```
tapestrAI/
├── index.html                # Main application
├── css/
│   └── styles.css           # Custom styles
├── js/
│   ├── main.js              # Application entry
│   ├── apiKeyManager.js     # 4-provider API management
│   ├── universalAnalyzer.js # Core analysis engine
│   ├── agentOrchestrator.js # Multi-agent coordination
│   ├── imageProcessor.js    # Image handling
│   ├── progressUI.js        # Progress tracking
│   ├── costTracker.js       # Usage monitoring
│   └── errorHandler.js      # Error handling
├── tests/
│   ├── bugx-framework.js           # BugX test framework
│   ├── bugx-tapestrAI-tests.js     # Comprehensive test suite (60+ tests)
│   └── test-runner.html            # Interactive test runner UI
└── docs/
    ├── getting-started.md          # User guide
    ├── api-keys-guide.md           # API key setup
    └── api-testing-guide.md        # Live API integration testing
```

---

## 🧪 Testing

tapestrAI uses the **BugX Framework** for comprehensive boundary testing:

### Module Testing (BugX Framework)
Tests internal logic of all modules without requiring API keys:

```bash
# Option 1: Use the interactive test runner
Open tests/test-runner.html in your browser

# Option 2: Run from browser console
BugX.runAll()
```

**Current Status**: 60+ tests across 7 suites, targeting 120+ total

**Test Coverage**:
- ✅ API Key Manager (encryption, storage, validation)
- ✅ Image Processor (upload, compression, optimization)
- ✅ Progress UI (step management, state tracking)
- ✅ Cost Tracker (usage monitoring, calculations)
- ✅ Error Handler (categorization, recovery)
- ✅ Universal Analyzer (prompt generation)
- ✅ Agent Orchestrator (coordination logic)

### API Integration Testing
Live testing with actual API keys (requires user-provided keys):

**See**: `docs/api-testing-guide.md` for comprehensive testing procedures

**Requirements**:
- At least 1 API key (Gemini required)
- Test images (2-3 artifact photos)
- Active internet connection

**Test Phases**:
1. Single Provider Test (Gemini only)
2. Multi-Provider Test (all 4 agents)
3. Edge Cases & Error Recovery

---

## 🔒 Security & Privacy

- ✅ **100% Client-Side** - No server, no backend
- ✅ **Encrypted Storage** - API keys encrypted in localStorage
- ✅ **No Tracking** - Your images never leave your browser
- ✅ **No Account Required** - Use your own API keys
- ✅ **Open Source** - Audit the code yourself

---

## 📊 Version History

### v3.0 (Current - In Development)
- 4 AI providers (was 2)
- Universal analysis engine (was category-specific)
- Multi-agent system
- Image compression
- Cost tracking
- Comprehensive error handling

### v2.0 (Stable)
- 96 BugX tests (9.5/10 score)
- Landing page UX complete
- 2 AI providers (Gemini, Claude)
- 4 enhanced specialization configs

---

## 🎯 Roadmap

### Phase 1 (Current - 4 weeks)
- [x] API Key Management (4 providers)
- [x] Universal Analysis Engine
- [x] Image Processing Pipeline
- [x] Multi-Agent Orchestration
- [x] Progress UI
- [x] Cost Tracking
- [x] Error Handling
- [x] BugX Testing Framework (60+ tests)
- [ ] Live API Integration Testing (requires user API keys)

### Phase 2 (Future)
- [ ] Category-specific templates
- [ ] Smart routing to specialists
- [ ] Export to PDF/MD/HTML
- [ ] Advanced personalization
- [ ] Historical comparables
- [ ] Value estimation guides

---

## 📝 License

MIT License - See LICENSE file

---

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

---

## 📧 Contact

Created by D. Schwager / BrewX  
For questions: [Create an issue]

---

**Built with 💜 for history enthusiasts, collectors, and curious minds**

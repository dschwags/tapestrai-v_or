/**
 * BugX Tests for tapestrAI v3.0
 * Comprehensive test suite for all modules
 */

// Initialize BugX
const BugX = new BugXFramework();
const { assert } = BugX;

// =====================================================
// SUITE 1: API Key Manager Tests
// =====================================================

BugX.suite('API Key Manager - Initialization', function() {
    
    BugX.test('APIKeyManager class should be defined', function() {
        assert.exists(window.APIKeyManager, 'APIKeyManager class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const manager = new window.APIKeyManager();
        assert.exists(manager, 'Failed to create APIKeyManager instance');
    });
    
    BugX.test('Should have 4 provider configurations', function() {
        const manager = new window.APIKeyManager();
        const providerKeys = Object.keys(manager.providers);
        assert.equals(providerKeys.length, 4, 'Should have exactly 4 providers');
        assert.contains(providerKeys, 'gemini', 'Should have gemini');
        assert.contains(providerKeys, 'openai', 'Should have openai');
        assert.contains(providerKeys, 'anthropic', 'Should have anthropic');
        assert.contains(providerKeys, 'perplexity', 'Should have perplexity');
    });
    
    BugX.test('Gemini should be marked as required', function() {
        const manager = new window.APIKeyManager();
        assert.isTrue(manager.providers.gemini.required, 'Gemini should be required');
    });
    
    BugX.test('Other providers should be optional', function() {
        const manager = new window.APIKeyManager();
        assert.isFalse(manager.providers.openai.required, 'OpenAI should be optional');
        assert.isFalse(manager.providers.anthropic.required, 'Anthropic should be optional');
        assert.isFalse(manager.providers.perplexity.required, 'Perplexity should be optional');
    });
});

BugX.suite('API Key Manager - Encryption', function() {
    
    BugX.test('Should generate device salt', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        const salt = manager.getDeviceSalt();
        assert.exists(salt, 'Salt should be generated');
        assert.isTrue(salt.length > 0, 'Salt should not be empty');
    });
    
    BugX.test('Should persist device salt', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        const salt1 = manager.getDeviceSalt();
        const salt2 = manager.getDeviceSalt();
        assert.equals(salt1, salt2, 'Salt should be consistent');
    });
    
    BugX.test('Should encrypt and decrypt correctly', function() {
        const manager = new window.APIKeyManager();
        const original = 'AIzaSyTest1234567890';
        const encrypted = manager.encrypt(original);
        const decrypted = manager.decrypt(encrypted);
        assert.equals(decrypted, original, 'Decrypted should match original');
    });
    
    BugX.test('Encrypted value should be different from original', function() {
        const manager = new window.APIKeyManager();
        const original = 'test_key_123';
        const encrypted = manager.encrypt(original);
        assert.notEquals(encrypted, original, 'Encrypted should differ from original');
    });
});

BugX.suite('API Key Manager - Storage', function() {
    
    BugX.test('Should load keys from localStorage', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        const testKey = 'AIzaSyTestKey123456789';
        const encrypted = manager.encrypt(testKey);
        localStorage.setItem('tapestrAI_key_gemini', encrypted);
        
        manager.loadKeys();
        assert.exists(manager.keys.gemini, 'Key should be loaded');
        assert.equals(manager.keys.gemini, testKey, 'Loaded key should match');
    });
    
    BugX.test('Should handle missing keys gracefully', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        manager.loadKeys();
        assert.isUndefined(manager.keys.gemini, 'Missing key should be undefined');
    });
    
    BugX.test('Should update status for loaded keys', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        const testKey = 'AIzaSyTestKey123456789';
        const encrypted = manager.encrypt(testKey);
        localStorage.setItem('tapestrAI_key_gemini', encrypted);
        
        manager.loadKeys();
        assert.equals(manager.status.gemini, 'active', 'Status should be active');
    });
});

BugX.suite('API Key Manager - Agent Configuration', function() {
    
    BugX.test('Should return empty agents when no keys', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        const agents = manager.getAvailableAgents();
        assert.equals(agents.length, 0, 'Should have no agents without keys');
    });
    
    BugX.test('Should return material analyst with Gemini key', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test_key';
        const agents = manager.getAvailableAgents();
        assert.equals(agents.length, 1, 'Should have 1 agent');
        assert.equals(agents[0].id, 'material_analyst', 'Should be material analyst');
        assert.isTrue(agents[0].primary, 'Should be marked as primary');
    });
    
    BugX.test('Should return multiple agents with multiple keys', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test_key_1';
        manager.keys.openai = 'test_key_2';
        manager.keys.anthropic = 'test_key_3';
        const agents = manager.getAvailableAgents();
        assert.equals(agents.length, 3, 'Should have 3 agents');
    });
    
    BugX.test('Should return all 4 agents with all keys', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test_1';
        manager.keys.openai = 'test_2';
        manager.keys.anthropic = 'test_3';
        manager.keys.perplexity = 'test_4';
        const agents = manager.getAvailableAgents();
        assert.equals(agents.length, 4, 'Should have all 4 agents');
    });
});

BugX.suite('API Key Manager - Analysis Levels', function() {
    
    BugX.test('Should return "No Analysis" with 0 keys', function() {
        const manager = new window.APIKeyManager();
        const level = manager.getAnalysisLevel();
        assert.equals(level.name, 'No Analysis', 'Should be No Analysis');
        assert.equals(level.stars, '', 'Should have no stars');
    });
    
    BugX.test('Should return "Basic Analysis" with 1 key', function() {
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test';
        const level = manager.getAnalysisLevel();
        assert.equals(level.name, 'Basic Analysis', 'Should be Basic');
        assert.equals(level.stars, '⭐', 'Should have 1 star');
    });
    
    BugX.test('Should return "Enhanced Analysis" with 2 keys', function() {
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test1';
        manager.keys.openai = 'test2';
        const level = manager.getAnalysisLevel();
        assert.equals(level.name, 'Enhanced Analysis', 'Should be Enhanced');
        assert.equals(level.stars, '⭐⭐', 'Should have 2 stars');
    });
    
    BugX.test('Should return "Professional Analysis" with 4 keys', function() {
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test1';
        manager.keys.openai = 'test2';
        manager.keys.anthropic = 'test3';
        manager.keys.perplexity = 'test4';
        const level = manager.getAnalysisLevel();
        assert.equals(level.name, 'Professional Analysis', 'Should be Professional');
        assert.equals(level.stars, '⭐⭐⭐⭐', 'Should have 4 stars');
    });
});

BugX.suite('API Key Manager - Validation', function() {
    
    BugX.test('canAnalyze should return false without Gemini key', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        assert.isFalse(manager.canAnalyze(), 'Should not be able to analyze');
    });
    
    BugX.test('canAnalyze should return true with Gemini key', function() {
        BugXHelpers.clearStorage();
        const manager = new window.APIKeyManager();
        manager.keys.gemini = 'test_key';
        assert.isTrue(manager.canAnalyze(), 'Should be able to analyze');
    });
});

// =====================================================
// SUITE 2: Image Processor Tests
// =====================================================

BugX.suite('Image Processor - Initialization', function() {
    
    BugX.test('ImageProcessor class should be defined', function() {
        assert.exists(window.ImageProcessor, 'ImageProcessor class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const processor = new window.ImageProcessor();
        assert.exists(processor, 'Failed to create ImageProcessor instance');
    });
    
    BugX.test('Should initialize with empty images array', function() {
        const processor = new window.ImageProcessor();
        assert.equals(processor.getCount(), 0, 'Should start with 0 images');
    });
    
    BugX.test('Should have correct configuration', function() {
        const processor = new window.ImageProcessor();
        assert.equals(processor.maxImages, 3, 'Should allow max 3 images');
        assert.equals(processor.maxSizeMB, 20, 'Should have 20MB limit');
        assert.equals(processor.targetSizeMB, 4, 'Should target 4MB compression');
    });
});

BugX.suite('Image Processor - Image Management', function() {
    
    BugX.test('Should add images to collection', function() {
        const processor = new window.ImageProcessor();
        const testImage = {
            id: 123,
            name: 'test.jpg',
            data: 'data:image/jpeg;base64,test',
            originalSize: 1000000,
            compressedSize: 500000,
            width: 1024,
            height: 768
        };
        processor.images.push(testImage);
        assert.equals(processor.getCount(), 1, 'Should have 1 image');
    });
    
    BugX.test('Should remove images by ID', function() {
        const processor = new window.ImageProcessor();
        processor.images = [
            { id: 1, name: 'test1.jpg' },
            { id: 2, name: 'test2.jpg' }
        ];
        processor.removeImage(1);
        assert.equals(processor.getCount(), 1, 'Should have 1 image left');
    });
    
    BugX.test('Should clear all images', function() {
        const processor = new window.ImageProcessor();
        processor.images = [
            { id: 1, name: 'test1.jpg' },
            { id: 2, name: 'test2.jpg' }
        ];
        processor.clearAll();
        assert.equals(processor.getCount(), 0, 'Should have 0 images');
    });
});

// =====================================================
// SUITE 3: Progress UI Tests
// =====================================================

BugX.suite('Progress UI - Initialization', function() {
    
    BugX.test('ProgressUI class should be defined', function() {
        assert.exists(window.ProgressUI, 'ProgressUI class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const ui = new window.ProgressUI();
        assert.exists(ui, 'Failed to create ProgressUI instance');
    });
    
    BugX.test('Should initialize with inactive state', function() {
        const ui = new window.ProgressUI();
        assert.isFalse(ui.isActive, 'Should start inactive');
        assert.equals(ui.currentStep, 0, 'Should start at step 0');
    });
});

BugX.suite('Progress UI - Step Management', function() {
    
    BugX.test('Should build steps based on agents', function() {
        const ui = new window.ProgressUI();
        const agents = [
            { id: 'material_analyst', name: 'Material Analyst' },
            { id: 'cultural_specialist', name: 'Cultural Specialist' }
        ];
        ui.start(agents);
        assert.isTrue(ui.steps.length > 2, 'Should have multiple steps');
        assert.isTrue(ui.isActive, 'Should be active after start');
    });
    
    BugX.test('Should progress through steps', function() {
        const ui = new window.ProgressUI();
        ui.start([{ id: 'material_analyst' }]);
        const initialStep = ui.currentStep;
        ui.nextStep();
        assert.equals(ui.currentStep, initialStep + 1, 'Should move to next step');
    });
});

// =====================================================
// SUITE 4: Cost Tracker Tests
// =====================================================

BugX.suite('Cost Tracker - Initialization', function() {
    
    BugX.test('CostTracker class should be defined', function() {
        assert.exists(window.CostTracker, 'CostTracker class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const tracker = new window.CostTracker();
        assert.exists(tracker, 'Failed to create CostTracker instance');
    });
    
    BugX.test('Should initialize with empty analysis', function() {
        const tracker = new window.CostTracker();
        assert.equals(tracker.currentAnalysis.totalCost, 0, 'Should start at $0');
        assert.equals(tracker.currentAnalysis.totalTokens, 0, 'Should start at 0 tokens');
    });
});

BugX.suite('Cost Tracker - Usage Tracking', function() {
    
    BugX.test('Should track API calls', function() {
        const tracker = new window.CostTracker();
        tracker.startAnalysis();
        tracker.trackCall('gemini', 1000, 500, 'gemini-2.0-flash-exp');
        assert.isTrue(tracker.currentAnalysis.totalTokens > 0, 'Should track tokens');
        assert.isTrue(tracker.currentAnalysis.totalCost >= 0, 'Should calculate cost');
    });
    
    BugX.test('Should track multiple providers', function() {
        const tracker = new window.CostTracker();
        tracker.startAnalysis();
        tracker.trackCall('gemini', 1000, 500, 'gemini-2.0-flash-exp');
        tracker.trackCall('openai', 1000, 500, 'gpt-4-turbo');
        const providers = Object.keys(tracker.currentAnalysis.providers);
        assert.equals(providers.length, 2, 'Should track 2 providers');
    });
    
    BugX.test('Should aggregate costs correctly', function() {
        const tracker = new window.CostTracker();
        tracker.startAnalysis();
        tracker.trackCall('gemini', 1000, 500, 'gemini-2.0-flash-exp');
        tracker.trackCall('gemini', 1000, 500, 'gemini-2.0-flash-exp');
        assert.equals(tracker.currentAnalysis.providers.gemini.calls, 2, 'Should count 2 calls');
    });
});

// =====================================================
// SUITE 5: Error Handler Tests
// =====================================================

BugX.suite('Error Handler - Initialization', function() {
    
    BugX.test('ErrorHandler class should be defined', function() {
        assert.exists(window.ErrorHandler, 'ErrorHandler class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const handler = new window.ErrorHandler();
        assert.exists(handler, 'Failed to create ErrorHandler instance');
    });
});

BugX.suite('Error Handler - Error Categorization', function() {
    
    BugX.test('Should categorize network errors', function() {
        const handler = new window.ErrorHandler();
        const error = new Error('Network request failed');
        const type = handler.categorizeError(error);
        assert.equals(type, 'network', 'Should be network error');
    });
    
    BugX.test('Should categorize API errors', function() {
        const handler = new window.ErrorHandler();
        const error = new Error('API key invalid');
        const type = handler.categorizeError(error);
        assert.equals(type, 'api', 'Should be API error');
    });
    
    BugX.test('Should categorize rate limit errors', function() {
        const handler = new window.ErrorHandler();
        const error = new Error('Rate limit exceeded');
        const type = handler.categorizeError(error);
        assert.equals(type, 'rate_limit', 'Should be rate limit error');
    });
});

BugX.suite('Error Handler - Recovery', function() {
    
    BugX.test('Should identify recoverable errors', function() {
        const handler = new window.ErrorHandler();
        const error = new Error('Network timeout');
        assert.isTrue(handler.isRecoverable(error), 'Network errors should be recoverable');
    });
    
    BugX.test('Should provide recovery suggestions', function() {
        const handler = new window.ErrorHandler();
        const error = new Error('API key invalid');
        const suggestions = handler.getRecoverySuggestions(error);
        assert.isTrue(suggestions.length > 0, 'Should provide suggestions');
    });
});

// =====================================================
// SUITE 6: Universal Analyzer Tests
// =====================================================

BugX.suite('Universal Analyzer - Initialization', function() {
    
    BugX.test('UniversalAnalyzer class should be defined', function() {
        assert.exists(window.UniversalAnalyzer, 'UniversalAnalyzer class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const analyzer = new window.UniversalAnalyzer();
        assert.exists(analyzer, 'Failed to create UniversalAnalyzer instance');
    });
    
    BugX.test('Should have analysis history array', function() {
        const analyzer = new window.UniversalAnalyzer();
        assert.exists(analyzer.analysisHistory, 'Should have history array');
        assert.equals(analyzer.analysisHistory.length, 0, 'Should start empty');
    });
});

BugX.suite('Universal Analyzer - Prompt Generation', function() {
    
    BugX.test('Should generate universal analysis prompt', function() {
        const analyzer = new window.UniversalAnalyzer();
        const prompt = analyzer.getUniversalAnalysisPrompt();
        assert.exists(prompt, 'Prompt should exist');
        assert.isTrue(prompt.length > 1000, 'Prompt should be comprehensive');
        assert.contains(prompt, 'PHYSICAL ANALYSIS', 'Should include physical analysis');
        assert.contains(prompt, 'MARKINGS', 'Should include markings section');
        assert.contains(prompt, 'AGE INDICATORS', 'Should include age section');
    });
});

// =====================================================
// SUITE 7: Agent Orchestrator Tests
// =====================================================

BugX.suite('Agent Orchestrator - Initialization', function() {
    
    BugX.test('AgentOrchestrator class should be defined', function() {
        assert.exists(window.AgentOrchestrator, 'AgentOrchestrator class not found');
    });
    
    BugX.test('Should create instance successfully', function() {
        const orchestrator = new window.AgentOrchestrator();
        assert.exists(orchestrator, 'Failed to create AgentOrchestrator instance');
    });
    
    BugX.test('Should have universal analyzer instance', function() {
        const orchestrator = new window.AgentOrchestrator();
        assert.exists(orchestrator.universalAnalyzer, 'Should have analyzer');
    });
});

// =====================================================
// Run all tests
// =====================================================

console.log('%c🧪 tapestrAI v3.0 - BugX Test Suite', 'font-size: 18px; font-weight: bold; color: #667eea;');
console.log('%cRunning comprehensive tests...', 'color: #666;');

BugX.runAll().then(results => {
    console.log('\n%c✓ Test execution complete', 'color: #10b981; font-weight: bold;');
    console.log(`Pass rate: ${(results.passed / results.total * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
        console.log('%c🎉 ALL TESTS PASSED!', 'font-size: 16px; color: #10b981; font-weight: bold;');
    } else {
        console.log(`%c⚠️  ${results.failed} test(s) failed`, 'color: #ef4444; font-weight: bold;');
    }
});

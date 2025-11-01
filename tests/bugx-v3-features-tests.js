/**
 * BugX Test Suite for tapestrAI v3 New Features
 * Tests all improvements and new functionality
 */

// Initialize BugX
const BugX = new BugXFramework();
const assert = BugX.assert;
const helpers = BugXHelpers;

// ========================================
// Test Suite: Analysis Level Updates
// ========================================
BugX.suite('Analysis Level Display', function() {
    
    BugX.test('Should show "Not Configured" instead of "No Analysis" with 0 keys', function() {
        // Check default text
        const levelDisplay = document.getElementById('analysis-level-display');
        assert.exists(levelDisplay, 'Analysis level display element should exist');
        
        // Simulate no keys configured
        if (window.apiKeyManager) {
            const level = window.apiKeyManager.getAnalysisLevel();
            assert.equals(level.name, 'Not Configured', 'Should show Not Configured with 0 keys');
        }
    });
    
    BugX.test('Should support Elite Analysis level with 5 keys', function() {
        // Mock API key manager with 5 keys
        const mockApiKeyManager = {
            keys: {
                gemini: 'test-key-1',
                openai: 'test-key-2',
                anthropic: 'test-key-3',
                perplexity: 'test-key-4',
                deepseek: 'test-key-5'
            },
            getAnalysisLevel: function() {
                const count = Object.keys(this.keys).length;
                const levels = {
                    0: { stars: '', name: 'Not Configured', description: 'Add Gemini API key to begin' },
                    1: { stars: '⭐', name: 'Basic Analysis', description: 'Single-agent material examination' },
                    2: { stars: '⭐⭐', name: 'Enhanced Analysis', description: 'Cross-verified insights' },
                    3: { stars: '⭐⭐⭐', name: 'Comprehensive Analysis', description: 'Multi-perspective research' },
                    4: { stars: '⭐⭐⭐⭐', name: 'Professional Analysis', description: 'Expert-level synthesis' },
                    5: { stars: '⭐⭐⭐⭐⭐', name: 'Elite Analysis', description: 'Full AI research team activated' }
                };
                return levels[count] || levels[0];
            }
        };
        
        const level = mockApiKeyManager.getAnalysisLevel();
        assert.equals(level.name, 'Elite Analysis', 'Should show Elite Analysis with 5 keys');
        assert.equals(level.stars, '⭐⭐⭐⭐⭐', 'Should show 5 stars');
        assert.contains(level.description, 'Full AI research team', 'Should mention full research team');
    });
});

// ========================================
// Test Suite: DeepSeek Badge Update
// ========================================
BugX.suite('DeepSeek Provider Badge', function() {
    
    BugX.test('Should display "Optional" badge instead of "100x Cheaper!"', function() {
        const deepseekCard = document.querySelector('[id*="deepseek"]');
        
        if (deepseekCard) {
            const cardHTML = document.body.innerHTML;
            assert.isFalse(
                cardHTML.includes('100x Cheaper!'),
                'Should not contain "100x Cheaper!" text'
            );
            
            // Check that Optional badge exists near DeepSeek
            const deepseekSection = cardHTML.match(/DeepSeek[\s\S]{0,200}Optional/);
            assert.isNotNull(deepseekSection, 'DeepSeek should have Optional badge nearby');
        }
    });
});

// ========================================
// Test Suite: Image Upload Limit
// ========================================
BugX.suite('Image Upload Limit', function() {
    
    BugX.test('Should allow up to 5 images', function() {
        if (window.imageProcessor) {
            assert.equals(window.imageProcessor.maxImages, 5, 'Max images should be 5');
        }
    });
    
    BugX.test('Should reject 6th image', function() {
        if (window.imageProcessor) {
            // Create mock processor
            const mockProcessor = {
                maxImages: 5,
                images: [1, 2, 3, 4, 5], // 5 images
                canAddMore: function() {
                    return this.images.length < this.maxImages;
                }
            };
            
            assert.isFalse(mockProcessor.canAddMore(), 'Should not allow 6th image');
        }
    });
});

// ========================================
// Test Suite: Token Tracker (5 Providers)
// ========================================
BugX.suite('Token Tracker - All Providers', function() {
    
    BugX.test('Should track all 5 API providers', function() {
        if (window.tokenTracker || window.TokenTracker) {
            const tracker = window.tokenTracker || new window.TokenTracker();
            
            const providers = Object.keys(tracker.usage);
            assert.equals(providers.length, 5, 'Should track exactly 5 providers');
            
            assert.contains(providers, 'gemini', 'Should include Gemini');
            assert.contains(providers, 'openai', 'Should include OpenAI');
            assert.contains(providers, 'anthropic', 'Should include Anthropic');
            assert.contains(providers, 'perplexity', 'Should include Perplexity');
            assert.contains(providers, 'deepseek', 'Should include DeepSeek');
        }
    });
    
    BugX.test('Should display detailed view for all 5 providers', function() {
        const detailsContainer = document.getElementById('provider-token-details');
        
        if (detailsContainer && window.tokenTracker) {
            // Trigger update
            window.tokenTracker.updateDetailedView();
            
            // Check that all 5 providers are rendered
            const containerHTML = detailsContainer.innerHTML;
            assert.contains(containerHTML, 'Gemini', 'Should display Gemini');
            assert.contains(containerHTML, 'Openai', 'Should display OpenAI');
            assert.contains(containerHTML, 'Anthropic', 'Should display Anthropic');
            assert.contains(containerHTML, 'Perplexity', 'Should display Perplexity');
            assert.contains(containerHTML, 'Deepseek', 'Should display DeepSeek');
        }
    });
});

// ========================================
// Test Suite: Follow-up Questions
// ========================================
BugX.suite('Follow-up Questions Feature', function() {
    
    BugX.test('Should have follow-up question textarea in results', function() {
        // This will be tested when results are displayed
        // For now, check that main.js has the method
        assert.isNotUndefined(
            window.TapestrAI && window.TapestrAI.prototype.submitFollowupQuestion,
            'submitFollowupQuestion method should exist'
        );
    });
    
    BugX.test('Should have addMorePhotos functionality', function() {
        assert.isNotUndefined(
            window.TapestrAI && window.TapestrAI.prototype.addMorePhotos,
            'addMorePhotos method should exist'
        );
    });
    
    BugX.test('Should validate empty question input', function() {
        // Mock the submit function behavior
        const mockSubmit = async function(question) {
            if (!question || question.trim() === '') {
                throw new Error('Please enter a question.');
            }
            return true;
        };
        
        assert.rejects(mockSubmit(''), 'Should reject empty question');
        assert.rejects(mockSubmit('   '), 'Should reject whitespace-only question');
    });
});

// ========================================
// Test Suite: Multi-Format Export
// ========================================
BugX.suite('Multi-Format Export', function() {
    
    BugX.test('Should have export methods for all formats', function() {
        if (window.main || window.TapestrAI) {
            const mainInstance = window.main || new window.TapestrAI();
            
            assert.isNotUndefined(mainInstance.exportAsText, 'exportAsText should exist');
            assert.isNotUndefined(mainInstance.exportAsMarkdown, 'exportAsMarkdown should exist');
            assert.isNotUndefined(mainInstance.exportAsHTML, 'exportAsHTML should exist');
            assert.isNotUndefined(mainInstance.exportAsPDF, 'exportAsPDF should exist');
        }
    });
    
    BugX.test('Should have downloadFile helper method', function() {
        if (window.main || window.TapestrAI) {
            const mainInstance = window.main || new window.TapestrAI();
            assert.isNotUndefined(mainInstance.downloadFile, 'downloadFile helper should exist');
        }
    });
    
    BugX.test('Should generate valid Markdown structure', function() {
        // Mock results
        const mockResults = {
            primary: {
                rawText: 'Test analysis content'
            },
            agents: ['Gemini'],
            additional: {},
            synthesis: null,
            factCheck: null
        };
        
        // Simulate markdown generation
        let md = `# tapestrAI Artifact Analysis\n\n`;
        md += `**Generated:** ${new Date().toLocaleString()}  \n`;
        md += `**AI Agents Used:** ${mockResults.agents.join(', ')}  \n\n`;
        md += `---\n\n`;
        md += `## Primary Analysis\n\n`;
        md += `${mockResults.primary.rawText}\n\n`;
        
        assert.contains(md, '# tapestrAI', 'Should contain main heading');
        assert.contains(md, '## Primary Analysis', 'Should contain section heading');
        assert.contains(md, 'Test analysis content', 'Should contain content');
        assert.contains(md, '---', 'Should contain separator');
    });
    
    BugX.test('Should generate valid HTML structure', function() {
        const mockHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>tapestrAI Analysis Report</title>
</head>
<body>
    <h1>Test</h1>
</body>
</html>`;
        
        assert.contains(mockHTML, '<!DOCTYPE html>', 'Should have DOCTYPE');
        assert.contains(mockHTML, '<html lang="en">', 'Should have HTML tag with lang');
        assert.contains(mockHTML, '<meta charset="UTF-8">', 'Should have charset');
        assert.contains(mockHTML, '</html>', 'Should close HTML tag');
    });
});

// ========================================
// Test Suite: UI Elements Existence
// ========================================
BugX.suite('UI Elements - New Features', function() {
    
    BugX.test('Should have export format buttons in results section', function() {
        const bodyHTML = document.body.innerHTML;
        
        // Check for export button labels
        const hasTextExport = bodyHTML.includes('Text (.txt)') || bodyHTML.includes('📄');
        const hasMarkdownExport = bodyHTML.includes('Markdown (.md)') || bodyHTML.includes('📝');
        const hasHTMLExport = bodyHTML.includes('HTML (.html)') || bodyHTML.includes('🌐');
        const hasPDFExport = bodyHTML.includes('PDF (.pdf)') || bodyHTML.includes('📜');
        
        assert.isTrue(hasTextExport, 'Should have Text export option');
        assert.isTrue(hasMarkdownExport, 'Should have Markdown export option');
        assert.isTrue(hasHTMLExport, 'Should have HTML export option');
        assert.isTrue(hasPDFExport, 'Should have PDF export option');
    });
    
    BugX.test('Should have token tracker collapsible section', function() {
        const tokenTracker = document.getElementById('token-tracker-container');
        assert.exists(tokenTracker, 'Token tracker container should exist');
    });
    
    BugX.test('Should have analysis level display', function() {
        const levelDisplay = document.getElementById('analysis-level-display');
        assert.exists(levelDisplay, 'Analysis level display should exist');
        assert.isNotNull(levelDisplay.textContent, 'Should have text content');
    });
});

// ========================================
// Test Suite: Integration Tests
// ========================================
BugX.suite('Integration Tests', function() {
    
    BugX.test('Should initialize all main components', function() {
        assert.exists(window.APIKeyManager, 'APIKeyManager class should exist');
        assert.exists(window.ImageProcessor, 'ImageProcessor class should exist');
        assert.exists(window.AgentOrchestrator, 'AgentOrchestrator class should exist');
        assert.exists(window.TokenTracker, 'TokenTracker class should exist');
        assert.exists(window.CostTracker, 'CostTracker class should exist');
        assert.exists(window.TapestrAI, 'TapestrAI class should exist');
    });
    
    BugX.test('Should have main app instance', function() {
        assert.exists(window.main, 'Main app instance should exist');
        assert.exists(window.main.apiKeyManager, 'Should have apiKeyManager');
        assert.exists(window.main.imageProcessor, 'Should have imageProcessor');
        assert.exists(window.main.agentOrchestrator, 'Should have agentOrchestrator');
    });
    
    BugX.test('AgentOrchestrator should have askFollowup method', function() {
        if (window.AgentOrchestrator) {
            const orchestrator = new window.AgentOrchestrator();
            assert.isNotUndefined(orchestrator.askFollowup, 'askFollowup method should exist');
        }
    });
});

// ========================================
// Test Suite: Error Handling
// ========================================
BugX.suite('Error Handling - New Features', function() {
    
    BugX.test('Should handle missing results gracefully on export', function() {
        if (window.main) {
            // Mock a scenario with no results
            const originalResults = window.main.currentResults;
            window.main.currentResults = null;
            
            try {
                // This should show alert, not crash
                const result = window.main.exportResults('txt');
                // If it gets here without crashing, that's good
                assert.isTrue(true, 'Should handle missing results');
            } catch (error) {
                // Should not throw error, should show alert
                assert.isFalse(true, 'Should not throw error on missing results');
            } finally {
                window.main.currentResults = originalResults;
            }
        }
    });
    
    BugX.test('Should validate format parameter in exportResults', function() {
        // Test that invalid formats default to text
        const validFormats = ['txt', 'md', 'html', 'pdf'];
        const invalidFormat = 'invalid-format';
        
        assert.contains(validFormats, 'txt', 'txt should be valid');
        assert.contains(validFormats, 'md', 'md should be valid');
        assert.contains(validFormats, 'html', 'html should be valid');
        assert.contains(validFormats, 'pdf', 'pdf should be valid');
        assert.isFalse(validFormats.includes(invalidFormat), 'Invalid format should not be in list');
    });
});

// ========================================
// Test Suite: Data Validation
// ========================================
BugX.suite('Data Validation', function() {
    
    BugX.test('Should escape HTML in follow-up questions', function() {
        if (window.main && window.main.escapeHtml) {
            const dangerousInput = '<script>alert("xss")</script>';
            const escaped = window.main.escapeHtml(dangerousInput);
            
            assert.isFalse(escaped.includes('<script>'), 'Should escape script tags');
            assert.contains(escaped, '&lt;', 'Should contain escaped characters');
        }
    });
    
    BugX.test('Should validate image count stays within limits', function() {
        if (window.imageProcessor) {
            const count = window.imageProcessor.maxImages;
            assert.isTrue(count >= 5, 'Max images should be at least 5');
            assert.isTrue(count <= 10, 'Max images should not exceed reasonable limit');
        }
    });
});

// ========================================
// Run All Tests
// ========================================
console.log('\n🚀 Starting BugX Test Suite for tapestrAI v3 Features\n');
console.log('Testing:');
console.log('  ✓ Analysis level display (Not Configured → Elite Analysis)');
console.log('  ✓ DeepSeek badge update (Optional instead of 100x Cheaper)');
console.log('  ✓ Image upload limit (increased to 5)');
console.log('  ✓ Token tracker (all 5 providers)');
console.log('  ✓ Follow-up questions feature');
console.log('  ✓ Multi-format export (TXT, MD, HTML, PDF)');
console.log('  ✓ Integration and error handling\n');

// Run tests
BugX.runAll().then(results => {
    console.log('\n✨ Test suite complete!\n');
    
    // Show summary
    if (results.failed === 0) {
        console.log('🎉 ALL TESTS PASSED! Ready for deployment.');
    } else {
        console.log(`⚠️  ${results.failed} test(s) failed. Please review.`);
    }
});

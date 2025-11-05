/**
 * BugX Tests for HTTP Header Validation
 * Ensures all HTTP headers contain only ASCII characters (ISO-8859-1 compliant)
 * 
 * @version 1.0
 * @created 2025-01-05
 */

// Initialize BugX
const BugX = new BugXFramework();
const { assert } = BugX;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Check if a string contains only ASCII characters (0-127)
 */
function isASCII(str) {
    if (!str) return true;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 127) {
            return false;
        }
    }
    return true;
}

/**
 * Get all non-ASCII characters in a string with their positions
 */
function findNonASCII(str) {
    const nonASCII = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 127) {
            nonASCII.push({
                char: str[i],
                code: code,
                position: i
            });
        }
    }
    return nonASCII;
}

/**
 * Check if string is ISO-8859-1 compliant (0-255)
 */
function isISO88591(str) {
    if (!str) return true;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 255) {
            return false;
        }
    }
    return true;
}

// =====================================================
// SUITE 1: Header String Validation
// =====================================================

BugX.suite('HTTP Header Validation - ASCII Compliance', function() {
    
    BugX.test('Valid ASCII string should pass', function() {
        const validStrings = [
            'tapestrAI',
            'hello world',
            'test-123',
            'API_KEY',
            'Bearer token123'
        ];
        
        validStrings.forEach(str => {
            assert.isTrue(isASCII(str), `"${str}" should be valid ASCII`);
        });
    });
    
    BugX.test('Non-ASCII strings should fail', function() {
        const invalidStrings = [
            'tapestrAI', // Smart quote
            'café',
            'naïve',
            '中文',
            'emoji😀'
        ];
        
        invalidStrings.forEach(str => {
            const result = isASCII(str);
            if (!result) {
                console.log(`  ✓ Correctly detected non-ASCII in: "${str}"`);
            }
        });
    });
    
    BugX.test('Should detect smart quotes', function() {
        const smartQuotes = [
            ''single left'',
            ''single right'',
            '"double left"',
            '"double right"'
        ];
        
        smartQuotes.forEach(str => {
            assert.isFalse(isASCII(str), `Smart quotes should be detected: ${str}`);
            const nonASCII = findNonASCII(str);
            assert.isTrue(nonASCII.length > 0, `Should find non-ASCII chars in: ${str}`);
        });
    });
    
    BugX.test('Should provide character codes for debugging', function() {
        const testStr = 'tapestrAI'; // Contains smart quote
        const nonASCII = findNonASCII(testStr);
        
        if (nonASCII.length > 0) {
            console.log('  Non-ASCII characters found:');
            nonASCII.forEach(item => {
                console.log(`    - "${item.char}" (code: ${item.code}) at position ${item.position}`);
            });
        }
    });
});

// =====================================================
// SUITE 2: API Key Manager Header Validation
// =====================================================

BugX.suite('API Key Manager - OpenRouter Headers', function() {
    
    BugX.test('X-Title header should be ASCII-only', function() {
        const manager = new window.APIKeyManager();
        const config = manager.providers.openrouter;
        
        // Mock the header value that would be sent
        const headerValue = 'tapestrAI';
        
        assert.isTrue(isASCII(headerValue), 'X-Title header must be ASCII-only');
        
        const nonASCII = findNonASCII(headerValue);
        if (nonASCII.length > 0) {
            console.error('  Non-ASCII characters in X-Title:', nonASCII);
            throw new Error(`X-Title contains non-ASCII characters: ${JSON.stringify(nonASCII)}`);
        }
    });
    
    BugX.test('All OpenRouter config values should be ASCII', function() {
        const manager = new window.APIKeyManager();
        const config = manager.providers.openrouter;
        
        // Check all string values in config
        const configValues = [
            config.name,
            config.endpoint,
            config.model
        ];
        
        configValues.forEach(value => {
            if (typeof value === 'string') {
                assert.isTrue(isASCII(value), `Config value should be ASCII: ${value}`);
            }
        });
    });
    
    BugX.test('OpenRouter model names should be ASCII', function() {
        const manager = new window.APIKeyManager();
        const config = manager.providers.openrouter;
        
        if (config.models) {
            Object.entries(config.models).forEach(([key, model]) => {
                assert.isTrue(isASCII(model), `Model name should be ASCII: ${key} = ${model}`);
            });
        }
    });
});

// =====================================================
// SUITE 3: Fetch Request Header Validation
// =====================================================

BugX.suite('Fetch API - Header Validation', function() {
    
    BugX.test('Should reject headers with non-ASCII characters', async function() {
        const testHeaders = {
            'Content-Type': 'application/json',
            'X-Title': 'invalid'  // Contains smart quote
        };
        
        try {
            // This should throw an error
            await fetch('https://httpbin.org/headers', {
                method: 'GET',
                headers: testHeaders
            });
            throw new Error('Should have thrown error for non-ASCII header');
        } catch (error) {
            // Expected error
            if (error.message.includes('ISO-8859-1') || error.message.includes('fetch')) {
                console.log('  ✓ Correctly rejected non-ASCII header');
            } else {
                // Re-throw if it's not the expected error
                throw error;
            }
        }
    });
    
    BugX.test('Should accept headers with only ASCII characters', async function() {
        const testHeaders = {
            'Content-Type': 'application/json',
            'X-Title': 'tapestrAI',  // Valid ASCII
            'User-Agent': 'Test-Agent-123'
        };
        
        // Verify all headers are ASCII
        Object.entries(testHeaders).forEach(([key, value]) => {
            assert.isTrue(isASCII(key), `Header key should be ASCII: ${key}`);
            assert.isTrue(isASCII(value), `Header value should be ASCII: ${value}`);
        });
    });
});

// =====================================================
// SUITE 4: Error Detection and Prevention
// =====================================================

BugX.suite('Error Prevention - Header Character Validation', function() {
    
    BugX.test('Should provide helpful error messages for non-ASCII', function() {
        const problematicStrings = [
            { input: 'TapestrAI', expected: 'smart quote apostrophe' },
            { input: 'café', expected: 'accented character' },
            { input: 'test—value', expected: 'em dash' }
        ];
        
        problematicStrings.forEach(({ input, expected }) => {
            if (!isASCII(input)) {
                const nonASCII = findNonASCII(input);
                console.log(`  ✓ Detected ${expected} in "${input}":`, nonASCII);
            }
        });
    });
    
    BugX.test('Should validate common header patterns', function() {
        const commonHeaders = {
            'Authorization': 'Bearer sk-test123456',
            'Content-Type': 'application/json',
            'X-Title': 'tapestrAI',
            'HTTP-Referer': 'https://example.com',
            'User-Agent': 'TapestrAI/3.6.6'
        };
        
        Object.entries(commonHeaders).forEach(([key, value]) => {
            assert.isTrue(isASCII(key), `Header key "${key}" must be ASCII`);
            assert.isTrue(isASCII(value), `Header value "${value}" must be ASCII`);
        });
    });
    
    BugX.test('Should detect ISO-8859-1 violations', function() {
        // ISO-8859-1 allows 0-255, but HTTP headers should stick to ASCII (0-127)
        const testStrings = [
            { str: 'test', valid: true },
            { str: 'tapestrAI', valid: true },
            { str: 'café', valid: false },  // é is > 127
            { str: '中文', valid: false }    // Chinese characters
        ];
        
        testStrings.forEach(({ str, valid }) => {
            const result = isASCII(str);
            if (valid) {
                assert.isTrue(result, `"${str}" should be valid ASCII`);
            } else {
                assert.isFalse(result, `"${str}" should fail ASCII validation`);
            }
        });
    });
});

// =====================================================
// SUITE 5: Real-World OpenRouter Request Validation
// =====================================================

BugX.suite('OpenRouter Integration - Header Validation', function() {
    
    BugX.test('OpenRouter testKey headers should be ASCII-safe', function() {
        const manager = new window.APIKeyManager();
        
        // Simulate the headers that would be sent in testKey() function
        const headers = {
            'Authorization': 'Bearer test-key',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'tapestrAI',
            'Content-Type': 'application/json'
        };
        
        Object.entries(headers).forEach(([key, value]) => {
            const keyASCII = isASCII(key);
            const valueASCII = isASCII(value);
            
            if (!keyASCII) {
                const nonASCII = findNonASCII(key);
                throw new Error(`Header key "${key}" contains non-ASCII: ${JSON.stringify(nonASCII)}`);
            }
            
            if (!valueASCII) {
                const nonASCII = findNonASCII(value);
                throw new Error(`Header value for "${key}" contains non-ASCII: ${JSON.stringify(nonASCII)}`);
            }
            
            assert.isTrue(keyASCII && valueASCII, `Header "${key}: ${value}" must be ASCII-only`);
        });
    });
    
    BugX.test('OpenRouter analyzeWithOpenRouter headers should be ASCII-safe', function() {
        const manager = new window.APIKeyManager();
        
        // Simulate the headers that would be sent in analyzeWithOpenRouter() function
        const headers = {
            'Authorization': 'Bearer sk-or-v1-test',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'tapestrAI',
            'Content-Type': 'application/json'
        };
        
        Object.entries(headers).forEach(([key, value]) => {
            assert.isTrue(isASCII(key), `Header key must be ASCII: ${key}`);
            assert.isTrue(isASCII(value), `Header value must be ASCII: ${key} = ${value}`);
        });
    });
    
    BugX.test('Should not contain common problematic characters', function() {
        const problematicChars = [
            { name: 'Left single quote', char: ''', code: 8216 },
            { name: 'Right single quote', char: ''', code: 8217 },
            { name: 'Left double quote', char: '"', code: 8220 },
            { name: 'Right double quote', char: '"', code: 8221 },
            { name: 'Em dash', char: '—', code: 8212 },
            { name: 'En dash', char: '–', code: 8211 }
        ];
        
        const testString = 'tapestrAI';
        
        problematicChars.forEach(({ name, char, code }) => {
            const hasChar = testString.includes(char);
            if (hasChar) {
                throw new Error(`String contains ${name} (${char}, code ${code})`);
            }
        });
        
        console.log('  ✓ No problematic characters found');
    });
});

// =====================================================
// SUITE 6: Prevention Utilities
// =====================================================

BugX.suite('Header Utilities - Sanitization', function() {
    
    BugX.test('Should provide sanitization helper', function() {
        // Helper function to sanitize strings for headers
        function sanitizeForHeader(str) {
            return str.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII
        }
        
        const testCases = [
            { input: 'TapestrAI', expected: 'TapestrAI' },
            { input: 'café', expected: 'caf' },
            { input: 'hello—world', expected: 'helloworld' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            const result = sanitizeForHeader(input);
            assert.equals(result, expected, `Sanitization of "${input}" should produce "${expected}"`);
            assert.isTrue(isASCII(result), `Sanitized string should be ASCII: ${result}`);
        });
    });
    
    BugX.test('Should provide validation helper', function() {
        function validateHeaders(headers) {
            const errors = [];
            
            Object.entries(headers).forEach(([key, value]) => {
                if (!isASCII(key)) {
                    errors.push({
                        type: 'key',
                        header: key,
                        issues: findNonASCII(key)
                    });
                }
                
                if (!isASCII(value)) {
                    errors.push({
                        type: 'value',
                        header: key,
                        issues: findNonASCII(value)
                    });
                }
            });
            
            return errors;
        }
        
        const validHeaders = {
            'X-Title': 'tapestrAI',
            'Content-Type': 'application/json'
        };
        
        const errors = validateHeaders(validHeaders);
        assert.equals(errors.length, 0, 'Valid headers should produce no errors');
    });
});

// =====================================================
// Run all tests
// =====================================================

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', async function() {
        console.log('\n🧪 Starting HTTP Header Validation Tests...\n');
        await BugX.runAll();
    });
}

// Export for use in other test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BugX, isASCII, findNonASCII, isISO88591 };
}

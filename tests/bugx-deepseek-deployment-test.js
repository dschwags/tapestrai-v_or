/**
 * BugX Test Suite: DeepSeek Deployment Verification
 * Diagnoses why DeepSeek is not showing on live site
 * 
 * Issue: Site shows "4/4" instead of "0/5"
 * Expected: Should show "0/5" and have DeepSeek card
 */

const bugx = new BugXFramework();

// Test Suite 1: Version Detection
bugx.suite('Version Detection', () => {
    
    bugx.test('Check HTML meta version tag', () => {
        const html = document.documentElement.innerHTML;
        const hasVersionTag = html.includes('Version: 3.1.0 with DeepSeek');
        const hasBuildDate = html.includes('Build: 2025-10-31');
        
        console.log('   🔍 Looking for version tag...');
        console.log(`   📌 Has 3.1.0 tag: ${hasVersionTag}`);
        console.log(`   📌 Has build date: ${hasBuildDate}`);
        
        if (!hasVersionTag || !hasBuildDate) {
            throw new Error('🚨 OLD VERSION DEPLOYED! Missing v3.1.0 version tag');
        }
    });
    
    bugx.test('Check footer version number', () => {
        const footer = document.querySelector('footer')?.textContent || '';
        const bodyText = document.body.textContent;
        
        const hasV310 = bodyText.includes('v3.1.0') || bodyText.includes('3.1.0');
        const hasDeepSeek = bodyText.includes('DeepSeek');
        
        console.log('   🔍 Checking footer version...');
        console.log(`   📌 Has v3.1.0: ${hasV310}`);
        console.log(`   📌 Mentions DeepSeek: ${hasDeepSeek}`);
        
        if (!hasV310) {
            throw new Error('🚨 Footer shows wrong version (expected v3.1.0)');
        }
    });
});

// Test Suite 2: Provider Count Verification
bugx.suite('Provider Count Verification', () => {
    
    bugx.test('Check API Keys counter in header', () => {
        const header = document.querySelector('#api-status-summary');
        const counterElement = document.querySelector('#keys-configured-count');
        
        console.log('   🔍 Checking API key counter...');
        console.log(`   📌 Counter element exists: ${!!counterElement}`);
        
        if (counterElement) {
            const text = counterElement.textContent;
            console.log(`   📌 Counter text: "${text}"`);
            
            // Should show "0/5" not "0/4"
            if (text.includes('4/4') || text.includes('0/4')) {
                throw new Error(`🚨 WRONG COUNTER! Shows "${text}" but should show "0/5" or "X/5"`);
            }
            
            if (!text.includes('/5')) {
                throw new Error(`🚨 Counter doesn't show 5 providers: "${text}"`);
            }
        } else {
            throw new Error('🚨 Counter element #keys-configured-count not found!');
        }
    });
    
    bugx.test('Count provider cards in UI', () => {
        const providerCards = document.querySelectorAll('.provider-card');
        console.log(`   🔍 Found ${providerCards.length} provider cards`);
        
        if (providerCards.length !== 5) {
            throw new Error(`🚨 WRONG PROVIDER COUNT! Found ${providerCards.length} cards, expected 5`);
        }
    });
});

// Test Suite 3: DeepSeek UI Elements
bugx.suite('DeepSeek UI Elements', () => {
    
    bugx.test('Check for DeepSeek card', () => {
        const pageText = document.body.textContent;
        const hasDeepSeekCard = pageText.includes('DeepSeek');
        
        console.log('   🔍 Searching for DeepSeek in page...');
        console.log(`   📌 Found "DeepSeek" text: ${hasDeepSeekCard}`);
        
        if (!hasDeepSeekCard) {
            throw new Error('🚨 NO DEEPSEEK CARD FOUND!');
        }
    });
    
    bugx.test('Check for DeepSeek input field', () => {
        const input = document.querySelector('#deepseek-key-input');
        console.log(`   🔍 DeepSeek input field exists: ${!!input}`);
        
        if (!input) {
            throw new Error('🚨 DeepSeek input field #deepseek-key-input not found!');
        }
    });
    
    bugx.test('Check for "100x Cheaper" badge', () => {
        const pageHTML = document.documentElement.innerHTML;
        const has100xBadge = pageHTML.includes('100x Cheaper') || pageHTML.includes('100x cheaper');
        
        console.log(`   🔍 "100x Cheaper" badge found: ${has100xBadge}`);
        
        if (!has100xBadge) {
            throw new Error('🚨 Missing "100x Cheaper" badge for DeepSeek!');
        }
    });
});

// Test Suite 4: JavaScript API Configuration
bugx.suite('JavaScript API Configuration', () => {
    
    bugx.test('Check apiKeyManager has deepseek provider', () => {
        if (typeof window.apiKeyManager === 'undefined') {
            throw new Error('🚨 apiKeyManager not loaded!');
        }
        
        const providers = window.apiKeyManager.providers;
        console.log('   🔍 Checking providers object...');
        console.log(`   📌 Providers: ${Object.keys(providers).join(', ')}`);
        
        if (!providers.deepseek) {
            throw new Error('🚨 DeepSeek provider NOT in apiKeyManager.providers!');
        }
        
        console.log(`   ✅ DeepSeek config: ${JSON.stringify(providers.deepseek, null, 2)}`);
    });
    
    bugx.test('Check provider count equals 5', () => {
        const providers = window.apiKeyManager.providers;
        const count = Object.keys(providers).length;
        
        console.log(`   📌 Total providers: ${count}`);
        
        if (count !== 5) {
            throw new Error(`🚨 Provider count is ${count}, expected 5!`);
        }
    });
});

// Test Suite 5: Deployment Diagnosis
bugx.suite('Deployment Diagnosis', () => {
    
    bugx.test('Check cache timestamp', () => {
        const html = document.documentElement.innerHTML;
        const cacheInfo = html.match(/Last updated: ([\d-]+)/);
        
        if (cacheInfo) {
            console.log(`   📌 Last updated: ${cacheInfo[1]}`);
        } else {
            console.log('   ⚠️  No cache timestamp found');
        }
    });
    
    bugx.test('Check if browser cached old version', () => {
        const performanceEntries = performance.getEntriesByType('navigation');
        if (performanceEntries.length > 0) {
            const nav = performanceEntries[0];
            const fromCache = nav.transferSize === 0;
            
            console.log(`   📌 Page loaded from cache: ${fromCache}`);
            console.log(`   📌 Transfer size: ${nav.transferSize} bytes`);
            
            if (fromCache) {
                console.log('   ⚠️  WARNING: Page loaded from cache! Hard refresh needed.');
            }
        }
    });
    
    bugx.test('Generate deployment report', () => {
        const report = {
            version: document.documentElement.innerHTML.includes('3.1.0') ? 'v3.1.0' : 'v3.0 or unknown',
            providerCount: document.querySelectorAll('.provider-card').length,
            hasDeepSeek: document.body.textContent.includes('DeepSeek'),
            counterText: document.querySelector('#keys-configured-count')?.textContent || 'not found',
            apiKeyManagerLoaded: typeof window.apiKeyManager !== 'undefined',
            deepseekInConfig: window.apiKeyManager?.providers?.deepseek ? 'YES' : 'NO',
            timestamp: new Date().toISOString()
        };
        
        console.log('\n📋 DEPLOYMENT REPORT:');
        console.log(JSON.stringify(report, null, 2));
        
        // Log diagnosis
        if (report.version !== 'v3.1.0') {
            console.error('\n🚨 DIAGNOSIS: OLD VERSION DEPLOYED');
            console.error('   Solutions:');
            console.error('   1. Check if GitHub merge completed');
            console.error('   2. Check Cloudflare Pages deployment status');
            console.error('   3. Hard refresh browser (Ctrl+Shift+R)');
            console.error('   4. Clear browser cache completely');
        } else if (!report.hasDeepSeek) {
            console.error('\n🚨 DIAGNOSIS: CORRECT VERSION BUT DEEPSEEK MISSING');
            console.error('   This should not happen - check HTML rendering');
        } else if (report.counterText.includes('/4')) {
            console.error('\n🚨 DIAGNOSIS: UI NOT UPDATED');
            console.error('   Counter still shows /4 instead of /5');
            console.error('   This indicates partial deployment');
        } else {
            console.log('\n✅ DIAGNOSIS: EVERYTHING LOOKS GOOD!');
        }
    });
});

// Run tests
console.log('🔧 BugX: DeepSeek Deployment Verification');
console.log('==========================================\n');

bugx.runAll().then(results => {
    if (results.failed > 0) {
        console.log('\n🚨 ACTION REQUIRED:');
        console.log('   The old version is still deployed.');
        console.log('   Next steps:');
        console.log('   1. Check Cloudflare Pages deployment at: https://dash.cloudflare.com');
        console.log('   2. Verify GitHub merge completed: https://github.com/dschwags/tapestrai-v3');
        console.log('   3. Hard refresh browser: Ctrl+Shift+R');
        console.log('   4. If still fails, manually redeploy via Wrangler');
    }
});

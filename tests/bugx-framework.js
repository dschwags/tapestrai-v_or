/**
 * BugX Test Framework
 * Lightweight testing framework for boundary testing and state verification
 * 
 * @version 2.0
 * @author D. Schwager / BrewX
 * @license MIT
 */

class BugXFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };
        this.currentSuite = null;
    }

    /**
     * Define a test suite
     */
    suite(name, callback) {
        this.currentSuite = name;
        console.log(`\n📦 Suite: ${name}`);
        callback();
        this.currentSuite = null;
    }

    /**
     * Define a test case
     */
    test(name, callback) {
        this.tests.push({
            suite: this.currentSuite,
            name: name,
            callback: callback
        });
    }

    /**
     * Run all tests
     */
    async runAll() {
        console.log('\n🚀 Starting BugX Test Suite for tapestrAI v3.0\n');
        this.results = { passed: 0, failed: 0, skipped: 0, total: 0 };

        for (const test of this.tests) {
            await this.runTest(test);
        }

        this.printSummary();
        return this.results;
    }

    /**
     * Run a single test
     */
    async runTest(test) {
        this.results.total++;
        const testName = test.suite ? `${test.suite} > ${test.name}` : test.name;

        try {
            await test.callback();
            console.log(`✅ ${testName}`);
            this.results.passed++;
        } catch (error) {
            console.error(`❌ ${testName}`);
            console.error(`   Error: ${error.message}`);
            if (error.stack) {
                console.error(`   Stack: ${error.stack.split('\n')[1]}`);
            }
            this.results.failed++;
        }
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⏭️  Skipped: ${this.results.skipped}`);
        
        const passRate = (this.results.passed / this.results.total * 100).toFixed(1);
        console.log(`\n📈 Pass Rate: ${passRate}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
        } else {
            console.log(`\n⚠️  ${this.results.failed} TEST(S) FAILED`);
        }
        console.log('='.repeat(50) + '\n');
    }

    /**
     * Assertion helpers
     */
    assert = {
        isTrue(value, message = 'Expected true') {
            if (value !== true) {
                throw new Error(`${message} (got: ${value})`);
            }
        },

        isFalse(value, message = 'Expected false') {
            if (value !== false) {
                throw new Error(`${message} (got: ${value})`);
            }
        },

        equals(actual, expected, message = 'Values not equal') {
            if (actual !== expected) {
                throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
            }
        },

        notEquals(actual, expected, message = 'Values should not be equal') {
            if (actual === expected) {
                throw new Error(`${message} (both are: ${actual})`);
            }
        },

        isNull(value, message = 'Expected null') {
            if (value !== null) {
                throw new Error(`${message} (got: ${value})`);
            }
        },

        isNotNull(value, message = 'Expected non-null value') {
            if (value === null) {
                throw new Error(message);
            }
        },

        isUndefined(value, message = 'Expected undefined') {
            if (value !== undefined) {
                throw new Error(`${message} (got: ${value})`);
            }
        },

        isNotUndefined(value, message = 'Expected defined value') {
            if (value === undefined) {
                throw new Error(message);
            }
        },

        exists(value, message = 'Expected value to exist') {
            if (value === null || value === undefined) {
                throw new Error(message);
            }
        },

        contains(container, value, message = 'Container does not include value') {
            if (Array.isArray(container)) {
                if (!container.includes(value)) {
                    throw new Error(`${message}\n  Looking for: ${value}\n  In: [${container.join(', ')}]`);
                }
            } else if (typeof container === 'string') {
                if (!container.includes(value)) {
                    throw new Error(`${message}\n  Looking for: ${value}\n  In: ${container}`);
                }
            } else {
                throw new Error('Container must be array or string');
            }
        },

        throws(fn, message = 'Expected function to throw') {
            let threw = false;
            try {
                fn();
            } catch (e) {
                threw = true;
            }
            if (!threw) {
                throw new Error(message);
            }
        },

        async rejects(promise, message = 'Expected promise to reject') {
            let rejected = false;
            try {
                await promise;
            } catch (e) {
                rejected = true;
            }
            if (!rejected) {
                throw new Error(message);
            }
        }
    };
}

/**
 * Test helpers for browser-based applications
 */
class BugXHelpers {
    static clearStorage() {
        localStorage.clear();
    }

    static getStorageKeys() {
        const keys = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            keys[key] = localStorage.getItem(key);
        }
        return keys;
    }

    static elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    static isVisible(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               !element.classList.contains('hidden');
    }

    static hasClass(selector, className) {
        const element = document.querySelector(selector);
        return element ? element.classList.contains(className) : false;
    }

    static async waitFor(condition, timeout = 5000, interval = 100) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        throw new Error('Timeout waiting for condition');
    }

    static async waitForElement(selector, timeout = 5000) {
        return this.waitFor(() => this.elementExists(selector), timeout);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use
window.BugXFramework = BugXFramework;
window.BugXHelpers = BugXHelpers;

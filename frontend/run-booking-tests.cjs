#!/usr/bin/env node

/**
 * ========================================================================================
 * BOOKING SYSTEM TEST RUNNER
 * ========================================================================================
 * 
 * This script runs comprehensive tests for the booking system and automatically
 * fixes any issues found. It can be integrated into CI/CD pipelines or run manually.
 * 
 * USAGE:
 *   node run-booking-tests.js [options]
 * 
 * OPTIONS:
 *   --fix          Automatically fix issues found
 *   --verbose      Show detailed output
 *   --watch        Watch for file changes and auto-fix
 *   --validate     Only validate, don't fix
 */

const CrossPackageBookingTester = require('./test-cross-package-booking');
const AutomatedBookingSystemFixer = require('./auto-fix-booking-system');
const fs = require('fs');
const path = require('path');

class BookingSystemTestRunner {
  constructor(options = {}) {
    this.options = {
      fix: options.fix || false,
      verbose: options.verbose || false,
      watch: options.watch || false,
      validate: options.validate || false,
      ...options
    };
    
    this.tester = new CrossPackageBookingTester();
    this.fixer = new AutomatedBookingSystemFixer();
  }

  /**
   * Run all tests and fixes
   */
  async run() {
    console.log('🚀 Starting Booking System Test Runner...\n');
    
    if (this.options.verbose) {
      console.log('📋 Configuration:');
      console.log(`   Fix Issues: ${this.options.fix}`);
      console.log(`   Verbose: ${this.options.verbose}`);
      console.log(`   Watch Mode: ${this.options.watch}`);
      console.log(`   Validate Only: ${this.options.validate}\n`);
    }
    
    try {
      // Run the test suite
      const results = await this.tester.runAllTests();
      
      // Show results
      this.displayResults(results);
      
      // Apply fixes if requested
      if (this.options.fix && !this.options.validate) {
        await this.applyFixes();
      }
      
      // Start watching if requested
      if (this.options.watch) {
        await this.startWatching();
      }
      
      // Return exit code
      return results.failed > 0 ? 1 : 0;
      
    } catch (error) {
      console.error('❌ Test runner failed:', error);
      return 1;
    }
  }

  /**
   * Display test results
   */
  displayResults(results) {
    console.log('\n📊 FINAL RESULTS');
    console.log('==================');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`🔧 Fixed: ${results.fixed}`);
    console.log(`📝 Total: ${results.totalTests}`);
    
    const successRate = ((results.passed / results.totalTests) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (results.failed > 0) {
      console.log('\n🚨 ISSUES SUMMARY:');
      this.tester.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type} (${issue.severity})`);
      });
    }
    
    if (results.fixed > 0) {
      console.log('\n🎉 AUTOMATED FIXES APPLIED:');
      console.log(`   ${results.fixed} issues were automatically fixed`);
    }
  }

  /**
   * Apply fixes
   */
  async applyFixes() {
    console.log('\n🔧 Applying automated fixes...');
    
    try {
      await this.fixer.runInitialCheck();
      console.log('✅ All fixes applied successfully');
    } catch (error) {
      console.error('❌ Failed to apply fixes:', error);
    }
  }

  /**
   * Start watching for changes
   */
  async startWatching() {
    console.log('\n👀 Starting file watcher...');
    console.log('   Press Ctrl+C to stop watching');
    
    try {
      await this.fixer.start();
      
      // Keep the process running
      return new Promise(() => {});
    } catch (error) {
      console.error('❌ Failed to start watcher:', error);
    }
  }

  /**
   * Generate test report
   */
  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      results: results,
      issues: this.tester.issues,
      fixes: this.tester.fixes,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    const reportPath = path.join(__dirname, 'booking-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  /**
   * Validate specific files
   */
  async validateFiles(files) {
    console.log('🔍 Validating specific files...');
    
    for (const file of files) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        await this.fixer.analyzeAndFixFile(filePath);
      } else {
        console.log(`⚠️  File not found: ${file}`);
      }
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    switch (arg) {
      case '--fix':
        options.fix = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--watch':
        options.watch = true;
        break;
      case '--validate':
        options.validate = true;
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
    }
  });
  
  return options;
}

// Show help information
function showHelp() {
  console.log(`
🧪 Booking System Test Runner

USAGE:
  node run-booking-tests.js [options]

OPTIONS:
  --fix          Automatically fix issues found
  --verbose      Show detailed output
  --watch        Watch for file changes and auto-fix
  --validate     Only validate, don't fix
  --help         Show this help message

EXAMPLES:
  node run-booking-tests.js                    # Run tests only
  node run-booking-tests.js --fix              # Run tests and fix issues
  node run-booking-tests.js --watch            # Watch for changes and auto-fix
  node run-booking-tests.js --verbose --fix    # Verbose output with fixes
  `);
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const runner = new BookingSystemTestRunner(options);
  
  runner.run()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = BookingSystemTestRunner;

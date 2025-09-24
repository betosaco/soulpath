#!/usr/bin/env node

/**
 * ========================================================================================
 * BOOKING SYSTEM ANALYSIS EXPORTER
 * ========================================================================================
 * 
 * This script exports all booking workflow, products, and schedule files
 * into a single comprehensive text file for code analysis.
 * 
 * FEATURES:
 * - Exports all relevant booking system files
 * - Includes behavior rules and documentation
 * - Organizes by component type and functionality
 * - Generates comprehensive analysis file
 */

const fs = require('fs');
const path = require('path');

class BookingSystemExporter {
  constructor() {
    this.outputFile = 'booking-system-analysis.txt';
    this.analysis = {
      timestamp: new Date().toISOString(),
      files: [],
      rules: [],
      components: []
    };
    
    // Define the files to analyze
    this.bookingFiles = [
      // Core Booking Flow Components
      'components/MasterBookingFlow.tsx',
      'components/ScheduleBookingFlow.tsx',
      'components/EnhancedSchedule.tsx',
      
      // Cart and UI Components
      'components/CartSidebar.tsx',
      'components/UnifiedCheckoutFlow.tsx',
      
      // Product and Package Components
      'components/ProductCard.tsx',
      'components/PackageCard.tsx',
      
      // API Routes
      'app/api/packages/route.ts',
      'app/api/schedule/route.ts',
      'app/api/bookings/route.ts',
      
      // Pages
      'app/products/page.tsx',
      'app/schedule/page.tsx',
      'app/checkout/page.tsx',
      
      // Hooks and Utilities
      'hooks/usePackagesQuery.tsx',
      'hooks/useScheduleQuery.tsx',
      'lib/safe-fetch.ts',
      'lib/prisma.ts',
      
      // Store and State Management
      'store/appStore.ts',
      'store/cartStore.ts'
    ];
    
    // Behavior rules and patterns to extract
    this.behaviorPatterns = [
      'CROSS-PACKAGE BOOKING',
      'SLOT AVAILABILITY',
      'SESSION LIMITS',
      'FLOW DETECTION',
      'VALIDATION RULES',
      'BOOKING SCENARIOS',
      'PACKAGE MANAGEMENT',
      'SCHEDULE LOCKING',
      'CART BEHAVIOR',
      'CHECKOUT FLOW'
    ];
  }

  /**
   * Main export function
   */
  async export() {
    console.log('📊 Starting Booking System Analysis Export...\n');
    
    try {
      // Analyze each file
      for (const filePath of this.bookingFiles) {
        await this.analyzeFile(filePath);
      }
      
      // Generate comprehensive analysis
      this.generateAnalysis();
      
      // Write to file
      this.writeAnalysisFile();
      
      console.log(`✅ Analysis exported to: ${this.outputFile}`);
      console.log(`📁 Analyzed ${this.analysis.files.length} files`);
      console.log(`📋 Extracted ${this.analysis.rules.length} behavior rules`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      process.exit(1);
    }
  }

  /**
   * Analyze a single file
   */
  async analyzeFile(filePath) {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    console.log(`🔍 Analyzing: ${filePath}`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const fileInfo = {
      path: filePath,
      size: content.length,
      lines: content.split('\n').length,
      content: content,
      rules: this.extractBehaviorRules(content),
      components: this.extractComponents(content),
      functions: this.extractFunctions(content),
      types: this.extractTypes(content),
      imports: this.extractImports(content)
    };
    
    this.analysis.files.push(fileInfo);
  }

  /**
   * Extract behavior rules from file content
   */
  extractBehaviorRules(content) {
    const rules = [];
    
    // Look for comment blocks with behavior rules
    const commentBlocks = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
    const singleLineComments = content.match(/\/\/.*$/gm) || [];
    
    // Extract multi-line comment rules
    commentBlocks.forEach(block => {
      if (this.containsBehaviorRule(block)) {
        rules.push({
          type: 'block_comment',
          content: block.trim(),
          patterns: this.identifyPatterns(block)
        });
      }
    });
    
    // Extract single-line comment rules
    singleLineComments.forEach(comment => {
      if (this.containsBehaviorRule(comment)) {
        rules.push({
          type: 'single_comment',
          content: comment.trim(),
          patterns: this.identifyPatterns(comment)
        });
      }
    });
    
    return rules;
  }

  /**
   * Check if content contains behavior rules
   */
  containsBehaviorRule(content) {
    const lowerContent = content.toLowerCase();
    return this.behaviorPatterns.some(pattern => 
      lowerContent.includes(pattern.toLowerCase())
    ) || 
    lowerContent.includes('rule') ||
    lowerContent.includes('behavior') ||
    lowerContent.includes('logic') ||
    lowerContent.includes('validation') ||
    lowerContent.includes('scenario');
  }

  /**
   * Identify behavior patterns in content
   */
  identifyPatterns(content) {
    const patterns = [];
    const lowerContent = content.toLowerCase();
    
    this.behaviorPatterns.forEach(pattern => {
      if (lowerContent.includes(pattern.toLowerCase())) {
        patterns.push(pattern);
      }
    });
    
    return patterns;
  }

  /**
   * Extract React components from content
   */
  extractComponents(content) {
    const components = [];
    
    // Extract function components
    const functionComponents = content.match(/export\s+(?:function|const)\s+(\w+)\s*[=\(]/g) || [];
    functionComponents.forEach(match => {
      const name = match.match(/(\w+)\s*[=\(]/)[1];
      components.push({ type: 'function', name });
    });
    
    // Extract class components
    const classComponents = content.match(/export\s+class\s+(\w+)/g) || [];
    classComponents.forEach(match => {
      const name = match.match(/class\s+(\w+)/)[1];
      components.push({ type: 'class', name });
    });
    
    return components;
  }

  /**
   * Extract functions from content
   */
  extractFunctions(content) {
    const functions = [];
    
    // Extract function declarations
    const functionMatches = content.match(/(?:const|function)\s+(\w+)\s*[=\(]/g) || [];
    functionMatches.forEach(match => {
      const name = match.match(/(\w+)\s*[=\(]/)[1];
      if (!name.startsWith('use') && !name.startsWith('is') && !name.startsWith('get')) {
        functions.push(name);
      }
    });
    
    return functions;
  }

  /**
   * Extract TypeScript types and interfaces
   */
  extractTypes(content) {
    const types = [];
    
    // Extract interfaces
    const interfaces = content.match(/interface\s+(\w+)/g) || [];
    interfaces.forEach(match => {
      const name = match.match(/interface\s+(\w+)/)[1];
      types.push({ type: 'interface', name });
    });
    
    // Extract type aliases
    const typeAliases = content.match(/type\s+(\w+)\s*=/g) || [];
    typeAliases.forEach(match => {
      const name = match.match(/type\s+(\w+)/)[1];
      types.push({ type: 'type', name });
    });
    
    return types;
  }

  /**
   * Extract imports from content
   */
  extractImports(content) {
    const imports = [];
    
    const importMatches = content.match(/import\s+.*?from\s+['"]([^'"]+)['"]/g) || [];
    importMatches.forEach(match => {
      const source = match.match(/from\s+['"]([^'"]+)['"]/)[1];
      imports.push(source);
    });
    
    return [...new Set(imports)]; // Remove duplicates
  }

  /**
   * Generate comprehensive analysis
   */
  generateAnalysis() {
    console.log('\n📋 Generating comprehensive analysis...');
    
    // Extract all behavior rules
    this.analysis.files.forEach(file => {
      file.rules.forEach(rule => {
        this.analysis.rules.push({
          file: file.path,
          type: rule.type,
          content: rule.content,
          patterns: rule.patterns
        });
      });
    });
    
    // Extract all components
    this.analysis.files.forEach(file => {
      file.components.forEach(component => {
        this.analysis.components.push({
          file: file.path,
          ...component
        });
      });
    });
  }

  /**
   * Write analysis to file
   */
  writeAnalysisFile() {
    console.log(`\n📝 Writing analysis to ${this.outputFile}...`);
    
    let output = '';
    
    // Header
    output += this.generateHeader();
    
    // Summary
    output += this.generateSummary();
    
    // File Analysis
    output += this.generateFileAnalysis();
    
    // Behavior Rules
    output += this.generateBehaviorRules();
    
    // Components Overview
    output += this.generateComponentsOverview();
    
    // Full File Contents
    output += this.generateFullFileContents();
    
    // Footer
    output += this.generateFooter();
    
    fs.writeFileSync(this.outputFile, output);
  }

  /**
   * Generate file header
   */
  generateHeader() {
    return `
========================================================================================
BOOKING SYSTEM COMPREHENSIVE ANALYSIS
========================================================================================

Generated: ${this.analysis.timestamp}
Purpose: Complete code analysis of booking workflow, products, and schedules
Files Analyzed: ${this.analysis.files.length}
Behavior Rules Found: ${this.analysis.rules.length}
Components Found: ${this.analysis.components.length}

========================================================================================
TABLE OF CONTENTS
========================================================================================

1. SUMMARY AND OVERVIEW
2. BEHAVIOR RULES AND LOGIC
3. COMPONENTS OVERVIEW
4. FILE-BY-FILE ANALYSIS
5. COMPLETE SOURCE CODE

========================================================================================
`;
  }

  /**
   * Generate summary section
   */
  generateSummary() {
    return `
========================================================================================
1. SUMMARY AND OVERVIEW
========================================================================================

BOOKING SYSTEM ARCHITECTURE:
- Master Booking Flow: Central component managing all booking scenarios
- Schedule Management: Enhanced schedule component with cross-package booking
- Cart System: Zustand-based cart with package and booking management
- API Integration: RESTful APIs for packages, schedules, and bookings
- State Management: Centralized state with session persistence

KEY FUNCTIONALITY:
- Cross-package booking (different packages can book same time slots)
- Session limit enforcement per package
- Multiple booking flow scenarios (schedule-first, package-first, add-more)
- Real-time slot availability and locking
- Comprehensive validation and error handling

TECHNICAL STACK:
- React 18 with TypeScript
- Next.js 15 with App Router
- Zustand for state management
- Prisma for database operations
- Tailwind CSS for styling

========================================================================================
`;
  }

  /**
   * Generate behavior rules section
   */
  generateBehaviorRules() {
    let output = `
========================================================================================
2. BEHAVIOR RULES AND LOGIC
========================================================================================

`;

    // Group rules by pattern
    const rulesByPattern = {};
    this.analysis.rules.forEach(rule => {
      rule.patterns.forEach(pattern => {
        if (!rulesByPattern[pattern]) {
          rulesByPattern[pattern] = [];
        }
        rulesByPattern[pattern].push(rule);
      });
    });

    // Output rules by pattern
    Object.keys(rulesByPattern).forEach(pattern => {
      output += `\n${pattern}:\n`;
      output += `${'='.repeat(pattern.length + 1)}\n\n`;
      
      rulesByPattern[pattern].forEach(rule => {
        output += `File: ${rule.file}\n`;
        output += `Type: ${rule.type}\n`;
        output += `Content:\n${rule.content}\n\n`;
        output += `${'-'.repeat(80)}\n\n`;
      });
    });

    return output;
  }

  /**
   * Generate components overview
   */
  generateComponentsOverview() {
    let output = `
========================================================================================
3. COMPONENTS OVERVIEW
========================================================================================

`;

    this.analysis.components.forEach(component => {
      output += `${component.name} (${component.type})\n`;
      output += `  File: ${component.file}\n`;
      output += `  Type: ${component.type} component\n\n`;
    });

    return output;
  }

  /**
   * Generate file analysis section
   */
  generateFileAnalysis() {
    let output = `
========================================================================================
4. FILE-BY-FILE ANALYSIS
========================================================================================

`;

    this.analysis.files.forEach(file => {
      output += `\nFILE: ${file.path}\n`;
      output += `${'='.repeat(file.path.length + 6)}\n`;
      output += `Size: ${file.size} bytes\n`;
      output += `Lines: ${file.lines}\n`;
      output += `Components: ${file.components.length}\n`;
      output += `Functions: ${file.functions.length}\n`;
      output += `Types: ${file.types.length}\n`;
      output += `Behavior Rules: ${file.rules.length}\n`;
      output += `Imports: ${file.imports.length}\n\n`;
      
      if (file.components.length > 0) {
        output += `Components:\n`;
        file.components.forEach(comp => {
          output += `  - ${comp.name} (${comp.type})\n`;
        });
        output += `\n`;
      }
      
      if (file.functions.length > 0) {
        output += `Key Functions:\n`;
        file.functions.slice(0, 10).forEach(func => {
          output += `  - ${func}\n`;
        });
        if (file.functions.length > 10) {
          output += `  ... and ${file.functions.length - 10} more\n`;
        }
        output += `\n`;
      }
      
      if (file.types.length > 0) {
        output += `Types/Interfaces:\n`;
        file.types.forEach(type => {
          output += `  - ${type.name} (${type.type})\n`;
        });
        output += `\n`;
      }
      
      output += `${'-'.repeat(80)}\n\n`;
    });

    return output;
  }

  /**
   * Generate full file contents
   */
  generateFullFileContents() {
    let output = `
========================================================================================
5. COMPLETE SOURCE CODE
========================================================================================

`;

    this.analysis.files.forEach(file => {
      output += `\n\n========================================================================================\n`;
      output += `FILE: ${file.path}\n`;
      output += `========================================================================================\n\n`;
      output += file.content;
      output += `\n\n`;
    });

    return output;
  }

  /**
   * Generate footer
   */
  generateFooter() {
    return `
========================================================================================
END OF ANALYSIS
========================================================================================

Analysis completed: ${new Date().toISOString()}
Total files processed: ${this.analysis.files.length}
Total behavior rules extracted: ${this.analysis.rules.length}
Total components identified: ${this.analysis.components.length}

This analysis provides a comprehensive overview of the booking system's
architecture, behavior rules, and implementation details for code analysis
and maintenance purposes.

========================================================================================
`;
  }
}

// Run the exporter if this file is executed directly
if (require.main === module) {
  const exporter = new BookingSystemExporter();
  exporter.export()
    .then(() => {
      console.log('\n🎉 Export completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Export failed:', error);
      process.exit(1);
    });
}

module.exports = BookingSystemExporter;

#!/usr/bin/env node

/**
 * ========================================================================================
 * AUTOMATED BOOKING SYSTEM FIXER
 * ========================================================================================
 * 
 * This system automatically detects and fixes cross-package booking issues
 * in real-time by monitoring file changes and applying fixes automatically.
 * 
 * FEATURES:
 * - Real-time file monitoring
 * - Automatic issue detection
 * - Intelligent fix application
 * - Backup creation before fixes
 * - Rollback capability
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class AutomatedBookingSystemFixer {
  constructor() {
    this.watchedFiles = [
      'components/MasterBookingFlow.tsx',
      'components/EnhancedSchedule.tsx',
      'components/ScheduleBookingFlow.tsx'
    ];
    this.backupDir = 'backups';
    this.fixHistory = [];
    this.isRunning = false;
  }

  /**
   * Start the automated fix system
   */
  async start() {
    console.log('🤖 Starting Automated Booking System Fixer...');
    
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    // Start file watching
    this.startFileWatching();
    
    // Run initial check
    await this.runInitialCheck();
    
    this.isRunning = true;
    console.log('✅ Automated fix system is now running...');
    console.log('📁 Watching files:', this.watchedFiles.join(', '));
    console.log('💾 Backups will be saved to:', this.backupDir);
  }

  /**
   * Start file watching
   */
  startFileWatching() {
    const watcher = chokidar.watch(this.watchedFiles, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', async (filePath) => {
      console.log(`\n📝 File changed: ${filePath}`);
      await this.analyzeAndFixFile(filePath);
    });

    watcher.on('error', (error) => {
      console.error('❌ File watcher error:', error);
    });
  }

  /**
   * Run initial check on all files
   */
  async runInitialCheck() {
    console.log('\n🔍 Running initial check on all files...');
    
    for (const file of this.watchedFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        await this.analyzeAndFixFile(filePath);
      }
    }
  }

  /**
   * Analyze and fix a specific file
   */
  async analyzeAndFixFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = this.detectIssues(content, filePath);
      
      if (issues.length > 0) {
        console.log(`🚨 Found ${issues.length} issues in ${path.basename(filePath)}`);
        
        // Create backup
        await this.createBackup(filePath);
        
        // Apply fixes
        const fixedContent = this.applyFixes(content, issues);
        
        // Write fixed content
        fs.writeFileSync(filePath, fixedContent);
        
        console.log(`✅ Applied ${issues.length} fixes to ${path.basename(filePath)}`);
        
        // Record fix history
        this.recordFix(filePath, issues);
      } else {
        console.log(`✅ No issues found in ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`❌ Error analyzing ${filePath}:`, error.message);
    }
  }

  /**
   * Detect issues in file content
   */
  detectIssues(content, filePath) {
    const issues = [];
    const fileName = path.basename(filePath);

    // Issue 1: Missing hasMultiplePackages prop in EnhancedSchedule
    if (fileName === 'MasterBookingFlow.tsx') {
      const enhancedScheduleRegex = /<EnhancedSchedule[\s\S]*?\/>/g;
      const matches = content.match(enhancedScheduleRegex);
      
      if (matches) {
        matches.forEach((match, index) => {
          if (!match.includes('hasMultiplePackages')) {
            issues.push({
              type: 'missing_hasMultiplePackages_prop',
              severity: 'high',
              line: this.getLineNumber(content, match),
              fix: this.generateHasMultiplePackagesFix(match, index)
            });
          }
        });
      }
    }

    // Issue 2: Incorrect isSlotBooked logic
    if (fileName === 'EnhancedSchedule.tsx') {
      const isSlotBookedRegex = /const isSlotBooked = \(slot: ScheduleSlot\) => \{[\s\S]*?\};/;
      const match = content.match(isSlotBookedRegex);
      
      if (match && !match[0].includes('hasMultiplePackages')) {
        issues.push({
          type: 'incorrect_slot_booking_logic',
          severity: 'high',
          line: this.getLineNumber(content, match[0]),
          fix: this.generateIsSlotBookedFix()
        });
      }
    }

    // Issue 3: Incomplete existingBookings structure
    if (fileName === 'MasterBookingFlow.tsx') {
      const existingBookingsRegex = /existingBookings=\{[\s\S]*?\}/g;
      const matches = content.match(existingBookingsRegex);
      
      if (matches) {
        matches.forEach((match, index) => {
          if (!match.includes('packageId')) {
            issues.push({
              type: 'incomplete_existingBookings_structure',
              severity: 'medium',
              line: this.getLineNumber(content, match),
              fix: this.generateExistingBookingsFix(match)
            });
          }
        });
      }
    }

    // Issue 4: Missing cross-package booking logic
    if (fileName === 'MasterBookingFlow.tsx') {
      const getAvailablePackagesRegex = /const getAvailablePackagesForSlot = [\s\S]*?\};/;
      const match = content.match(getAvailablePackagesRegex);
      
      if (match && !match[0].includes('Different packages should be able to book the same time slot')) {
        issues.push({
          type: 'missing_cross_package_logic',
          severity: 'high',
          line: this.getLineNumber(content, match[0]),
          fix: this.generateCrossPackageLogicFix()
        });
      }
    }

    return issues;
  }

  /**
   * Apply fixes to content
   */
  applyFixes(content, issues) {
    let fixedContent = content;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'missing_hasMultiplePackages_prop':
          fixedContent = this.applyHasMultiplePackagesFix(fixedContent, issue.fix);
          break;
        case 'incorrect_slot_booking_logic':
          fixedContent = this.applyIsSlotBookedFix(fixedContent, issue.fix);
          break;
        case 'incomplete_existingBookings_structure':
          fixedContent = this.applyExistingBookingsFix(fixedContent, issue.fix);
          break;
        case 'missing_cross_package_logic':
          fixedContent = this.applyCrossPackageLogicFix(fixedContent, issue.fix);
          break;
      }
    });
    
    return fixedContent;
  }

  /**
   * Generate hasMultiplePackages fix
   */
  generateHasMultiplePackagesFix(match, index) {
    const scenarios = [
      'false', // Schedule-first flow
      'cartItems.filter(item => item.type === \'package\').length > 1', // Add more bookings flow
      'packageItems.length > 1' // Package-first flow
    ];
    
    const scenario = scenarios[index] || 'false';
    
    return match.replace(
      /(\/>)/,
      `\n                  hasMultiplePackages={${scenario}}\n                $1`
    );
  }

  /**
   * Generate isSlotBooked fix
   */
  generateIsSlotBookedFix() {
    return `
  // Check if a slot is already booked
  const isSlotBooked = (slot: ScheduleSlot) => {
    // For multiple packages, a slot is only "booked" if it reaches max capacity
    // For single package, a slot is "booked" if any booking exists
    if (hasMultiplePackages) {
      return getSlotBookingCount(slot) >= maxBookingsPerSlot;
    } else {
      return existingBookings.some(booking => 
        booking.selectedDate === slot.date && 
        booking.selectedTime === slot.time
      );
    }
  };`;
  }

  /**
   * Generate existingBookings fix
   */
  generateExistingBookingsFix(match) {
    return match.replace(
      /map\(booking => \(\{[^}]*\}\)\)/,
      `map(booking => ({
        selectedDate: booking.selectedDate || '',
        selectedTime: booking.selectedTime || '',
        packageId: item.id,
        packageName: item.name
      }))`
    );
  }

  /**
   * Generate cross-package logic fix
   */
  generateCrossPackageLogicFix() {
    return `
  const getAvailablePackagesForSlot = (_date: string, _time: string) => {
    // Note: date and time parameters are kept for future extensibility
    // Currently, we only check session limits, not slot-specific availability
    return cartItems
      .filter(item =>
        item.type === 'package' &&
        getPackageRemainingSessions(item.id) > 0
        // REMOVED: !isTimeSlotBookedByPackage(date, time, item.id)
        // REASON: Different packages should be able to book the same time slot
        // Only check if package has remaining sessions, not if it has booked this specific slot
      );
  };`;
  }

  /**
   * Apply hasMultiplePackages fix
   */
  applyHasMultiplePackagesFix(content, fix) {
    return content.replace(
      /<EnhancedSchedule[\s\S]*?\/>/g,
      (match) => {
        if (!match.includes('hasMultiplePackages')) {
          return fix;
        }
        return match;
      }
    );
  }

  /**
   * Apply isSlotBooked fix
   */
  applyIsSlotBookedFix(content, fix) {
    return content.replace(
      /const isSlotBooked = \(slot: ScheduleSlot\) => \{[\s\S]*?\};/,
      fix
    );
  }

  /**
   * Apply existingBookings fix
   */
  applyExistingBookingsFix(content, fix) {
    return content.replace(
      /existingBookings=\{[\s\S]*?\}/g,
      (match) => {
        if (!match.includes('packageId')) {
          return fix;
        }
        return match;
      }
    );
  }

  /**
   * Apply cross-package logic fix
   */
  applyCrossPackageLogicFix(content, fix) {
    return content.replace(
      /const getAvailablePackagesForSlot = [\s\S]*?\};/,
      fix
    );
  }

  /**
   * Get line number for a match
   */
  getLineNumber(content, match) {
    const lines = content.substring(0, content.indexOf(match)).split('\n');
    return lines.length;
  }

  /**
   * Create backup of file
   */
  async createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath);
    const backupPath = path.join(this.backupDir, `${fileName}.${timestamp}.backup`);
    
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Created backup: ${backupPath}`);
  }

  /**
   * Record fix in history
   */
  recordFix(filePath, issues) {
    this.fixHistory.push({
      timestamp: new Date().toISOString(),
      file: path.basename(filePath),
      issues: issues.map(issue => issue.type),
      count: issues.length
    });
  }

  /**
   * Stop the automated fix system
   */
  stop() {
    this.isRunning = false;
    console.log('🛑 Automated fix system stopped');
  }

  /**
   * Get fix history
   */
  getFixHistory() {
    return this.fixHistory;
  }

  /**
   * Rollback to previous version
   */
  rollback(filePath) {
    const fileName = path.basename(filePath);
    const backups = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith(fileName) && file.endsWith('.backup'))
      .sort()
      .reverse();
    
    if (backups.length > 0) {
      const latestBackup = path.join(this.backupDir, backups[0]);
      fs.copyFileSync(latestBackup, filePath);
      console.log(`🔄 Rolled back to: ${latestBackup}`);
      return true;
    }
    
    console.log('❌ No backups found for rollback');
    return false;
  }
}

// Run the automated fix system if this file is executed directly
if (require.main === module) {
  const fixer = new AutomatedBookingSystemFixer();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down automated fix system...');
    fixer.stop();
    process.exit(0);
  });
  
  fixer.start().catch(error => {
    console.error('❌ Failed to start automated fix system:', error);
    process.exit(1);
  });
}

module.exports = AutomatedBookingSystemFixer;

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-essential-code.txt';
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vscode',
  '.idea',
  'logs',
  '__pycache__',
  '.pytest_cache'
];
const EXCLUDE_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'next.config.js',
  'next.config.mjs',
  'tailwind.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'eslint.config.js',
  '.eslintrc.json',
  '.eslintrc.js',
  'prettier.config.js',
  '.prettierrc',
  'jest.config.js',
  'vitest.config.js',
  'vite.config.js',
  'webpack.config.js',
  'rollup.config.js',
  'babel.config.js',
  '.babelrc',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  '.gitignore',
  '.dockerignore',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  '.github',
  'cypress.config.js',
  'playwright.config.js',
  'jest.config.js',
  'vitest.config.js'
];
const EXCLUDE_EXTENSIONS = [
  '.log',
  '.tmp',
  '.temp',
  '.cache',
  '.lock',
  '.pid',
  '.seed',
  '.pid.lock',
  '.DS_Store',
  '.Thumbs.db'
];

// File patterns to include (only these file types)
const INCLUDE_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.json'
];

// Debug patterns to exclude
const DEBUG_PATTERNS = [
  /console\.log/,
  /console\.debug/,
  /console\.warn/,
  /console\.error/,
  /debugger/,
  /\/\/\s*DEBUG/,
  /\/\*\s*DEBUG/,
  /TODO/,
  /FIXME/,
  /HACK/,
  /XXX/
];

function shouldExcludeFile(filePath, fileName) {
  // Check if file should be excluded
  if (EXCLUDE_FILES.includes(fileName)) {
    return true;
  }
  
  // Check extensions
  const ext = path.extname(fileName);
  if (EXCLUDE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  // Only include specific extensions
  if (!INCLUDE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  // Exclude debug files
  if (fileName.includes('debug') || fileName.includes('test') || fileName.includes('spec')) {
    return true;
  }
  
  return false;
}

function shouldExcludeDir(dirName) {
  return EXCLUDE_DIRS.includes(dirName) || dirName.startsWith('.');
}

function cleanCodeContent(content) {
  // Remove debug statements and comments
  let cleaned = content;
  
  // Remove debug patterns
  DEBUG_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove empty lines (keep structure)
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleaned;
}

function exportFrontendCode() {
  console.log('🚀 Starting frontend essential code export...');
  
  let output = '';
  let fileCount = 0;
  let totalSize = 0;
  
  // Add header
  output += '='.repeat(80) + '\n';
  output += 'FRONTEND ESSENTIAL CODE EXPORT\n';
  output += 'Generated: ' + new Date().toISOString() + '\n';
  output += '='.repeat(80) + '\n\n';
  
  function processDirectory(dirPath, relativePath = '') {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!shouldExcludeDir(item)) {
            processDirectory(fullPath, relativeItemPath);
          }
        } else if (stat.isFile()) {
          if (!shouldExcludeFile(fullPath, item)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const cleanedContent = cleanCodeContent(content);
              
              // Skip empty files
              if (cleanedContent.trim().length === 0) {
                return;
              }
              
              output += '\n' + '='.repeat(60) + '\n';
              output += `FILE: ${relativeItemPath}\n`;
              output += `SIZE: ${content.length} bytes\n`;
              output += '='.repeat(60) + '\n\n';
              output += cleanedContent;
              output += '\n\n';
              
              fileCount++;
              totalSize += content.length;
              
              console.log(`✅ Processed: ${relativeItemPath}`);
            } catch (error) {
              console.log(`❌ Error reading ${relativeItemPath}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      console.log(`❌ Error processing directory ${dirPath}: ${error.message}`);
    }
  }
  
  // Process frontend directory
  if (fs.existsSync(FRONTEND_DIR)) {
    processDirectory(FRONTEND_DIR);
  } else {
    console.log('❌ Frontend directory not found!');
    return;
  }
  
  // Add footer
  output += '\n' + '='.repeat(80) + '\n';
  output += 'EXPORT SUMMARY\n';
  output += '='.repeat(80) + '\n';
  output += `Total Files: ${fileCount}\n`;
  output += `Total Size: ${(totalSize / 1024).toFixed(2)} KB\n`;
  output += `Generated: ${new Date().toISOString()}\n`;
  output += '='.repeat(80) + '\n';
  
  // Write output file
  try {
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    console.log(`\n🎉 Export completed successfully!`);
    console.log(`📁 Output file: ${OUTPUT_FILE}`);
    console.log(`📊 Files processed: ${fileCount}`);
    console.log(`📏 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.log(`❌ Error writing output file: ${error.message}`);
  }
}

// Run the export
exportFrontendCode();

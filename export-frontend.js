#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-codebase-export.txt';
const EXCLUDED_DIRS = ['node_modules', '.next', 'build', 'dist', '.git', 'rasa', 'scripts', '.vercel'];
const EXCLUDED_FILES = ['.DS_Store', '*.log', '*.tmp', '*.md', '*.json', '*.config.*', '*.cache.*'];
const INCLUDED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css'];

// File patterns to include - all frontend files except API routes
const INCLUDE_PATTERNS = [
  'app/**/*',
  'components/**/*',
  'lib/**/*',
  'hooks/**/*',
  'types/**/*',
  'styles/**/*',
  'middleware.*'
];

function shouldIncludeFile(filePath, relativePath) {
  // Check if file is in excluded directories
  const pathParts = relativePath.split(path.sep);
  for (const part of pathParts) {
    if (EXCLUDED_DIRS.includes(part)) {
      return false;
    }
  }

  // Check if file matches excluded patterns
  for (const pattern of EXCLUDED_FILES) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(relativePath)) {
        return false;
      }
    } else if (relativePath.includes(pattern)) {
      return false;
    }
  }

  // Exclude API routes (backend files)
  if (relativePath.includes('/api/')) {
    return false;
  }

  // Check file extension
  const ext = path.extname(filePath);
  if (!INCLUDED_EXTENSIONS.includes(ext)) {
    return false;
  }

  // Check if file matches include patterns
  for (const pattern of INCLUDE_PATTERNS) {
    if (pattern.includes('**')) {
      const basePattern = pattern.replace('/**/*', '');
      if (relativePath.startsWith(basePattern)) {
        return true;
      }
    } else if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(relativePath)) {
        return true;
      }
    } else if (relativePath === pattern) {
      return true;
    }
  }

  return false;
}

function getAllFiles(dir, relativePath = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively get files from subdirectories
        files.push(...getAllFiles(fullPath, itemRelativePath));
      } else if (shouldIncludeFile(fullPath, itemRelativePath)) {
        files.push({
          fullPath,
          relativePath: itemRelativePath
        });
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return `// Error reading file: ${error.message}\n`;
  }
}

function formatFileContent(relativePath, content) {
  const separator = '='.repeat(80);
  const header = `FILE: ${relativePath}`;
  
  return `\n${separator}\n${header}\n${separator}\n\n${content}\n`;
}

function main() {
  console.log('🚀 Starting frontend codebase export...');
  
  // Check if frontend directory exists
  if (!fs.existsSync(FRONTEND_DIR)) {
    console.error(`❌ Frontend directory not found: ${FRONTEND_DIR}`);
    process.exit(1);
  }

  // Get all files
  console.log('📁 Scanning files...');
  const files = getAllFiles(FRONTEND_DIR);
  console.log(`📄 Found ${files.length} files to export`);

  // Sort files by path for consistent output
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  // Build export content
  let exportContent = '';
  
  // Add header
  exportContent += '='.repeat(80) + '\n';
  exportContent += 'FRONTEND CODEBASE EXPORT\n';
  exportContent += 'Generated: ' + new Date().toISOString() + '\n';
  exportContent += 'Total Files: ' + files.length + '\n';
  exportContent += '='.repeat(80) + '\n\n';

  // Add table of contents
  exportContent += 'TABLE OF CONTENTS\n';
  exportContent += '-'.repeat(40) + '\n';
  files.forEach((file, index) => {
    exportContent += `${(index + 1).toString().padStart(3, ' ')}. ${file.relativePath}\n`;
  });
  exportContent += '\n';

  // Add file contents
  console.log('📝 Reading and formatting files...');
  files.forEach((file, index) => {
    console.log(`   ${index + 1}/${files.length}: ${file.relativePath}`);
    const content = readFileContent(file.fullPath);
    exportContent += formatFileContent(file.relativePath, content);
  });

  // Write to output file
  console.log('💾 Writing to output file...');
  try {
    fs.writeFileSync(OUTPUT_FILE, exportContent, 'utf8');
    console.log(`✅ Export completed successfully!`);
    console.log(`📄 Output file: ${OUTPUT_FILE}`);
    console.log(`📊 Total size: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error(`❌ Error writing output file:`, error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, getAllFiles, shouldIncludeFile };

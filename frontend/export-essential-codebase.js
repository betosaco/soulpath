#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_FILE = 'frontend-essential-codebase.txt';
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
  'backups'
];

const EXCLUDE_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.tmp',
  '*.temp'
];

const INCLUDE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.css',
  '.scss',
  '.md',
  '.prisma',
  '.env.example'
];

// Essential files and directories to include
const ESSENTIAL_PATHS = [
  'app',
  'components',
  'lib',
  'hooks',
  'types',
  'utils',
  'styles',
  'prisma',
  'public',
  'middleware.ts',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'README.md'
];

function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  
  // Check if file should be excluded
  if (EXCLUDE_FILES.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(fileName);
    }
    return fileName === pattern;
  })) {
    return true;
  }
  
  // Check if extension should be included
  if (!INCLUDE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  return false;
}

function shouldExcludeDir(dirName) {
  return EXCLUDE_DIRS.includes(dirName) || dirName.startsWith('.');
}

function getFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return `// Error reading file: ${error.message}\n`;
  }
}

function formatFileHeader(filePath, relativePath) {
  const separator = '='.repeat(80);
  return `\n${separator}\nFILE: ${relativePath}\n${separator}\n`;
}

function formatDirectoryHeader(dirPath, relativePath) {
  const separator = '-'.repeat(60);
  return `\n${separator}\nDIRECTORY: ${relativePath}\n${separator}\n`;
}

function scanDirectory(dirPath, relativePath = '') {
  let content = '';
  
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Sort items: directories first, then files
    items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const itemRelativePath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        if (!shouldExcludeDir(item.name)) {
          content += formatDirectoryHeader(fullPath, itemRelativePath);
          content += scanDirectory(fullPath, itemRelativePath);
        }
      } else {
        if (!shouldExcludeFile(fullPath)) {
          content += formatFileHeader(fullPath, itemRelativePath);
          content += getFileContent(fullPath);
          content += '\n';
        }
      }
    }
  } catch (error) {
    content += `// Error scanning directory ${dirPath}: ${error.message}\n`;
  }
  
  return content;
}

function createExport() {
  console.log('🚀 Starting frontend codebase export...');
  
  const startTime = Date.now();
  let content = '';
  
  // Add header
  content += '='.repeat(80) + '\n';
  content += 'MATMAX YOGA STUDIO - FRONTEND CODEBASE EXPORT\n';
  content += 'Generated: ' + new Date().toISOString() + '\n';
  content += '='.repeat(80) + '\n';
  
  // Add project overview
  content += '\nPROJECT OVERVIEW:\n';
  content += '- Next.js 14 App Router application\n';
  content += '- TypeScript with React components\n';
  content += '- Tailwind CSS for styling\n';
  content += '- Prisma ORM for database\n';
  content += '- Cart system with currency support\n';
  content += '- Package booking system\n';
  content += '- Product e-commerce functionality\n';
  content += '- Schedule booking system\n';
  content += '\n';
  
  // Scan essential paths
  const currentDir = process.cwd();
  
  for (const essentialPath of ESSENTIAL_PATHS) {
    const fullPath = path.join(currentDir, essentialPath);
    
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        console.log(`📁 Scanning directory: ${essentialPath}`);
        content += formatDirectoryHeader(fullPath, essentialPath);
        content += scanDirectory(fullPath, essentialPath);
      } else {
        console.log(`📄 Including file: ${essentialPath}`);
        content += formatFileHeader(fullPath, essentialPath);
        content += getFileContent(fullPath);
        content += '\n';
      }
    } else {
      console.log(`⚠️  Path not found: ${essentialPath}`);
    }
  }
  
  // Add footer
  content += '\n' + '='.repeat(80) + '\n';
  content += 'END OF EXPORT\n';
  content += '='.repeat(80) + '\n';
  
  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Export completed successfully!`);
    console.log(`📄 Output file: ${OUTPUT_FILE}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📊 File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    process.exit(1);
  }
}

// Run the export
if (import.meta.url === `file://${process.argv[1]}`) {
  createExport();
}

export { createExport };

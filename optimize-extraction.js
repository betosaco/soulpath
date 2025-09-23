#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const MAX_FILE_SIZE = 100000; // 100KB max per file

// File extensions to include (core development files)
const CORE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass', '.less'
];

// File extensions that are less critical for analysis
const SECONDARY_EXTENSIONS = [
  '.md', '.yml', '.yaml', '.env', '.env.example', '.gitignore', '.dockerignore'
];

// Directories to exclude (same as before)
const EXCLUDED_DIRS = [
  'node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.nyc_output',
  'public/images', 'public/videos', 'public/assets', 'public/media',
  'static/images', 'static/videos', 'static/assets', 'static/media',
  'uploads', 'temp', 'tmp', '.cache', '.parcel-cache', '.turbo'
];

// File patterns to exclude (same as before)
const EXCLUDED_PATTERNS = [
  /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff|tif)$/i,
  /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/i,
  /\.(mp3|wav|flac|aac|ogg|wma)$/i,
  /\.(zip|rar|7z|tar|gz)$/i,
  /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,
  /\.(exe|dmg|pkg|deb|rpm)$/i,
  /\.(log|tmp|temp)$/i,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /\.DS_Store$/,
  /Thumbs\.db$/,
  /\.env\.local$/,
  /\.env\.production$/,
  /\.env\.development$/
];

// Files to exclude by name (expanded list)
const EXCLUDED_FILES = [
  'next-env.d.ts',
  '.eslintcache',
  '.next/cache',
  'vercel.json',
  'netlify.toml',
  // Large seed files that are not core to frontend analysis
  'seed.ts',
  'seed.js',
  // Documentation files
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE.md',
  // Configuration files that are less relevant
  'tailwind.config.js',
  'postcss.config.js',
  'next.config.js',
  'next.config.mjs',
  'tsconfig.json',
  'tsconfig.node.json',
  'jest.config.js',
  'vitest.config.js',
  'playwright.config.js',
  'cypress.config.js',
  // Build and deployment files
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  '.dockerignore',
  // CI/CD files
  '.github/workflows',
  '.gitlab-ci.yml',
  'azure-pipelines.yml',
  // Package manager files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb'
];

// Directories that contain less critical files for analysis
const SECONDARY_DIRS = [
  'docs',
  'documentation',
  'examples',
  'playground',
  'test-utils',
  'scripts',
  'tools',
  'migrations',
  'seeds',
  'prisma/migrations',
  'prisma/seeds',
  'cypress',
  'e2e',
  'tests',
  'test',
  '__tests__',
  'spec',
  'stories',
  '.storybook',
  'coverage',
  'reports'
];

// Files that are typically large but not essential for core analysis
const LARGE_NON_ESSENTIAL_FILES = [
  'globals.css', // Often contains many utility classes
  'tailwind.css',
  'bootstrap.css',
  'antd.css',
  'material-ui.css'
];

function shouldExcludeFile(filePath, fileName) {
  // Check if file matches excluded patterns
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(fileName)) {
      return true;
    }
  }
  
  // Check if file is in excluded files list
  if (EXCLUDED_FILES.includes(fileName)) {
    return true;
  }
  
  // Check if file is too large
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return true;
    }
  } catch (error) {
    return true;
  }
  
  return false;
}

function shouldExcludeDir(dirName, dirPath) {
  // Check if directory is in excluded list
  if (EXCLUDED_DIRS.includes(dirName)) {
    return true;
  }
  
  // Check if directory is in secondary dirs (less critical)
  const relativePath = path.relative(FRONTEND_DIR, dirPath);
  if (SECONDARY_DIRS.some(secondaryDir => 
    relativePath === secondaryDir || relativePath.startsWith(secondaryDir + path.sep)
  )) {
    return true;
  }
  
  return false;
}

function shouldIncludeFile(fileName, filePath) {
  const ext = path.extname(fileName);
  
  // Always include core extensions
  if (CORE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  // Include secondary extensions only if they're small and in important locations
  if (SECONDARY_EXTENSIONS.includes(ext)) {
    try {
      const stats = fs.statSync(filePath);
      // Only include small secondary files (< 10KB)
      return stats.size < 10240;
    } catch (error) {
      return false;
    }
  }
  
  return false;
}

function isLargeNonEssentialFile(fileName, filePath) {
  if (LARGE_NON_ESSENTIAL_FILES.includes(fileName)) {
    try {
      const stats = fs.statSync(filePath);
      // Exclude if larger than 50KB
      return stats.size > 51200;
    } catch (error) {
      return false;
    }
  }
  return false;
}

function analyzeFiles(dir, basePath = '') {
  const files = {
    included: [],
    excluded: [],
    secondary: [],
    large: []
  };
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        if (!shouldExcludeDir(item, fullPath)) {
          const subResults = analyzeFiles(fullPath, relativePath);
          files.included.push(...subResults.included);
          files.excluded.push(...subResults.excluded);
          files.secondary.push(...subResults.secondary);
          files.large.push(...subResults.large);
        } else {
          files.excluded.push({
            path: relativePath,
            reason: 'excluded directory',
            size: 0
          });
        }
      } else if (stats.isFile()) {
        const fileInfo = {
          path: relativePath,
          fullPath: fullPath,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2),
          extension: path.extname(item) || 'no-extension'
        };
        
        if (shouldExcludeFile(fullPath, item)) {
          fileInfo.reason = 'excluded pattern/file';
          files.excluded.push(fileInfo);
        } else if (isLargeNonEssentialFile(item, fullPath)) {
          fileInfo.reason = 'large non-essential file';
          files.large.push(fileInfo);
        } else if (shouldIncludeFile(item, fullPath)) {
          const ext = path.extname(item);
          if (CORE_EXTENSIONS.includes(ext)) {
            files.included.push(fileInfo);
          } else if (SECONDARY_EXTENSIONS.includes(ext)) {
            fileInfo.reason = 'secondary extension';
            files.secondary.push(fileInfo);
          }
        } else {
          fileInfo.reason = 'not included extension';
          files.excluded.push(fileInfo);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
  
  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function main() {
  console.log('🔍 Analyzing files for optimized extraction...\n');
  
  const frontendPath = path.resolve(FRONTEND_DIR);
  
  if (!fs.existsSync(frontendPath)) {
    console.error(`❌ Frontend directory not found: ${frontendPath}`);
    process.exit(1);
  }
  
  // Analyze all files
  const results = analyzeFiles(frontendPath);
  
  // Calculate totals
  const totalIncluded = results.included.reduce((sum, file) => sum + file.size, 0);
  const totalExcluded = results.excluded.reduce((sum, file) => sum + file.size, 0);
  const totalSecondary = results.secondary.reduce((sum, file) => sum + file.size, 0);
  const totalLarge = results.large.reduce((sum, file) => sum + file.size, 0);
  const totalOriginal = totalIncluded + totalExcluded + totalSecondary + totalLarge;
  
  console.log('📊 OPTIMIZATION ANALYSIS');
  console.log('='.repeat(70));
  console.log(`Original total: ${formatBytes(totalOriginal)} (${results.included.length + results.excluded.length + results.secondary.length + results.large.length} files)`);
  console.log(`Included: ${formatBytes(totalIncluded)} (${results.included.length} files)`);
  console.log(`Excluded: ${formatBytes(totalExcluded)} (${results.excluded.length} files)`);
  console.log(`Secondary: ${formatBytes(totalSecondary)} (${results.secondary.length} files)`);
  console.log(`Large non-essential: ${formatBytes(totalLarge)} (${results.large.length} files)`);
  console.log('');
  
  const reductionPercentage = ((totalOriginal - totalIncluded) / totalOriginal * 100).toFixed(1);
  console.log(`🎯 OPTIMIZATION IMPACT:`);
  console.log(`Size reduction: ${formatBytes(totalOriginal - totalIncluded)} (${reductionPercentage}% smaller)`);
  console.log(`File reduction: ${results.excluded.length + results.secondary.length + results.large.length} files excluded`);
  console.log('');
  
  console.log('📁 FILES TO EXCLUDE (Top 20 by size):');
  console.log('='.repeat(70));
  const allExcluded = [...results.excluded, ...results.secondary, ...results.large]
    .sort((a, b) => b.size - a.size)
    .slice(0, 20);
  
  allExcluded.forEach((file, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${file.path}`);
    console.log(`    Size: ${file.sizeKB} KB | Reason: ${file.reason}`);
    console.log('');
  });
  
  console.log('🔧 RECOMMENDED EXCLUSIONS:');
  console.log('='.repeat(70));
  console.log('1. Large CSS files (globals.css, tailwind.css) - often contain many utility classes');
  console.log('2. Documentation files (.md files) - not essential for code analysis');
  console.log('3. Configuration files (config.js, package.json) - less relevant for business logic');
  console.log('4. Test files and examples - not part of production code');
  console.log('5. Build and deployment files - not relevant for frontend analysis');
  console.log('6. Large seed/migration files - database setup, not frontend logic');
  console.log('');
  
  console.log('✅ OPTIMIZED EXTRACTION WOULD INCLUDE:');
  console.log('='.repeat(70));
  console.log(`- ${results.included.length} core files (${formatBytes(totalIncluded)})`);
  console.log('- All .ts, .tsx, .js, .jsx files (business logic)');
  console.log('- Essential .json files (package.json, tsconfig.json)');
  console.log('- Component-specific .css files');
  console.log('- Small configuration files (< 10KB)');
  console.log('');
  
  // Show breakdown by extension for included files
  const includedByExt = {};
  results.included.forEach(file => {
    if (!includedByExt[file.extension]) {
      includedByExt[file.extension] = { count: 0, totalSize: 0 };
    }
    includedByExt[file.extension].count++;
    includedByExt[file.extension].totalSize += file.size;
  });
  
  console.log('📈 INCLUDED FILES BY TYPE:');
  console.log('='.repeat(70));
  Object.entries(includedByExt)
    .sort(([,a], [,b]) => b.totalSize - a.totalSize)
    .forEach(([ext, data]) => {
      const percentage = ((data.totalSize / totalIncluded) * 100).toFixed(1);
      console.log(`${ext.padEnd(8)} | ${data.count.toString().padStart(3)} files | ${formatBytes(data.totalSize).padStart(8)} | ${percentage.padStart(5)}%`);
    });
  
  console.log('');
  console.log('🚀 Ready to create optimized extraction!');
}

// Run the analysis
main();

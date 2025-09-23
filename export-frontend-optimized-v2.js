#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-code-optimized.txt';
const MAX_FILE_SIZE = 50000; // 50KB max per file (reduced from 100KB)

// File extensions to include (core development files only)
const INCLUDED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass', '.less', '.prisma'
];

// Directories to exclude
const EXCLUDED_DIRS = [
  'node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.nyc_output',
  'public/images', 'public/videos', 'public/assets', 'public/media',
  'static/images', 'static/videos', 'static/assets', 'static/media',
  'uploads', 'temp', 'tmp', '.cache', '.parcel-cache', '.turbo',
  // Additional exclusions for optimization
  'docs', 'documentation', 'examples', 'playground', 'test-utils', 'scripts',
  'tools', 'migrations', 'seeds', 'prisma/migrations', 'prisma/seeds',
  'cypress', 'e2e', 'tests', 'test', '__tests__', 'spec', 'stories',
  '.storybook', 'coverage', 'reports'
];

// File patterns to exclude
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
  /\.env\.development$/,
  /\.tsbuildinfo$/,
  /\.txt$/ // Exclude text files (like previous extractions)
];

// Files to exclude by name
const EXCLUDED_FILES = [
  'next-env.d.ts',
  '.eslintcache',
  'vercel.json',
  'netlify.toml',
  'seed.ts',
  'seed.js',
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE.md',
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
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  '.dockerignore',
  '.gitlab-ci.yml',
  'azure-pipelines.yml',
  'pnpm-lock.yaml',
  'bun.lockb',
  // Keep these large CSS files as they're important
  // 'globals.css', // REMOVED - now included
  'tailwind.css',
  'bootstrap.css',
  'antd.css',
  'material-ui.css'
];

// Files that should be included even if they're large (important business logic)
const IMPORTANT_FILES = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css', // Keep this one as it's likely custom styles
  'components/',
  'lib/',
  'hooks/',
  'store/',
  'utils/',
  'types/',
  'api/',
  'prisma/schema.prisma', // Include Prisma schema
  'globals.css' // Include globals.css
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
  
  // Check if file is too large (unless it's important)
  try {
    const stats = fs.statSync(filePath);
    const isImportant = IMPORTANT_FILES.some(important => 
      filePath.includes(important) || fileName.includes(important)
    );
    
    if (stats.size > MAX_FILE_SIZE && !isImportant) {
      return true;
    }
  } catch (error) {
    return true;
  }
  
  return false;
}

function shouldExcludeDir(dirName, dirPath) {
  const relativePath = path.relative(FRONTEND_DIR, dirPath);
  
  // Check if directory is in excluded list
  if (EXCLUDED_DIRS.includes(dirName)) {
    return true;
  }
  
  // Check if directory path matches excluded patterns
  return EXCLUDED_DIRS.some(excludedDir => 
    relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)
  );
}

function shouldIncludeFile(fileName) {
  const ext = path.extname(fileName);
  return INCLUDED_EXTENSIONS.includes(ext);
}

function extractCode(dir, outputStream, basePath = '') {
  const files = fs.readdirSync(dir);
  let totalFiles = 0;
  let totalSize = 0;
  const fileTypeCounts = {};

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (!shouldExcludeDir(file, filePath)) {
        const subResults = extractCode(filePath, outputStream, relativePath);
        totalFiles += subResults.totalFiles;
        totalSize += subResults.totalSize;
        Object.entries(subResults.fileTypeCounts).forEach(([ext, count]) => {
          fileTypeCounts[ext] = (fileTypeCounts[ext] || 0) + count;
        });
      }
    } else {
      if (shouldIncludeFile(file) && !shouldExcludeFile(filePath, file)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        outputStream.write(`\n================================================================================\n`);
        outputStream.write(`FILE: ${relativePath}\n`);
        outputStream.write(`SIZE: ${(stats.size / 1024).toFixed(2)} KB\n`);
        outputStream.write(`MODIFIED: ${stats.mtime.toISOString()}\n`);
        outputStream.write(`================================================================================\n`);
        outputStream.write(fileContent);
        outputStream.write(`\n`);

        totalFiles++;
        totalSize += stats.size;
        const ext = path.extname(file).toLowerCase();
        fileTypeCounts[ext] = (fileTypeCounts[ext] || 0) + 1;
      }
    }
  });

  return { totalFiles, totalSize, fileTypeCounts };
}

function main() {
  console.log('🚀 Starting optimized frontend code extraction (v2 with Prisma & globals.css)...\n');
  
  const frontendPath = path.resolve(FRONTEND_DIR);
  const outputPath = path.resolve(OUTPUT_FILE);
  
  if (!fs.existsSync(frontendPath)) {
    console.error(`❌ Frontend directory not found: ${frontendPath}`);
    process.exit(1);
  }
  
  const outputStream = fs.createWriteStream(outputPath);
  
  // Write header
  outputStream.write(`OPTIMIZED FRONTEND CODE ANALYSIS (V2)\n`);
  outputStream.write(`Generated: ${new Date().toISOString()}\n`);
  outputStream.write(`Source: ${frontendPath}\n`);
  outputStream.write(`Output: ${outputPath}\n\n`);
  
  outputStream.write(`OPTIMIZATION RULES:\n`);
  outputStream.write(`- Included extensions: ${INCLUDED_EXTENSIONS.join(', ')}\n`);
  outputStream.write(`- Excluded directories: ${EXCLUDED_DIRS.join(', ')}\n`);
  outputStream.write(`- Max file size: ${MAX_FILE_SIZE / 1024} KB (reduced from 100KB)\n`);
  outputStream.write(`- Excluded patterns: Images, videos, audio, archives, logs, etc.\n`);
  outputStream.write(`- Excluded files: ${EXCLUDED_FILES.join(', ')}\n`);
  outputStream.write(`- IMPORTANT: Now includes prisma/schema.prisma and globals.css\n\n`);
  
  outputStream.write(`================================================================================\n`);
  outputStream.write(`CODE EXTRACTION\n`);
  outputStream.write(`================================================================================\n`);
  
  // Extract code
  const results = extractCode(frontendPath, outputStream);
  
  // Write summary
  outputStream.write(`\n================================================================================\n`);
  outputStream.write(`EXTRACTION COMPLETE\n`);
  outputStream.write(`Generated: ${new Date().toISOString()}\n`);
  outputStream.write(`Total files processed: ${results.totalFiles}\n`);
  outputStream.write(`Total size: ${(results.totalSize / (1024 * 1024)).toFixed(2)} MB\n`);
  outputStream.write(`File types: ${Object.entries(results.fileTypeCounts).map(([ext, count]) => `${ext}: ${count} files`).join(', ')}\n`);
  outputStream.write(`================================================================================\n`);
  
  outputStream.end(() => {
    console.log('✅ Optimized frontend code extraction complete!');
    console.log(`📄 Output file: ${outputPath}`);
    console.log(`📊 Summary: ${results.totalFiles} files, ${(results.totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`🎯 File types: ${Object.entries(results.fileTypeCounts).map(([ext, count]) => `${ext}: ${count} files`).join(', ')}`);
    console.log(`\n🎉 Now includes: prisma/schema.prisma and globals.css`);
    console.log(`📈 Focus: Core business logic, components, database schema, and essential styles`);
  });
}

// Run the extraction
main();

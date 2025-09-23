#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-code-analysis.txt';
const MAX_FILE_SIZE = 100000; // 100KB max per file

// File extensions to include
const INCLUDED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass', '.less',
  '.md', '.yml', '.yaml', '.env', '.env.example', '.gitignore', '.dockerignore'
];

// Directories to exclude
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.nyc_output',
  'public/images',
  'public/videos',
  'public/assets',
  'public/media',
  'static/images',
  'static/videos',
  'static/assets',
  'static/media',
  'uploads',
  'temp',
  'tmp',
  '.cache',
  '.parcel-cache',
  '.turbo'
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
  /\.env\.development$/
];

// Files to exclude by name
const EXCLUDED_FILES = [
  'next-env.d.ts',
  '.eslintcache',
  '.next/cache',
  'vercel.json',
  'netlify.toml'
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

function shouldExcludeDir(dirName) {
  return EXCLUDED_DIRS.includes(dirName) || dirName.startsWith('.');
}

function shouldIncludeFile(fileName) {
  const ext = path.extname(fileName);
  return INCLUDED_EXTENSIONS.includes(ext);
}

function getFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Clean up content
    return content
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')   // Handle old Mac line endings
      .trim();
  } catch (error) {
    return `// Error reading file: ${error.message}`;
  }
}

function formatFileHeader(filePath, relativePath) {
  const separator = '='.repeat(80);
  const stats = fs.statSync(filePath);
  const size = (stats.size / 1024).toFixed(2);
  const modified = stats.mtime.toISOString();
  
  return `\n${separator}
FILE: ${relativePath}
SIZE: ${size} KB
MODIFIED: ${modified}
${separator}\n`;
}

function extractFrontendCode(dir, output, basePath = '') {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        if (!shouldExcludeDir(item)) {
          extractFrontendCode(fullPath, output, relativePath);
        }
      } else if (stats.isFile()) {
        if (shouldIncludeFile(item) && !shouldExcludeFile(fullPath, item)) {
          const content = getFileContent(fullPath);
          if (content.length > 0) {
            output.write(formatFileHeader(fullPath, relativePath));
            output.write(content);
            output.write('\n');
          }
        }
      }
    }
  } catch (error) {
    output.write(`// Error processing directory ${dir}: ${error.message}\n`);
  }
}

function generateSummary(frontendDir) {
  let totalFiles = 0;
  let totalSize = 0;
  let fileTypes = {};
  
  function analyzeDirectory(dir, basePath = '') {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          if (!shouldExcludeDir(item)) {
            analyzeDirectory(fullPath, relativePath);
          }
        } else if (stats.isFile()) {
          if (shouldIncludeFile(item) && !shouldExcludeFile(fullPath, item)) {
            totalFiles++;
            totalSize += stats.size;
            
            const ext = path.extname(item) || 'no-extension';
            fileTypes[ext] = (fileTypes[ext] || 0) + 1;
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  analyzeDirectory(frontendDir);
  
  return {
    totalFiles,
    totalSize: (totalSize / 1024 / 1024).toFixed(2), // MB
    fileTypes: Object.entries(fileTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([ext, count]) => `${ext}: ${count} files`)
      .join(', ')
  };
}

function main() {
  console.log('🚀 Starting frontend code extraction...');
  
  const frontendPath = path.resolve(FRONTEND_DIR);
  
  if (!fs.existsSync(frontendPath)) {
    console.error(`❌ Frontend directory not found: ${frontendPath}`);
    process.exit(1);
  }
  
  // Generate summary
  console.log('📊 Analyzing frontend structure...');
  const summary = generateSummary(frontendPath);
  
  // Create output file
  const output = fs.createWriteStream(OUTPUT_FILE);
  
  // Write header
  const header = `FRONTEND CODE ANALYSIS
Generated: ${new Date().toISOString()}
Source: ${frontendPath}
Output: ${path.resolve(OUTPUT_FILE)}

SUMMARY:
- Total files: ${summary.totalFiles}
- Total size: ${summary.totalSize} MB
- File types: ${summary.fileTypes}

EXTRACTION RULES:
- Included extensions: ${INCLUDED_EXTENSIONS.join(', ')}
- Excluded directories: ${EXCLUDED_DIRS.join(', ')}
- Max file size: ${MAX_FILE_SIZE / 1000} KB
- Excluded patterns: Images, videos, audio, archives, logs, etc.

${'='.repeat(80)}
CODE EXTRACTION
${'='.repeat(80)}

`;
  
  output.write(header);
  
  // Extract code
  console.log('📝 Extracting code files...');
  extractFrontendCode(frontendPath, output);
  
  // Write footer
  const footer = `\n${'='.repeat(80)}
EXTRACTION COMPLETE
Generated: ${new Date().toISOString()}
Total files processed: ${summary.totalFiles}
Total size: ${summary.totalSize} MB
${'='.repeat(80)}
`;
  
  output.write(footer);
  output.end();
  
  console.log(`✅ Frontend code extraction complete!`);
  console.log(`📄 Output file: ${path.resolve(OUTPUT_FILE)}`);
  console.log(`📊 Summary: ${summary.totalFiles} files, ${summary.totalSize} MB`);
  console.log(`🎯 File types: ${summary.fileTypes}`);
}

// Run the extraction
main();

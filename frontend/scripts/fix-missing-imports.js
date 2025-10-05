import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Find all files that use createClient but don't import it
function findFilesWithMissingImports() {
  try {
    const result = execSync('grep -r "createClient" app/api/ --include="*.ts" | grep -v "import.*createClient"', { encoding: 'utf8' });
    const lines = result.trim().split('\n').filter(line => line.includes('.ts:'));
    
    const files = new Set();
    lines.forEach(line => {
      const filePath = line.split(':')[0];
      if (filePath && !filePath.includes('node_modules')) {
        files.add(filePath);
      }
    });
    
    return Array.from(files);
  } catch (error) {
    console.log('No files found with missing createClient imports');
    return [];
  }
}

// Fix a single file by adding the missing import
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if createClient is used but not imported
    if (content.includes('createClient') && !content.includes("import { createClient }")) {
      console.log(`Fixing ${filePath}...`);
      
      // Find the first import line
      const lines = content.split('\n');
      let firstImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          firstImportIndex = i;
          break;
        }
      }
      
      if (firstImportIndex === -1) {
        // No imports found, add at the beginning
        lines.unshift("import { createClient } from '@supabase/supabase-js';");
      } else {
        // Add after the last import
        let lastImportIndex = firstImportIndex;
        for (let i = firstImportIndex + 1; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          } else if (lines[i].trim() === '' || lines[i].startsWith('//') || lines[i].startsWith('/*')) {
            continue;
          } else {
            break;
          }
        }
        
        lines.splice(lastImportIndex + 1, 0, "import { createClient } from '@supabase/supabase-js';");
      }
      
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✅ Fixed ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Finding files with missing createClient imports...');
  
  const files = findFilesWithMissingImports();
  
  if (files.length === 0) {
    console.log('✅ No files need fixing');
    return;
  }
  
  console.log(`📁 Found ${files.length} files to fix:`);
  files.forEach(file => console.log(`  - ${file}`));
  
  let fixedCount = 0;
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedCount} files`);
}

main().catch(console.error);

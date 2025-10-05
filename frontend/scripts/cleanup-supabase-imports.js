import fs from 'fs';
import path from 'path';

async function cleanupSupabaseImports() {
  try {
    console.log('🧹 Cleaning up unused Supabase imports...\n');

    const apiDir = '/Users/albertosaco/Downloads/wellness-monorepo/frontend/app/api';
    const files = await getAllTsFiles(apiDir);
    
    let cleanedCount = 0;
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check if file has Supabase import but no Supabase usage
      if (content.includes('import') && content.includes('supabase') && !content.includes('supabase.')) {
        console.log(`📄 Cleaning: ${file.replace(apiDir, '')}`);
        
        // Remove Supabase import lines
        const lines = content.split('\n');
        const cleanedLines = lines.filter(line => 
          !line.includes('import') || 
          !line.includes('supabase') ||
          !line.includes('createClient')
        );
        
        const cleanedContent = cleanedLines.join('\n');
        fs.writeFileSync(file, cleanedContent);
        cleanedCount++;
      }
    }
    
    console.log(`\n✅ Cleaned ${cleanedCount} files`);
    
  } catch (error) {
    console.error('❌ Error cleaning up Supabase imports:', error);
  }
}

async function getAllTsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

cleanupSupabaseImports();

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  try {
    console.log('🔍 Setting up database tables...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/20250831000000_add_missing_tables.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} failed:`, err.message);
        }
      }
    }
    
    // Test the connection
    console.log('🧪 Testing database connection...');
    const { data, error } = await supabase.from('package_definitions').select('*').limit(1);
    
    if (error) {
      console.log('❌ Test failed:', error.message);
    } else {
      console.log('✅ Database setup successful!');
      console.log('📊 Sample data:', data);
    }
    
  } catch (err) {
    console.log('❌ Setup failed:', err.message);
  }
}

setupDatabase();

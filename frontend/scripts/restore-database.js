// scripts/restore-database.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function restoreDatabase() {
  const backupDir = path.join(__dirname, '..', 'backups', 'database');
  const backupFiles = fs.readdirSync(backupDir).filter(file => file.startsWith('backup-') && file.endsWith('.json'));
  
  if (backupFiles.length === 0) {
    console.log('❌ No backup files found');
    process.exit(1);
  }

  // Get the most recent backup
  const latestBackup = backupFiles.sort().pop();
  const backupFile = path.join(backupDir, latestBackup);
  
  console.log(`Restoring from backup: ${latestBackup}`);

  try {
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log('Starting database restore...');

    // Restore data in the correct order (respecting foreign key constraints)
    const restoreOrder = [
      'Currency',
      'User', 
      'Teacher',
      'Venue',
      'Seo',
      'Content',
      'Image',
      'Rate',
      'Booking',
      'Purchase'
    ];

    for (const table of restoreOrder) {
      if (backup.tables[table] && backup.tables[table].length > 0) {
        try {
          console.log(`Restoring ${table}...`);
          
          // Clear existing data first
          await prisma[table.toLowerCase()].deleteMany();
          
          // Insert backed up data
          for (const record of backup.tables[table]) {
            await prisma[table.toLowerCase()].create({
              data: record
            });
          }
          
          console.log(`✓ ${table}: ${backup.tables[table].length} records restored`);
        } catch (error) {
          console.log(`⚠ ${table}: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Database restore completed successfully!');
    console.log('📊 Data has been restored from backup');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDatabase();

// scripts/backup-database.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups', 'database');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('Starting database backup...');

  try {
    // Backup all major tables
    const tables = [
      'User',
      'Purchase', 
      'PaymentRecord',
      'UserPackage',
      'PackageDefinition',
      'PackagePrice',
      'ServiceType',
      'Teacher',
      'Venue',
      'Booking',
      'Currency',
      'SessionDuration',
      'Rate',
      'PaymentMethodConfig',
      'EmailTemplate',
      'LogoSettings',
      'Seo',
      'Image',
      'ProfileImage',
      'Content',
      'Section',
      'CommunicationConfig',
      'CommunicationTemplate',
      'CommunicationTemplateTranslation',
      'BugReport',
      'BugComment',
      'SmsConfiguration',
      'OtpVerification',
      'ExternalAPIConfig',
      'APIConfigAudit',
      'ConversationLog',
      'UserFeedback',
      'MlModelPerformance',
      'AbTestExperiment',
      'AbTestAssignment'
    ];

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tables: {}
    };

    for (const table of tables) {
      try {
        console.log(`Backing up ${table}...`);
        const data = await prisma[table.toLowerCase()].findMany();
        backup.tables[table] = data;
        console.log(`✓ ${table}: ${data.length} records`);
      } catch (error) {
        console.log(`⚠ ${table}: ${error.message}`);
        backup.tables[table] = [];
      }
    }

    // Save backup to file
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`\n✅ Database backup completed successfully!`);
    console.log(`📁 Backup saved to: ${backupFile}`);
    console.log(`📊 Total tables backed up: ${Object.keys(backup.tables).length}`);
    
    // Also create a summary
    const summaryFile = path.join(backupDir, `backup-summary-${timestamp}.txt`);
    let summary = `Database Backup Summary - ${new Date().toLocaleString()}\n`;
    summary += `==========================================\n\n`;
    
    for (const [table, data] of Object.entries(backup.tables)) {
      summary += `${table}: ${data.length} records\n`;
    }
    
    fs.writeFileSync(summaryFile, summary);
    console.log(`📋 Summary saved to: ${summaryFile}`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function findLatestDataSql(baseDir) {
  const dir = path.resolve(baseDir);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => /^data_\d{8}_\d{6}\.sql$/.test(f))
    .sort()
    .reverse();
  return files.length ? path.join(dir, files[0]) : null;
}

function splitStatements(sql) {
  // Split on semicolon followed by newline to avoid breaking inside values
  const parts = sql.split(/;\s*\n/);
  return parts
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.endsWith(';') ? s : s + ';');
}

function shouldInclude(stmt, whitelist, blacklist) {
  const s = stmt.toLowerCase();
  if (!s.startsWith('insert into')) return false;
  for (const re of blacklist) {
    if (re.test(s)) return false;
  }
  // If table name present, require it be in whitelist
  const m = s.match(/insert into\s+(?:"?public"?\.)?"?([a-z0-9_]+)"?/);
  if (m && m[1]) {
    return whitelist.has(m[1]);
  }
  return false;
}

async function main() {
  const prisma = new PrismaClient();
  const backupDir = path.resolve(__dirname, '..', 'db_backups');
  const explicit = process.env.SQL_FILE ? path.resolve(process.env.SQL_FILE) : null;
  const sqlFile = explicit || findLatestDataSql(backupDir);
  if (!sqlFile || !fs.existsSync(sqlFile)) {
    console.error('SQL data backup not found. Set SQL_FILE env or place data_*.sql in ../db_backups');
    process.exit(1);
  }
  console.log('Seeding from SQL file:', sqlFile);
  const raw = fs.readFileSync(sqlFile, 'utf8');

  // Whitelist of app tables (lowercase)
  const whitelist = new Set([
    'users',
    'teachers',
    'teacher_schedules',
    'teacher_schedule_slots',
    'venues',
    'service_types',
    'schedule_templates',
    'schedule_slots',
    'bookings',
    'package_definitions',
    'package_prices',
    'package_services',
    'session_durations',
    'rates',
    'orders',
    'order_items',
    'order_history',
    'communication_templates',
    'communication_template_translations',
    'payment_records',
    'purchases',
    'user_packages',
    'languages',
    'teacher_languages',
    'specialties',
    'teacher_specialties',
    'testimonials',
    'faqs',
    'images',
    'profile_images',
    'content',
    'sections',
    'currency',
    'currencies',
    'payment_method_configs',
    'payment_methods',
    'external_api_configs',
    'api_config_audits',
    'otp_verifications',
    'password_reset_tokens',
  ]);

  // Blacklist patterns: non-app schemas/tables
  const blacklist = [
    /\bauth\./,
    /\bstorage\./,
    /\bgraphql\./,
    /\brealtime\./,
    /\bpgbouncer\b/,
    /\bschema_migrations\b/,
    /\b_prisma_migrations\b/,
  ];

  const stmts = splitStatements(raw).filter(s => shouldInclude(s, whitelist, blacklist));
  console.log(`Executing ${stmts.length} INSERT statements...`);

  try {
    await prisma.$executeRawUnsafe('BEGIN');
    for (const [i, stmt] of stmts.entries()) {
      try {
        // Execute each insert
        // eslint-disable-next-line no-await-in-loop
        await prisma.$executeRawUnsafe(stmt);
      } catch (err) {
        console.warn(`Statement ${i + 1} failed, skipping:`, (err && err.message) || err);
      }
    }
    await prisma.$executeRawUnsafe('COMMIT');
  } catch (err) {
    console.error('Seeding transaction failed:', err);
    try { await prisma.$executeRawUnsafe('ROLLBACK'); } catch (_) {}
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
  console.log('Seed from SQL completed.');
}

main();



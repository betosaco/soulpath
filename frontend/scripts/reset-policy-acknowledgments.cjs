#!/usr/bin/env node
/*
  Reset Policy Acknowledgments
  - Without args: deletes ALL policy acknowledgments (global reset)
  - --professorId=<id>: deletes only that professor's acknowledgments
  - --policyId=<id>: deletes acknowledgments for that policy (all professors)
  - You can combine both flags to delete a single acknowledgment pair
*/

// Ensure env is loaded (Prisma uses DATABASE_URL from process.env)
require('dotenv').config({ path: process.cwd() + '/../.env' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['error'] });

function getArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

async function main() {
  const professorId = getArg('professorId');
  const policyId = getArg('policyId');

  const where = {};
  if (professorId) where.professorId = String(professorId);
  if (policyId) where.policyId = String(policyId);

  const result = await prisma.policyAcknowledgment.deleteMany({ where });
  console.log(`Deleted ${result.count} acknowledgment(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





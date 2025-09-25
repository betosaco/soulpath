/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const removed = await prisma.rate.deleteMany({});
    console.log(`Deleted rates rows: ${removed.count}`);
  } catch (err) {
    console.error('Failed to delete rates:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();



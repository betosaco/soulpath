#!/usr/bin/env node

/**
 * Check Service Types Script
 * 
 * This script checks the service type IDs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkServiceTypes() {
  console.log('🔍 Checking Service Types\n');
  console.log('=========================\n');

  try {
    const serviceTypes = await prisma.serviceType.findMany({
      where: {
        name: {
          contains: 'Yoga'
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    console.log('📋 Service Types:');
    for (const serviceType of serviceTypes) {
      console.log(`ID: ${serviceType.id} | Name: ${serviceType.name}`);
    }

  } catch (error) {
    console.error('❌ Error checking service types:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkServiceTypes();

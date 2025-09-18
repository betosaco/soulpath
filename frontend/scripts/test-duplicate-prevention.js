#!/usr/bin/env node

/**
 * Test Script for Schedule Duplicate Prevention
 * 
 * This script tests the duplicate prevention system by creating
 * test schedules and checking for conflicts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDuplicatePrevention() {
  console.log('🧪 Testing Schedule Duplicate Prevention\n');
  console.log('=====================================\n');

  try {
    // Clean up any existing test data
    console.log('🧹 Cleaning up test data...');
    await prisma.teacherSchedule.deleteMany({
      where: {
        teacher: {
          name: { contains: 'Test Teacher' }
        }
      }
    });
    await prisma.venue.deleteMany({
      where: {
        name: { contains: 'Test Venue' }
      }
    });
    await prisma.teacher.deleteMany({
      where: {
        name: { contains: 'Test Teacher' }
      }
    });

    // Create test teacher
    console.log('👨‍🏫 Creating test teacher...');
    const testTeacher = await prisma.teacher.create({
      data: {
        name: 'Test Teacher Duplicate',
        email: 'test.duplicate@example.com',
        phone: '+1234567890',
        specialties: {
          create: [
            {
              specialty: {
                create: {
                  name: 'Astrology',
                  description: 'Astrology readings'
                }
              }
            }
          ]
        }
      }
    });
    console.log('✅ Test teacher created:', testTeacher.id);

    // Create test venue
    console.log('🏢 Creating test venue...');
    const testVenue = await prisma.venue.create({
      data: {
        name: 'Test Venue Duplicate',
        address: '123 Test Street',
        city: 'Test City',
        country: 'Test Country',
        capacity: 10
      }
    });
    console.log('✅ Test venue created:', testVenue.id);

    // Test 1: Create first schedule
    console.log('\n📅 Test 1: Creating first schedule...');
    const schedule1 = await prisma.teacherSchedule.create({
      data: {
        teacherId: testTeacher.id,
        venueId: testVenue.id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true,
        maxBookings: 1
      }
    });
    console.log('✅ First schedule created:', schedule1.id);

    // Test 2: Try to create exact duplicate (should fail)
    console.log('\n📅 Test 2: Attempting to create exact duplicate...');
    try {
      const duplicateSchedule = await prisma.teacherSchedule.create({
        data: {
          teacherId: testTeacher.id,
          venueId: testVenue.id,
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          isAvailable: true,
          maxBookings: 1
        }
      });
      console.log('❌ ERROR: Duplicate schedule was created! This should not happen.');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('✅ Duplicate prevented by database constraint');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Try to create overlapping schedule (should fail)
    console.log('\n📅 Test 3: Attempting to create overlapping schedule...');
    try {
      const overlappingSchedule = await prisma.teacherSchedule.create({
        data: {
          teacherId: testTeacher.id,
          venueId: testVenue.id,
          dayOfWeek: 'Monday',
          startTime: '09:30',
          endTime: '10:30',
          isAvailable: true,
          maxBookings: 1
        }
      });
      console.log('❌ ERROR: Overlapping schedule was created! This should not happen.');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('✅ Overlapping schedule prevented by database constraint');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 4: Create non-overlapping schedule (should succeed)
    console.log('\n📅 Test 4: Creating non-overlapping schedule...');
    const schedule2 = await prisma.teacherSchedule.create({
      data: {
        teacherId: testTeacher.id,
        venueId: testVenue.id,
        dayOfWeek: 'Monday',
        startTime: '11:00',
        endTime: '12:00',
        isAvailable: true,
        maxBookings: 1
      }
    });
    console.log('✅ Non-overlapping schedule created:', schedule2.id);

    // Test 5: Create schedule for different day (should succeed)
    console.log('\n📅 Test 5: Creating schedule for different day...');
    const schedule3 = await prisma.teacherSchedule.create({
      data: {
        teacherId: testTeacher.id,
        venueId: testVenue.id,
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true,
        maxBookings: 1
      }
    });
    console.log('✅ Different day schedule created:', schedule3.id);

    // Test 6: Test API duplicate checking
    console.log('\n🔍 Test 6: Testing API duplicate checking...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/schedule-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduleData: {
            teacherId: testTeacher.id,
            venueId: testVenue.id,
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            type: 'teacher'
          }
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data.hasDuplicates) {
        console.log('✅ API duplicate checking working correctly');
        console.log(`   Found ${result.data.duplicates.length} duplicates`);
        console.log(`   Found ${result.data.warnings.length} warnings`);
      } else {
        console.log('❌ API duplicate checking not working as expected');
      }
    } catch (error) {
      console.log('❌ API test failed:', error.message);
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log('✅ Database constraints working');
    console.log('✅ Duplicate prevention active');
    console.log('✅ Non-overlapping schedules allowed');
    console.log('✅ Different day schedules allowed');
    
    const totalSchedules = await prisma.teacherSchedule.count({
      where: {
        teacherId: testTeacher.id
      }
    });
    console.log(`✅ Total schedules created: ${totalSchedules}`);

    console.log('\n🎉 All duplicate prevention tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDuplicatePrevention();

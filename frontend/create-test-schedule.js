import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestSchedule() {
  try {
    console.log('🌱 Creating test schedule data...');

    // First, create some basic data if it doesn't exist
    console.log('📅 Creating session durations...');
    const sessionDuration = await prisma.sessionDuration.upsert({
      where: { id: 1 },
      update: {},
      create: {
        duration_minutes: 60,
        name: 'Standard Class',
        description: '60-minute yoga class'
      }
    });

    console.log('👨‍🏫 Creating teachers...');
    const teacher = await prisma.teacher.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Ana García',
        bio: 'Certified Yoga Instructor with 5 years of experience',
        shortBio: 'Yoga Expert',
        experience: 5,
        avatarUrl: null
      }
    });

    console.log('🏢 Creating venues...');
    const venue = await prisma.venue.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Studio A',
        address: 'Calle Alcanfores 425',
        city: 'Miraflores',
        capacity: 15
      }
    });

    console.log('🧘 Creating service types...');
    const serviceType = await prisma.serviceType.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Hatha Yoga',
        description: 'Gentle yoga practice focusing on breathing and alignment',
        shortDescription: 'Gentle yoga',
        duration: 60,
        difficulty: 'Beginner',
        color: '#6ea058',
        icon: '🧘'
      }
    });

    console.log('📅 Creating schedule templates...');
    const scheduleTemplate = await prisma.scheduleTemplate.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Morning Classes',
        description: 'Morning yoga classes',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isActive: true
      }
    });

    // Create schedule slots for the next 7 days
    console.log('📅 Creating schedule slots...');
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Create 3 slots per day
      const times = ['09:00', '14:00', '18:00'];
      
      for (const time of times) {
        const startTime = new Date(date);
        const [hours, minutes] = time.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        const slot = await prisma.teacherScheduleSlot.create({
          data: {
            startTime: startTime,
            endTime: endTime,
            isAvailable: true,
            maxBookings: 15,
            bookedCount: Math.floor(Math.random() * 5), // Random booked count
            teacherSchedule: {
              create: {
                teacherId: teacher.id,
                serviceTypeId: serviceType.id,
                venueId: venue.id,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
                startTime: time,
                endTime: `${parseInt(hours) + 1}:${minutes}`,
                isActive: true
              }
            }
          }
        });
        
        slots.push(slot);
      }
    }

    console.log(`✅ Created ${slots.length} schedule slots`);
    console.log('🎉 Test schedule data created successfully!');

  } catch (error) {
    console.error('❌ Error creating test schedule:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSchedule();

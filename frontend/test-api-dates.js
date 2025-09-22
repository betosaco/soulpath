// Test the date calculation logic from the API
const now = new Date();
console.log('Current time:', now.toISOString());

const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
console.log('Today (start of day):', today.toISOString());

const startOfWeek = new Date(today);
const dayOfWeek = today.getDay();
const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days to Monday
startOfWeek.setDate(today.getDate() - daysToMonday);

console.log('Day of week:', dayOfWeek);
console.log('Days to Monday:', daysToMonday);
console.log('Start of week (Monday):', startOfWeek.toISOString());

const dateStart = startOfWeek;
const dateEnd = new Date(startOfWeek);
dateEnd.setDate(startOfWeek.getDate() + 7); // Show one week

console.log('Date range:');
console.log('  Start:', dateStart.toISOString().split('T')[0]);
console.log('  End:', dateEnd.toISOString().split('T')[0]);

// Test with the specific dates we know have data
const testStart = new Date('2025-09-15');
const testEnd = new Date('2025-09-21');
console.log('\nTest with known data dates:');
console.log('  Start:', testStart.toISOString().split('T')[0]);
console.log('  End:', testEnd.toISOString().split('T')[0]);

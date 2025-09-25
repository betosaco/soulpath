import { performance } from 'perf_hooks';

async function testAPIPerformance() {
  const baseUrl = 'http://localhost:3000';
  const testCases = [
    { name: 'Packages API', url: `${baseUrl}/api/packages?currency=PEN&active=true` },
    { name: 'Schedules API', url: `${baseUrl}/api/schedules?available=true` },
    { name: 'Packages with Schedule', url: `${baseUrl}/api/packages?currency=PEN&active=true&includeSchedule=true` }
  ];

  console.log('🚀 Testing API Performance...\n');

  for (const testCase of testCases) {
    console.log(`📊 Testing: ${testCase.name}`);
    
    const times = [];
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        const response = await fetch(testCase.url);
        const data = await response.json();
        const end = performance.now();
        
        const duration = end - start;
        times.push(duration);
        
        console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms (${data.success ? '✅' : '❌'})`);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`  Run ${i + 1}: ❌ Error - ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      console.log(`  📈 Results:`);
      console.log(`    Average: ${avgTime.toFixed(2)}ms`);
      console.log(`    Min: ${minTime.toFixed(2)}ms`);
      console.log(`    Max: ${maxTime.toFixed(2)}ms`);
      console.log(`    Success Rate: ${times.length}/${iterations} (${(times.length/iterations*100).toFixed(1)}%)\n`);
    }
  }

  console.log('🎉 Performance test completed!');
}

testAPIPerformance().catch(console.error);

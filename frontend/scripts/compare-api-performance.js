import { performance } from 'perf_hooks';

async function compareAPIPerformance() {
  const baseUrl = 'http://localhost:3000';
  const testCases = [
    { 
      name: 'Hybrid Packages API (Monday 12 PM + Optimizations)', 
      url: `${baseUrl}/api/packages?currency=PEN&active=true`,
      expected: 'fastest'
    },
    { 
      name: 'Schedules API (Baseline)', 
      url: `${baseUrl}/api/schedules?available=true`,
      expected: 'fast'
    },
    { 
      name: 'Hybrid Packages with Schedule', 
      url: `${baseUrl}/api/packages?currency=PEN&active=true&includeSchedule=true`,
      expected: 'medium'
    }
  ];

  console.log('🚀 Comparing API Performance (Hybrid vs Baseline)...\n');

  const results = [];

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
      
      results.push({
        name: testCase.name,
        avgTime,
        minTime,
        maxTime,
        successRate: times.length / iterations
      });
      
      console.log(`  📈 Results:`);
      console.log(`    Average: ${avgTime.toFixed(2)}ms`);
      console.log(`    Min: ${minTime.toFixed(2)}ms`);
      console.log(`    Max: ${maxTime.toFixed(2)}ms`);
      console.log(`    Success Rate: ${times.length}/${iterations} (${(times.length/iterations*100).toFixed(1)}%)\n`);
    }
  }

  // Performance comparison
  console.log('🏆 Performance Comparison:');
  console.log('='.repeat(60));
  
  results.sort((a, b) => a.avgTime - b.avgTime);
  
  results.forEach((result, index) => {
    const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    const improvement = index > 0 ? 
      `(${((result.avgTime - results[0].avgTime) / results[0].avgTime * 100).toFixed(1)}% slower)` : 
      '(fastest)';
    
    console.log(`${rank} ${result.name}`);
    console.log(`   Average: ${result.avgTime.toFixed(2)}ms ${improvement}`);
    console.log(`   Range: ${result.minTime.toFixed(2)}ms - ${result.maxTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${(result.successRate * 100).toFixed(1)}%\n`);
  });

  // Key insights
  const hybridResult = results.find(r => r.name.includes('Hybrid Packages API'));
  const schedulesResult = results.find(r => r.name.includes('Schedules API'));
  
  if (hybridResult && schedulesResult) {
    const performanceRatio = hybridResult.avgTime / schedulesResult.avgTime;
    console.log('💡 Key Insights:');
    console.log(`   • Hybrid Packages API is ${performanceRatio.toFixed(2)}x the speed of Schedules API`);
    
    if (performanceRatio < 1.5) {
      console.log('   ✅ Excellent! Hybrid API performance is very close to Schedules API');
    } else if (performanceRatio < 2.0) {
      console.log('   ✅ Good! Hybrid API performance is acceptable');
    } else {
      console.log('   ⚠️  Hybrid API could be further optimized');
    }
  }

  console.log('\n🎉 Performance comparison completed!');
}

compareAPIPerformance().catch(console.error);

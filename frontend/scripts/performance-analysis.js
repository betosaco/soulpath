import { performance } from 'perf_hooks';

async function analyzePerformance() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Performance Analysis - Current State\n');
  
  // Test different scenarios
  const tests = [
    {
      name: 'Packages API (Basic)',
      url: `${baseUrl}/api/packages?currency=PEN&active=true`,
      iterations: 10
    },
    {
      name: 'Packages API (With Schedule)',
      url: `${baseUrl}/api/packages?currency=PEN&active=true&includeSchedule=true`,
      iterations: 5
    },
    {
      name: 'Schedules API',
      url: `${baseUrl}/api/schedules?available=true`,
      iterations: 10
    }
  ];

  const results = {};

  for (const test of tests) {
    console.log(`📊 Testing: ${test.name}`);
    const times = [];
    
    for (let i = 0; i < test.iterations; i++) {
      const start = performance.now();
      
      try {
        const response = await fetch(test.url);
        const data = await response.json();
        const end = performance.now();
        
        const duration = end - start;
        times.push(duration);
        
        console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms`);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.log(`  Run ${i + 1}: ❌ Error - ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];
      
      results[test.name] = {
        avg: avgTime,
        min: minTime,
        max: maxTime,
        p95: p95Time,
        samples: times.length
      };
      
      console.log(`  📈 Results:`);
      console.log(`    Average: ${avgTime.toFixed(2)}ms`);
      console.log(`    Min: ${minTime.toFixed(2)}ms`);
      console.log(`    Max: ${maxTime.toFixed(2)}ms`);
      console.log(`    95th percentile: ${p95Time.toFixed(2)}ms\n`);
    }
  }

  // Performance insights
  console.log('💡 Performance Insights:');
  console.log('='.repeat(50));
  
  const packagesBasic = results['Packages API (Basic)'];
  const packagesWithSchedule = results['Packages API (With Schedule)'];
  const schedules = results['Schedules API'];
  
  if (packagesBasic && schedules) {
    const ratio = packagesBasic.avg / schedules.avg;
    console.log(`• Packages API is ${ratio.toFixed(2)}x slower than Schedules API`);
    
    if (ratio > 2) {
      console.log('  ⚠️  Significant optimization opportunity');
    } else if (ratio > 1.5) {
      console.log('  ✅ Good performance, minor optimizations possible');
    } else {
      console.log('  🚀 Excellent performance!');
    }
  }
  
  if (packagesBasic && packagesWithSchedule) {
    const scheduleOverhead = packagesWithSchedule.avg - packagesBasic.avg;
    console.log(`• Schedule integration adds ${scheduleOverhead.toFixed(2)}ms overhead`);
  }
  
  console.log('\n🎯 Optimization Recommendations:');
  console.log('1. Database query optimization');
  console.log('2. Response compression');
  console.log('3. Edge caching');
  console.log('4. Connection pooling');
  console.log('5. UI virtualization');
  console.log('6. Component memoization');
}

analyzePerformance().catch(console.error);

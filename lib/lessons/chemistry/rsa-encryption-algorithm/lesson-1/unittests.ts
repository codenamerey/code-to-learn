export const testRunner = `function runTests(studentFunction) {
  const tests = [];
  
  // Test 1: Valid small primes
  try {
    const result = studentFunction(7, 11);
    const expectedN = 77;
    const expectedPhi = 60;
    
    if (result.n === expectedN && result.phi === expectedPhi) {
      tests.push({
        title: 'Small primes (7, 11)',
        passed: true,
        message: 'Correctly calculated n=77 and φ(n)=60'
      });
    } else {
      tests.push({
        title: 'Small primes (7, 11)',
        passed: false,
        message: 'Expected n=' + expectedN + ' and phi=' + expectedPhi + ', got n=' + result.n + ' and phi=' + result.phi
      });
    }
  } catch (e) {
    tests.push({
      title: 'Small primes (7, 11)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 2: Larger primes
  try {
    const result = studentFunction(13, 17);
    const expectedN = 221;
    const expectedPhi = 192;
    
    if (result.n === expectedN && result.phi === expectedPhi) {
      tests.push({
        title: 'Larger primes (13, 17)',
        passed: true,
        message: 'Correctly calculated n=221 and φ(n)=192'
      });
    } else {
      tests.push({
        title: 'Larger primes (13, 17)',
        passed: false,
        message: 'Expected n=' + expectedN + ' and phi=' + expectedPhi + ', got n=' + result.n + ' and phi=' + result.phi
      });
    }
  } catch (e) {
    tests.push({
      title: 'Larger primes (13, 17)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 3: Non-prime input should throw error
  try {
    studentFunction(4, 7);
    tests.push({
      title: 'Non-prime input (4, 7)',
      passed: false,
      message: 'Should have thrown an error for non-prime input'
    });
  } catch (e) {
    tests.push({
      title: 'Non-prime input (4, 7)',
      passed: true,
      message: 'Correctly rejected non-prime input'
    });
  }
  
  return tests;
}`;

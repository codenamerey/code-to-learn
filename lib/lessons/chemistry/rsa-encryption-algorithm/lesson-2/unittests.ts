export const testRunner = `function runTests(studentFunction) {
  const tests = [];
  
  // Test 1: Check e is set and valid for p=7, q=11
  try {
    const result = studentFunction(7, 11);
    
    if (result.e === null || result.e === undefined) {
      tests.push({
        title: 'Public exponent for (7, 11)',
        passed: false,
        message: 'Public exponent e was not set'
      });
    } else if (result.e < 2 || result.e >= result.phi) {
      tests.push({
        title: 'Public exponent for (7, 11)',
        passed: false,
        message: 'e must be between 2 and phi(n), got e=' + result.e
      });
    } else if (gcd(result.e, result.phi) !== 1) {
      tests.push({
        title: 'Public exponent for (7, 11)',
        passed: false,
        message: 'e must be co-prime with phi(n), but gcd(e, phi) = ' + gcd(result.e, result.phi)
      });
    } else {
      tests.push({
        title: 'Public exponent for (7, 11)',
        passed: true,
        message: 'Correctly found e=' + result.e + ' which is co-prime with phi=60'
      });
    }
  } catch (e) {
    tests.push({
      title: 'Public exponent for (7, 11)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 2: Check e for p=13, q=17
  try {
    const result = studentFunction(13, 17);
    
    if (result.e && result.e > 1 && result.e < result.phi && gcd(result.e, result.phi) === 1) {
      tests.push({
        title: 'Public exponent for (13, 17)',
        passed: true,
        message: 'Correctly found e=' + result.e + ' co-prime with phi=192'
      });
    } else {
      tests.push({
        title: 'Public exponent for (13, 17)',
        passed: false,
        message: 'Invalid public exponent e=' + result.e
      });
    }
  } catch (e) {
    tests.push({
      title: 'Public exponent for (13, 17)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 3: Verify smallest valid e is chosen
  try {
    const result = studentFunction(11, 13);
    const phi = 120;
    
    // For phi=120, the smallest valid e should be 7 (since gcd(3,120)=3, gcd(5,120)=5)
    if (result.e === 7) {
      tests.push({
        title: 'Finds smallest valid e for (11, 13)',
        passed: true,
        message: 'Correctly found smallest e=7'
      });
    } else if (result.e && gcd(result.e, phi) === 1) {
      tests.push({
        title: 'Finds smallest valid e for (11, 13)',
        passed: true,
        message: 'Found valid e=' + result.e + ' (optimal would be 7)'
      });
    } else {
      tests.push({
        title: 'Finds smallest valid e for (11, 13)',
        passed: false,
        message: 'Expected e=7 or another co-prime value, got e=' + result.e
      });
    }
  } catch (e) {
    tests.push({
      title: 'Finds smallest valid e for (11, 13)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  return tests;
}`;

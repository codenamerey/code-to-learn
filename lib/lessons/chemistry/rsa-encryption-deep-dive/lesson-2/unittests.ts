export const testRunner = `function runTests(convertMessageToNumber) {
  const power = convertMessageToNumber; // Renaming for clarity in tests
  const results = [];

  // Test Case 1: Small numbers, basic calculation (2^3 % 5 = 8 % 5 = 3)
  try {
    const base1 = 2n;
    const exp1 = 3n;
    const mod1 = 5n;
    const expected1 = 3n;
    const actual1 = power(base1, exp1, mod1);
    if (actual1 === expected1) {
      results.push({ title: 'Test Case 1: Small numbers (2^3 % 5)', passed: true, message: 'Correctly calculated ' + base1 + '^' + exp1 + ' % ' + mod1 + '.' });
    } else {
      results.push({ title: 'Test Case 1: Small numbers (2^3 % 5)', passed: false, message: 'Expected ' + expected1 + ', got ' + actual1 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 1: Small numbers (2^3 % 5)', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 2: Larger exponent (7^10 % 13 = 282475249 % 13 = 3)
  try {
    const base2 = 7n;
    const exp2 = 10n;
    const mod2 = 13n;
    const expected2 = 3n;
    const actual2 = power(base2, exp2, mod2);
    if (actual2 === expected2) {
      results.push({ title: 'Test Case 2: Larger exponent (7^10 % 13)', passed: true, message: 'Correctly calculated ' + base2 + '^' + exp2 + ' % ' + mod2 + '.' });
    } else {
      results.push({ title: 'Test Case 2: Larger exponent (7^10 % 13)', passed: false, message: 'Expected ' + expected2 + ', got ' + actual2 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 2: Larger exponent (7^10 % 13)', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 3: Exponent is 0 (any_base^0 % mod = 1 % mod = 1)
  try {
    const base3 = 12345n;
    const exp3 = 0n;
    const mod3 = 67n;
    const expected3 = 1n;
    const actual3 = power(base3, exp3, mod3);
    if (actual3 === expected3) {
      results.push({ title: 'Test Case 3: Exponent is 0', passed: true, message: 'Correctly handled exponent of 0.' });
    } else {
      results.push({ title: 'Test Case 3: Exponent is 0', passed: false, message: 'Expected ' + expected3 + ', got ' + actual3 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 3: Exponent is 0', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 4: Larger numbers, simulating RSA scale (using smaller primes for test)
  try {
    const base4 = 100n;
    const exp4 = 101n;
    const mod4 = 209n; // 11 * 19
    const expected4 = 100n;
    const actual4 = power(base4, exp4, mod4);
    if (actual4 === expected4) {
      results.push({ title: 'Test Case 4: Larger numbers (100^101 % 209)', passed: true, message: 'Correctly handled larger numbers.' });
    } else {
      results.push({ title: 'Test Case 4: Larger numbers (100^101 % 209)', passed: false, message: 'Expected ' + expected4 + ', got ' + actual4 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 4: Larger numbers (100^101 % 209)', passed: false, message: 'Error: ' + error.message });
  }

  return results;
}`;

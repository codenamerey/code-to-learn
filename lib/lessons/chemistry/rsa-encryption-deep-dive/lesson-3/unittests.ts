export const testRunner = `function runTests(convertMessageToNumber) {
  const generateRSAKeys = convertMessageToNumber; // Renaming for clarity in tests
  const results = [];

  // Test Case 1: Smallest valid primes (p=3, q=5)
  try {
    const p1 = 3n;
    const q1 = 5n;
    const keys1 = generateRSAKeys(p1, q1);
    const n1 = p1 * q1;
    const phiN1 = (p1 - 1n) * (q1 - 1n);
    const expectedE1 = 3n; // Should be the first coprime in [3n, 17n, 65537n]
    const expectedD1 = RSAHelper.modInverse(expectedE1, phiN1);

    if (keys1.publicKey.n === n1 && keys1.publicKey.e === expectedE1 && keys1.privateKey === expectedD1) {
      results.push({ title: 'Test Case 1: Smallest primes (3, 5)', passed: true, message: 'Correctly generated keys for p=3, q=5.' });
    } else {
      results.push({ title: 'Test Case 1: Smallest primes (3, 5)', passed: false, message: 'Expected n: ' + n1 + ', e: ' + expectedE1 + ', d: ' + expectedD1 + '. Got n: ' + keys1.publicKey.n + ', e: ' + keys1.publicKey.e + ', d: ' + keys1.privateKey });
    }
  } catch (error) {
    results.push({ title: 'Test Case 1: Smallest primes (3, 5)', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 2: Larger primes (p=11, q=13)
  try {
    const p2 = 11n;
    const q2 = 13n;
    const keys2 = generateRSAKeys(p2, q2);
    const n2 = p2 * q2;
    const phiN2 = (p2 - 1n) * (q2 - 1n);
    const expectedE2 = 7n; // A common e not in the list, but let's assume one is found
    // For this test, we'll manually check for e=3n, 17n, 65537n
    let chosenE2 = 0n;
    const commonEs = [3n, 17n, 65537n];
    for (const eVal of commonEs) {
      if (eVal < phiN2 && RSAHelper.areCoprime(eVal, phiN2)) {
        chosenE2 = eVal;
        break;
      }
    }
    const expectedD2 = RSAHelper.modInverse(chosenE2, phiN2);

    if (keys2.publicKey.n === n2 && keys2.publicKey.e === chosenE2 && keys2.privateKey === expectedD2) {
      results.push({ title: 'Test Case 2: Larger primes (11, 13)', passed: true, message: 'Correctly generated keys for p=11, q=13.' });
    } else {
      results.push({ title: 'Test Case 2: Larger primes (11, 13)', passed: false, message: 'Expected n: ' + n2 + ', e: ' + chosenE2 + ', d: ' + expectedD2 + '. Got n: ' + keys2.publicKey.n + ', e: ' + keys2.publicKey.e + ', d: ' + keys2.privateKey });
    }
  } catch (error) {
    results.push({ title: 'Test Case 2: Larger primes (11, 13)', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 3: Another pair of primes (p=17, q=19)
  try {
    const p3 = 17n;
    const q3 = 19n;
    const keys3 = generateRSAKeys(p3, q3);
    const n3 = p3 * q3;
    const phiN3 = (p3 - 1n) * (q3 - 1n);

    let chosenE3 = 0n;
    const commonEs = [3n, 17n, 65537n];
    for (const eVal of commonEs) {
      if (eVal < phiN3 && RSAHelper.areCoprime(eVal, phiN3)) {
        chosenE3 = eVal;
        break;
      }
    }
    const expectedD3 = RSAHelper.modInverse(chosenE3, phiN3);

    if (keys3.publicKey.n === n3 && keys3.publicKey.e === chosenE3 && keys3.privateKey === expectedD3) {
      results.push({ title: 'Test Case 3: Primes (17, 19)', passed: true, message: 'Correctly generated keys for p=17, q=19.' });
    } else {
      results.push({ title: 'Test Case 3: Primes (17, 19)', passed: false, message: 'Expected n: ' + n3 + ', e: ' + chosenE3 + ', d: ' + expectedD3 + '. Got n: ' + keys3.publicKey.n + ', e: ' + keys3.publicKey.e + ', d: ' + keys3.privateKey });
    }
  } catch (error) {
    results.push({ title: 'Test Case 3: Primes (17, 19)', passed: false, message: 'Error: ' + error.message });
  }

  return results;
}`;

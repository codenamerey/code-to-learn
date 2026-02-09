export const testRunner = `function runTests(studentFunction) {
  const tests = [];
  
  // Test 1: Complete key generation for (7, 11)
  try {
    const key = studentFunction(7, 11);
    
    if (!key.e || !key.d) {
      tests.push({
        title: 'Complete key generation (7, 11)',
        passed: false,
        message: 'Both e and d must be set. e=' + key.e + ', d=' + key.d
      });
    } else {
      const product = (key.e * key.d) % key.phi;
      if (product === 1) {
        tests.push({
          title: 'Complete key generation (7, 11)',
          passed: true,
          message: 'Successfully generated key with e=' + key.e + ' and d=' + key.d
        });
      } else {
        tests.push({
          title: 'Complete key generation (7, 11)',
          passed: false,
          message: '(e × d) mod φ(n) must equal 1, got ' + product
        });
      }
    }
  } catch (e) {
    tests.push({
      title: 'Complete key generation (7, 11)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 2: Encryption and decryption work correctly
  try {
    const key = studentFunction(11, 13);
    const message = 42;
    
    const encrypted = key.encrypt(message);
    const decrypted = key.decrypt(encrypted);
    
    if (decrypted === message) {
      tests.push({
        title: 'Encrypt and decrypt message',
        passed: true,
        message: 'Successfully encrypted and decrypted message ' + message
      });
    } else {
      tests.push({
        title: 'Encrypt and decrypt message',
        passed: false,
        message: 'Decryption failed. Original: ' + message + ', Decrypted: ' + decrypted
      });
    }
  } catch (e) {
    tests.push({
      title: 'Encrypt and decrypt message',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  // Test 3: Verify mathematical relationship
  try {
    const key = studentFunction(13, 17);
    
    const edProduct = key.e * key.d;
    const remainder = edProduct % key.phi;
    
    if (remainder === 1) {
      tests.push({
        title: 'Mathematical relationship (e×d ≡ 1 mod φ)',
        passed: true,
        message: 'Correctly satisfies (e×d) mod φ(n) = 1'
      });
    } else {
      tests.push({
        title: 'Mathematical relationship (e×d ≡ 1 mod φ)',
        passed: false,
        message: 'Expected (e×d) mod φ(n) = 1, got ' + remainder
      });
    }
  } catch (e) {
    tests.push({
      title: 'Mathematical relationship (e×d ≡ 1 mod φ)',
      passed: false,
      message: 'Error: ' + e.message
    });
  }
  
  return tests;
}`;

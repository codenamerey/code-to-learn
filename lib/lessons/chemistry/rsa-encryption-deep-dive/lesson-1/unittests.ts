export const testRunner = `function runTests(convertMessageToNumber) {
  const results = [];

  // Test Case 1: Simple message
  try {
    const message1 = 'A';
    const expected1 = BigInt(message1.charCodeAt(0).toString());
    const actual1 = convertMessageToNumber(message1);
    if (actual1 === expected1) {
      results.push({ title: 'Test Case 1: Single character message', passed: true, message: 'Correctly converted single character.' });
    } else {
      results.push({ title: 'Test Case 1: Single character message', passed: false, message: 'Expected ' + expected1 + ', got ' + actual1 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 1: Single character message', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 2: Multi-character message
  try {
    const message2 = 'Hi';
    const expected2 = BigInt(message2.charCodeAt(0).toString() + message2.charCodeAt(1).toString());
    const actual2 = convertMessageToNumber(message2);
    if (actual2 === expected2) {
      results.push({ title: 'Test Case 2: Multi-character message', passed: true, message: 'Correctly converted multi-character message.' });
    } else {
      results.push({ title: 'Test Case 2: Multi-character message', passed: false, message: 'Expected ' + expected2 + ', got ' + actual2 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 2: Multi-character message', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 3: Empty message
  try {
    const message3 = '';
    const expected3 = 0n;
    const actual3 = convertMessageToNumber(message3);
    if (actual3 === expected3) {
      results.push({ title: 'Test Case 3: Empty message', passed: true, message: 'Correctly handled empty message.' });
    } else {
      results.push({ title: 'Test Case 3: Empty message', passed: false, message: 'Expected ' + expected3 + ', got ' + actual3 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 3: Empty message', passed: false, message: 'Error: ' + error.message });
  }

  // Test Case 4: Message with mixed case and symbols
  try {
    const message4 = 'Hello World!';
    let expected4Str = '';
    for (let i = 0; i < message4.length; i++) {
      expected4Str += message4.charCodeAt(i).toString();
    }
    const expected4 = BigInt(expected4Str);
    const actual4 = convertMessageToNumber(message4);
    if (actual4 === expected4) {
      results.push({ title: 'Test Case 4: Mixed case and symbols', passed: true, message: 'Correctly converted message with mixed case and symbols.' });
    } else {
      results.push({ title: 'Test Case 4: Mixed case and symbols', passed: false, message: 'Expected ' + expected4 + ', got ' + actual4 });
    }
  } catch (error) {
    results.push({ title: 'Test Case 4: Mixed case and symbols', passed: false, message: 'Error: ' + error.message });
  }

  return results;
}`;

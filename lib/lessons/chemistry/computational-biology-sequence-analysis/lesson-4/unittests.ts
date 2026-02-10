export const testRunner = `function runTests(studentFunction) {
  const tests = [];

  // Test Case 1: Uniform frequencies, match=1, mismatch=-1 (common DNA scenario)
  const freqs1 = { 'A': 0.25, 'C': 0.25, 'G': 0.25, 'T': 0.25 };
  const expectedLambda1 = Math.log(3); // Analytical solution for this specific case
  const result1 = studentFunction(1, -1, freqs1);
  const passed1 = Math.abs(result1 - expectedLambda1) < 0.01; // Allow for numerical approximation
  tests.push({
    title: 'Test Case 1: Uniform freqs, match=1, mismatch=-1',
    passed: passed1,
    message: 'Expected lambda around ' + expectedLambda1.toFixed(3) + ', got ' + result1.toFixed(3)
  });

  // Test Case 2: Different match/mismatch scores
  const freqs2 = { 'A': 0.25, 'C': 0.25, 'G': 0.25, 'T': 0.25 };
  // Analytical solution for match=2, mismatch=-2: lambda = log(3)/2
  const expectedLambda2 = Math.log(3) / 2;
  const result2 = studentFunction(2, -2, freqs2);
  const passed2 = Math.abs(result2 - expectedLambda2) < 0.01;
  tests.push({
    title: 'Test Case 2: Uniform freqs, match=2, mismatch=-2',
    passed: passed2,
    message: 'Expected lambda around ' + expectedLambda2.toFixed(3) + ', got ' + result2.toFixed(3)
  });

  // Test Case 3: Biased frequencies (e.g., AT-rich)
  const freqs3 = { 'A': 0.4, 'C': 0.1, 'G': 0.1, 'T': 0.4 };
  // With match=1, mismatch=-1, lambda should be smaller than log(3) due to higher chance of matches
  const result3 = studentFunction(1, -1, freqs3);
  const passed3 = result3 > 0 && result3 < Math.log(3); // Should be positive but smaller than uniform case
  tests.push({
    title: 'Test Case 3: Biased freqs (AT-rich), match=1, mismatch=-1',
    passed: passed3,
    message: 'Expected positive lambda < ' + Math.log(3).toFixed(3) + ', got ' + result3.toFixed(3)
  });

  // Test Case 4: Average score not negative (should return 0)
  const freqs4 = { 'A': 0.25, 'C': 0.25, 'G': 0.25, 'T': 0.25 };
  const result4 = studentFunction(1, 0, freqs4); // Mismatch score 0, average score will be positive
  const passed4 = result4 === 0;
  tests.push({
    title: 'Test Case 4: Average score not negative (match=1, mismatch=0)',
    passed: passed4,
    message: 'Expected lambda 0, got ' + result4.toFixed(3)
  });

  return tests;
}`;

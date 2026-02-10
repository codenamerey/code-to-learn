export const testRunner = `function runTests(studentFunction) {
  const tests = [];

  // Test Case 1: Mixed quality reads, some pass, some fail
  const rawReads1 = [
    { sequence: 'ATGC', qualityScores: [30, 28, 32, 25] }, // Avg: 28.75
    { sequence: 'GGTA', qualityScores: [10, 15, 12, 18] }, // Avg: 13.75
    { sequence: 'CCAA', qualityScores: [35, 30, 31, 34] }  // Avg: 32.5
  ];
  const qualityThreshold1 = 20;
  const expectedReads1 = [
    new Read(1, 'ATGC', [30, 28, 32, 25]),
    new Read(3, 'CCAA', [35, 30, 31, 34])
  ];
  const result1 = studentFunction(rawReads1, qualityThreshold1);
  const passed1 = result1.length === expectedReads1.length &&
                  result1.every((r, i) => r.getId() === expectedReads1[i].getId() &&
                                          r.getSequence() === expectedReads1[i].getSequence());
  tests.push({
    title: 'Test Case 1: Mixed quality reads',
    passed: passed1,
    message: 'Expected ' + JSON.stringify(expectedReads1.map(r => r.getSequence())) + ', got ' + JSON.stringify(result1.map(r => r.getSequence()))
  });

  // Test Case 2: All reads pass
  const rawReads2 = [
    { sequence: 'GATTACA', qualityScores: [40, 39, 41, 38, 40, 39, 42] }, // Avg: 39.86
    { sequence: 'TACG', qualityScores: [30, 31, 29, 32] }                  // Avg: 30.5
  ];
  const qualityThreshold2 = 25;
  const expectedReads2 = [
    new Read(1, 'GATTACA', [40, 39, 41, 38, 40, 39, 42]),
    new Read(2, 'TACG', [30, 31, 29, 32])
  ];
  const result2 = studentFunction(rawReads2, qualityThreshold2);
  const passed2 = result2.length === expectedReads2.length &&
                  result2.every((r, i) => r.getId() === expectedReads2[i].getId() &&
                                          r.getSequence() === expectedReads2[i].getSequence());
  tests.push({
    title: 'Test Case 2: All reads pass',
    passed: passed2,
    message: 'Expected ' + JSON.stringify(expectedReads2.map(r => r.getSequence())) + ', got ' + JSON.stringify(result2.map(r => r.getSequence()))
  });

  // Test Case 3: All reads fail
  const rawReads3 = [
    { sequence: 'AAAA', qualityScores: [5, 6, 7, 8] },   // Avg: 6.5
    { sequence: 'TTTT', qualityScores: [10, 9, 11, 8] } // Avg: 9.5
  ];
  const qualityThreshold3 = 15;
  const expectedReads3 = [];
  const result3 = studentFunction(rawReads3, qualityThreshold3);
  const passed3 = result3.length === expectedReads3.length;
  tests.push({
    title: 'Test Case 3: All reads fail',
    passed: passed3,
    message: 'Expected ' + JSON.stringify(expectedReads3.map(r => r.getSequence())) + ', got ' + JSON.stringify(result3.map(r => r.getSequence()))
  });

  // Test Case 4: Empty raw reads array
  const rawReads4 = [];
  const qualityThreshold4 = 20;
  const expectedReads4 = [];
  const result4 = studentFunction(rawReads4, qualityThreshold4);
  const passed4 = result4.length === expectedReads4.length;
  tests.push({
    title: 'Test Case 4: Empty raw reads array',
    passed: passed4,
    message: 'Expected ' + JSON.stringify(expectedReads4.map(r => r.getSequence())) + ', got ' + JSON.stringify(result4.map(r => r.getSequence()))
  });

  return tests;
}`;

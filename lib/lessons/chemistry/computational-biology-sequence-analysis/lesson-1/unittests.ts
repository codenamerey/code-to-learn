export const testRunner = `function runTests(studentFunction) {
  const tests = [];

  // Test Case 1: Simple sequence
  const fragments1 = [
    new DNAFragment(1, 1, 'C'),
    new DNAFragment(2, 2, 'A'),
    new DNAFragment(3, 3, 'G'),
    new DNAFragment(4, 4, 'T')
  ];
  const expected1 = 'CAGT';
  const result1 = studentFunction(fragments1);
  tests.push({
    title: 'Test Case 1: Simple 4-base sequence',
    passed: result1 === expected1,
    message: 'Expected ' + expected1 + ', got ' + result1
  });

  // Test Case 2: Longer sequence with more fragments
  const fragments2 = [
    new DNAFragment(1, 1, 'A'),
    new DNAFragment(2, 2, 'T'),
    new DNAFragment(3, 3, 'G'),
    new DNAFragment(4, 4, 'C'),
    new DNAFragment(5, 5, 'A'),
    new DNAFragment(6, 6, 'T'),
    new DNAFragment(7, 7, 'G'),
    new DNAFragment(8, 8, 'C'),
    new DNAFragment(9, 9, 'A'),
    new DNAFragment(10, 10, 'T')
  ];
  const expected2 = 'ATGCATGCAT';
  const result2 = studentFunction(fragments2);
  tests.push({
    title: 'Test Case 2: Longer 10-base sequence',
    passed: result2 === expected2,
    message: 'Expected ' + expected2 + ', got ' + result2
  });

  // Test Case 3: Sequence with repeated bases
  const fragments3 = [
    new DNAFragment(1, 1, 'G'),
    new DNAFragment(2, 2, 'G'),
    new DNAFragment(3, 3, 'A'),
    new DNAFragment(4, 4, 'T'),
    new DNAFragment(5, 5, 'C'),
    new DNAFragment(6, 6, 'A'),
    new DNAFragment(7, 7, 'G'),
    new DNAFragment(8, 8, 'G')
  ];
  const expected3 = 'GGATCAGG';
  const result3 = studentFunction(fragments3);
  tests.push({
    title: 'Test Case 3: Sequence with repeated bases',
    passed: result3 === expected3,
    message: 'Expected ' + expected3 + ', got ' + result3
  });

  // Test Case 4: Single base sequence
  const fragments4 = [
    new DNAFragment(1, 1, 'T')
  ];
  const expected4 = 'T';
  const result4 = studentFunction(fragments4);
  tests.push({
    title: 'Test Case 4: Single base sequence',
    passed: result4 === expected4,
    message: 'Expected ' + expected4 + ', got ' + result4
  });

  return tests;
}`;

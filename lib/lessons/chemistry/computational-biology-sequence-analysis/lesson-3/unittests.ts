export const testRunner = `function runTests(studentFunction) {
  const tests = [];

  // Test Case 1: Basic alignment
  const query1 = 'ATGC';
  const subject1 = 'GATTCAG';
  const expected1 = new AlignmentResult(2, 1, 1, 2); // TG vs TT
  const result1 = studentFunction(query1, subject1);
  const passed1 = result1.getScore() === expected1.getScore() &&
                  result1.getQueryStart() === expected1.getQueryStart() &&
                  result1.getSubjectStart() === expected1.getSubjectStart() &&
                  result1.getLength() === expected1.getLength();
  tests.push({
    title: 'Test Case 1: Basic alignment (TG vs TT)',
    passed: passed1,
    message: 'Expected ' + expected1.toString() + ', got ' + result1.toString()
  });

  // Test Case 2: Longer alignment with mismatches
  const query2 = 'GATTACA';
  const subject2 = 'CGATTACAG';
  const expected2 = new AlignmentResult(5, 0, 1, 7); // GATTACA vs GATTACA
  const result2 = studentFunction(query2, subject2);
  const passed2 = result2.getScore() === expected2.getScore() &&
                  result2.getQueryStart() === expected2.getQueryStart() &&
                  result2.getSubjectStart() === expected2.getSubjectStart() &&
                  result2.getLength() === expected2.getLength();
  tests.push({
    title: 'Test Case 2: Longer alignment with exact match',
    passed: passed2,
    message: 'Expected ' + expected2.toString() + ', got ' + result2.toString()
  });

  // Test Case 3: No positive scoring alignment
  const query3 = 'AAAAA';
  const subject3 = 'TTTTT';
  const expected3 = new AlignmentResult(0, -1, -1, 0); // No positive score
  const result3 = studentFunction(query3, subject3);
  const passed3 = result3.getScore() === expected3.getScore() &&
                  result3.getQueryStart() === expected3.getQueryStart() &&
                  result3.getSubjectStart() === expected3.getSubjectStart() &&
                  result3.getLength() === expected3.getLength();
  tests.push({
    title: 'Test Case 3: No positive scoring alignment',
    passed: passed3,
    message: 'Expected ' + expected3.toString() + ', got ' + result3.toString()
  });

  // Test Case 4: Alignment with internal mismatches, but overall positive score
  const query4 = 'ACGTACGT';
  const subject4 = 'XXCGTAXX';
  const expected4 = new AlignmentResult(2, 2, 2, 4); // CGTA vs CGTA, score 4. (ACGTACGT vs XXCGTAXX) -> C:C, G:G, T:T, A:A. Score 4. Length 4. Query start 2, Subject start 2.
  const result4 = studentFunction(query4, subject4);
  const passed4 = result4.getScore() === expected4.getScore() &&
                  result4.getQueryStart() === expected4.getQueryStart() &&
                  result4.getSubjectStart() === expected4.getSubjectStart() &&
                  result4.getLength() === expected4.getLength();
  tests.push({
    title: 'Test Case 4: Alignment with internal mismatches, overall positive score',
    passed: passed4,
    message: 'Expected ' + expected4.toString() + ', got ' + result4.toString()
  });

  return tests;
}`;

export const defaultCode = `function findUngappedLocalAlignment(query, subject) {
  // query: string, the query sequence (e.g., 'ATGC')
  // subject: string, the subject sequence (e.g., 'GATTCAG')

  const matchScore = 1;
  const mismatchScore = -1;

  let maxScore = 0;
  let bestQueryStart = -1;
  let bestSubjectStart = -1;
  let bestLength = 0;

  // 1. Iterate through all possible starting positions in the subject sequence.
  for (let s_start = 0; s_start < subject.length; s_start++) {
    // 2. Iterate through all possible starting positions in the query sequence.
    for (let q_start = 0; q_start < query.length; q_start++) {

      let currentScore = 0;
      let currentLength = 0;
      let tempQueryStart = q_start;
      let tempSubjectStart = s_start;

      // 3. For each pair of starting positions, extend the alignment as long as possible.
      //    This loop simulates comparing along a 'diagonal'.
      for (let k = 0; 
           (tempQueryStart + k < query.length) && (tempSubjectStart + k < subject.length); 
           k++) {

        // 4. Calculate the score for the current base pair.
        const queryBase = query[tempQueryStart + k];
        const subjectBase = subject[tempSubjectStart + k];
        const score = (queryBase === subjectBase) ? matchScore : mismatchScore;

        // 5. Update the current alignment score.
        currentScore += score;

        // 6. If the current score drops below zero, reset it to zero.
        //    This is the core of local alignment: negative-scoring segments are discarded.
        if (currentScore < 0) {
          currentScore = 0;
          // If score resets, effectively start a new potential alignment from the next base.
          // Reset currentLength for the new potential segment.
          currentLength = 0; 
        } else {
          currentLength++;
        }

        // 7. If the current score is greater than the maximum score found so far,
        //    update maxScore and record the details of this best alignment.
        //    Be careful to store the *start* of the current high-scoring segment.
        if (currentScore > maxScore) {
          maxScore = currentScore;
          bestQueryStart = tempQueryStart + k - currentLength + 1; // Adjust to get the actual start of the segment
          bestSubjectStart = tempSubjectStart + k - currentLength + 1; // Adjust to get the actual start of the segment
          bestLength = currentLength;
        }
      }
    }
  }

  // 8. Return an AlignmentResult object with the best alignment found.
  //    If no positive scoring alignment is found, return a default result (score 0, starts -1, length 0).
  return new AlignmentResult(maxScore, bestQueryStart, bestSubjectStart, bestLength);
}`;

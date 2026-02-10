export const lesson = `# Local Alignment: Ungapped Algorithm

<iframe width="560" height="315" src="https://www.youtube.com/embed/6Udqou3vmng?start=3150&end=5450" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learning Objectives
- Understand the concept of local alignment and its difference from global alignment.
- Learn the basic principles of an ungapped local alignment algorithm.
- Implement a simplified version of the Smith-Waterman algorithm for ungapped local alignment.
- Calculate the computational complexity of the algorithm using Big-O notation.

## Introduction to Sequence Alignment
Sequence alignment is a fundamental task in computational biology, used to identify regions of similarity between DNA, RNA, or protein sequences. These similarities often imply functional, structural, or evolutionary relationships between the sequences.

-   **Global Alignment**: Attempts to align every nucleotide or amino acid in every sequence. Suitable for closely related sequences of similar length.
-   **Local Alignment**: Identifies regions of similarity within longer sequences, even if the overall sequences are very different. This is useful for finding conserved domains, motifs, or homologous regions within otherwise unrelated sequences. BLAST (Basic Local Alignment Search Tool) is a widely used local alignment algorithm.

## Ungapped Local Alignment Algorithm
We will start with a simplified version of local alignment that does not allow for insertions or deletions (gaps). This is often referred to as finding the 'highest scoring segment pair' (HSSP).

### Scoring System
To evaluate an alignment, we need a scoring system. For DNA sequences, a simple scoring system might be:
-   **Match**: +1 (for identical bases)
-   **Mismatch**: -1 (for different bases)

Crucially, for local alignment algorithms like the one we're discussing, the expected score of a random alignment must be negative. This ensures that only genuinely similar regions accumulate a high score, while dissimilar regions 'drift down' to low or negative scores, which are then reset to zero.

### The Algorithm (Kadane's Algorithm variant)
To find the highest scoring ungapped segment pair between a \`query\` sequence and a \`subject\` sequence, we can iterate through all possible starting positions in the \`subject\` and, for each position, calculate the best possible alignment with a segment of the \`query\`.

Consider aligning a \`query\` (length \`m\`) against a \`subject\` (length \`n\`). For each possible starting position in the \`subject\` (from \`0\` to \`n-m\`), we can imagine a 'diagonal' comparison. Along each diagonal, we want to find the highest-scoring continuous segment.

This can be efficiently done using a variant of Kadane's algorithm, which finds the maximum sum subarray in a one-dimensional array. For each 'diagonal' (or offset) between the query and subject, we compute a score array and then find the maximum sum subarray within it.

#### Detailed Steps for a Fixed Offset:
Let's say we want to align \`query\` starting at index \`q_start\` with \`subject\` starting at index \`s_start\`. This defines an 'offset'. We iterate through possible alignment lengths:

1.  Initialize \`current_score = 0\` and \`max_score_for_offset = 0\`.
2.  Iterate \`k\` from \`0\` up to \`min(query.length - q_start, subject.length - s_start) - 1\`:
    a.  Compare \`query[q_start + k]\` with \`subject[s_start + k]\`.
    b.  If they match, \`current_score += 1\`.
    c.  If they mismatch, \`current_score -= 1\`.
    d.  If \`current_score\` becomes negative, reset it to \`0\` (this is the core of local alignment: negative scores don't extend).
    e.  Update \`max_score_for_offset = max(max_score_for_offset, current_score)\`.

This process is repeated for every possible \`q_start\` and \`s_start\` combination, and the overall \`max_score\` is tracked.

### Computational Complexity (Big-O Notation)
Let \`m\` be the length of the \`query\` sequence and \`n\` be the length of the \`subject\` sequence.

-   The outer loop iterates through all possible starting positions in the \`subject\` (roughly \`n\` times).
-   The inner loop iterates through all possible starting positions in the \`query\` (roughly \`m\` times).
-   For each \`(q_start, s_start)\` pair, we calculate the score for a segment. In our simplified Kadane's variant, this involves iterating up to \`min(m, n)\` comparisons.

Therefore, the total number of comparisons is approximately \`m * n\`. The algorithm's time complexity is **O(m*n)**. This means that if you double the length of either sequence, the running time will roughly double. If you double both, the running time will quadruple.

## Your Challenge
Implement the \`findUngappedLocalAlignment\` function. It should take a \`query\` sequence string and a \`subject\` sequence string, and return the \`AlignmentResult\` object representing the highest-scoring ungapped local alignment between them. Use a scoring system of +1 for a match and -1 for a mismatch.`;

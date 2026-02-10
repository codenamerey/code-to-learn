export const lesson = `# Scoring Systems and Karlin-Altschul Statistics

<iframe width="560" height="315" src="https://www.youtube.com/embed/6Udqou3vmng?start=5450&end=7639" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learning Objectives
- Understand the importance of scoring matrices in sequence alignment.
- Explain the concept of expected score and its role in local alignment statistics.
- Introduce Karlin-Altschul statistics for evaluating the significance of local alignment scores.
- Understand the parameters (lambda, K) of the Extreme Value Distribution (EVD) in this context.
- Discuss how scoring matrix parameters influence the type of alignments detected.

## Scoring Matrices
In the previous lesson, we used a simple scoring system (+1 for match, -1 for mismatch). In practice, scoring matrices are more sophisticated and reflect biological realities. For DNA, different mismatch penalties can be assigned (e.g., transitions (A↔G, C↔T) might be penalized less than transversions (A↔C, A↔T, G↔C, G↔T) due to their higher natural occurrence). For proteins, substitution matrices like BLOSUM or PAM are used, which assign scores based on the biochemical similarity and evolutionary likelihood of amino acid substitutions.

### Expected Score
For local alignment algorithms to work correctly (i.e., to find meaningful local similarities rather than just long, random alignments), the expected score of a random alignment must be negative. If the expected score were positive, random alignments would tend to grow indefinitely, accumulating high scores by chance. A negative expected score ensures that only genuinely similar regions stand out with positive scores, while dissimilar regions 'penalize' themselves out of consideration.

## Karlin-Altschul Statistics
After finding a high-scoring local alignment, the next critical question is: Is this alignment statistically significant? Could such a score have arisen purely by chance?

The Karlin-Altschul theory provides a mathematical framework to answer this question. It states that the distribution of maximal segment scores (S) from comparing a random query sequence against a random database (or another random sequence) follows an Extreme Value Distribution (EVD), also known as a Gumbel distribution.

### The P-value Formula
The probability (P-value) of observing a score \`S\` greater than or equal to a threshold \`x\` by chance is given by:

\`P(S ≥ x) ≈ 1 - e^(-KMN * e^(-λx))\`

Where:
-   \`x\`: The observed alignment score.
-   \`M\`: Length of the query sequence.
-   \`N\`: Length of the subject sequence (or total length of the database).
-   \`λ\` (lambda): A positive scaling parameter that depends on the scoring matrix and the background residue (nucleotide/amino acid) frequencies. It essentially normalizes the score scale.
-   \`K\`: A positive constant that also depends on the scoring matrix and background frequencies. It relates to the effective search space size.

For practical purposes, when \`KMN * e^(-λx)\` is small (i.e., \`x\` is large and the P-value is small), this simplifies to:

\`P(S ≥ x) ≈ KMN * e^(-λx)\`

This P-value tells us the probability of finding an alignment with a score of \`x\` or better by chance, given the lengths of the sequences and the scoring system.

### Calculating Lambda (λ)
The parameter \`λ\` is the unique positive solution to the equation:

\`∑_{i,j} p_i * p_j * e^(λ * S_ij) = 1\`

Where:
-   \`p_i\`, \`p_j\`: Background frequencies of residue \`i\` and \`j\`.
-   \`S_ij\`: The score for aligning residue \`i\` with residue \`j\` (from the scoring matrix).

As shown in the lecture, for a simple DNA scoring system (+1 for match, -1 for mismatch) and uniform base frequencies (pA=pC=pG=pT=0.25), \`λ\` can be solved analytically. If the scoring matrix values are scaled (e.g., doubled), \`λ\` will be scaled inversely (e.g., halved), maintaining the same statistical significance for the original biological event.

### Target Frequency Equation
The Karlin-Altschul theory also describes the expected composition of high-scoring alignments. The 'target frequency' \`q_ij\` (the probability that a residue \`i\` in the query aligns with a residue \`j\` in the subject within a significant alignment) is given by:

\`q_ij = (p_i * p_j * e^(λ * S_ij)) / (∑_{k,l} p_k * p_l * e^(λ * S_kl))\`

This equation highlights that the choice of scoring matrix parameters (specifically \`S_ij\`) and the resulting \`λ\` directly influence the characteristics (e.g., percent identity) of the alignments that are deemed statistically significant. For example, to find alignments with very high percent identity, one would typically use a scoring matrix with a relatively high positive match score and a very negative mismatch penalty.

## Your Challenge
Implement a function that calculates the \`lambda\` parameter for a given scoring matrix and background base frequencies. Assume a simplified scenario where all match scores are identical and all mismatch scores are identical. You will need to numerically solve the transcendental equation for \`lambda\` using an iterative approach (e.g., Newton-Raphson or a simple bisection method). For this challenge, a simple iterative search will suffice.

**Hint**: The function \`f(λ) = ∑_{i,j} p_i * p_j * e^(λ * S_ij) - 1\` should be equal to zero. You are looking for the \`λ\` where \`f(λ) = 0\`. The function \`f(λ)\` is monotonically increasing for \`λ > 0\`.`;

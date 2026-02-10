export const defaultCode = `function calculateLambda(matchScore, mismatchScore, baseFrequencies) {
  // matchScore: number, score for a base match (e.g., 1)
  // mismatchScore: number, score for a base mismatch (e.g., -1)
  // baseFrequencies: object, e.g., { 'A': 0.25, 'C': 0.25, 'G': 0.25, 'T': 0.25 }

  const bases = Object.keys(baseFrequencies);
  const epsilon = 0.0001; // Tolerance for lambda calculation
  const step = 0.001;     // Step size for iterative search

  // Define the function f(lambda) = sum(pi * pj * e^(lambda * Sij)) - 1
  const f = (lambda) => {
    let sum = 0;
    for (let i = 0; i < bases.length; i++) {
      for (let j = 0; j < bases.length; j++) {
        const base1 = bases[i];
        const base2 = bases[j];
        const pi = baseFrequencies[base1];
        const pj = baseFrequencies[base2];
        const sij = (base1 === base2) ? matchScore : mismatchScore;
        sum += pi * pj * Math.exp(lambda * sij);
      }
    }
    return sum - 1;
  };

  // 1. Check if the average score is negative. If not, lambda cannot be found (or is 0).
  //    The sum(pi * pj * Sij) should be < 0 for a positive lambda to exist.
  let averageScore = 0;
  for (let i = 0; i < bases.length; i++) {
    for (let j = 0; j < bases.length; j++) {
      const base1 = bases[i];
      const base2 = bases[j];
      const pi = baseFrequencies[base1];
      const pj = baseFrequencies[base2];
      const sij = (base1 === base2) ? matchScore : mismatchScore;
      averageScore += pi * pj * sij;
    }
  }
  if (averageScore >= 0) {
    // In this simplified context, if average score is not negative,
    // a positive lambda for local alignment statistics does not exist.
    // Return 0 or throw an error depending on desired behavior.
    // For this challenge, we'll return 0 to indicate no valid positive lambda.
    return 0;
  }

  // 2. Iteratively search for lambda where f(lambda) is close to 0.
  //    Start with a small positive lambda and increment until f(lambda) crosses 0.
  let lambda = epsilon; // Start with a small positive value
  while (f(lambda) < 0) {
    lambda += step;
    // Add a safeguard to prevent infinite loops if lambda doesn't converge or grows too large
    if (lambda > 100) { // Arbitrary upper bound for lambda
      console.warn("Lambda search exceeded upper bound, returning 0.");
      return 0;
    }
  }

  // 3. Once f(lambda) has crossed 0, perform a finer search (e.g., bisection or smaller steps).
  //    For simplicity, we'll just return the value that made it cross 0, or the previous one.
  //    A more robust solution would involve a bisection method here.
  //    However, for the purpose of this exercise, the 'step' method is acceptable if it gets close enough.
  //    Let's refine slightly by checking the previous step.
  if (Math.abs(f(lambda)) < Math.abs(f(lambda - step))) {
    return lambda;
  } else {
    return lambda - step;
  }
}`;

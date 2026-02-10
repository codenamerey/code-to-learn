export const hintsData = [
  {
    "id": "karlin-altschul-summation",
    "title": "Implementing the Summation",
    "content": "The sum `∑_{i,j} p_i * p_j * e^(λ * S_ij)` involves iterating through all possible pairs of bases (e.g., AA, AC, AG, AT, CA, CC, etc.). You can use nested loops over the `bases` array to achieve this. Inside the loops, retrieve `p_i`, `p_j`, and `S_ij` using the provided `baseFrequencies` and `matchScore`/`mismatchScore`."
  },
  {
    "id": "karlin-altschul-iterative-search",
    "title": "Iterative Search for Lambda",
    "content": "The `f(lambda)` function is monotonically increasing for `lambda > 0`. This means you can start with a small `lambda` (e.g., `epsilon`) and gradually increase it by `step` until `f(lambda)` becomes positive. The `lambda` value at which it crosses zero is your solution. You might need to refine the search by checking `f(lambda)` and `f(lambda - step)` to pick the one closer to zero."
  },
  {
    "id": "karlin-altschul-average-score",
    "title": "Checking Average Score",
    "content": "Before starting the iterative search, calculate the average score `∑_{i,j} p_i * p_j * S_ij`. If this average score is not negative, a positive `lambda` (which is required for the EVD to apply to local alignment) does not exist. In such cases, return `0` as specified."
  }
];

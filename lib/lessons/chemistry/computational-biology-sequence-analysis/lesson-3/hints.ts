export const hintsData = [
  {
    "id": "ungapped-reset-current-score",
    "title": "Resetting Current Score",
    "content": "The crucial part of local alignment is that if `currentScore` drops below zero, it's reset to `0`. This means that any previous negative-scoring segment is 'forgotten', and a new potential alignment starts from the next base. When `currentScore` is reset, you should also reset `currentLength`."
  },
  {
    "id": "ungapped-best-start-indices",
    "title": "Tracking Best Start Indices",
    "content": "When `currentScore` becomes the `maxScore`, you need to record the *start* of the segment that produced this `currentScore`. If `currentScore` was reset to `0` at some point, the true start of the current high-scoring segment is `k - currentLength + 1` relative to `tempQueryStart` and `tempSubjectStart`."
  },
  {
    "id": "ungapped-nested-loops",
    "title": "Understanding Nested Loops",
    "content": "The outermost loops (`s_start` and `q_start`) determine the initial 'offset' or 'diagonal' for comparison. The innermost loop (`k`) then extends the alignment along this diagonal. Ensure the `k` loop correctly handles boundary conditions for both `query` and `subject` lengths."
  }
];

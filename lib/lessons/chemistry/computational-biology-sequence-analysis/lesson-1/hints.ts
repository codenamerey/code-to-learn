export const hintsData = [
  {
    "id": "sanger-sequence-array-size",
    "title": "Handling Sequence Length",
    "content": "The `sequence` array should be initialized to a size that can accommodate the longest fragment. For example, if the longest fragment has length `L`, your array should be able to store `L` bases. You can pre-fill it with a placeholder character (e.g., `'-'`) or dynamically expand it."
  },
  {
    "id": "sanger-indexing",
    "title": "Correct Indexing",
    "content": "Remember that array indices are typically 0-based in JavaScript. If a fragment has a `length` of `L`, its terminal base corresponds to the `L`-th position in the sequence. What would be the 0-based index for this position?"
  },
  {
    "id": "sanger-direct-assignment",
    "title": "Direct Assignment",
    "content": "Since the fragments are already sorted by length, you can directly place each `fragment.terminalBase` into its correct position in the `sequence` array based on `fragment.length`."
  }
];

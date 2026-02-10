export const hintsData = [
  {
    "id": "ngs-average-quality",
    "title": "Calculating Average Quality",
    "content": "To calculate the average quality, you need to sum all the `qualityScores` for a given `rawRead` and then divide by the number of scores. Remember to handle cases where `qualityScores` might be empty to avoid division by zero."
  },
  {
    "id": "ngs-create-read-object",
    "title": "Creating Read Objects",
    "content": "The `Read` constructor expects three arguments: `id`, `sequence`, and `qualityScores`. You can use the loop index (plus one) for the `id`."
  },
  {
    "id": "ngs-filter-condition",
    "title": "Filtering Condition",
    "content": "The problem specifies that a read is valid if its average quality score 'meets or exceeds' the `qualityThreshold`. This means the average quality must be greater than or equal to the threshold."
  }
];

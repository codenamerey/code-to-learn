export const documentationData = [
  {
    "className": "ScoringMatrix",
    "description": "Defines the scoring rules for aligning individual bases, including scores for matches and mismatches, and the background frequencies of each base.",
    "usage": "const dnaMatrix = new ScoringMatrix(1, -1, { 'A': 0.25, 'C': 0.25, 'G': 0.25, 'T': 0.25 });",
    "methods": [
      {
        "method": "getScore(base1, base2)",
        "description": "Returns the score for aligning two given bases.",
        "returnType": "number"
      },
      {
        "method": "getBaseFrequency(base)",
        "description": "Returns the background frequency of a specific base.",
        "returnType": "number"
      },
      {
        "method": "getBases()",
        "description": "Returns an array of all bases defined in the matrix (e.g., ['A', 'C', 'G', 'T']).",
        "returnType": "string[]"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "matchScore",
        "dataType": "number",
        "description": "The score assigned for a perfect base match."
      },
      {
        "type": "Read-Only",
        "property": "mismatchScore",
        "dataType": "number",
        "description": "The score assigned for a base mismatch."
      },
      {
        "type": "Read-Only",
        "property": "baseFrequencies",
        "dataType": "object",
        "description": "An object mapping each base (e.g., 'A') to its background frequency (e.g., 0.25)."
      }
    ]
  }
];

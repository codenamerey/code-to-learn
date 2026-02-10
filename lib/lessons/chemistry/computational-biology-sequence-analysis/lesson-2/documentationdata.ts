export const documentationData = [
  {
    "className": "Read",
    "description": "Represents a single sequence read obtained from an NGS experiment, including its sequence and per-base quality scores.",
    "usage": "const read = new Read(1, 'ATGC', [30, 28, 32, 25]);",
    "methods": [
      {
        "method": "getId()",
        "description": "Returns the unique identifier of the read.",
        "returnType": "number"
      },
      {
        "method": "getSequence()",
        "description": "Returns the nucleotide sequence of the read.",
        "returnType": "string"
      },
      {
        "method": "getQualityScores()",
        "description": "Returns an array of quality scores, one for each base in the sequence.",
        "returnType": "number[]"
      },
      {
        "method": "getAverageQuality()",
        "description": "Calculates and returns the average quality score for the read.",
        "returnType": "number"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "id",
        "dataType": "number",
        "description": "A unique identifier for the read."
      },
      {
        "type": "Read-Only",
        "property": "sequence",
        "dataType": "string",
        "description": "The nucleotide sequence (e.g., 'ATGC')."
      },
      {
        "type": "Read-Only",
        "property": "qualityScores",
        "dataType": "number[]",
        "description": "An array of integer quality scores, corresponding to each base in the sequence."
      }
    ]
  }
];

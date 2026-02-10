export const documentationData = [
  {
    "className": "AlignmentResult",
    "description": "Represents the result of a sequence alignment, including the alignment score, starting positions in both sequences, and the length of the aligned segment.",
    "usage": "const result = new AlignmentResult(5, 2, 3, 5);",
    "methods": [
      {
        "method": "getScore()",
        "description": "Returns the score of the alignment.",
        "returnType": "number"
      },
      {
        "method": "getQueryStart()",
        "description": "Returns the 0-based starting index of the alignment in the query sequence.",
        "returnType": "number"
      },
      {
        "method": "getSubjectStart()",
        "description": "Returns the 0-based starting index of the alignment in the subject sequence.",
        "returnType": "number"
      },
      {
        "method": "getLength()",
        "description": "Returns the length of the aligned segment.",
        "returnType": "number"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "score",
        "dataType": "number",
        "description": "The calculated score of the alignment."
      },
      {
        "type": "Read-Only",
        "property": "queryStart",
        "dataType": "number",
        "description": "The 0-based starting index of the aligned segment in the query sequence."
      },
      {
        "type": "Read-Only",
        "property": "subjectStart",
        "dataType": "number",
        "description": "The 0-based starting index of the aligned segment in the subject sequence."
      },
      {
        "type": "Read-Only",
        "property": "length",
        "dataType": "number",
        "description": "The length of the aligned segment."
      }
    ]
  }
];

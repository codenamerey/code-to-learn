export const documentationData = [
  {
    "className": "DNAFragment",
    "description": "Represents a DNA fragment produced during Sanger sequencing, characterized by its length and the dideoxynucleotide (terminal base) that caused its termination.",
    "usage": "const fragment = new DNAFragment(1, 10, 'A');",
    "methods": [
      {
        "method": "getLength()",
        "description": "Returns the length of the DNA fragment.",
        "returnType": "number"
      },
      {
        "method": "getTerminalBase()",
        "description": "Returns the terminal base (ddNTP) of the DNA fragment.",
        "returnType": "string"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "id",
        "dataType": "number",
        "description": "A unique identifier for the fragment."
      },
      {
        "type": "Read-Only",
        "property": "length",
        "dataType": "number",
        "description": "The length of the DNA fragment in bases."
      },
      {
        "type": "Read-Only",
        "property": "terminalBase",
        "dataType": "string",
        "description": "The base (A, C, G, or T) at which the fragment terminated."
      }
    ]
  }
];

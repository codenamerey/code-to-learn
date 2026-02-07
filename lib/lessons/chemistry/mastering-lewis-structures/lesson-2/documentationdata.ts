export const documentationData = {
  "className": "Atom",
  "description": "Represents a single atom with its elemental properties.",
  "usage": "const carbon = new Atom('C', 14);\nconst oxygen = new Atom('O', 16);",
  "methods": [
    {
      "method": "getId()",
      "description": "Returns the unique ID of the atom.",
      "returnType": "number"
    },
    {
      "method": "getSymbol()",
      "description": "Returns the elemental symbol of the atom (e.g., 'C', 'O', 'H').",
      "returnType": "string"
    },
    {
      "method": "getGroupNumber()",
      "description": "Returns the periodic table group number of the atom (1-18).",
      "returnType": "number"
    },
    {
      "method": "getValenceElectrons()",
      "description": "Calculates and returns the number of valence electrons for the atom.",
      "returnType": "number"
    }
  ],
  "properties": [
    {
      "type": "Read-Only",
      "property": "id",
      "dataType": "number",
      "description": "A unique identifier for the atom."
    },
    {
      "type": "Read-Only",
      "property": "symbol",
      "dataType": "string",
      "description": "The elemental symbol of the atom."
    },
    {
      "type": "Read-Only",
      "property": "groupNumber",
      "dataType": "number",
      "description": "The periodic table group number of the atom."
    }
  ]
};

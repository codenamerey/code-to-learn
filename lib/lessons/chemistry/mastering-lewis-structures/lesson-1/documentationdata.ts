export const documentationData = {
  "className": "Molecule",
  "description": "Represents a chemical molecule, composed of multiple Atom objects and an overall charge.",
  "usage": "const carbon = new Atom('C', 14);\nconst oxygen1 = new Atom('O', 16);\nconst oxygen2 = new Atom('O', 16);\nconst co2 = new Molecule([carbon, oxygen1, oxygen2], 0);",
  "methods": [
    {
      "method": "getAtoms()",
      "description": "Returns an array of Atom objects that constitute the molecule.",
      "returnType": "Atom[]"
    },
    {
      "method": "getCharge()",
      "description": "Returns the net charge of the molecule. Positive for cations, negative for anions, 0 for neutral.",
      "returnType": "number"
    }
  ],
  "properties": [
    {
      "type": "Read-Only",
      "property": "id",
      "dataType": "number",
      "description": "A unique identifier for the molecule."
    },
    {
      "type": "Read-Only",
      "property": "atoms",
      "dataType": "Atom[]",
      "description": "An array of Atom objects making up the molecule."
    },
    {
      "type": "Read-Only",
      "property": "charge",
      "dataType": "number",
      "description": "The net charge of the molecule."
    }
  ]
};

export const documentationData = {
  "className": "Atom",
  "description": "Represents a single atom with its elemental properties and bonding information.",
  "usage": "const carbon = new Atom('C', 14);\nconst oxygen = new Atom('O', 16);\ncarbon.connectBond(oxygen.getId());\noxygen.addLonePair();",
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
    },
    {
      "method": "connectBond(targetAtomId)",
      "description": "Establishes a single bond connection to another atom, identified by its ID. This method should be called on both atoms forming the bond.",
      "returnType": "void"
    },
    {
      "method": "addLonePair()",
      "description": "Adds one lone pair (2 electrons) to the atom.",
      "returnType": "void"
    },
    {
      "method": "getBondsCount()",
      "description": "Returns the number of single bonds this atom is involved in.",
      "returnType": "number"
    },
    {
      "method": "getLonePairsCount()",
      "description": "Returns the number of lone pairs on this atom.",
      "returnType": "number"
    },
    {
      "method": "getElectronsAround()",
      "description": "Calculates the total number of electrons surrounding the atom (shared in bonds + lone pair electrons).",
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
    },
    {
      "type": "Read-Only",
      "property": "bondedTo",
      "dataType": "Set<number>",
      "description": "A set of IDs of atoms this atom is directly bonded to."
    },
    {
      "type": "Read/Write",
      "property": "lonePairs",
      "dataType": "number",
      "description": "The number of lone pairs associated with this atom."
    }
  ]
};

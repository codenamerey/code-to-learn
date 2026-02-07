export const documentationData = [
  {
    className: "Atom",
    description:
      "Represents a single atom with its element symbol and group number on the periodic table.",
    usage:
      "const hydrogen = new Atom('H', 1);\nconst oxygen = new Atom('O', 16);\nconsole.log(hydrogen.getValenceElectrons()); // 1\nconsole.log(oxygen.getValenceElectrons()); // 6",
    methods: [
      {
        method: "getSymbol()",
        description:
          "Returns the chemical symbol of the atom (e.g., 'H', 'O', 'C').",
        returnType: "string",
      },
      {
        method: "getGroupNumber()",
        description:
          "Returns the group number of the atom on the periodic table.",
        returnType: "number",
      },
      {
        method: "getValenceElectrons()",
        description:
          "Calculates and returns the number of valence electrons for the atom based on its group number.",
        returnType: "number",
      },
      {
        method: "getId()",
        description: "Returns the unique identifier for the atom.",
        returnType: "number",
      },
    ],
    properties: [
      {
        type: "Read-Only",
        property: "id",
        dataType: "number",
        description: "A unique identifier for the atom.",
      },
      {
        type: "Read-Only",
        property: "symbol",
        dataType: "string",
        description: "The chemical symbol of the element (e.g., 'H', 'O').",
      },
      {
        type: "Read-Only",
        property: "groupNumber",
        dataType: "number",
        description: "The group number on the periodic table.",
      },
    ],
  },
  {
    className: "Molecule",
    description:
      "Represents a chemical molecule, composed of multiple Atom objects and an overall charge.",
    usage:
      "const carbon = new Atom('C', 14);\nconst oxygen1 = new Atom('O', 16);\nconst oxygen2 = new Atom('O', 16);\nconst co2 = new Molecule([carbon, oxygen1, oxygen2], 0);",
    methods: [
      {
        method: "getAtoms()",
        description:
          "Returns an array of Atom objects that constitute the molecule.",
        returnType: "Atom[]",
      },
      {
        method: "getCharge()",
        description:
          "Returns the net charge of the molecule. Positive for cations, negative for anions, 0 for neutral.",
        returnType: "number",
      },
    ],
    properties: [
      {
        type: "Read-Only",
        property: "id",
        dataType: "number",
        description: "A unique identifier for the molecule.",
      },
      {
        type: "Read-Only",
        property: "atoms",
        dataType: "Atom[]",
        description: "An array of Atom objects making up the molecule.",
      },
      {
        type: "Read-Only",
        property: "charge",
        dataType: "number",
        description: "The net charge of the molecule.",
      },
    ],
  },
];

export const atomDocumentationData = [
  {
    className: "Atom",
    description: "Class representing an atom in a molecule",
    usage: `
  // Create atoms (atoms are created by the system)
              let oxygen = new Atom(6, 3.5, 'O');
              let hydrogen1 = new Atom(1, 2.1, 'H');
              let hydrogen2 = new Atom(1, 2.1, 'H');

              // Mark central atom
              oxygen.isCentral = true;

              // Form bonds
              oxygen.bond(hydrogen1);
              oxygen.bond(hydrogen2);

              // Add lone electrons to oxygen
              oxygen.loneElectrons = 4;

              // Check octet status
              console.log(oxygen.isOctet); // true
              console.log(hydrogen1.isOctet); // true
              console.log(hydrogen2.isOctet); // true
              
              // Get bond order
              console.log(oxygen.getBondOrder(hydrogen1)); // 1
              
              // Get total electron count
              console.log(oxygen.totalElectronCount); // 8`,
    methods: [
      {
        method: "bond(Atom otherAtom, number order=1)",
        description:
          "Create bond with another atom. Default is single bond (order=1). Pass order=2 for double bond, order=3 for triple bond.",
        returnType: "void",
      },
      {
        method: "getBondOrder(Atom otherAtom)",
        description:
          "Returns the bond order between this atom and another atom (1=single, 2=double, 3=triple). Returns 0 if no bond exists.",
        returnType: "number",
      },
    ],
    properties: [
      {
        type: "Read/Write" as const,
        property: "name",
        dataType: "string",
        description: "Element symbol ('H', 'O', 'C', 'N', etc.)",
      },
      {
        type: "Read/Write" as const,
        property: "valenceElectrons",
        dataType: "number",
        description: "Number of valence electrons for this atom",
      },
      {
        type: "Read/Write" as const,
        property: "loneElectrons",
        dataType: "number",
        description: "Number of lone (non-bonding) electrons",
      },
      {
        type: "Read/Write" as const,
        property: "isCentral",
        dataType: "boolean",
        description: "Whether this atom is the central atom (true/false)",
      },
      {
        type: "Read-Only" as const,
        property: "electronegativity",
        dataType: "number",
        description: "Electronegativity value of the element",
      },
      {
        type: "Read-Only" as const,
        property: "bondsToNeighbors",
        dataType: "object",
        description: "Object mapping bond IDs to bond orders",
      },
      {
        type: "Read-Only" as const,
        property: "totalElectronCount",
        dataType: "number (getter)",
        description: "Total electrons around atom (bonding + lone electrons)",
      },
      {
        type: "Read-Only" as const,
        property: "isOctet",
        dataType: "boolean (getter)",
        description: "Whether atom satisfies octet rule (or duet for H/He)",
      },
    ],
  },
];

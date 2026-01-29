export const atomDocumentationData = {
  className: "Atom",
  description: "Class representing an atom in a molecule",
  usage: `
  // Create atoms
              let oxygen = new Atom('O', 6);
              let hydrogen1 = new Atom('H', 1);
              let hydrogen2 = new Atom('H', 1);

              // Mark central and terminal atoms
              oxygen.is_central = true;
              hydrogen1.is_terminal = true;
              hydrogen2.is_terminal = true;

              // Form bonds
              oxygen.bond(hydrogen1);
              oxygen.bond(hydrogen2);

              // Add lone pairs to oxygen
              oxygen.lone_pairs = 2;

              // Check octet status
              console.log(oxygen.is_octet); // true
              console.log(hydrogen1.is_octet); // true
              console.log(hydrogen2.is_octet); // true`,
  methods: [
    {
      method: "bond(other_atom)",
      description: "Create single bond",
      returnType: "void",
    },
    {
      method: "check_octet(atom)",
      description: "Returns true if octet satisfied",
      returnType: "boolean",
    },
  ],
  properties: [
    {
      type: "Read/Write" as const,
      property: "uuid",
      dataType: "string",
      description: "Unique identifier",
    },
    {
      type: "Read/Write" as const,
      property: "lone_pairs",
      dataType: "number",
      description: "Number of lone pairs",
    },
    {
      type: "Read/Write" as const,
      property: "is_central",
      dataType: "boolean",
      description: "Mark as central atom (true/false)",
    },
    {
      type: "Read/Write" as const,
      property: "is_terminal",
      dataType: "boolean",
      description: "Mark as terminal atom (true/false)",
    },
    {
      type: "Read/Write" as const,
      property: "valence",
      dataType: "number",
      description: "Number of valence electrons",
    },
    {
      type: "Read/Write" as const,
      property: "name",
      dataType: "string",
      description: "Element symbol ('H', 'O', etc.)",
    },
    {
      type: "Read-Only" as const,
      property: "bonds",
      dataType: "number",
      description: "Total number of bonds",
    },
    {
      type: "Read-Only" as const,
      property: "bonds_to_neighbors",
      dataType: "object",
      description: "Object with bond details",
    },
    {
      type: "Read-Only" as const,
      property: "electronegativity",
      dataType: "number",
      description: "Electronegativity value",
    },
    {
      type: "Read-Only" as const,
      property: "is_octet",
      dataType: "boolean",
      description: "Whether octet rule satisfied",
    },
  ],
};

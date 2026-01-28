export const atomDocumentationData = {
  methods: [
    {
      method: "atom.bond(other_atom)",
      description: "Create single bond",
    },
    {
      method: "check_octet(atom)",
      description: "Returns true if octet satisfied",
    },
  ],
  properties: [
    {
      type: "Read/Write" as const,
      property: "atom.uuid",
      description: "Unique identifier",
    },
    {
      type: "Read/Write" as const,
      property: "atom.lone_pairs",
      description: "Number of lone pairs",
    },
    {
      type: "Read/Write" as const,
      property: "atom.is_central",
      description: "Mark as central atom (true/false)",
    },
    {
      type: "Read/Write" as const,
      property: "atom.is_terminal",
      description: "Mark as terminal atom (true/false)",
    },
    {
      type: "Read/Write" as const,
      property: "atom.valence",
      description: "Number of valence electrons",
    },
    {
      type: "Read/Write" as const,
      property: "atom.name",
      description: "Element symbol ('H', 'O', etc.)",
    },
    {
      type: "Read-Only" as const,
      property: "atom.bonds",
      description: "Total number of bonds",
    },
    {
      type: "Read-Only" as const,
      property: "atom.bonds_to_neighbors",
      description: "Object with bond details",
    },
    {
      type: "Read-Only" as const,
      property: "atom.electronegativity",
      description: "Electronegativity value",
    },
    {
      type: "Read-Only" as const,
      property: "atom.is_octet",
      description: "Whether octet rule satisfied",
    },
  ],
};

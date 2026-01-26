import { FolderTabs } from "@/components/ui/foldertabs";
import ReactMarkdown from "react-markdown";

export function Lesson() {
  const items = [
    {
      title: "Lesson",
      content: <ReactMarkdown>{lessonContent.lesson}</ReactMarkdown>,
      value: "lesson",
      label: "Lesson",
    },
    {
      title: "Documentation",
      content: <ReactMarkdown>{lessonContent.documentation}</ReactMarkdown>,
      value: "documentation",
      label: "Documentation",
    },
    {
      title: "Hints",
      content: <ReactMarkdown>{lessonContent.hints}</ReactMarkdown>,
      value: "hints",
      label: "Hints",
    },
  ];
  return <FolderTabs items={items} />;
}

export const lessonContent = {
  lesson: `# Lewis Structures I

## Learning Objectives
- Implement the complete Lewis structure algorithm
- Understand electron counting and distribution
- Handle octet rule systematically
- Create structures that work for multiple compounds

## According to the lecture, this is the Lewis structure algorithm:

**Step 1: Connect atoms, central often less electronegative**
- Place the least electronegative atom in the center (except hydrogen)
- Place the remaining atoms around it (these are called terminal atoms)

**Step 2: Count total valence electrons**
- Sum all valence electrons from all atoms
- This determines how many electrons to distribute

**Step 3: Place bonding pair of electrons between adjacent atoms**
- Connect central atom to each terminal atom with a single bond
- Each bond uses 2 electrons

**Step 4: Starting with terminal atoms, add electrons to each one to form octet
(2 for H)**
- Add lone pairs to terminal atoms until octet (or duet for H) is satisfied

**Step 5: If electrons are left over, place on the central atom**
- Give terminal atoms lone pairs to complete octets
- Hydrogen needs 2 electrons total (duet rule)
- Other atoms need 8 electrons total (octet rule)

**Step 6: If central atom hasn’t reached octet, use lone pairs from terminal atoms
to form multiple bonds to the central atom to achieve octet**
- Any leftover electrons become lone pairs on central atom

## Your Challenge

Implement the algorithm that will work for:
- **H₂O** (water): H-O-H with 2 lone pairs on O
- **CO₂** (carbon dioxide): O=C=O with no lone pairs  
- **NH₃** (ammonia): H₃N with 1 lone pair on N

The algorithm must be general enough to handle different molecules!

**Test molecule:** H₂O (valence electrons: H=1, H=1, O=6, total=8)`,
  documentation: `
\`\`\`javascript
// Atom Methods
atom.bond(other_atom)           // Create single bond
check_octet(atom)              // Returns true if octet satisfied

// Atom Properties (read/write)
atom.uuid                      // Unique identifier
atom.electronegativity         // Electronegativity value
atom.lone_pairs                 // Number of lone pairs
atom.is_central = true/false   // Mark as central atom
atom.is_terminal = true/false  // Mark as terminal atom

atom.valence                   // Number of valence electrons
atom.name                      // Element symbol ('H', 'O', etc.)
atom.lone_pairs = number       // Set lone pairs (0, 1, 2...)
atom.is_central = true/false   // Mark as central atom
atom.is_terminal = true/false  // Mark as terminal atom

// Atom Properties (read-only)
atom.bonds                     // Total number of bonds
atom.bonds_to_neighbors        // Object with bond details
atom.electronegativity         // Electronegativity value
atom.uuid                      // Unique identifier
atom.is_octet                  // Whether octet rule satisfied
\`\`\`
`,
  hints: `- Use \`console.log(atom.name, atom.valence)\` to check atom properties
- Use \`console.log(atom.bonds_to_neighbors)\` to see all bonds
- Use \`console.log(atom.lone_pairs)\` to verify lone pair assignment
`,
};

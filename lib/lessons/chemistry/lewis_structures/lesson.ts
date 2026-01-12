export const lessonContent = `# Lewis Structures I

## Learning Objectives
- Implement the complete Lewis structure algorithm
- Understand electron counting and distribution
- Handle octet rule systematically
- Create structures that work for multiple compounds

## The Algorithm Steps

**Step 1: Create atoms with correct valence electrons**
- Each atom needs its valence electron count and electronegativity

**Step 2: Find the central atom**
- Usually the atom that can form the most bonds
- Never hydrogen (can only form 1 bond)
- Often the atom with the most valence electrons

**Step 3: Count total valence electrons**
- Sum all valence electrons from all atoms
- This determines how many electrons to distribute

**Step 4: Form single bonds**
- Connect central atom to all terminal atoms
- Each bond uses 2 electrons

**Step 5: Satisfy terminal atom octets**
- Give terminal atoms lone pairs to complete octets
- Hydrogen needs 2 electrons total (duet rule)
- Other atoms need 8 electrons total (octet rule)

**Step 6: Place remaining electrons on central atom**
- Any leftover electrons become lone pairs on central atom

**Step 7: Form multiple bonds if needed**
- If central atom doesn't satisfy octet and terminal atoms have lone pairs
- Convert terminal lone pairs to additional bonds

## Available Methods & Properties

\`\`\`javascript
// Atom Methods
atom.bond(other_atom)           // Create single bond
check_octet(atom)              // Returns true if octet satisfied

// Atom Properties (read/write)
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

**Debugging Tips:**
- Use \`console.log(atom.name, atom.valence)\` to check atom properties
- Use \`console.log(atom.bonds_to_neighbors)\` to see all bonds
- Use \`console.log(atom.lone_pairs)\` to verify lone pair assignment

## Your Challenge

Implement the algorithm that will work for:
- **H₂O** (water): H-O-H with 2 lone pairs on O
- **CO₂** (carbon dioxide): O=C=O with no lone pairs  
- **NH₃** (ammonia): H₃N with 1 lone pair on N

The algorithm must be general enough to handle different molecules!

**Test molecule:** H₂O (valence electrons: H=1, H=1, O=6, total=8)`;

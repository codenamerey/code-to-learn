import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import { atomDocumentationData } from "@/lib/lessons/chemistry/lewis_structures/documentationdata";

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
      content: (
        <UnderscoreTabs
          items={[
            {
              value: "methods",
              label: "Methods",
              content: (
                <DocumentationTable
                  title="Atom Methods"
                  methods={atomDocumentationData.methods}
                />
              ),
            },
            {
              value: "properties",
              label: "Properties",
              content: (
                <DocumentationTable
                  title="Atom Properties"
                  properties={atomDocumentationData.properties}
                />
              ),
            },
          ]}
        />
      ),
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
  hints: `- Use \`console.log(atom.name, atom.valence)\` to check atom properties
- Use \`console.log(atom.bonds_to_neighbors)\` to see all bonds
- Use \`console.log(atom.lone_pairs)\` to verify lone pair assignment
`,
};

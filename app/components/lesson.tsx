import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import { atomDocumentationData } from "@/lib/lessons/chemistry/lewis_structures/documentationdata";
import { Hints } from "./hints";
import { hintsData } from "@/lib/lessons/chemistry/lewis_structures/hints";
import rehypeRaw from "rehype-raw";

export function Lesson() {
  const items = [
    {
      title: "Lesson",
      content: (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {lessonContent.lesson}
        </ReactMarkdown>
      ),
      value: "lesson",
      label: "Lesson",
    },
    {
      title: "Documentation",
      content: (
        <>
          <h1>Atom Class</h1>
          <article>
            <p>This class represents an atom in a molecule.</p>
          </article>
          <UnderscoreTabs
            items={[
              {
                value: "methods",
                label: "Methods",
                content: (
                  <DocumentationTable methods={atomDocumentationData.methods} />
                ),
              },
              {
                value: "properties",
                label: "Properties",
                content: (
                  <DocumentationTable
                    properties={atomDocumentationData.properties}
                  />
                ),
              },
            ]}
          />
          <h2>Usage:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {`// Create atoms
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
              console.log(hydrogen2.is_octet); // true`}
          </pre>
        </>
      ),
      value: "documentation",
      label: "Documentation",
    },
    {
      title: "Hints",
      content: <Hints hints={hintsData} />,
      value: "hints",
      label: "Hints",
    },
  ];
  return <FolderTabs items={items} />;
}

export const lessonContent = {
  lesson: `# Lewis Structures I
## Video Tutorial

Watch this video from 4:04 to 11:03

<iframe width="560" height="315" src="https://www.youtube.com/embed/DvGNpuan4rw?list=PLUl4u3cNGP63z5HAguqleEbsICfHgDPaG" title="9. Lewis Structures I (Intro to Solid-State Chemistry)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

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
};

import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import { atomDocumentationData } from "@/lib/lessons/chemistry/lewis_structures/documentationdata";
import { Hints } from "./hints";
import { hintsData } from "@/lib/lessons/chemistry/lewis_structures/hints";
import rehypeRaw from "rehype-raw";
import { lesson } from "@/lib/lessons/chemistry/lewis_structures/lesson";

export function Lesson() {
  const items = [
    {
      title: "Lesson",
      content: (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{lesson}</ReactMarkdown>
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

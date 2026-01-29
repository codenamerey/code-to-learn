import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import { atomDocumentationData } from "@/lib/lessons/chemistry/lewis_structures/documentationdata";
import { Hints } from "./hints";
import { hintsData } from "@/lib/lessons/chemistry/lewis_structures/hints";
import rehypeRaw from "rehype-raw";
import { lesson } from "@/lib/lessons/chemistry/lewis_structures/lesson";
import { VisualizerRegistry } from "@/lib/visualizers/registry";

// Import visualizers to ensure they are registered
import "@/lib/visualizers";
import DynamicVisualizer from "@/components/DynamicVisualizer";
import { VisualizerBuilder } from "@/components/VisualizerBuilder";
import { useState } from "react";

// Import visualizers to register them
import "@/lib/visualizers";

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
          <h1>{atomDocumentationData.className}</h1>
          <article>
            <p>{atomDocumentationData.description}</p>
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
          <ReactMarkdown>
            {`\`\`\`javascript
            ${atomDocumentationData.usage}
            \`\`\``}
          </ReactMarkdown>
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

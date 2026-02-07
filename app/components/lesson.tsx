import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import { atomDocumentationData } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/documentationdata";
import { Hints } from "./hints";
import { hintsData } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/hints";
import rehypeRaw from "rehype-raw";
import { lesson } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/lesson";
import { VisualizerRegistry } from "@/lib/visualizers/registry";

// Import visualizers to register them
import "@/lib/visualizers";

interface LessonProps {
  lessonContent?: string;
  documentationData?: any;
  hints?: any[];
}

export function Lesson({
  lessonContent = lesson,
  documentationData = atomDocumentationData,
  hints = hintsData,
}: LessonProps = {}) {
  // Normalize documentationData to always be an array
  const documentationClasses = Array.isArray(documentationData)
    ? documentationData
    : [documentationData];

  const items = [
    {
      title: "Lesson",
      content: (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {lessonContent}
        </ReactMarkdown>
      ),
      value: "lesson",
      label: "Lesson",
    },
    {
      title: "Documentation",
      content: (
        <>
          {documentationClasses.map((docData, index) => (
            <div key={index} className={index > 0 ? "mt-8 pt-8 border-t" : ""}>
              <h1>{docData.className}</h1>
              <article>
                <p>{docData.description}</p>
              </article>
              <UnderscoreTabs
                items={[
                  {
                    value: `methods-${index}`,
                    label: "Methods",
                    content: <DocumentationTable methods={docData.methods} />,
                  },
                  {
                    value: `properties-${index}`,
                    label: "Properties",
                    content: (
                      <DocumentationTable properties={docData.properties} />
                    ),
                  },
                ]}
              />
              <h2>Usage:</h2>
              <ReactMarkdown>
                {`\`\`\`javascript
            ${docData.usage}
            \`\`\``}
              </ReactMarkdown>
            </div>
          ))}
        </>
      ),
      value: "documentation",
      label: "Documentation",
    },
    {
      title: "Hints",
      content: <Hints hints={hints} />,
      value: "hints",
      label: "Hints",
    },
  ];
  return <FolderTabs items={items} />;
}

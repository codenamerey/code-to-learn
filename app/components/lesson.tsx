import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable, PropertyData } from "./documentationtable";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Hint {
  id: string;
  title: string;
  content: string;
}

interface DocClass {
  className: string;
  description: string;
  usage: string;
  methods: { method: string; description: string; returnType: string }[];
  properties: PropertyData[];
}

interface LessonProps {
  lessonContent?: string;
  documentationData?: DocClass[];
  hints?: Hint[];
}

export function Lesson({
  lessonContent = "",
  documentationData = [],
  hints = [],
}: LessonProps) {
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
                {"```javascript\n" + docData.usage + "\n```"}
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

function Hints({ hints }: { hints: Hint[] }) {
  if (!hints || hints.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No hints available for this lesson.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hints.map((hint) => (
        <details key={hint.id} className="group">
          <summary className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            {hint.title}
          </summary>
          <div className="p-3 mt-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-mono whitespace-pre-wrap">
            {hint.content}
          </div>
        </details>
      ))}
    </div>
  );
}
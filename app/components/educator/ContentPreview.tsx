"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { DocumentationTable, PropertyData } from "../documentationtable";

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

interface ContentPreviewProps {
  lessonContent?: string;
  documentationData?: DocClass[];
  hints?: Hint[];
}

function Hints({ hints }: { hints: Hint[] }) {
  if (!hints || hints.length === 0) {
    return (
      <div className="text-muted-foreground p-4">
        No hints available for this lesson.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hints.map((hint) => (
        <details key={hint.id} className="group">
          <summary className="cursor-pointer list-none p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium">{hint.title}</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </summary>
          <div className="p-4 mt-2 bg-muted/30 rounded-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
              {hint.content}
            </ReactMarkdown>
          </div>
        </details>
      ))}
    </div>
  );
}

export function ContentPreview({
  lessonContent = "",
  documentationData = [],
  hints = [],
}: ContentPreviewProps) {
  const documentationClasses = Array.isArray(documentationData)
    ? documentationData
    : [documentationData];

  const items = [
    {
      title: "Lesson",
      content: (
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
          >
            {lessonContent}
          </ReactMarkdown>
        </div>
      ),
      value: "lesson",
      label: "Lesson",
    },
    {
      title: "Documentation",
      content: (
        <>
          {documentationClasses.length === 0 ? (
            <div className="text-muted-foreground p-4">
              No documentation available for this lesson.
            </div>
          ) : (
            documentationClasses.map((docData, index) => (
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
            ))
          )}
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

  return (
    <div className="h-full">
      <div className="p-4 border-b bg-background">
        <h3 className="font-semibold text-lg">Preview</h3>
        <p className="text-sm text-muted-foreground">
          This is how students will see the content
        </p>
      </div>
      <div className="p-4">
        <FolderTabs items={items} />
      </div>
    </div>
  );
}

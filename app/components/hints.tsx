import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Hint {
  id: string;
  title: string;
  content: string;
}

export function Hints({ hints }: { hints: Hint[] | undefined }) {
  if (!hints || hints.length === 0) {
    return (
      <div className="text-muted-foreground text-sm p-4 border rounded-lg">
        No hints available for this lesson.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {hints.map((hint) => (
        <AccordionItem key={hint.id} value={hint.id}>
          <AccordionTrigger>{hint.title}</AccordionTrigger>
          <AccordionContent>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {hint.content}
            </code>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
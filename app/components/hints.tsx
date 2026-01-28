import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Hint } from "@/lib/lessons/chemistry/lewis_structures/interfaces/hint.interface";

export function Hints({ hints }: { hints: Hint[] }) {
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

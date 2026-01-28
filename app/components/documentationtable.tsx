import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for generalizable data structures
export interface MethodData {
  method: string;
  description: string;
}

export interface PropertyData {
  type: "Read/Write" | "Read-Only";
  property: string;
  description: string;
}

export interface DocumentationTableProps {
  title?: string;
  methods?: MethodData[];
  properties?: PropertyData[];
  className?: string;
}

// Generalized component for rendering documentation tables
export function DocumentationTable({
  title,
  methods,
  properties,
  className,
}: DocumentationTableProps) {
  if (methods) {
    return (
      <div className={className}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method, index) => (
              <TableRow key={index}>
                <TableCell>
                  <code>{method.method}</code>
                </TableCell>
                <TableCell>{method.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (properties) {
    return (
      <div className={className}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      property.type === "Read/Write"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {property.type}
                  </span>
                </TableCell>
                <TableCell>
                  <code>{property.property}</code>
                </TableCell>
                <TableCell>{property.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return null;
}

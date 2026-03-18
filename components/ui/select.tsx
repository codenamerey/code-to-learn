import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return <div className={cn("relative", className)}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <>{value || placeholder}</>;
}

export function SelectContent({
  children,
  className,
}: SelectContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { onValueChange } = React.useContext(SelectContext);
  return (
    <option value={value} className={className}>
      {children}
    </option>
  );
}

export const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const SelectLabel = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const SelectSeparator = () => null;

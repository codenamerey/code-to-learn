"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import ClerkProvider to avoid build issues
const ClerkProvider = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.ClerkProvider })),
  { ssr: false },
);

interface ClerkWrapperProps {
  children: ReactNode;
  publishableKey?: string;
}

export default function ClerkWrapper({
  children,
  publishableKey,
}: ClerkWrapperProps) {
  // Always wrap with ClerkProvider to avoid hook errors
  // Even with placeholder keys, this prevents useAuth/useUser errors
  const key = publishableKey;

  return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>;
}

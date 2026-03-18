"use client";

import { useState, useEffect } from "react";

export default function NavBar({ title }: { title: string }) {
  const [clerkComponents, setClerkComponents] = useState<any>(null);
  const [isClerkAvailable, setIsClerkAvailable] = useState(false);
  
  useEffect(() => {
    const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const hasValidKey = !!clerkPubKey && clerkPubKey !== "pk_test_placeholder";
    
    if (hasValidKey) {
      // Dynamically import Clerk only when available
      import("@clerk/nextjs").then((clerk) => {
        setClerkComponents(clerk);
        setIsClerkAvailable(true);
      }).catch(() => {
        setIsClerkAvailable(false);
      });
    } else {
      setIsClerkAvailable(false);
    }
  }, []);

  if (!isClerkAvailable || !clerkComponents) {
    return (
      <div className="flex h-[8vh] border items-center justify-between p-4 w-full">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500">
          Auth not configured
        </div>
      </div>
    );
  }

  const { useClerk, SignedIn, SignedOut, SignInButton, UserButton } = clerkComponents;
  const clerk = useClerk();
  
  if (!clerk || clerk.isSignedIn === undefined) {
    return (
      <div className="flex h-[8vh] border items-center justify-between p-4 w-full">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[8vh] border items-center justify-between p-4 w-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
}
"use client";

import { useClerk, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function NavBar({ title }: { title: string }) {
  const { isSignedIn } = useClerk();

  if (isSignedIn === undefined) {
    return (
      <div className="flex h-[8vh] border items-center justify-between p-4 w-full">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500">
          Auth not configured
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
import type { Metadata } from "next";
import { Geist, Geist_Mono, Overpass } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Code to Learn",
  description: "Interactive coding courses for learning programming concepts",
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!clerkPubKey || clerkPubKey === "pk_test_placeholder") {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${overpass.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${overpass.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
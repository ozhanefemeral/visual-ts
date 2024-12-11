import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@repo/ui/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisualTS - Visual TypeScript Code Generator",
  description:
    "Transform your TypeScript development with drag-and-drop code generation. Build type-safe React and Next.js applications visually.",
  keywords:
    "typescript, code generator, visual programming, react, nextjs, developer tools, typescript ast, code visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="flex flex-1 w-full overflow-hidden p-4">
            {children}
            <Analytics />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

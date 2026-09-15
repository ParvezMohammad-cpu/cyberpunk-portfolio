import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parvez \u2014 Software Engineer",
  description:
    "Cyberpunk-themed portfolio of Parvez, a Software Engineer who builds systems, experiments with technology, and turns complex ideas into interactive experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full bg-void text-fg">{children}</body>
    </html>
  );
}

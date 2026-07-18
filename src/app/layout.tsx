import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attic — records worth keeping",
  description:
    "A curated online record store and personal music library for independent artists and listeners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

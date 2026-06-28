import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextApp",
  description: "A simple Next.js starter app",
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

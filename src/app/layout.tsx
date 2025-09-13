import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fabrika Simülasyonu - Three.js",
  description: "Three.js ile oluşturulmuş basit fabrika simülasyonu",
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

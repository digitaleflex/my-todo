import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Todo",
  description: "A focused productivity SaaS."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
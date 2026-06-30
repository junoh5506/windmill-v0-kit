import type { ReactNode } from "react";

import "./globals.css";

export const metadata = { title: "Windmill v0 Kit" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

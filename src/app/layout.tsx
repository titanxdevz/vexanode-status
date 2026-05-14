import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VexaNode Status | System Monitoring",
  description: "Real-time status updates and incident reporting for VexaNode services.",
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

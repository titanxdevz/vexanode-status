import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VexaNode Status | Infrastructure Monitoring",
  description: "Real-time status monitoring and incident reporting for VexaNode infrastructure services.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "VexaNode Status",
    description: "Real-time infrastructure status monitoring for VexaNode services.",
    siteName: "VexaNode Status",
    images: ["/logo.png"],
  },
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

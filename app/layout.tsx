import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ADRMS | Ahmadiyyah Record Management System",
    template: "%s | ADRMS"
  },
  description: "Advanced digital management system for secure, efficient record keeping of Chanda Am and Tajnid records within the Ahmadiyyah community.",
  keywords: ["ADRMS", "Ahmadiyyah", "Record Management", "Chanda Am", "Tajnid", "Digital Registry", "Secure Database"],
  authors: [{ name: "ADRMS Team" }],
  creator: "ADRMS",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://adrms.org",
    title: "ADRMS | Ahmadiyyah Record Management System",
    description: "Streamlined digital records for the Ahmadiyyah community.",
    siteName: "ADRMS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

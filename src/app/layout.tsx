import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiveZone - Find Expert Freelancers & Professionals",
  description: "Connect with top freelancers — developers, designers, marketers, lawyers. Secure payments, verified profiles, zero commission.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "FiveZone - Find Expert Freelancers & Professionals",
    description: "Connect with top freelancers for your projects — fast, secure, zero commission.",
    siteName: "FiveZone",
    images: [
      {
        url: "/icon.svg", // Note: Idéalement remplacer par un PNG (1200x630px)
        width: 800,
        height: 800,
        alt: "Logo FiveZone",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FiveZone - Find Expert Freelancers",
    description: "Developers • Designers • Marketers • Consultants",
    images: ["/icon.svg"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <Providers>
            <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}

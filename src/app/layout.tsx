import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiveZone - Freelances & Services Locaux",
  description: "Accédez aux meilleurs freelances, experts et services locaux. Développeurs, Créatifs, Artisans, Consultants.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "FiveZone - Freelances & Services Locaux",
    description: "Trouvez les meilleurs freelances et experts pour vos projets en quelques clics.",
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
    title: "FiveZone - Les meilleures adresses locales",
    description: "Artisans • Commerces • Services • Restaurants",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans antialiased`}
      >
        <Providers>
            <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
            </div>
        </Providers>
      </body>
    </html>
  );
}

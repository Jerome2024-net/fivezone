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
  title: "FiveZone - Découvrez les meilleures entreprises",
  description: "Trouvez les meilleures entreprises et services locaux près de chez vous.",
  icons: {
    icon: "/icon.svg",
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

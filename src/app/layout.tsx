import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin", "latin-ext", "cyrillic"], 
  variable: "--font-inter",
  display: "swap" 
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin", "latin-ext", "cyrillic-ext"], 
  variable: "--font-heading",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "Poliprint Studio - Онлайн типографія 24/7",
  description: "Професійний друк холстів, акрилу, поліграфії та мерчу. Завантажуйте макети онлайн, отримуйте готові вироби швидко та якісно.",
  keywords: "друк холст, акрил, візитки, поліграфія, онлайн типографія",
  authors: [{ name: "Poliprint Studio" }],
  creator: "Poliprint Studio",
  publisher: "Poliprint Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.ua'),
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: '/',
    title: 'Poliprint Studio - Онлайн типографія 24/7',
    description: 'Професійний друк холстів, акрилу, поліграфії та мерчу',
    siteName: 'Poliprint Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poliprint Studio - Онлайн типографія 24/7',
    description: 'Професійний друк холстів, акрилу, поліграфії та мерчу',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
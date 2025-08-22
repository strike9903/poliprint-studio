import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/toaster";
import { enableMocking } from "@/lib/msw";

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
  keywords: "друк холст, акрил, візитки, поліграфія, онлайн типографія, печать холст, акрил, визитки, полиграфия",
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

// Enable MSW in development
if (process.env.NODE_ENV === 'development') {
  enableMocking();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
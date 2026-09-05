import type { Metadata } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});

const inter = Inter({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "bandwidth",
  description: "One link. Everything a venue, booker, or sound engineer needs from you.",
  openGraph: {
    title: "bandwidth",
    description: "One link. Everything a venue, booker, or sound engineer needs from you.",
    url: "https://bandstack-template.vercel.app",
    siteName: "bandwidth",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "bandwidth — live music platform" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bandwidth",
    description: "One link. Everything a venue, booker, or sound engineer needs from you.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harshil Aggarwal — Cybersecurity Engineer & Creative Developer",
  description:
    "Portfolio of Harshil Aggarwal — IIT Kharagpur. Cybersecurity engineer, full-stack developer, competitive programmer. Building secure, scalable systems that feel alive.",
  keywords: [
    "Harshil Aggarwal",
    "Portfolio",
    "Cybersecurity",
    "Full Stack Developer",
    "Creative Developer",
    "IIT Kharagpur",
    "React",
    "Next.js",
    "Three.js",
    "WebGL",
  ],
  authors: [{ name: "Harshil Aggarwal" }],
  openGraph: {
    title: "Harshil Aggarwal — Portfolio",
    description:
      "Cybersecurity engineer & creative developer. IIT Kharagpur. Building secure systems that feel alive.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshil Aggarwal — Portfolio",
    description:
      "Cybersecurity engineer & creative developer. IIT Kharagpur.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-canvas font-sans text-ink antialiased cursor-none">
        {children}
      </body>
    </html>
  );
}

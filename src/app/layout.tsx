import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

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

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harshil Aggarwal — Cybersecurity Engineer & Full Stack Developer",
  description:
    "Portfolio of Harshil Aggarwal — IIT Kharagpur grad, cybersecurity engineer, full-stack developer, and competitive programmer. Building secure, scalable systems.",
  keywords: [
    "Harshil Aggarwal",
    "Portfolio",
    "Cybersecurity",
    "Full Stack Developer",
    "IIT Kharagpur",
    "React",
    "Next.js",
    "Competitive Programming",
  ],
  authors: [{ name: "Harshil Aggarwal" }],
  openGraph: {
    title: "Harshil Aggarwal — Portfolio",
    description:
      "Cybersecurity engineer & full-stack developer. IIT Kharagpur. Building secure, scalable systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshil Aggarwal — Portfolio",
    description:
      "Cybersecurity engineer & full-stack developer. IIT Kharagpur.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ThemeProvider } from "@/providers/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${pressStart.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-arcade-bg font-mono text-arcade-white antialiased transition-colors duration-1000">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

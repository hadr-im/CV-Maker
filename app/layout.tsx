import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CVProvider } from "@/lib/cv-context";
import { ThemeProvider, themeInitScript } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: {
    default: "CV Maker",
    template: "%s · CV Maker",
  },
  description:
    "Fill a simple form, let AI sharpen your wording, preview live and download a polished CV in minutes.",
  icons: {
    icon: "/hadrumet.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh bg-background text-foreground">
        <ThemeProvider>
          <CVProvider>{children}</CVProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}

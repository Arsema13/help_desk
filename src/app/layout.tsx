import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helpdesk | Eden Hailu Portal",
  description: "Futuristic operations management & IT ticket portal",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-ambient-glow text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200`}>
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

import ClientThemeHandler from "@/components/theme/clientThemeHandler";
import { Inter } from "next/font/google";
import MenuBar from "./menubar";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Sidebar from "./sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vector Similarity",
  description: "A tool for comparing vectors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <ClientThemeHandler />
      <body className={inter.className}>
        <div className="h-[calc(100vh-64px)]">
          <Providers className="h-full">
            <MenuBar />
            <div className="hidden h-full w-full sm:flex">
              <Sidebar />
              <div className="h-full flex-1">{children}</div>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}

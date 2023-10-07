import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";

import ClientThemeHandler from "@/components/theme/ClientThemeHandler";
import { Inter } from "next/font/google";
import MenuBar from "./menubar";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Sidebar from "./sidebar";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();
  const themeClass =
    (cookieStore.get("theme")?.value ?? "dark") === "dark" ? "dark" : "light";
  return (
    <html lang="en" className={themeClass}>
      <body className={inter.className}>
        <div className="h-[calc(100vh-64px)]">
          <ClientThemeHandler />
          <Providers className="h-full">
            <MenuBar />
            <div className="h-full w-full sm:flex">
              <Sidebar />
              <div className="h-full flex-1">{children}</div>
            </div>
          </Providers>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}

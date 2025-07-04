import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Fira_Code,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { TagsProvider } from "@/components/tags-provider";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sage - Q&A Platform",
  description:
    "A modern question and answer platform built with Next.js and Spring Boot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${firaCode.variable} ${sourceCodePro.variable} font-sans`}
      >
        <AuthProvider>
          <TagsProvider>
            <div className="min-h-screen bg-gray-50">
              {/* Sticky Header */}
              <Header />

              <div className="flex">
                {/* Left Sidebar Navigation - aligned to screen edge */}
                <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-30">
                  <Navigation />
                </aside>

                {/* Main Content */}
                <main className="ml-64 flex-1 pt-16">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </TagsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

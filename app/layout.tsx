"use client";

// layout for the app
// children routes inherit this layout

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavigation = pathname !== "/interview";

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen">
            {showNavigation && <Navigation />}
            <main className={`bg-gradient-to-b from-blue-50 to-white ${showNavigation ? 'pt-16' : ''}`}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

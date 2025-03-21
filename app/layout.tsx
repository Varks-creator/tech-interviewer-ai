import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Interviewer AI",
  description: "Practice technical interviews with AI-powered feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  Tech Interviewer AI
                </Link>
                <UserProfile />
              </div>
            </nav>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

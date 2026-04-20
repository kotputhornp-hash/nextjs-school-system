import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // แก้จุดตรงนี้ให้เหลือแค่ ./
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School System - ระบบจัดการโรงเรียน",
  description: "ระบบจัดการข้อมูลนักเรียน",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="th">
      <body className={inter.className}>
        {/* ลบ session={session} ออกเพื่อให้หายแดง */}
        <AuthProvider> 
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
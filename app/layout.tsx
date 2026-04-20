import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <AuthProvider session={session}> 
          {/* ลบบรรทัด Navbar ออกไปก่อนเพื่อให้ Build ผ่านและบันทึกข้อมูลได้ */}
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
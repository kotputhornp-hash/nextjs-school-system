"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏫</span>
        <Link href="/" className="font-bold text-xl text-blue-900 tracking-tight">
          SchoolSystem
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          หน้าหลัก
        </Link>
        
        {session ? (
          // ถ้าล็อกอินแล้ว โชว์ส่วนนี้
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              สวัสดี, {session.user?.name}
            </span>
            <button 
              onClick={() => signOut()}
              className="text-sm font-semibold text-red-500 hover:text-red-700"
            >
              ออกจากระบบ
            </button>
          </div>
        ) : (
          // ถ้ายังไม่ล็อกอิน โชว์ส่วนนี้
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

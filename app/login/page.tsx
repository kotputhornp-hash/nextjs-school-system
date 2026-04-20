"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email, password, redirect: false,
    });
    if (res?.ok) router.push("/");
    else alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-white">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="text-5xl mb-4">🏫</div>
          <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
          <p className="text-blue-100 text-sm mt-1">ยินดีต้อนรับสู่ระบบจัดการโรงเรียน</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
              placeholder="example@school.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">รหัสผ่าน</label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
              placeholder="••••••••"
              required 
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform active:scale-95 mt-2">
            เข้าสู่ระบบ
          </button>
          
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              ยังไม่มีบัญชี? <Link href="/register" className="text-blue-600 font-bold hover:underline">สมัครสมาชิกที่นี่</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

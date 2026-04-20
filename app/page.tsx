import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ!</h1>
        <p className="text-gray-500 mb-8 font-medium">เข้าสู่ระบบโรงเรียนสำเร็จแล้ว</p>
        
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 text-left">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">ข้อมูลผู้ใช้งาน</p>
          <div className="space-y-1">
            <p className="text-gray-700 font-semibold truncate">
              {session.user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-600 text-sm font-bold">ยืนยันตัวตนแล้ว</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/students" 
            className="block w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-center"
          >
            📋 จัดการรายชื่อนักเรียน
          </Link>
          
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

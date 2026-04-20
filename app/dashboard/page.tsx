import { getServerSession } from "next-auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-2xl font-bold">ระบบจัดการโรงเรียน</h1>
          <div className="flex items-center gap-4">
            <span>ยินดีต้อนรับ, {session?.user?.email}</span>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/students" className="bg-blue-500 text-white p-10 rounded-xl shadow-lg hover:bg-blue-600 transition text-center">
            <h2 className="text-xl font-semibold">จัดการข้อมูลนักเรียน</h2>
            <p>เพิ่ม, ลบ, แก้ไข รายชื่อนักเรียน</p>
          </Link>
          
          <div className="bg-green-500 text-white p-10 rounded-xl shadow-lg text-center opacity-50">
            <h2 className="text-xl font-semibold">จัดการข้อมูลครู (เร็วๆ นี้)</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
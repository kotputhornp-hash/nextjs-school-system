"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentsPage() {
  // --- State สำหรับเก็บข้อมูล ---
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);

  // --- 1. ฟังก์ชันดึงข้อมูลนักเรียนจาก Database ---
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรกตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetchStudents();
  }, []);

  // --- 2. ฟังก์ชันบันทึกข้อมูล (Create) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !firstName || !lastName || !grade) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, firstName, lastName, grade }),
    });

    if (res.ok) {
      alert("บันทึกข้อมูลนักเรียนสำเร็จ! 🎉");
      // ล้างฟอร์ม
      setStudentId("");
      setFirstName("");
      setLastName("");
      setGrade("");
      // โหลดข้อมูลใหม่มาแสดงในตาราง
      fetchStudents();
    } else {
      alert("เกิดข้อผิดพลาด หรือรหัสนักเรียนซ้ำ");
    }
  };

  // --- 3. ฟังก์ชันลบข้อมูล (Delete) ---
  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจใช่ไหมที่จะลบรายชื่อนักเรียนคนนี้?")) {
      const res = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchStudents(); // ลบเสร็จโหลดตารางใหม่
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* ส่วนหัวหน้าเว็บ */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 ระบบจัดการข้อมูลนักเรียน</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← กลับไปหน้า Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ฝั่งซ้าย: ฟอร์มเพิ่มนักเรียน */}
          <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">➕ เพิ่มนักเรียนใหม่</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">รหัสนักเรียน</label>
                <input 
                  type="text" value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เช่น 66001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อจริง</label>
                <input 
                  type="text" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded-lg mt-1"
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
                <input 
                  type="text" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded-lg mt-1"
                  placeholder="นามสกุล"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ชั้นเรียน</label>
                <input 
                  type="text" value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2 border rounded-lg mt-1"
                  placeholder="เช่น ม.3/2"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                บันทึกข้อมูล
              </button>
            </form>
          </div>

          {/* ฝั่งขวา: ตารางรายชื่อนักเรียน */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">📋 รายชื่อนักเรียนทั้งหมด</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="p-4 border-b">รหัส</th>
                    <th className="p-4 border-b">ชื่อ-นามสกุล</th>
                    <th className="p-4 border-b text-center">ชั้นเรียน</th>
                    <th className="p-4 border-b text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">ยังไม่มีข้อมูลนักเรียนในระบบ</td></tr>
                  ) : (
                    students.map((student: any) => (
                      <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                        <td className="p-4 font-mono text-blue-600">{student.studentId}</td>
                        <td className="p-4 font-medium">{student.firstName} {student.lastName}</td>
                        <td className="p-4 text-center">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                            {student.grade}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition"
                          >
                            ลบข้อมูล
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
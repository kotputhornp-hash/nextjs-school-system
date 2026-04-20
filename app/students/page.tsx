"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentsPage() {
  // --- State สำหรับเก็บข้อมูลนักเรียน ---
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- State สำหรับฟอร์ม (ต้องตรงกับ Database Schema) ---
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");

  // 1. ฟังก์ชันดึงข้อมูลนักเรียนจาก Database
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. ฟังก์ชันบันทึกข้อมูล (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !firstName || !lastName || !grade) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const payload = {
      studentId: studentId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade: grade.trim()
    };

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("บันทึกข้อมูลสำเร็จ! 🎉");
        // ล้างค่าในฟอร์ม
        setStudentId(""); setFirstName(""); setLastName(""); setGrade("");
        // โหลดข้อมูลใหม่มาแสดงทันที
        fetchStudents();
      } else {
        alert("บันทึกไม่สำเร็จ: " + (result.error || "รหัสนักเรียนซ้ำ หรือข้อมูลผิดพลาด"));
      }
    } catch (err) {
      alert("การเชื่อมต่อเซิร์ฟเวอร์มีปัญหา");
    }
  };

  // 3. ฟังก์ชันลบข้อมูล (DELETE)
  const handleDelete = async (id: string) => {
    if (confirm("ยืนยันว่าจะลบรายชื่อนักเรียนคนนี้?")) {
      try {
        const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchStudents();
        } else {
          alert("ลบไม่สำเร็จ");
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">📑 ระบบจัดการรายชื่อนักเรียน</h1>
            <p className="text-gray-500">จัดการข้อมูลนักเรียนในโรงเรียนของคุณ</p>
          </div>
          <Link href="/dashboard" className="bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
            ← กลับหน้าหลัก
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ฝั่งซ้าย: ฟอร์มเพิ่มนักเรียน */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center">
              <span className="mr-2">➕</span> เพิ่มนักเรียนใหม่
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักเรียน</label>
                <input 
                  type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="เช่น 1001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจริง</label>
                  <input 
                    type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ชื่อ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                  <input 
                    type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="นามสกุล"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นเรียน</label>
                <input 
                  type="text" value={grade} onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น ม.6/1"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                บันทึกเข้าสู่ฐานข้อมูล
              </button>
            </form>
          </div>

          {/* ฝั่งขวา: ตารางรายชื่อ */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">📋 รายชื่อนักเรียนทั้งหมด</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                ทั้งหมด {students.length} คน
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <tr>
                    <th className="p-4 font-semibold">รหัสนักเรียน</th>
                    <th className="p-4 font-semibold">ชื่อ-นามสกุล</th>
                    <th className="p-4 font-semibold text-center">ชั้นเรียน</th>
                    <th className="p-4 font-semibold text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">ไม่พบข้อมูลนักเรียน</td></tr>
                  ) : (
                    students.map((s: any) => (
                      <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 font-mono text-blue-600 font-bold">{s.studentId}</td>
                        <td className="p-4 font-medium text-gray-700">{s.firstName} {s.lastName}</td>
                        <td className="p-4 text-center">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                            {s.grade}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDelete(s.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                          >
                            ลบ
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
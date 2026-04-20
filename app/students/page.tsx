"use client";

import { useState, useEffect } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 🔍 เพิ่ม State สำหรับการค้นหา
  const [searchQuery, setSearchQuery] = useState("");

  // ฟังก์ชันดึงข้อมูลนักเรียน
  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔍 Logic สำหรับกรองข้อมูลนักเรียนตามชื่อหรือรหัส
  const filteredStudents = students.filter((student: any) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.includes(searchQuery)
  );

  // ฟังก์ชันลบนักเรียน
  const handleDelete = async (id: string) => {
    if (confirm("ยืนยันว่าจะลบรายชื่อนี้?")) {
      await fetch("/api/students", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      fetchStudents();
    }
  };

  // ฟังก์ชันเพิ่มนักเรียน
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/students", {
      method: "POST",
      body: JSON.stringify({ name, studentId, grade }),
    });
    setName("");
    setStudentId("");
    setGrade("");
    fetchStudents();
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📋 จัดการรายชื่อนักเรียน</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          ทั้งหมด {filteredStudents.length} คน
        </div>
      </div>
      
      {/* 1️⃣ ฟอร์มเพิ่มนักเรียน (UI ใหม่แบบการ์ด) */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุชื่อ..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักเรียน</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น 1001" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นเรียน</label>
            <input value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น ม.6/1" required />
          </div>
          <button disabled={loading} className="bg-blue-600 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-blue-300">
            {loading ? "กำลังบันทึก..." : "➕ เพิ่มนักเรียน"}
          </button>
        </div>
      </form>

      {/* 2️⃣ ช่องค้นหาแบบ Real-time */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ หรือรหัสนักเรียน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
          />
        </div>
      </div>

      {/* 3️⃣ ตารางแสดงรายชื่อนักเรียน */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-black">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">รหัสนักเรียน</th>
              <th className="p-4 font-semibold text-gray-600">ชื่อ-นามสกุล</th>
              <th className="p-4 font-semibold text-gray-600">ชั้นเรียน</th>
              <th className="p-4 font-semibold text-center text-gray-600">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student: any) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-mono text-sm text-blue-600">{student.studentId}</td>
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.grade}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold"
                    >
                      ลบข้อมูล
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  ไม่พบรายชื่อนักเรียนที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ 
    studentId: "", 
    firstName: "", 
    lastName: "", 
    grade: "" 
  });

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ studentId: "", firstName: "", lastName: "", grade: "" });
      fetchStudents();
    } else {
      alert("เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchStudents();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">จัดการรายชื่อนักเรียน</h1>
      
      {/* ฟอร์มเพิ่มข้อมูลแบบ Grid สวยๆ */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="เลขประจำตัว" required value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
        <input className="border p-2 rounded" placeholder="ชั้นเรียน (เช่น ม.1/1)" required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} />
        <input className="border p-2 rounded" placeholder="ชื่อจริง" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
        <input className="border p-2 rounded" placeholder="นามสกุล" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        <button className="col-span-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition">
          + เพิ่มรายชื่อนักเรียน
        </button>
      </form>

      {/* ตารางแสดงผล */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3">เลขประจำตัว</th>
              <th className="p-3">ชื่อ-นามสกุล</th>
              <th className="p-3">ชั้น</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {students.map((s: any) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{s.studentId}</td>
                <td className="p-3">{s.firstName} {s.lastName}</td>
                <td className="p-3">{s.grade}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
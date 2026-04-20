import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Backend รับข้อมูลมาว่าเป็น:", body); // ดูที่ Terminal ของคุณ

    const { studentId, firstName, lastName, grade } = body;

    // ตรวจสอบว่ามีค่าว่างไหม
    if (!studentId || !firstName || !lastName || !grade) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const newStudent = await prisma.student.create({
      data: {
        studentId: String(studentId), // ป้องกันปัญหาเรื่อง Type
        firstName,
        lastName,
        grade,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Prisma Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "รหัสนักเรียนนี้มีอยู่แล้วในระบบ" }, { status: 400 });
    }
    return NextResponse.json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" }, { status: 500 });
  }
}
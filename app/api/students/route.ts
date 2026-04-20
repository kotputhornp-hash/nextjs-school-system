import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. ดึงข้อมูลนักเรียนทั้งหมด
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

// 2. เพิ่มข้อมูลนักเรียนใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = await prisma.student.create({
      data: {
        studentId: body.studentId,
        firstName: body.firstName, // แก้จาก name เป็น firstName ให้ตรงกับ schema
        lastName: body.lastName,   // เพิ่ม lastName ให้ตรงกับ schema
        grade: body.grade,
      },
    });
    return NextResponse.json(student);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มข้อมูลได้" }, { status: 400 });
  }
}

// 3. ลบข้อมูลนักเรียน
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.student.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "ลบข้อมูลล้มเหลว" }, { status: 500 });
  }
}
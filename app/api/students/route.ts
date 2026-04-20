import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = await prisma.student.create({
      data: {
        name: body.name,
        studentId: body.studentId,
        grade: body.grade,
      },
    });
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "failed" }, { status: 400 });
  }
}
// เพิ่มต่อท้ายไฟล์เดิม
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.student.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "ล้มเหลว" }, { status: 500 });
  }
}

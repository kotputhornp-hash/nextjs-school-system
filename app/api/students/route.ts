import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // บันทึกลง Database
    const student = await prisma.student.create({
      data: {
        studentId: String(body.studentId), // สำคัญมาก: ต้องมีฟิลด์นี้
        firstName: body.firstName,         // สำคัญมาก: ต้องมีฟิลด์นี้
        lastName: body.lastName,
        grade: body.grade,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    
    // กรณีรหัสนักเรียนซ้ำ
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "รหัสนักเรียนนี้ซ้ำ!" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "บันทึกไม่ได้: " + error.message }, { status: 500 });
  }
}

// อย่าลืมเพิ่ม GET ไว้ดึงข้อมูลมาโชว์ในตารางด้วยครับ
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่ได้" }, { status: 500 });
  }
}
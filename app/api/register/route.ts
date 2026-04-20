import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลที่ส่งมาจากหน้าเว็บ (ชื่อ, อีเมล, รหัสผ่าน)
    const body = await request.json();
    const { email, password, name } = body;

    // 2. ตรวจสอบว่ากรอกข้อมูลครบไหม
    if (!email || !password || !name) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 3. เช็คว่ามีอีเมลนี้อยู่ในระบบโรงเรียนแล้วหรือยัง?
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น" }, { status: 400 });
    }

    // 4. นำรหัสผ่านไปเข้าเครื่องย่อย (Hashing) เพื่อความปลอดภัย
    // (แม้แต่เราที่เป็นเจ้าของระบบก็จะไม่รู้รหัสผ่านจริงๆ ของผู้ใช้)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. บันทึกข้อมูลลงฐานข้อมูล Neon
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: "STUDENT" // กำหนดค่าเริ่มต้นให้เป็นนักเรียนก่อน
      }
    });

    // ส่งข้อความกลับไปบอกหน้าเว็บว่าสมัครสำเร็จแล้ว!
    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ!" }, { status: 201 });

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์" }, { status: 500 });
  }
}

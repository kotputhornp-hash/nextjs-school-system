export const dynamic = 'force-dynamic';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
        }

        // 1. ค้นหาอีเมลในฐานข้อมูล
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("ไม่พบอีเมลนี้ในระบบ");
        }

        // 2. เอารหัสผ่านที่พิมพ์มา เทียบกับรหัสผ่านที่เข้ารหัสไว้ในฐานข้อมูล
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // 3. ถ้าผ่านหมด ให้คืนค่าข้อมูลผู้ใช้กลับไป
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // บอกระบบว่าถ้าจะล็อกอิน ให้ไปที่หน้า /login นะ
  }
});

export { handler as GET, handler as POST };

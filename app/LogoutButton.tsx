"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full bg-red-50 text-red-600 font-medium p-3 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all"
    >
      ออกจากระบบ
    </button>
  );
}

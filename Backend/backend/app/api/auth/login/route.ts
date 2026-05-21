import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    // Cari user di database berdasarkan full_name
    const user = await prisma.user.findFirst({
      where: {
        full_name: username,
      },
    });

    // Jika user tidak ada
    if (!user) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    // Cocokkan password yang diketik dengan password_hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Jika berhasil, kembalikan data user (tanpa mengirimkan password!)
    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: {
        id: user.id,
        username: user.full_name,
        email: user.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
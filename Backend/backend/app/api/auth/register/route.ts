import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validasi input kosong
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    // Cek apakah user sudah pernah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: { full_name: username }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username sudah dipakai, pilih yang lain" }, { status: 409 });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database Supabase (pakai dummy email karena di schema kamu email wajib/unique)
    const newUser = await prisma.user.create({
      data: {
        full_name: username,
        email: `${username}@skinmate.app`, // Dummy email otomatis
        password_hash: hashedPassword,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "User berhasil didaftarkan!", 
      userId: newUser.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Gagal melakukan registrasi" }, { status: 500 });
  }
}
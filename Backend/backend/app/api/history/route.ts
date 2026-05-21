import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Ambil userId dari URL (Contoh: /api/history?userId=123)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID tidak ditemukan" }, { status: 400 });
    }

    // 2. Cari semua riwayat analisis kulit berdasarkan userId
    const historyData = await prisma.skinAnalysis.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // Urutkan dari yang terbaru ke yang paling lama
      },
    });

    // 3. Kembalikan data ke frontend
    return NextResponse.json({ 
      success: true, 
      message: "Berhasil mengambil riwayat analisis", 
      data: historyData 
    }, { status: 200 });

  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Gagal mengambil data history dari server" }, { status: 500 });
  }
}
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Tangkap data dari frontend (gambar Base64/URL dan ID user yang sedang login)
    const { imageUrl, userId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Gambar tidak ditemukan, silakan ambil foto ulang" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Akses ditolak: User ID tidak valid" }, { status: 401 });
    }

    // 2. MOCKING AI / DUMMY DATA
    // Bagian ini nanti diganti dengan kode yang memanggil model AI asli kalian
    const mockAcneType = "Papula";
    const mockSkinType = "Oily (Berminyak)";
    const mockSeverity = "Medium";
    
    // Kita buat JSON palsu seolah-olah ini hasil output dari AI
    const mockAiResult = {
      confidence: 0.92,
      detected_areas: 3,
      recommendation: "Gunakan pembersih wajah berbahan dasar salicylic acid."
    };

    // 3. Simpan gambar dan hasil analisis ke database Supabase
    const newAnalysis = await prisma.skinAnalysis.create({
      data: {
        imageUrl: imageUrl,
        userId: userId,
        acneType: mockAcneType,
        skinType: mockSkinType,
        acneSeverityLabel: mockSeverity,
        status: "completed", 
        aiResultJson: mockAiResult,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Analisis gambar berhasil", 
      data: newAnalysis 
    }, { status: 201 });

  } catch (error) {
    console.error("Deteksi error:", error);
    return NextResponse.json({ error: "Server gagal memproses gambar" }, { status: 500 });
  }
}
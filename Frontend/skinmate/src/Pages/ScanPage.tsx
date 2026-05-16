import { useEffect, useRef, useState } from 'react';
// di Frontend/skinmate/src/Pages/ScanPage.tsx
import '../style/ScanPage.css';

type ScanHistoryItem = {
  id: string;
  image: string;
  conditionName: string;
  severity: string;
  date: string;
  note: string;
};

const STORAGE_KEY = 'skinmate_scan_history';

function makeId() {
  if ('crypto' in window && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScanHistoryItem[]) : [];
  } catch {
    return [];
  }
}

// === FITUR HISTORY: simpan hasil scan ke localStorage ===
function saveToHistory(item: ScanHistoryItem) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...readHistory()]));
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [image, setImage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanHistoryItem | null>(null);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }

  // === FITUR OPEN KAMERA: kode untuk membuka kamera browser ===
  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert(
        'Browser ini belum mendukung akses kamera. Jalankan lewat localhost/HTTPS atau gunakan upload foto.',
      );
      return;
    }

    try {
      stopCamera();
      setImage('');
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error(error);
      alert(
        'Kamera gagal dibuka. Pastikan izin kamera aktif dan aplikasi dibuka lewat localhost atau HTTPS.',
      );
    }
  }

  // === FITUR OPEN KAMERA: ambil foto dari video kamera ===
  function captureFromCamera() {
    const video = videoRef.current;
    if (!video || !streamRef.current) return '';

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImage(dataUrl);
    stopCamera();
    return dataUrl;
  }

  function uploadPhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stopCamera();
      setImage(String(reader.result || ''));
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeNow() {
    const selectedImage = image || captureFromCamera();
    if (!selectedImage) {
      alert('Buka kamera lalu ambil foto, atau upload foto dulu.');
      return;
    }

    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    // TODO: nanti bagian ini bisa diganti response API AI.
    const item: ScanHistoryItem = {
      id: makeId(),
      image: selectedImage,
      conditionName: 'Analisis Kulit',
      severity: 'Perlu review',
      date: new Date().toISOString(),
      note: 'Data scan tersimpan. Sambungkan ke API AI untuk hasil diagnosis asli.',
    };

    saveToHistory(item);
    setResult(item);
    setAnalyzing(false);
  }

  function resetScan() {
    stopCamera();
    setImage('');
    setResult(null);
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="scan-page">
      <nav className="scan-nav">
        <a className="scan-logo" href="/">
          <span /> Skinmate
        </a>
        <div className="scan-nav-actions">
          <a href="/history">History</a>
          <a href="/">Home</a>
        </div>
      </nav>

      {analyzing && (
        <div className="scan-loading">
          <div className="scan-spinner" />
          <h2>Menganalisis foto...</h2>
          <p>Hasil scan akan otomatis masuk ke history.</p>
        </div>
      )}

      <main className="scan-shell">
        <header className="scan-header">
          <p>Scan Kulit</p>
          <h1>Open kamera atau upload foto</h1>
          <span>Bagian fitur kamera dan history sudah ditandai di kode.</span>
        </header>

        <section className="scan-card">
          <div className="scan-preview">
            <video
              ref={videoRef}
              className={cameraOpen ? 'show' : ''}
              autoPlay
              playsInline
              muted
            />
            {image && <img src={image} alt="Preview scan" />}
            {!cameraOpen && !image && (
              <div className="scan-empty">
                <strong>📷</strong>
                <p>Kamera/foto akan tampil di sini</p>
              </div>
            )}
            {(cameraOpen || image) && <div className="face-guide" />}
          </div>

          <div className="scan-controls">
            <button type="button" onClick={openCamera}>
              Buka Kamera
            </button>
            <button
              type="button"
              onClick={captureFromCamera}
              disabled={!cameraOpen}
            >
              Ambil Foto
            </button>
            <label>
              Upload Foto
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadPhoto(e.target.files?.[0])}
              />
            </label>
            <button type="button" className="primary" onClick={analyzeNow}>
              Analisis & Simpan
            </button>
          </div>
        </section>

        {result && (
          <section className="scan-result">
            <img src={result.image} alt="Hasil scan" />
            <div>
              <p>Hasil sementara</p>
              <h2>{result.conditionName}</h2>
              <span>{result.severity}</span>
              <small>{result.note}</small>
              <div className="scan-result-actions">
                <a href="/history">Lihat History</a>
                <button type="button" onClick={resetScan}>
                  Scan Ulang
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

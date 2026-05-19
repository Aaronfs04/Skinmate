import { useEffect, useRef, useState } from 'react';
import '../style/ScanPage.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanHistoryItem = {
  id: string;
  image: string;
  skinType: string;
  skinTypeDesc: string;
  acneType: string;
  acneTypeDesc: string;
  overallCondition: string;
  skincareTips: string[];
  confidence: number;
  date: string;
  isDemo?: boolean;
};

type AIAnalysis = {
  skinType: { label: string; confidence: number; description: string };
  acneType: { label: string; confidence: number; description: string };
  overallCondition: string;
  skincareTips: string[];
  disclaimer: string;
};

const STORAGE_KEY = 'skinmate_scan_history';
const BACKEND_URL = 'http://localhost:3001';

// ─── Dummy fallback data (dipakai saat AI tidak tersedia) ─────────────────────
const DUMMY_RESULTS: Omit<ScanHistoryItem, 'id' | 'image' | 'date' | 'isDemo'>[] = [
  {
    skinType: 'Berminyak',
    skinTypeDesc: 'Kulit terlihat mengkilap terutama di area T-zone. Produksi sebum cenderung tinggi sepanjang hari.',
    acneType: 'Jerawat Ringan',
    acneTypeDesc: 'Terdapat beberapa papul kecil yang meradang, terutama di area dagu dan hidung. Jumlah lesi masih di bawah 20.',
    overallCondition: 'Cukup',
    skincareTips: [
      'Gunakan pembersih wajah dengan kandungan salicylic acid 0.5–2% untuk mengontrol minyak berlebih.',
      'Pakai moisturizer berbasis gel yang non-comedogenic agar kulit tetap lembap tanpa menyumbat pori.',
      'Hindari menyentuh wajah terlalu sering dan ganti sarung bantal minimal 2x seminggu.',
    ],
    confidence: 78,
  },
  {
    skinType: 'Kombinasi',
    skinTypeDesc: 'Area T-zone (dahi, hidung, dagu) lebih berminyak sementara pipi cenderung normal hingga kering.',
    acneType: 'Komedo',
    acneTypeDesc: 'Terdapat blackhead dan whitehead di area hidung dan dahi. Belum ada peradangan yang signifikan.',
    overallCondition: 'Baik',
    skincareTips: [
      'Gunakan toner dengan kandungan niacinamide untuk menyeimbangkan produksi minyak di T-zone.',
      'Aplikasikan clay mask 1–2x seminggu khusus di area berminyak untuk membersihkan pori.',
      'Pilih sunscreen berbentuk lotion ringan agar tidak memperparah area kering.',
    ],
    confidence: 82,
  },
  {
    skinType: 'Normal',
    skinTypeDesc: 'Kulit terlihat seimbang, tidak terlalu berminyak maupun kering. Pori-pori tampak minimal.',
    acneType: 'Tidak Ada Jerawat',
    acneTypeDesc: 'Kulit bersih tanpa tanda-tanda peradangan atau sumbatan pori yang terlihat. Kondisi baik.',
    overallCondition: 'Baik',
    skincareTips: [
      'Pertahankan rutinitas skincare yang sederhana: cleanser, moisturizer, dan sunscreen setiap hari.',
      'Lakukan eksfoliasi ringan 1x seminggu untuk menjaga kulit tetap cerah dan segar.',
      'Konsumsi air mineral minimal 8 gelas sehari untuk menjaga hidrasi kulit dari dalam.',
    ],
    confidence: 85,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeId() {
  if ('crypto' in window && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScanHistoryItem[]) : [];
  } catch { return []; }
}

function saveToHistory(item: ScanHistoryItem) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...readHistory()]));
}

const CONDITION_COLOR: Record<string, string> = {
  'Baik': '#22c55e',
  'Cukup': '#f59e0b',
  'Perlu Perhatian': '#ef4444',
  'AI Tidak Ditemukan': '#94a3b8',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [image, setImage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanHistoryItem | null>(null);
  const [error, setError] = useState('');

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraOpen(false);
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { alert('Browser belum mendukung kamera. Gunakan upload foto.'); return; }
    try {
      stopCamera(); setImage(''); setResult(null); setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream; setCameraOpen(true);
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
    } catch { alert('Kamera gagal dibuka. Pastikan izin aktif dan buka via localhost/HTTPS.'); }
  }

  function captureFromCamera(): string {
    const video = videoRef.current;
    if (!video || !streamRef.current) return '';
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d'); if (!ctx) return '';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImage(dataUrl); stopCamera(); return dataUrl;
  }

  function uploadPhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { stopCamera(); setImage(String(reader.result || '')); setResult(null); setError(''); };
    reader.readAsDataURL(file);
  }

  async function analyzeNow() {
    const selectedImage = image || captureFromCamera();
    if (!selectedImage) { alert('Buka kamera lalu ambil foto, atau upload foto dulu.'); return; }
    setAnalyzing(true); setError(''); setResult(null);

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      const res = await fetch(`${BACKEND_URL}/api/detect`, { method: 'POST', body: formData });
      if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.error || `Server error ${res.status}`); }

      const data = await res.json();
      const isDemo = data.aiAvailable === false;
      const ai: AIAnalysis = data.analysis;

      // Kalau AI tidak tersedia, pakai dummy data (bukan response kosong dari backend)
      if (isDemo) {
        const dummy = DUMMY_RESULTS[Math.floor(Math.random() * DUMMY_RESULTS.length)];
        const item: ScanHistoryItem = {
          id: makeId(), image: selectedImage,
          ...dummy,
          date: new Date().toISOString(),
          isDemo: true,
        };
        setResult(item);
      } else {
        const item: ScanHistoryItem = {
          id: makeId(), image: selectedImage,
          skinType: ai.skinType.label, skinTypeDesc: ai.skinType.description,
          acneType: ai.acneType.label, acneTypeDesc: ai.acneType.description,
          overallCondition: ai.overallCondition, skincareTips: ai.skincareTips,
          confidence: Math.round((ai.skinType.confidence + ai.acneType.confidence) / 2),
          date: new Date().toISOString(),
          isDemo: false,
        };
        saveToHistory(item); setResult(item);
      }

    } catch (err: unknown) {
      // Backend tidak bisa diakses sama sekali → tetap pakai dummy
      const dummy = DUMMY_RESULTS[Math.floor(Math.random() * DUMMY_RESULTS.length)];
      const item: ScanHistoryItem = {
        id: makeId(), image: selectedImage,
        ...dummy,
        date: new Date().toISOString(),
        isDemo: true,
      };
      setResult(item);
      setError('Backend tidak dapat dijangkau — menampilkan data contoh.');
    } finally {
      setAnalyzing(false);
    }
  }

  function resetScan() { stopCamera(); setImage(''); setResult(null); setError(''); }
  useEffect(() => () => stopCamera(), []);

  return (
    <div className="scan-page">
      <nav className="scan-nav">
        <a className="scan-logo" href="/"><span /> Skinmate</a>
        <div className="scan-nav-actions">
          <a href="/history">History</a>
          <a href="/">Home</a>
        </div>
      </nav>

      {analyzing && (
        <div className="scan-loading">
          <div className="scan-spinner" />
          <h2>Menganalisis foto...</h2>
          <p>AI sedang mendeteksi tipe kulit dan kondisi jerawatmu.</p>
        </div>
      )}

      <main className="scan-shell">
        <header className="scan-header">
          <p>Scan Kulit</p>
          <h1>Deteksi Tipe Kulit & Jerawat</h1>
          <span>Buka kamera atau upload foto wajahmu untuk analisis AI</span>
        </header>

        <section className="scan-card">
          <div className="scan-preview">
            <video ref={videoRef} className={cameraOpen ? 'show' : ''} autoPlay playsInline muted />
            {image && <img src={image} alt="Preview scan" />}
            {!cameraOpen && !image && (
              <div className="scan-empty"><strong>📷</strong><p>Kamera/foto akan tampil di sini</p></div>
            )}
            {(cameraOpen || image) && <div className="face-guide" />}
          </div>
          <div className="scan-controls">
            <button type="button" onClick={openCamera}>Buka Kamera</button>
            <button type="button" onClick={captureFromCamera} disabled={!cameraOpen}>Ambil Foto</button>
            <label>
              Upload Foto
              <input type="file" accept="image/*" onChange={e => uploadPhoto(e.target.files?.[0])} />
            </label>
            <button type="button" className="primary" onClick={analyzeNow} disabled={analyzing}>
              {analyzing ? 'Menganalisis...' : 'Analisis Sekarang'}
            </button>
          </div>
        </section>

        {/* Soft warning jika backend mati tapi tetap ada hasil dummy */}
        {error && (
          <div className="scan-offline-note">
            ℹ️ {error}
          </div>
        )}

        {result && (
          <section className="scan-result-full">

            {/* NOTE 1 — tampil kalau AI belum terhubung */}
            {result.isDemo && (
              <div className="result-note">
                <span className="note-badge">Catatan 1</span>
                <div>
                  <strong>AI belum terhubung</strong> — Hasil di bawah adalah data contoh untuk tampilan.
                  Hubungkan model AI di <code>Backend/.env</code> untuk analisis foto yang sesungguhnya.
                </div>
              </div>
            )}

            <div className="result-header">
              <img src={result.image} alt="Hasil scan" className="result-thumb" />
              <div className="result-summary">
                <div className="result-condition-badge"
                  style={{
                    background: (CONDITION_COLOR[result.overallCondition] || '#888') + '22',
                    color: CONDITION_COLOR[result.overallCondition] || '#888',
                    borderColor: (CONDITION_COLOR[result.overallCondition] || '#888') + '55'
                  }}>
                  {result.overallCondition}
                </div>
                {!result.isDemo && <p className="result-confidence">Akurasi rata-rata: {result.confidence}%</p>}
                {result.isDemo && <p className="result-confidence result-confidence-demo">Data contoh</p>}
              </div>
            </div>

            <div className="result-cards">
              <div className="result-card skin-type-card">
                <div className="rc-icon">🌿</div>
                <div className="rc-label">Tipe Kulit</div>
                <div className="rc-value">{result.skinType}</div>
                <p className="rc-desc">{result.skinTypeDesc}</p>
              </div>
              <div className="result-card acne-type-card">
                <div className="rc-icon">🔍</div>
                <div className="rc-label">Kondisi Jerawat</div>
                <div className="rc-value">{result.acneType}</div>
                <p className="rc-desc">{result.acneTypeDesc}</p>
              </div>
            </div>

            <div className="result-tips">
              <h3>💡 Tips Skincare untuk Kamu</h3>
              <ul>{result.skincareTips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </div>

            <p className="result-disclaimer">
              ⚕️ Hasil ini hanya estimasi{result.isDemo ? ' contoh' : ' AI'}, bukan diagnosis medis. Konsultasikan ke dokter kulit untuk diagnosis akurat.
            </p>

            <div className="scan-result-actions">
              {!result.isDemo && <a href="/history" className="btn-history">Lihat History</a>}
              <button type="button" onClick={resetScan} className="btn-reset">Scan Ulang</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

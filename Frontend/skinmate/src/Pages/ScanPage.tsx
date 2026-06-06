import { useEffect, useRef, useState } from 'react';
import '../style/ScanPage.css';
import logoImg from '../assets/logo.png';
import { getUser } from '../auth';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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

// ─── Dummy fallback data ──────────────────────────────────────────────────────
const DUMMY_RESULTS: Omit<
  ScanHistoryItem,
  'id' | 'image' | 'date' | 'isDemo'
>[] = [
  {
    skinType: 'Oily',
    skinTypeDesc:
      'Skin looks shiny, especially in the T-zone area. Sebum production tends to be high throughout the day.',
    acneType: 'Mild Acne',
    acneTypeDesc:
      'There are several inflamed small papules, especially in the chin and nose areas. The number of lesions is still below 20.',
    overallCondition: 'Fair',
    skincareTips: [
      'Use a facial cleanser with 0.5–2% salicylic acid to control excess oil.',
      'Use a non-comedogenic gel-based moisturizer to keep the skin hydrated without clogging pores.',
      'Avoid touching your face too often and change pillowcases at least 2x a week.',
    ],
    confidence: 78,
  },
  {
    skinType: 'Combination',
    skinTypeDesc:
      'The T-zone area (forehead, nose, chin) is oilier while the cheeks tend to be normal to dry.',
    acneType: 'Comedones',
    acneTypeDesc:
      'There are blackheads and whiteheads in the nose and forehead areas. There is no significant inflammation yet.',
    overallCondition: 'Good',
    skincareTips: [
      'Use a toner with niacinamide to balance oil production in the T-zone.',
      'Apply a clay mask 1–2x a week specifically on oily areas to clean pores.',
      'Choose a light lotion sunscreen so as not to worsen dry areas.',
    ],
    confidence: 82,
  },
  {
    skinType: 'Normal',
    skinTypeDesc:
      'Skin looks balanced, neither too oily nor dry. Pores are minimally visible.',
    acneType: 'No Acne',
    acneTypeDesc:
      'Clear skin without visible signs of inflammation or clogged pores. Good condition.',
    overallCondition: 'Good',
    skincareTips: [
      'Maintain a simple skincare routine: cleanser, moisturizer, and sunscreen every day.',
      'Do light exfoliation 1x a week to keep the skin bright and fresh.',
      'Drink at least 8 glasses of mineral water a day to maintain skin hydration from within.',
    ],
    confidence: 85,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function saveToHistory(item: ScanHistoryItem) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...readHistory()]));
}

const CONDITION_COLOR: Record<string, string> = {
  Good: '#22c55e',
  Fair: '#f59e0b',
  'Needs Attention': '#ef4444',
  'AI Not Found': '#94a3b8',
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
  const [user, setCurrentUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Browser does not support camera. Use photo upload.');
      return;
    }
    try {
      stopCamera();
      setImage('');
      setResult(null);
      setError('');
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
    } catch {
      alert(
        'Failed to open camera. Make sure permission is active and open via localhost/HTTPS.',
      );
    }
  }

  function captureFromCamera(): string {
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
      setError('');
    };
    reader.readAsDataURL(file);
  }

  async function analyzeNow() {
    const selectedImage = image || captureFromCamera();
    if (!selectedImage) {
      alert('Open camera and take a photo, or upload a photo first.');
      return;
    }
    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      const res = await fetch(`${BACKEND_URL}/api/detect`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const isDemo = data.aiAvailable === false;
      const ai: AIAnalysis = data.analysis;

      if (isDemo) {
        const dummy =
          DUMMY_RESULTS[Math.floor(Math.random() * DUMMY_RESULTS.length)];
        const item: ScanHistoryItem = {
          id: makeId(),
          image: selectedImage,
          ...dummy,
          date: new Date().toISOString(),
          isDemo: true,
        };
        setResult(item);
      } else {
        const item: ScanHistoryItem = {
          id: makeId(),
          image: selectedImage,
          skinType: ai.skinType.label,
          skinTypeDesc: ai.skinType.description,
          acneType: ai.acneType.label,
          acneTypeDesc: ai.acneType.description,
          overallCondition: ai.overallCondition,
          skincareTips: ai.skincareTips,
          confidence: Math.round(
            (ai.skinType.confidence + ai.acneType.confidence) / 2,
          ),
          date: new Date().toISOString(),
          isDemo: false,
        };
        saveToHistory(item);
        setResult(item);
      }
    } catch {
      const dummy =
        DUMMY_RESULTS[Math.floor(Math.random() * DUMMY_RESULTS.length)];
      const item: ScanHistoryItem = {
        id: makeId(),
        image: selectedImage,
        ...dummy,
        date: new Date().toISOString(),
        isDemo: true,
      };
      setResult(item);
      setError('Backend unreachable — showing sample data.');
    } finally {
      setAnalyzing(false);
    }
  }

  function resetScan() {
    stopCamera();
    setImage('');
    setResult(null);
    setError('');
  }
  useEffect(() => () => stopCamera(), []);

  return (
    <div className="scan-page">
      <nav className="scan-nav">
        <a className="scan-logo" href={user ? '/home' : '/'}>
          <img
            src={logoImg}
            alt="Logo"
            width="22"
            height="29"
            style={{ marginRight: '5px' }}
          />
          Skin<span>Mate</span>
        </a>
        <div className="scan-nav-actions">
          <a className="active" href="/scan">
            Scan
          </a>
          <a href="/dashboard">Dashboard</a>
          <a href="/history">History</a>
        </div>
        <a href="/profile" className="scan-nav-avatar" title="Profile">
          <span className="scan-avatar-circle">
            {user ? getInitials(user.username) : '👤'}
          </span>
        </a>
      </nav>

      {analyzing && (
        <div className="scan-loading">
          <div className="scan-spinner" />
          <h2>Analyzing photo...</h2>
          <p>AI is detecting your skin type and acne condition.</p>
        </div>
      )}

      <main className="scan-shell">
        <header className="scan-header">
          <p>Skin Scan</p>
          <h1>Detect Skin Type & Acne</h1>
          <span>Open camera or upload your face photo for AI analysis</span>
        </header>

        {/* ─── Input Card ─────────────────────────────────────────────────── */}
        {!result && (
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
                  <p>Camera/photo will appear here</p>
                </div>
              )}
              {(cameraOpen || image) && <div className="face-guide" />}
            </div>
            <div className="scan-controls">
              <button type="button" onClick={openCamera}>
                Open Camera
              </button>
              <button
                type="button"
                onClick={captureFromCamera}
                disabled={!cameraOpen}
              >
                Take Photo
              </button>
              <label>
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadPhoto(e.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                className="primary"
                onClick={analyzeNow}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Now'}
              </button>
            </div>
          </section>
        )}

        {error && <div className="scan-offline-note">ℹ️ {error}</div>}

        {/* ─── Result: Full Split Layout ──────────────────────────────────── */}
        {result && (
          <section className="scan-result-full">
            {result.isDemo && (
              <div className="result-note">
                <span className="note-badge">Note 1</span>
                <div>
                  <strong>AI not connected</strong> — Results below are
                  sample data for display. Connect the AI model in{' '}
                  <code>Backend/.env</code> for actual photo
                  analysis.
                </div>
              </div>
            )}

            {/* ── Top Split: Foto (kiri 50%) + Analisis (kanan 50%) ────────── */}
            <div className="result-split">
              {/* Kiri — Foto besar */}
              <div className="result-image-panel">
                <div className="result-image-wrap">
                  <img
                    src={result.image}
                    alt="Scan result"
                    className="result-big-photo"
                  />
                  {/* Kondisi badge overlay */}
                  <div
                    className="result-overlay-badge"
                    style={{
                      background:
                        (CONDITION_COLOR[result.overallCondition] || '#888') +
                        'ee',
                    }}
                  >
                    {result.overallCondition}
                  </div>
                </div>
                {!result.isDemo && (
                  <p className="result-accuracy-label">
                    🎯 Average accuracy: <strong>{result.confidence}%</strong>
                  </p>
                )}
                {result.isDemo && (
                  <p className="result-accuracy-label result-demo-label">
                    ✨ Sample data
                  </p>
                )}
              </div>

              {/* Kanan — Info cards */}
              <div className="result-info-panel">
                <div className="result-cards-stacked">
                  <div className="result-card skin-type-card">
                    <div className="rc-icon">🌿</div>
                    <div className="rc-label">Skin Type</div>
                    <div className="rc-value">{result.skinType}</div>
                    <p className="rc-desc">{result.skinTypeDesc}</p>
                  </div>
                  <div className="result-card acne-type-card">
                    <div className="rc-icon">🔍</div>
                    <div className="rc-label">Acne Condition</div>
                    <div className="rc-value">{result.acneType}</div>
                    <p className="rc-desc">{result.acneTypeDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bawah — Tips Skincare ─────────────────────────────────────── */}
            <div className="result-tips">
              <h3>💡 Skincare Tips for You</h3>
              <ul className="result-tips-list">
                {result.skincareTips.map((tip, i) => (
                  <li key={i}>
                    <span className="tip-num">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <p className="result-disclaimer">
              ⚕️ This result is only an{result.isDemo ? ' example' : ' AI'} estimation,
              not a medical diagnosis. Consult a dermatologist for
              an accurate diagnosis.
            </p>

            <div className="scan-result-actions">
              {!result.isDemo && (
                <a href="/dashboard" className="btn-history">
                  View Dashboard
                </a>
              )}
              <button type="button" onClick={resetScan} className="btn-reset">
                Rescan
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

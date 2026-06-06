import { useMemo, useState, useEffect } from 'react';
import '../style/HistoryPage.css';
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

const STORAGE_KEY = 'skinmate_scan_history';

const CONDITION_COLOR: Record<string, string> = {
  Baik: '#22c55e',
  Cukup: '#f59e0b',
  'Perlu Perhatian': '#ef4444',
  'AI Tidak Ditemukan': '#94a3b8',
};

function loadHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScanHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Sub-component: Detail Full Page ─────────────────────────────────────────

function DetailPage({
  item,
  onBack,
  onToggleSelect,
  isSelected,
}: {
  item: ScanHistoryItem;
  onBack: () => void;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const conditionColor = CONDITION_COLOR[item.overallCondition] || '#94a3b8';

  return (
    <div className="detail-page">
      {/* Nav */}
      <nav className="detail-nav">
        <button type="button" className="detail-back-btn" onClick={onBack}>
          ← Kembali ke History
        </button>
        <div className="detail-nav-date">{formatDate(item.date)}</div>
      </nav>

      <main className="detail-shell">
        {/* Demo Banner */}
        {item.isDemo && (
          <div className="detail-demo-banner">
            <span className="detail-demo-tag">Data Demo</span>
            Ini adalah data contoh. Hubungkan AI untuk hasil analisis
            sesungguhnya.
          </div>
        )}

        {/* ── Split: Foto (kiri) + Info (kanan) ───────────────────────────── */}
        <div className="detail-split">
          {/* Foto Panel */}
          <div className="detail-image-panel">
            <div className="detail-image-wrap">
              <img
                src={item.image}
                alt="Detail scan"
                className="detail-big-photo"
              />
              <div
                className="detail-overlay-badge"
                style={{ background: conditionColor + 'ee' }}
              >
                {item.overallCondition}
              </div>
            </div>
            {!item.isDemo ? (
              <p className="detail-accuracy-label">
                🎯 Akurasi rata-rata: <strong>{item.confidence}%</strong>
              </p>
            ) : (
              <p className="detail-accuracy-label detail-demo-acc">
                ✨ Data contoh
              </p>
            )}
          </div>

          {/* Info Panel */}
          <div className="detail-info-panel">
            <div className="detail-cards-stacked">
              <div className="detail-card skin-card">
                <div className="dc-icon">🌿</div>
                <div className="dc-label">Tipe Kulit</div>
                <div className="dc-value">{item.skinType}</div>
                <p className="dc-desc">{item.skinTypeDesc}</p>
              </div>
              <div className="detail-card acne-card">
                <div className="dc-icon">🔍</div>
                <div className="dc-label">Kondisi Jerawat</div>
                <div className="dc-value">{item.acneType}</div>
                <p className="dc-desc">{item.acneTypeDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tips (bawah) ─────────────────────────────────────────────────── */}
        {item.skincareTips?.length > 0 && (
          <div className="detail-tips">
            <h3>💡 Tips Skincare untuk Kamu</h3>
            <ul className="detail-tips-list">
              {item.skincareTips.map((tip, i) => (
                <li key={i}>
                  <span className="tip-num">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="detail-disclaimer">
          ⚕️ Hasil ini hanya estimasi{item.isDemo ? ' contoh' : ' AI'}, bukan
          diagnosis medis. Konsultasikan ke dokter kulit untuk diagnosis akurat.
        </p>

        {/* Actions */}
        <div className="detail-actions">
          <button
            type="button"
            className={isSelected ? 'btn-selected' : 'btn-compare'}
            onClick={() => {
              onToggleSelect(item.id);
              onBack();
            }}
          >
            {isSelected ? '✓ Dipilih untuk Compare' : 'Pilih untuk Compare'}
          </button>
          <button type="button" className="btn-back-action" onClick={onBack}>
            Kembali
          </button>
        </div>
      </main>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>(loadHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [user, setCurrentUser] = useState<{ username: string } | null>(null);
  const [detailItem, setDetailItem] = useState<ScanHistoryItem | null>(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  // Scroll ke atas saat masuk/keluar detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [detailItem]);

  const selectedItems = useMemo(
    () => history.filter((item) => selectedIds.includes(item.id)),
    [history, selectedIds],
  );

  function toggleSelect(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id))
        return current.filter((itemId) => itemId !== id);
      if (current.length >= 2) {
        alert('Maksimal pilih 2 scan untuk dibandingkan.');
        return current;
      }
      return [...current, id];
    });
  }

  function clearHistory() {
    const ok = confirm('Yakin mau hapus semua history scan?');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    setSelectedIds([]);
  }

  // ── Jika detail terbuka, render full page detail ──────────────────────────
  if (detailItem) {
    return (
      <DetailPage
        item={detailItem}
        onBack={() => setDetailItem(null)}
        onToggleSelect={toggleSelect}
        isSelected={selectedIds.includes(detailItem.id)}
      />
    );
  }

  // ── History List Page ─────────────────────────────────────────────────────
  return (
    <div className="history-page">
      <nav className="history-nav">
        <a className="history-logo" href={user ? '/home' : '/'}>
          <img
            src={logoImg}
            alt="Logo"
            width="22"
            height="29"
            style={{ marginRight: '5px' }}
          />
          Skin<span>Mate</span>
        </a>
        <div className="history-nav-actions">
          <a href="/scan">Scan</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile" className="history-nav-avatar" title="Profile">
            <span className="history-avatar-circle">
              {user ? getInitials(user.username) : '👤'}
            </span>
          </a>
        </div>
      </nav>

      <main className="history-shell">
        <header className="history-header">
          <div>
            <p>History Scan</p>
            <h1>Pantau progres kulitmu</h1>
            <span>
              Klik kartu untuk lihat detail. Pilih dua kartu untuk compare.
            </span>
          </div>
          {history.length > 0 && (
            <button type="button" onClick={clearHistory}>
              Hapus History
            </button>
          )}
        </header>

        {/* Compare Panel */}
        {selectedItems.length === 2 && (
          <section className="compare-panel">
            <h2>Compare 2 Scan</h2>
            <div className="compare-grid">
              {selectedItems.map((item) => (
                <article key={item.id}>
                  <img src={item.image} alt="Hasil scan terpilih" />
                  <h3>{item.skinType}</h3>
                  <p>{item.acneType}</p>
                  <div
                    className="compare-condition-badge"
                    style={{
                      color:
                        CONDITION_COLOR[item.overallCondition] || '#94a3b8',
                    }}
                  >
                    {item.overallCondition}
                  </div>
                  <span>{formatDate(item.date)}</span>
                </article>
              ))}
            </div>
            <p className="compare-note">
              Insight: cek perbedaan tanggal, tipe kulit, dan kondisi jerawat.
              Untuk hasil tracking yang rapi, scan dengan sudut dan cahaya yang
              sama.
            </p>
          </section>
        )}

        {/* Empty State */}
        {history.length === 0 ? (
          <section className="history-empty">
            <strong>📸</strong>
            <h2>Belum ada history</h2>
            <p>Setelah scan, hasilnya otomatis tersimpan di halaman ini.</p>
            <a href="/scan">Mulai Scan</a>
          </section>
        ) : (
          <section className="history-grid">
            {history.map((item) => {
              const active = selectedIds.includes(item.id);
              return (
                <article
                  className={active ? 'active' : ''}
                  key={item.id}
                  onClick={() => setDetailItem(item)}
                >
                  <div className="check">✓</div>
                  {item.isDemo && <div className="demo-badge">Demo</div>}
                  <img src={item.image} alt="History scan" />
                  <div className="history-card-body">
                    <h2>{item.skinType}</h2>
                    <p
                      style={{
                        color:
                          CONDITION_COLOR[item.overallCondition] || '#918b6b',
                      }}
                    >
                      {item.overallCondition}
                    </p>
                    <span className="history-acne-label">{item.acneType}</span>
                    <span className="history-date">
                      {formatDate(item.date)}
                    </span>
                    <button
                      type="button"
                      className={active ? 'btn-selected' : ''}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSelect(item.id);
                      }}
                    >
                      {active ? '✓ Dipilih' : 'Pilih Compare'}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

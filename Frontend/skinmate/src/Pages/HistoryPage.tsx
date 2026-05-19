import { useMemo, useState } from 'react';
import '../style/HistoryPage.css';
import logo from '../assets/logo.png';

type ScanHistoryItem = {
  id: string;
  image: string;
  conditionName: string;
  severity: string;
  date: string;
  note?: string;
};

const STORAGE_KEY = 'skinmate_scan_history';

// === FITUR HISTORY: kode baca data history dari localStorage ===
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

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>(loadHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedItems = useMemo(
    () => history.filter((item) => selectedIds.includes(item.id)),
    [history, selectedIds],
  );

  // === FITUR HISTORY: pilih 2 scan untuk compare ===
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

  return (
    <div className="history-page">
      <nav className="history-nav">
        <a className="history-logo" href="/">
          <img src={logo} alt="logo" width="22" height="25" style={{ marginRight: '5px' }} />
          Skinmate
        </a>
        <div className="history-nav-actions">
          <a className="primary" href="/scan">
            + Scan Baru
          </a>
          <a href="/">Home</a>
        </div>
      </nav>

      <main className="history-shell">
        <header className="history-header">
          <div>
            <p>History Scan</p>
            <h1>Pantau progres kulitmu</h1>
            <span>Pilih dua kartu untuk compare hasil scan.</span>
          </div>
          {history.length > 0 && (
            <button type="button" onClick={clearHistory}>
              Hapus History
            </button>
          )}
        </header>

        {selectedItems.length === 2 && (
          <section className="compare-panel">
            <h2>Compare 2 Scan</h2>
            <div className="compare-grid">
              {selectedItems.map((item) => (
                <article key={item.id}>
                  <img src={item.image} alt="Hasil scan terpilih" />
                  <h3>{item.conditionName}</h3>
                  <p>{item.severity}</p>
                  <span>{formatDate(item.date)}</span>
                </article>
              ))}
            </div>
            <p className="compare-note">
              Insight: cek perbedaan tanggal, kondisi, dan tingkat keparahan.
              Untuk hasil tracking yang rapi, scan dengan sudut dan cahaya yang
              sama.
            </p>
          </section>
        )}

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
                  onClick={() => toggleSelect(item.id)}
                >
                  <div className="check">✓</div>
                  <img src={item.image} alt="History scan" />
                  <div className="history-card-body">
                    <h2>{item.conditionName}</h2>
                    <p>{item.severity}</p>
                    <span>{formatDate(item.date)}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSelect(item.id);
                      }}
                    >
                      {active ? 'Dipilih' : 'Pilih Compare'}
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

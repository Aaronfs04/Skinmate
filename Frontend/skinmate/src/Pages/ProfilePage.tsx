import { useEffect, useState } from 'react';
import logoImg from '../assets/logo.png';
import { getUser, clearUser, type AuthUser } from '../auth';
import '../style/ProfilePage.css';

type ScanHistoryItem = {
  id: string;
  skinType: string;
  acneType: string;
  overallCondition: string;
  confidence: number;
  date: string;
};

const STORAGE_KEY = 'skinmate_scan_history';

function loadHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScanHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const u = getUser();
    if (!u) {
      window.location.href = '/auth/login';
      return;
    }
    setUser(u);
    setEditName(u.username);
    setHistory(loadHistory());
    setLoaded(true);
  }, []);

  function handleLogout() {
    const ok = confirm('Yakin mau logout?');
    if (!ok) return;
    clearUser();
    window.location.href = '/';
  }

  function handleSaveName() {
    if (!user || !editName.trim()) return;
    const updated = { ...user, username: editName.trim() };
    import('../auth').then(({ setUser: saveUser }) => {
      saveUser(updated);
      setUser(updated);
      setEditing(false);
    });
  }

  function handleClearHistory() {
    const ok = confirm('Hapus semua history scan?');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }

  const totalScans = history.length;
  const avgConf =
    totalScans > 0
      ? Math.round(history.reduce((s, h) => s + (h.confidence || 0), 0) / totalScans)
      : 0;

  const skinTypeCounts = history.reduce<Record<string, number>>((acc, h) => {
    acc[h.skinType] = (acc[h.skinType] || 0) + 1;
    return acc;
  }, {});
  const topSkin = Object.entries(skinTypeCounts).sort((a, b) => b[1] - a[1])[0];

  const conditionCounts = history.reduce<Record<string, number>>((acc, h) => {
    acc[h.overallCondition] = (acc[h.overallCondition] || 0) + 1;
    return acc;
  }, {});

  if (!loaded) return null;

  return (
    <div className={`profile-page${loaded ? ' loaded' : ''}`}>
      {/* ── Nav ── */}
      <nav className="profile-nav">
        <a className="profile-nav-logo" href={user ? "/home" : "/"}>
          <img src={logoImg} alt="Logo" width="22" height="29" style={{ marginRight: '5px' }} />
          Skin<span>Mate</span>
        </a>
        <div className="profile-nav-links">
          <a href="/scan">Scan</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile" className="active profile-nav-avatar" title="Profile">
            <span className="nav-avatar-circle">{user ? getInitials(user.username) : '?'}</span>
          </a>
        </div>
      </nav>

      <main className="profile-main">
        {/* ── Header Card ── */}
        <div className="profile-hero-card">
          <div className="profile-avatar-big">
            {user ? getInitials(user.username) : '?'}
          </div>
          <div className="profile-hero-info">
            {editing ? (
              <div className="profile-edit-row">
                <input
                  className="profile-edit-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                />
                <button className="profile-btn-save" onClick={handleSaveName}>Simpan</button>
                <button className="profile-btn-cancel" onClick={() => setEditing(false)}>Batal</button>
              </div>
            ) : (
              <div className="profile-name-row">
                <h1>{user?.username}</h1>
                <button className="profile-btn-edit" onClick={() => setEditing(true)} title="Edit nama">
                  ✏️
                </button>
              </div>
            )}
            <p className="profile-email">{user?.email}</p>
            <p className="profile-joined">
              Bergabung sejak {user ? formatDate(user.joinedAt) : '-'}
            </p>
          </div>
          <button className="profile-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <span className="pstat-icon">📸</span>
            <div className="pstat-num">{totalScans}</div>
            <div className="pstat-label">Total Scan</div>
          </div>
          <div className="profile-stat-card">
            <span className="pstat-icon">🎯</span>
            <div className="pstat-num">{avgConf}%</div>
            <div className="pstat-label">Rata-rata Akurasi</div>
          </div>
          <div className="profile-stat-card">
            <span className="pstat-icon">🌿</span>
            <div className="pstat-num">{topSkin?.[0] ?? '-'}</div>
            <div className="pstat-label">Tipe Kulit Dominan</div>
          </div>
        </div>

        {/* ── Condition Breakdown ── */}
        {totalScans > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header">
              <h2>Riwayat Kondisi Kulit</h2>
              <button className="profile-btn-clear" onClick={handleClearHistory}>
                Hapus History
              </button>
            </div>
            <div className="profile-cond-list">
              {Object.entries(conditionCounts).map(([cond, count]) => {
                const pct = Math.round((count / totalScans) * 100);
                const COLOR: Record<string, string> = {
                  Baik: '#22c55e',
                  Cukup: '#f59e0b',
                  'Perlu Perhatian': '#ef4444',
                };
                const color = COLOR[cond] ?? '#918b6b';
                return (
                  <div key={cond} className="profile-cond-row">
                    <span className="pcond-dot" style={{ background: color }} />
                    <span className="pcond-name">{cond}</span>
                    <div className="pcond-bar-wrap">
                      <div className="pcond-bar" style={{ width: `${pct}%`, background: color + '55', borderColor: color }} />
                    </div>
                    <span className="pcond-count" style={{ color }}>{count}×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Skin Type Breakdown ── */}
        {totalScans > 0 && (
          <div className="profile-section-card">
            <h2>Distribusi Tipe Kulit</h2>
            <div className="profile-skintype-grid">
              {Object.entries(skinTypeCounts).map(([type, count]) => (
                <div key={type} className="profile-skintype-chip">
                  <div className="pchip-count">{count}</div>
                  <div className="pchip-label">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {totalScans === 0 && (
          <div className="profile-empty">
            <span>📊</span>
            <h3>Belum ada data scan</h3>
            <p>Mulai scan untuk melihat statistik kulitmu di sini.</p>
            <a href="/scan" className="profile-cta">Mulai Scan</a>
          </div>
        )}
      </main>
    </div>
  );
}

import '../style/Landing.css'
import logo from '../assets/logo.png'

export function Landing() {
  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <img src={logo} alt="logo" width="22" height="25" style={{ marginRight: '5px' }} />
          Skin<span>Mate</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Fitur</a></li>
          <li><a href="#how">Cara Kerja</a></li>
          <li><a href="#skin-types">Tipe Kulit</a></li>
          <li><a href="#acne-types">Tipe Jerawat</a></li>
        </ul>
        <div className="nav-cta">
          <a href="/auth/login" className="btn-ghost">Masuk</a>
          <a href="/scan" className="btn-solid">Scan Sekarang</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-circle c1"></div>
        <div className="hero-bg-circle c2"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot"></span>
            Analisis Kulit Personal
          </div>
          <h1>
            Kenali Kulitmu,<br />
            <em>Temukan</em> Perawatan<br />
            yang Tepat
          </h1>
          <p className="hero-desc">
            Upload foto wajah dan dapatkan analisis tipe kulit serta kondisi jerawatmu secara instan menggunakan AI.
          </p>
          <div className="hero-actions">
            <a href="/scan" className="btn-hero">Scan Kulit Sekarang →</a>
            <a href="#how" className="btn-hero-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              Lihat Cara Kerja
            </a>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <span>🧴</span><span>✨</span><span>🌿</span><span>💧</span>
            </div>
            <div className="trust-text">
              <strong>10,000+ pengguna aktif</strong>
              sudah menemukan rutinitas terbaik mereka
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float">
            <div className="float-badge b1">
              <span className="badge-icon">✅</span>
              <div className="badge-label"><strong>Analisis Selesai</strong>Tipe kulit terdeteksi</div>
            </div>
            <div className="float-badge b2">
              <span className="badge-icon">🌟</span>
              <div className="badge-label"><strong>98% Akurasi</strong>Hasil AI Vision</div>
            </div>
            <div className="hero-card-main">
              <h3>Apa Tipe Kulitmu?</h3>
              <p>AI mendeteksi secara otomatis dari foto</p>
              <div className="skin-type-grid">
                <div className="skin-chip chip-oily">🌊 Berminyak</div>
                <div className="skin-chip chip-dry">🍂 Kering</div>
                <div className="skin-chip chip-combo">⚖️ Kombinasi</div>
                <div className="skin-chip chip-normal">🌿 Normal</div>
                <div className="skin-chip chip-sensitive">🌸 Sensitif</div>
              </div>
              <p className="quiz-analyzing-text">Menganalisal profil kulitmu…</p>
              <div className="quiz-progress"><div className="quiz-progress-fill"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-header">
          <span className="section-tag">Mengapa Skinmate</span>
          <h2>Semua yang Kamu Butuhkan<br />untuk Kulit Sehat</h2>
          <p>Dari analisis hingga rekomendasi produk, semuanya ada di satu tempat</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Deteksi AI Akurat</h3>
            <p>Teknologi computer vision untuk mengidentifikasi tipe kulit dan kondisi jerawat dari foto wajahmu secara real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Rekomendasi Personal</h3>
            <p>Dapatkan tips skincare yang disesuaikan khusus dengan profil kulitmu, bukan rekomendasi umum.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Pantau Progres Kulit</h3>
            <p>Simpan history scan dan lihat perkembangan kondisi kulitmu dari waktu ke waktu.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how">
        <div className="section-header">
          <span className="section-tag">Cara Kerja</span>
          <h2>Hanya 3 Langkah Mudah</h2>
          <p>Proses yang simpel untuk hasil yang maksimal</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Upload Foto</h3>
            <p>Ambil foto wajah atau upload dari galeri. Pastikan cahaya cukup untuk hasil terbaik.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Analisis AI</h3>
            <p>AI kami menganalisis tipe kulit, kondisi jerawat, dan tingkat keparahannya secara otomatis.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Dapatkan Hasil</h3>
            <p>Terima analisis lengkap beserta tips skincare yang dipersonalisasi untuk kulitmu.</p>
          </div>
        </div>
      </section>

      {/* SKIN TYPES */}
      <section className="skin-types" id="skin-types">
        <div className="section-header">
          <span className="section-tag">Tipe Kulit</span>
          <h2>Kamu Termasuk yang Mana?</h2>
          <p>Setiap tipe kulit punya kebutuhan unik — AI kami bantu mendeteksinya</p>
        </div>
        <div className="skin-types-grid">
          <div className="skin-type-card">
            <span className="skin-emoji">🌊</span>
            <h4>Berminyak</h4>
            <p>Produksi sebum berlebih, pori besar, rentan komedo dan jerawat</p>
          </div>
          <div className="skin-type-card">
            <span className="skin-emoji">🍂</span>
            <h4>Kering</h4>
            <p>Kulit terasa kencang, mengelupas, dan kusam akibat kurang kelembapan</p>
          </div>
          <div className="skin-type-card">
            <span className="skin-emoji">⚖️</span>
            <h4>Kombinasi</h4>
            <p>Area T-zone berminyak namun pipi cenderung normal atau kering</p>
          </div>
          <div className="skin-type-card">
            <span className="skin-emoji">🌿</span>
            <h4>Normal</h4>
            <p>Kulit seimbang, tidak terlalu berminyak atau kering, pori minimal</p>
          </div>
          <div className="skin-type-card">
            <span className="skin-emoji">🌸</span>
            <h4>Sensitif</h4>
            <p>Mudah kemerahan, iritasi, dan bereaksi terhadap bahan atau cuaca</p>
          </div>
        </div>
      </section>

      {/* ACNE TYPES - NEW SECTION */}
      <section className="acne-types" id="acne-types">
        <div className="section-header">
          <span className="section-tag">Tipe Jerawat</span>
          <h2>Kenali Jenis Jerawatmu</h2>
          <p>AI kami dapat mendeteksi 6 kondisi jerawat berbeda</p>
        </div>
        <div className="acne-types-grid">
          <div className="acne-type-card">
            <span className="acne-emoji">✨</span>
            <h4>Tidak Ada Jerawat</h4>
            <p>Kulit bersih tanpa tanda peradangan atau sumbatan pori yang terlihat</p>
          </div>
          <div className="acne-type-card">
            <span className="acne-emoji">⚫</span>
            <h4>Komedo</h4>
            <p>Pori tersumbat tanpa peradangan. Bisa berupa komedo hitam (blackhead) atau putih (whitehead)</p>
          </div>
          <div className="acne-type-card">
            <span className="acne-emoji">🟡</span>
            <h4>Jerawat Ringan</h4>
            <p>Beberapa papul atau pustul kecil yang meradang, biasanya &lt;20 lesi di wajah</p>
          </div>
          <div className="acne-type-card">
            <span className="acne-emoji">🟠</span>
            <h4>Jerawat Sedang</h4>
            <p>Jerawat lebih banyak dan meradang, 20–50 lesi, beberapa mulai membentuk nodul</p>
          </div>
          <div className="acne-type-card">
            <span className="acne-emoji">🔴</span>
            <h4>Jerawat Parah</h4>
            <p>Lebih dari 50 lesi, meradang luas, risiko bekas luka permanen jika tidak ditangani</p>
          </div>
          <div className="acne-type-card acne-severe">
            <span className="acne-emoji">🩸</span>
            <h4>Kistik</h4>
            <p>Jerawat dalam di bawah kulit, menyakitkan, dan berpotensi meninggalkan bekas — butuh penanganan dokter</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>
          Siap Memulai Perjalanan<br />
          Menuju Kulit yang <em>Lebih Sehat</em>?
        </h2>
        <p>Scan wajahmu sekarang dan dapatkan analisis kulit personal dari AI</p>
        <a href="/scan" className="btn-cta">Scan Kulit Gratis Sekarang</a>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            Skin<span>Mate</span>
          </div>
          <ul className="footer-links">
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
            <li><a href="#">Kontak</a></li>
          </ul>
        </div>
        <p className="footer-copy">© 2025 Skinmate. Dibuat dengan ❤️ untuk kulit sehat.</p>
      </footer>
    </>
  );
}

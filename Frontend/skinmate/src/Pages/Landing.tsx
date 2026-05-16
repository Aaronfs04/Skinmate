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
        </ul>
          <li><a href="#skin-types">Tipe Kulit</a></li>
        <div className="nav-cta">
          <a href="/auth/login" className="btn-ghost">Masuk</a>
          <a href="/auth/register" className="btn-solid">Mulai Sekarang</a>
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
            Jawab quiz singkat dan dapatkan rekomendasi skincare yang dipersonalisasi sesuai tipe kulit dan kondisi jerawatmu.
          </p>
          <div className="hero-actions">
            <a href="/auth/register" className="btn-hero">Mulai Quiz Gratis →</a>
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
              <span>🧴</span>
              <span>✨</span>
              <span>🌿</span>
              <span>💧</span>
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
              <div className="badge-label">
                <strong>Analisis Selesai</strong>
                Tipe kulit terdeteksi
              </div>
            </div>
            <div className="float-badge b2">
              <span className="badge-icon">🌟</span>
              <div className="badge-label">
                <strong>98% Akurasi</strong>
                Berdasarkan quiz
              </div>
            </div>

            <div className="hero-card-main">
              <h3>Apa Tipe Kulitmu?</h3>
              <p>Pilih yang paling sesuai kondisimu</p>
              <div className="skin-type-grid">
                <div className="skin-chip chip-oily">🌊 Berminyak</div>
                <div className="skin-chip chip-dry">🍂 Kering</div>
                <div className="skin-chip chip-combo">⚖️ Kombinasi</div>
                <div className="skin-chip chip-normal">🌿 Normal</div>
                <div className="skin-chip chip-sensitive">🌸 Sensitif</div>
              </div>
              <p className="quiz-analyzing-text">Menganalisal profil kulitmu…</p>
              <div className="quiz-progress">
                <div className="quiz-progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-header">
          <span className="section-tag">Mengapa Skinmate</span>
          <h2>
            Semua yang Kamu Butuhkan<br />
            untuk Kulit Sehat
          </h2>
          <p>Dari analisis hingga rekomendasi produk, semuanya ada di satu tempat</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Analisis Kulit Akurat</h3>
            <p>Quiz berbasis dermatologi untuk mengidentifikasi tipe kulit, kondisi jerawat, dan kebutuhan kulitmu secara presisi.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Rekomendasi Personal</h3>
            <p>Dapatkan saran produk dan rutinitas skincare yang disesuaikan khusus dengan profil kulitmu, bukan rekomendasi umum.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Pantau Progres Kulit</h3>
            <p>Catat perkembangan kulitmu dari waktu ke waktu dan lihat bagaimana rutinitas barumu memberikan perubahan nyata.</p>
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
            <h3>Buat Akun</h3>
            <p>Daftar gratis dalam hitungan detik. Tidak perlu kartu kredit, tidak ada biaya tersembunyi.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Isi Quiz Kulit</h3>
            <p>Jawab serangkaian pertanyaan singkat tentang kondisi, kebiasaan, dan masalah kulitmu sehari-hari.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Dapatkan Hasil</h3>
            <p>Terima analisis lengkap dan rekomendasi skincare yang dipersonalisasi khusus untuk kulitmu.</p>
          </div>
        </div>
      </section>

      {/* SKIN TYPES */}
      <section className="skin-types" id="skin-types">
        <div className="section-header">
          <span className="section-tag">Tipe Kulit</span>
          <h2>Kamu Termasuk yang Mana?</h2>
          <p>Setiap tipe kulit punya kebutuhan unik — kami bantu kamu menemukannya</p>
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

      {/* CTA */}
      <section className="cta-section">
        <h2>
          Siap Memulai Perjalanan<br />
          Menuju Kulit yang <em>Lebih Sehat</em>?
        </h2>
        <p>Bergabung dengan ribuan pengguna yang sudah menemukan rutinitas terbaik mereka</p>
        <a href="/auth/register" className="btn-cta">Mulai Quiz Gratis Sekarang</a>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            Clear<span>Skin</span>
          </div>
          <ul className="footer-links">
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
            <li><a href="#">Kontak</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <p className="footer-copy">© 2025 Skinmate. Dibuat dengan ❤️ untuk kulit sehat.</p>
      </footer>
    </>
  );
};





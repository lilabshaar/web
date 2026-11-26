/**
 * ==============================================================================
 * MODUL AKSESIBILITAS WEB & LOGIKA FORMULIR KONSER
 * Standar Aksesibilitas WCAG 2.1 AA (Terinspirasi dari https://www.kemkes.go.id)
 * Pengembang : Ulil Abshar Said (NIM: 320240401032)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. ELEMEN DOM & STATE MANAGEMENT
    // --------------------------------------------------------------------------
    const root = document.documentElement;
    const announcer = document.getElementById('acc-live-announcer');

    // Widget Accessibility Controls
    const accToggleBtn = document.getElementById('acc-toggle-btn');
    const accPanel = document.getElementById('acc-panel');
    const accCloseBtn = document.getElementById('acc-close-btn');
    const accBackdrop = document.getElementById('acc-backdrop');

    // Font Controls
    const btnFontInc = document.getElementById('btn-font-inc');
    const btnFontDec = document.getElementById('btn-font-dec');
    const btnFontReset = document.getElementById('btn-font-reset');
    const fontSizeIndicator = document.getElementById('font-size-indicator');

    // Contrast & Color Theme Controls
    const btnHighContrast = document.getElementById('btn-high-contrast');
    const btnGrayscale = document.getElementById('btn-grayscale');
    const btnInvert = document.getElementById('btn-invert');
    const btnSepia = document.getElementById('btn-sepia');

    // Timezone & Theme Controls
    const timezoneSelect = document.getElementById('acc-timezone-select');
    const currentTimeDisplay = document.getElementById('acc-current-time');
    const themeStatusTag = document.getElementById('acc-theme-status-tag');
    const btnThemeAuto = document.getElementById('btn-theme-auto');
    const btnThemeLight = document.getElementById('btn-theme-light');
    const btnThemeDark = document.getElementById('btn-theme-dark');
    const timeSlider = document.getElementById('acc-time-slider');
    const simValDisplay = document.getElementById('acc-sim-val');

    // Extra Accessibility Aids
    const btnReadAloud = document.getElementById('btn-read-aloud');
    const readAloudText = document.getElementById('read-aloud-text');
    const btnUnderlineLinks = document.getElementById('btn-underline-links');
    const btnCursorLarge = document.getElementById('btn-cursor-large');
    const btnResetAll = document.getElementById('btn-reset-all');

    // Form Elements
    const form = document.getElementById('konserForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = submitBtn.querySelector('.btn-text');
    const submitBtnSpinner = submitBtn.querySelector('.btn-spinner');
    const submitFeedbackBadge = document.getElementById('submit-feedback-badge');
    const formNotification = document.getElementById('form-notification');
    const registrationsList = document.getElementById('registrations-list');
    const registrationsStatus = document.getElementById('registrations-status');
    const refreshRegistrationsBtn = document.getElementById('refresh-registrations');

    // State Variables
    let currentFontScale = 1.0;
    let themeMode = 'auto'; // 'auto', 'light', 'dark'
    let selectedTimezone = 'Asia/Jakarta';
    let simulatedHour = -1; // -1: real time, 0-23: simulated hour
    let isSpeaking = false;

    // Helper: Announce ke Screen Reader
    function announce(message) {
        if (announcer) {
            announcer.textContent = message;
        }
    }

    // --------------------------------------------------------------------------
    // 2. LOGIKA UKURAN FONT (BESAR / KECIL / RESET)
    // --------------------------------------------------------------------------
    function setFontScale(scale) {
        currentFontScale = Math.min(Math.max(scale, 0.8), 1.5); // Range 80% s/d 150%
        root.style.setProperty('--font-scale', currentFontScale);
        const percent = Math.round(currentFontScale * 100);
        fontSizeIndicator.textContent = `${percent}%`;

        // Update active state visual
        if (percent === 100) {
            btnFontReset.classList.add('acc-btn-active');
        } else {
            btnFontReset.classList.remove('acc-btn-active');
        }

        announce(`Ukuran teks diubah menjadi ${percent} persen`);
        localStorage.setItem('acc_font_scale', currentFontScale);
    }

    btnFontInc.addEventListener('click', () => setFontScale(currentFontScale + 0.1));
    btnFontDec.addEventListener('click', () => setFontScale(currentFontScale - 0.1));
    btnFontReset.addEventListener('click', () => setFontScale(1.0));

    // --------------------------------------------------------------------------
    // 3. LOGIKA WARNA & KONTRAS (KEMKES STYLE)
    // --------------------------------------------------------------------------
    function resetContrastModes() {
        root.removeAttribute('data-contrast-mode');
        root.classList.remove('filter-grayscale', 'filter-invert');
        btnHighContrast.classList.remove('acc-btn-active');
        btnGrayscale.classList.remove('acc-btn-active');
        btnInvert.classList.remove('acc-btn-active');
        btnSepia.classList.remove('acc-btn-active');
    }

    // Kontras Tinggi
    btnHighContrast.addEventListener('click', () => {
        const isActive = root.getAttribute('data-contrast-mode') === 'high-contrast';
        resetContrastModes();
        if (!isActive) {
            root.setAttribute('data-contrast-mode', 'high-contrast');
            btnHighContrast.classList.add('acc-btn-active');
            announce('Mode kontras tinggi aktif');
        } else {
            announce('Mode kontras tinggi dinonaktifkan');
        }
    });

    // Grayscale (Monokrom)
    btnGrayscale.addEventListener('click', () => {
        const isActive = root.classList.contains('filter-grayscale');
        root.classList.remove('filter-invert');
        btnInvert.classList.remove('acc-btn-active');

        if (!isActive) {
            root.classList.add('filter-grayscale');
            btnGrayscale.classList.add('acc-btn-active');
            announce('Mode monokrom aktif');
        } else {
            root.classList.remove('filter-grayscale');
            btnGrayscale.classList.remove('acc-btn-active');
            announce('Mode monokrom dinonaktifkan');
        }
    });

    // Invert Colors (Balik Warna)
    btnInvert.addEventListener('click', () => {
        const isActive = root.classList.contains('filter-invert');
        root.classList.remove('filter-grayscale');
        btnGrayscale.classList.remove('acc-btn-active');

        if (!isActive) {
            root.classList.add('filter-invert');
            btnInvert.classList.add('acc-btn-active');
            announce('Mode balik warna aktif');
        } else {
            root.classList.remove('filter-invert');
            btnInvert.classList.remove('acc-btn-active');
            announce('Mode balik warna dinonaktifkan');
        }
    });

    // Mode Ramah Mata (Sepia)
    btnSepia.addEventListener('click', () => {
        const isActive = root.getAttribute('data-contrast-mode') === 'sepia';
        resetContrastModes();
        if (!isActive) {
            root.setAttribute('data-contrast-mode', 'sepia');
            btnSepia.classList.add('acc-btn-active');
            announce('Mode ramah mata sepia aktif');
        } else {
            announce('Mode ramah mata dinonaktifkan');
        }
    });

    // --------------------------------------------------------------------------
    // 4. DARK MODE / LIGHT MODE OTOMATIS BERDASARKAN WAKTU & ZONA WAKTU
    // --------------------------------------------------------------------------
    /**
     * Mendapatkan jam dan menit saat ini pada zona waktu yang dipilih
     * Format jam 0-23
     */
    function getTimeInTimezone(tz) {
        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('id-ID', {
                timeZone: tz,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(now);
            const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
            const minute = parts.find(p => p.type === 'minute').value;
            const second = parts.find(p => p.type === 'second').value;
            return { hour, minute, second, formatted: `${String(hour).padStart(2, '0')}:${minute}:${second}` };
        } catch (e) {
            const now = new Date();
            return { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds(), formatted: now.toLocaleTimeString() };
        }
    }

    /**
     * Memperbarui tema (Gelap atau Terang) berdasarkan waktu dan setelan pengguna
     */
    function updateThemeByTime() {
        const timeData = getTimeInTimezone(selectedTimezone);
        let effectiveHour = (simulatedHour >= 0) ? simulatedHour : timeData.hour;

        // Tampilkan jam aktif di widget
        if (simulatedHour >= 0) {
            currentTimeDisplay.textContent = `${String(simulatedHour).padStart(2, '0')}:00 (Simulasi)`;
        } else {
            currentTimeDisplay.textContent = `${timeData.formatted}`;
        }

        // Aturan waktu:
        // Siang hari : 06.00 s/d 17.59 -> Light Mode
        // Malam hari : 18.00 s/d 05.59 -> Dark Mode
        const isDayTime = effectiveHour >= 6 && effectiveHour < 18;

        if (themeMode === 'auto') {
            if (isDayTime) {
                root.setAttribute('data-color-theme', 'light');
                themeStatusTag.textContent = `☀️ Siang (06-18) → Mode Terang`;
                themeStatusTag.style.backgroundColor = '#0284c7';
            } else {
                root.setAttribute('data-color-theme', 'dark');
                themeStatusTag.textContent = `🌙 Malam (18-06) → Mode Gelap`;
                themeStatusTag.style.backgroundColor = '#4f46e5';
            }
        } else if (themeMode === 'light') {
            root.setAttribute('data-color-theme', 'light');
            themeStatusTag.textContent = `☀️ Mode Terang (Manual)`;
            themeStatusTag.style.backgroundColor = '#0284c7';
        } else if (themeMode === 'dark') {
            root.setAttribute('data-color-theme', 'dark');
            themeStatusTag.textContent = `🌙 Mode Gelap (Manual)`;
            themeStatusTag.style.backgroundColor = '#4f46e5';
        }
    }

    // Interval jam real-time setiap 1 detik
    setInterval(() => {
        if (simulatedHour === -1) {
            updateThemeByTime();
        }
    }, 1000);

    // Event Listener Ganti Zona Waktu
    timezoneSelect.addEventListener('change', (e) => {
        selectedTimezone = e.target.value;
        root.setAttribute('data-timezone', selectedTimezone);
        updateThemeByTime();
        announce(`Zona waktu diubah ke ${selectedTimezone}`);
    });

    // Mode Buttons: Auto / Light / Dark
    btnThemeAuto.addEventListener('click', () => {
        themeMode = 'auto';
        btnThemeAuto.classList.add('acc-btn-active');
        btnThemeLight.classList.remove('acc-btn-active');
        btnThemeDark.classList.remove('acc-btn-active');
        updateThemeByTime();
        announce('Mode tema diatur otomatis mengikuti waktu siang dan malam');
    });

    btnThemeLight.addEventListener('click', () => {
        themeMode = 'light';
        btnThemeLight.classList.add('acc-btn-active');
        btnThemeAuto.classList.remove('acc-btn-active');
        btnThemeDark.classList.remove('acc-btn-active');
        updateThemeByTime();
        announce('Mode terang manual diaktifkan');
    });

    btnThemeDark.addEventListener('click', () => {
        themeMode = 'dark';
        btnThemeDark.classList.add('acc-btn-active');
        btnThemeAuto.classList.remove('acc-btn-active');
        btnThemeLight.classList.remove('acc-btn-active');
        updateThemeByTime();
        announce('Mode gelap manual diaktifkan');
    });

    // Slider Simulasi Waktu
    timeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        simulatedHour = val;
        if (val === -1) {
            simValDisplay.textContent = 'Waktu Riil';
        } else {
            const period = (val >= 6 && val < 18) ? 'Siang' : 'Malam';
            simValDisplay.textContent = `Jam ${String(val).padStart(2, '0')}:00 (${period})`;
        }
        updateThemeByTime();
    });

    // --------------------------------------------------------------------------
    // 5. FITUR BANTUAN AKSESIBILITAS LAINNYA
    // --------------------------------------------------------------------------
    // Garis bawahi tautan
    btnUnderlineLinks.addEventListener('click', () => {
        root.classList.toggle('underline-links');
        const isActive = root.classList.contains('underline-links');
        btnUnderlineLinks.classList.toggle('acc-btn-active', isActive);
        announce(isActive ? 'Garis bawah tautan aktif' : 'Garis bawah tautan nonaktif');
    });

    // Kursor Besar
    btnCursorLarge.addEventListener('click', () => {
        root.classList.toggle('cursor-large');
        const isActive = root.classList.contains('cursor-large');
        btnCursorLarge.classList.toggle('acc-btn-active', isActive);
        announce(isActive ? 'Kursor besar aktif' : 'Kursor normal aktif');
    });

    // Text to Speech (Bacakan Halaman)
    btnReadAloud.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) {
            alert('Browser Anda tidak mendukung fitur Speech Synthesis / Pembaca Suara.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            readAloudText.textContent = 'Bacakan Form (TTS)';
            btnReadAloud.classList.remove('acc-btn-active');
            announce('Pembacaan suara dihentikan');
            return;
        }

        const textToRead = "Pendaftaran Konser. Selamat datang! Silakan lengkapi formulir pendaftaran konser. " +
            "Bagian satu: Data Peserta meliputi nama lengkap, email, nomor handphone, dan alamat. " +
            "Bagian dua: Pilihan Tiket meliputi jenis tiket Regular, VIP, atau VVIP, jumlah tiket, tanggal konser, dan metode pembayaran transfer, e-wallet, atau cash. " +
            "Bagian tiga: Catatan Tambahan. Terakhir, klik tombol Daftar Sekarang.";

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;

        utterance.onstart = () => {
            isSpeaking = true;
            readAloudText.textContent = 'Hentikan Suara';
            btnReadAloud.classList.add('acc-btn-active');
            announce('Sedang membacakan konten formulir');
        };

        utterance.onend = () => {
            isSpeaking = false;
            readAloudText.textContent = 'Bacakan Form (TTS)';
            btnReadAloud.classList.remove('acc-btn-active');
        };

        utterance.onerror = () => {
            isSpeaking = false;
            readAloudText.textContent = 'Bacakan Form (TTS)';
            btnReadAloud.classList.remove('acc-btn-active');
        };

        window.speechSynthesis.speak(utterance);
    });

    // Reset Semua Pengaturan
    btnResetAll.addEventListener('click', () => {
        setFontScale(1.0);
        resetContrastModes();
        root.classList.remove('underline-links', 'cursor-large');
        btnUnderlineLinks.classList.remove('acc-btn-active');
        btnCursorLarge.classList.remove('acc-btn-active');

        themeMode = 'auto';
        btnThemeAuto.classList.add('acc-btn-active');
        btnThemeLight.classList.remove('acc-btn-active');
        btnThemeDark.classList.remove('acc-btn-active');

        timeSlider.value = -1;
        simulatedHour = -1;
        simValDisplay.textContent = 'Waktu Riil';

        timezoneSelect.value = 'Asia/Jakarta';
        selectedTimezone = 'Asia/Jakarta';
        root.setAttribute('data-timezone', selectedTimezone);

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            readAloudText.textContent = 'Bacakan Form (TTS)';
            btnReadAloud.classList.remove('acc-btn-active');
        }

        updateThemeByTime();
        localStorage.clear();
        announce('Semua pengaturan aksesibilitas telah dikembalikan ke kondisi awal');
    });

    // --------------------------------------------------------------------------
    // 6. KONTROL MODAL WIDGET AKSESIBILITAS (BUKA / TUTUP & KEYBOARD)
    // --------------------------------------------------------------------------
    function openAccessibilityPanel() {
        accPanel.removeAttribute('hidden');
        accBackdrop.removeAttribute('hidden');
        accToggleBtn.setAttribute('aria-expanded', 'true');
        btnFontReset.focus();
        announce('Menu aksesibilitas terbuka. Tekan Escape untuk menutup.');
    }

    function closeAccessibilityPanel() {
        accPanel.setAttribute('hidden', '');
        accBackdrop.setAttribute('hidden', '');
        accToggleBtn.setAttribute('aria-expanded', 'false');
        accToggleBtn.focus();
        announce('Menu aksesibilitas ditutup');
    }

    accToggleBtn.addEventListener('click', openAccessibilityPanel);
    accCloseBtn.addEventListener('click', closeAccessibilityPanel);
    accBackdrop.addEventListener('click', closeAccessibilityPanel);

    // Keyboard Accessibility: Escape key & Alt+A shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !accPanel.hasAttribute('hidden')) {
            closeAccessibilityPanel();
        }
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            if (accPanel.hasAttribute('hidden')) {
                openAccessibilityPanel();
            } else {
                closeAccessibilityPanel();
            }
        }
    });

    // --------------------------------------------------------------------------
    // 7. INTERAKSI TOMBOL SUBMIT (BERUBAH WARNA & FEEDBACK INTERAKTIF)
    // --------------------------------------------------------------------------
    async function loadRegistrations() {
        registrationsStatus.textContent = 'Memuat data pendaftar...';
        refreshRegistrationsBtn.disabled = true;

        try {
            const response = await fetch('api.php', {
                headers: { Accept: 'application/json' }
            });
            const result = await response.json();

            if (!response.ok || result.success !== true || !Array.isArray(result.data)) {
                throw new Error(result.message || 'Data pendaftar tidak dapat dimuat.');
            }

            registrationsList.replaceChildren();
            result.data.forEach((registration) => {
                const item = document.createElement('li');
                const heading = document.createElement('strong');
                const details = document.createElement('span');

                heading.textContent = registration.nama;
                details.textContent = `${registration.jumlah} tiket ${registration.jenis_tiket} · ${registration.tanggal} · ${registration.email}`;
                item.append(heading, details);
                registrationsList.append(item);
            });

            registrationsStatus.textContent = result.data.length
                ? `${result.data.length} data pendaftar ditampilkan.`
                : 'Belum ada data pendaftar.';
        } catch (error) {
            registrationsStatus.textContent = error.message || 'Gagal memuat data pendaftar.';
        } finally {
            refreshRegistrationsBtn.disabled = false;
        }
    }

    refreshRegistrationsBtn.addEventListener('click', loadRegistrations);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ambil elemen input
        const namaInput = document.getElementById('nama');
        const emailInput = document.getElementById('email');
        const hpInput = document.getElementById('hp');
        const tiketSelect = document.getElementById('jenis_tiket');
        const jumlahInput = document.getElementById('jumlah');
        const tanggalInput = document.getElementById('tanggal');
        const pembayaranInput = form.querySelector('input[name="pembayaran"]:checked');
        const alamatInput = document.getElementById('alamat');
        const catatanInput = document.getElementById('catatan');

        // Reset error messages
        document.getElementById('error-nama').textContent = '';
        document.getElementById('error-email').textContent = '';
        document.getElementById('error-hp').textContent = '';

        let isValid = true;

        if (!namaInput.value.trim()) {
            document.getElementById('error-nama').textContent = 'Nama lengkap wajib diisi.';
            isValid = false;
        }
        if (!emailInput.value.trim() || !emailInput.validity.valid) {
            document.getElementById('error-email').textContent = 'Masukkan alamat email yang valid.';
            isValid = false;
        }
        if (!hpInput.value.trim() || !/^[0-9+()\-\s]{8,20}$/.test(hpInput.value.trim())) {
            document.getElementById('error-hp').textContent = 'Masukkan nomor handphone yang valid.';
            isValid = false;
        }
        if (!tiketSelect.value || !jumlahInput.validity.valid || !tanggalInput.value || !pembayaranInput) {
            isValid = false;
        }

        // ======================================================================
        // PERUBAHAN WARNA STATE 1: JIKA TIDAK VALID (WARNA MERAH ERROR)
        // ======================================================================
        if (!isValid) {
            submitBtn.className = 'btn-submit state-error';
            submitBtnText.textContent = '❌ Mohon Lengkapi Data';
            submitFeedbackBadge.textContent = 'Lengkapi semua kolom wajib dan periksa kembali nilainya.';
            submitFeedbackBadge.style.color = '#ef4444';
            announce('Formulir tidak lengkap. Mohon periksa kembali kolom isian Anda.');

            setTimeout(() => {
                submitBtn.className = 'btn-submit';
                submitBtnText.textContent = 'Daftar Sekarang';
                submitFeedbackBadge.textContent = '';
            }, 2500);
            return;
        }

        // ======================================================================
        // PERUBAHAN WARNA STATE 2: SAAT DIKLIK & MEMPROSES (WARNA ORANYE AMBER)
        // ======================================================================
        submitBtn.className = 'btn-submit state-loading';
        submitBtnSpinner.removeAttribute('hidden');
        submitBtnText.textContent = 'Memproses Pendaftaran...';
        submitFeedbackBadge.textContent = 'Sedang memvalidasi dan mengirimkan data...';
        submitFeedbackBadge.style.color = '#f59e0b';
        submitBtn.disabled = true;
        announce('Sedang memproses pendaftaran...');

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    nama: namaInput.value.trim(),
                    email: emailInput.value.trim(),
                    hp: hpInput.value.trim(),
                    alamat: alamatInput.value.trim(),
                    jenis_tiket: tiketSelect.value,
                    jumlah: Number(jumlahInput.value),
                    tanggal: tanggalInput.value,
                    pembayaran: pembayaranInput.value,
                    catatan: catatanInput.value.trim()
                })
            });
            const result = await response.json();

            if (!response.ok || result.success !== true) {
                throw new Error(result.message || 'Pendaftaran gagal disimpan.');
            }

            submitBtnSpinner.setAttribute('hidden', '');
            submitBtn.className = 'btn-submit state-success';
            submitBtnText.textContent = '✓ Pendaftaran Berhasil!';
            submitFeedbackBadge.textContent = 'Data pendaftaran berhasil disimpan ke database.';
            submitFeedbackBadge.style.color = '#10b981';

            const nama = namaInput.value.trim();
            const jenisTiket = tiketSelect.value;
            const jumlah = jumlahInput.value;
            const tanggal = tanggalInput.value;
            const pembayaran = pembayaranInput.value.toUpperCase();

            formNotification.className = 'notification-box success';
            formNotification.textContent = `Konfirmasi berhasil! Terima kasih ${nama}. Anda terdaftar untuk ${jumlah} tiket (${jenisTiket}) pada ${tanggal}. Metode pembayaran: ${pembayaran}.`;
            formNotification.removeAttribute('hidden');
            formNotification.scrollIntoView({ behavior: 'smooth', block: 'start' });

            announce(`Pendaftaran berhasil! Terima kasih ${nama}, Anda mendaftar ${jumlah} tiket ${jenisTiket}.`);
            await loadRegistrations();

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.className = 'btn-submit';
                submitBtnText.textContent = 'Daftar Sekarang';
                submitFeedbackBadge.textContent = '';
            }, 4000);
        } catch (error) {
            submitBtnSpinner.setAttribute('hidden', '');
            submitBtn.className = 'btn-submit state-error';
            submitBtnText.textContent = '❌ Gagal Menyimpan';
            submitFeedbackBadge.textContent = error.message || 'Terjadi kesalahan saat menghubungi server.';
            submitFeedbackBadge.style.color = '#ef4444';
            formNotification.className = 'notification-box error';
            formNotification.textContent = error.message || 'Pendaftaran gagal disimpan.';
            formNotification.removeAttribute('hidden');
            announce('Pendaftaran gagal disimpan. Periksa koneksi PHP dan database.');
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.className = 'btn-submit';
                submitBtnText.textContent = 'Daftar Sekarang';
            }, 3000);
        }
    });

    // --------------------------------------------------------------------------
    // 8. INISIALISASI AWAL
    // --------------------------------------------------------------------------
    // Muat font scale tersimpan jika ada
    const savedFontScale = localStorage.getItem('acc_font_scale');
    if (savedFontScale) {
        setFontScale(parseFloat(savedFontScale));
    }
    // Set tema awal berdasarkan waktu
    updateThemeByTime();
    loadRegistrations();
});

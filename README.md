# Pendaftaran Konser dengan PHP dan MySQL

## Menjalankan di XAMPP

1. Letakkan folder proyek di `C:\xampp\htdocs\web`.
2. Jalankan **Apache** dan **MySQL** dari XAMPP Control Panel.
3. Jika mulai dari nol, buka phpMyAdmin, pilih tab **Import**, lalu impor `database.sql`. File tersebut membuat database `konser_db` dan tabel `pendaftaran_konser`. Alternatifnya, buka tab **SQL** dan jalankan isi file tersebut.
4. Jika Anda sudah memiliki database, pilih database itu terlebih dahulu dan impor bagian pembuatan tabel dari `database.sql`; kemudian atur nama database tersebut pada `config.php` atau variabel lingkungan `DB_NAME`.
5. Nilai awal konfigurasi memakai database `konser_db` dan pengguna `root` tanpa password yang umum pada XAMPP. Sesuaikan `user` dan `password` di `config.php` bila perlu. Jangan bagikan kredensial database.
6. Buka halaman melalui `http://localhost/web/form.html` (jangan buka file HTML langsung dari `file://`).

## API

- `GET /web/api.php` mengambil maksimal 100 data pendaftar.
- `POST /web/api.php` menyimpan pendaftaran dalam JSON dengan properti `nama`, `email`, `hp`, `alamat`, `jenis_tiket`, `jumlah`, `tanggal`, `pembayaran`, dan `catatan`.

Halaman menggunakan endpoint yang sama untuk mengirim formulir dan memuat daftar pendaftar. API memvalidasi data di server dan menggunakan prepared statement untuk penyimpanan.

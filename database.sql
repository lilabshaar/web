CREATE DATABASE IF NOT EXISTS konser_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE konser_db;

CREATE TABLE IF NOT EXISTS pendaftaran_konser (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    hp VARCHAR(20) NOT NULL,
    alamat TEXT NULL,
    jenis_tiket ENUM('Regular', 'VIP', 'VVIP') NOT NULL,
    jumlah TINYINT UNSIGNED NOT NULL,
    tanggal DATE NOT NULL,
    pembayaran ENUM('transfer', 'e-wallet', 'cash') NOT NULL,
    catatan TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

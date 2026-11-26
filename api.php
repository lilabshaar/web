<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode(
        $body,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

function request_data(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    if (!is_array($data)) {
        respond(400, ['success' => false, 'message' => 'Format data JSON tidak valid.']);
    }

    return $data;
}

try {
    $config = require __DIR__ . '/config.php';
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $config['table'])) {
        throw new RuntimeException('Nama tabel pada konfigurasi tidak valid.');
    }
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['host'],
        $config['name']
    );
    $pdo = new PDO($dsn, $config['user'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $table = '`' . $config['table'] . '`';
    $columns = 'nama, email, hp, alamat, jenis_tiket, jumlah, tanggal, pembayaran, catatan';

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $statement = $pdo->query("SELECT {$columns} FROM {$table} LIMIT 100");
        respond(200, ['success' => true, 'data' => $statement->fetchAll()]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: GET, POST');
        respond(405, ['success' => false, 'message' => 'Metode request tidak didukung.']);
    }

    $data = request_data();
    $allowedTickets = ['Regular', 'VIP', 'VVIP'];
    $allowedPayments = ['transfer', 'e-wallet', 'cash'];
    $nama = is_string($data['nama'] ?? null) ? trim($data['nama']) : '';
    $email = is_string($data['email'] ?? null) ? trim($data['email']) : '';
    $hp = is_string($data['hp'] ?? null) ? trim($data['hp']) : '';
    $jenisTiket = (string) ($data['jenis_tiket'] ?? '');
    $jumlah = filter_var($data['jumlah'] ?? null, FILTER_VALIDATE_INT);
    $tanggal = (string) ($data['tanggal'] ?? '');
    $pembayaran = (string) ($data['pembayaran'] ?? '');

    if ($nama === '' || mb_strlen($nama) > 150) {
        respond(422, ['success' => false, 'message' => 'Nama wajib diisi dan maksimal 150 karakter.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        respond(422, ['success' => false, 'message' => 'Alamat email tidak valid.']);
    }
    if (!preg_match('/^[0-9+()\-\s]{8,20}$/', $hp)) {
        respond(422, ['success' => false, 'message' => 'Nomor handphone tidak valid.']);
    }
    if (!in_array($jenisTiket, $allowedTickets, true) || $jumlah === false || $jumlah < 1 || $jumlah > 10) {
        respond(422, ['success' => false, 'message' => 'Pilihan tiket atau jumlah tiket tidak valid.']);
    }
    $date = DateTime::createFromFormat('!Y-m-d', $tanggal);
    if (!$date || $date->format('Y-m-d') !== $tanggal) {
        respond(422, ['success' => false, 'message' => 'Tanggal konser tidak valid.']);
    }
    if (!in_array($pembayaran, $allowedPayments, true)) {
        respond(422, ['success' => false, 'message' => 'Metode pembayaran tidak valid.']);
    }

    $statement = $pdo->prepare(
        "INSERT INTO {$table} ({$columns}) VALUES (:nama, :email, :hp, :alamat, :jenis_tiket, :jumlah, :tanggal, :pembayaran, :catatan)"
    );
    $statement->execute([
        ':nama' => $nama,
        ':email' => $email,
        ':hp' => $hp,
        ':alamat' => is_string($data['alamat'] ?? null) ? trim($data['alamat']) : '',
        ':jenis_tiket' => $jenisTiket,
        ':jumlah' => $jumlah,
        ':tanggal' => $tanggal,
        ':pembayaran' => $pembayaran,
        ':catatan' => is_string($data['catatan'] ?? null) ? trim($data['catatan']) : '',
    ]);

    respond(201, ['success' => true, 'message' => 'Pendaftaran berhasil disimpan.']);
} catch (PDOException $error) {
    error_log($error->__toString());
    respond(500, [
        'success' => false,
        'message' => 'Koneksi database gagal atau struktur tabel tidak sesuai. Periksa konfigurasi dan kolom tabel.',
    ]);
} catch (RuntimeException $error) {
    error_log($error->__toString());
    respond(500, ['success' => false, 'message' => $error->getMessage()]);
}

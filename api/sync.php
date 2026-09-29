<?php
// Sincronización entre dispositivos. El progreso llega cifrado desde el navegador con una clave
// derivada del código de sincronización: el servidor no conoce el código ni puede leer los datos.
declare(strict_types=1);

require __DIR__ . '/db.php';

const MAX_DATA_BYTES = 600 * 1024;
const MAX_MISSES_PER_HOUR = 30; // códigos inexistentes por IP y hora (frena a quien intente adivinar)

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('Content-Type: application/json; charset=utf-8');

function reply(int $code, array $data = []): void
{
    http_response_code($code);
    echo json_encode($data ?: ['ok' => $code < 300]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405, ['error' => 'method']);

$raw = file_get_contents('php://input', false, null, 0, MAX_DATA_BYTES + 4096);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) reply(400, ['error' => 'json']);

$id = (string)($in['id'] ?? '');
if (!preg_match('/^[a-f0-9]{64}$/', $id)) reply(400, ['error' => 'id']);

try {
    $pdo = db();
    $client = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|lectura-sync');
    $hour = date('Y-m-d H');

    $st = $pdo->prepare('SELECT data, version, updated FROM sync_spaces WHERE id = ?');
    $st->execute([$id]);
    $row = $st->fetch();

    switch ((string)($in['action'] ?? '')) {
        case 'pull':
            $misses = $pdo->prepare('SELECT misses FROM sync_misses WHERE client = ? AND hour = ?');
            $misses->execute([$client, $hour]);
            if ((int)$misses->fetchColumn() >= MAX_MISSES_PER_HOUR) reply(429, ['error' => 'wait']);
            if (!$row) {
                $pdo->prepare('INSERT INTO sync_misses (client, hour, misses) VALUES (?, ?, 1)
                               ON CONFLICT(client, hour) DO UPDATE SET misses = misses + 1')->execute([$client, $hour]);
                $pdo->prepare('DELETE FROM sync_misses WHERE hour < ?')->execute([date('Y-m-d H', strtotime('-1 day'))]);
                reply(404, ['error' => 'not_found']);
            }
            reply(200, ['version' => (int)$row['version'], 'data' => $row['data'], 'updated' => $row['updated']]);

        case 'push':
            $data = (string)($in['data'] ?? '');
            $base = (int)($in['baseVersion'] ?? -1);
            if ($data === '' || strlen($data) > MAX_DATA_BYTES || !preg_match('/^[A-Za-z0-9+\/=]+$/', $data)) reply(400, ['error' => 'data']);
            $now = date('Y-m-d H:i:s');
            if (!$row) {
                if ($base !== 0) reply(409, ['version' => 0]);
                $pdo->prepare('INSERT INTO sync_spaces (id, data, version, created, updated) VALUES (?, ?, 1, ?, ?)')->execute([$id, $data, $now, $now]);
                reply(200, ['version' => 1]);
            }
            // Solo se guarda si nadie lo cambió desde la última lectura; si no, el cliente vuelve a fusionar.
            $up = $pdo->prepare('UPDATE sync_spaces SET data = ?, version = version + 1, updated = ? WHERE id = ? AND version = ?');
            $up->execute([$data, $now, $id, $base]);
            if ($up->rowCount() === 0) reply(409, ['version' => (int)$row['version']]);
            reply(200, ['version' => $base + 1]);

        case 'delete':
            $pdo->prepare('DELETE FROM sync_spaces WHERE id = ?')->execute([$id]);
            reply(200);
    }
    reply(400, ['error' => 'action']);
} catch (Throwable $e) {
    error_log('sync.php: ' . $e->getMessage());
    reply(500, ['error' => 'server']);
}

<?php
// Suscripciones al recordatorio diario (Web Push).
declare(strict_types=1);

require __DIR__ . '/webpush.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('Content-Type: application/json; charset=utf-8');

function reply(int $code, array $data = []): void
{
    http_response_code($code);
    echo json_encode($data ?: ['ok' => $code < 300]);
    exit;
}

function valid_time(string $t): bool
{
    return (bool)preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $t);
}

function valid_tz(string $tz): bool
{
    return in_array($tz, timezone_identifiers_list(), true);
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && ($_GET['action'] ?? '') === 'key') {
        reply(200, ['publicKey' => vapid_keys()['publicKey']]);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        reply(405, ['error' => 'method']);
    }

    $in = json_decode((string)file_get_contents('php://input', false, null, 0, 8192), true);
    if (!is_array($in)) reply(400, ['error' => 'json']);

    $action = (string)($in['action'] ?? '');
    $pdo = db();
    $today = date('Y-m-d');

    if ($action === 'click') {
        push_log($today, 'clicked');
        reply(200);
    }

    // El resto de acciones identifican la suscripción por su endpoint.
    $sub = is_array($in['subscription'] ?? null) ? $in['subscription'] : [];
    $endpoint = (string)($sub['endpoint'] ?? $in['endpoint'] ?? '');
    if (!is_valid_push_endpoint($endpoint)) reply(400, ['error' => 'endpoint']);

    switch ($action) {
        case 'subscribe':
        case 'resubscribe':
            $p256dh = (string)($sub['keys']['p256dh'] ?? '');
            $auth = (string)($sub['keys']['auth'] ?? '');
            if (strlen(b64url_decode($p256dh)) !== 65 || strlen(b64url_decode($auth)) !== 16) reply(400, ['error' => 'keys']);
            $time = (string)($in['time'] ?? '08:00');
            $tz = (string)($in['tz'] ?? 'Europe/Madrid');
            $device = preg_match('/^[a-z0-9-]{16,40}$/i', (string)($in['device'] ?? '')) ? (string)$in['device'] : null;
            if (!valid_time($time)) $time = '08:00';
            if (!valid_tz($tz)) $tz = 'Europe/Madrid';

            $eveningEnabled = !isset($in['eveningEnabled']) || !empty($in['eveningEnabled']) ? 1 : 0;
            $eveningTime = (string)($in['eveningTime'] ?? '21:00');
            if (!valid_time($eveningTime)) $eveningTime = '21:00';

            if ($action === 'resubscribe' && !empty($in['oldEndpoint'])) {
                $old = $pdo->prepare('SELECT remind_time, timezone, evening_enabled, evening_time FROM push_subscriptions WHERE endpoint = ?');
                $old->execute([(string)$in['oldEndpoint']]);
                if ($row = $old->fetch()) {
                    $time = $row['remind_time']; $tz = $row['timezone'];
                    $eveningEnabled = (int)$row['evening_enabled']; $eveningTime = $row['evening_time'];
                }
                $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')->execute([(string)$in['oldEndpoint']]);
            }

            $pdo->prepare('
                INSERT INTO push_subscriptions (endpoint, p256dh, auth, device_id, remind_time, timezone, created, evening_enabled, evening_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth,
                    device_id = COALESCE(excluded.device_id, push_subscriptions.device_id),
                    remind_time = excluded.remind_time, timezone = excluded.timezone,
                    evening_enabled = excluded.evening_enabled, evening_time = excluded.evening_time, failures = 0
            ')->execute([$endpoint, $p256dh, $auth, $device, $time, $tz, date('Y-m-d H:i:s'), $eveningEnabled, $eveningTime]);
            reply(200);

        case 'evening':
            // Aviso de racha por la noche: activarlo/desactivarlo y su hora.
            $time = (string)($in['time'] ?? '');
            if (!valid_time($time)) reply(400, ['error' => 'time']);
            $st = $pdo->prepare('UPDATE push_subscriptions SET evening_enabled = ?, evening_time = ? WHERE endpoint = ?');
            $st->execute([!empty($in['enabled']) ? 1 : 0, $time, $endpoint]);
            reply($st->rowCount() ? 200 : 404);

        case 'status':
            // Racha actual y si hoy ya se marcó alguna lectura (para el aviso de la noche).
            $date = (string)($in['date'] ?? '');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) reply(400, ['error' => 'date']);
            $streak = max(0, min(100000, (int)($in['streak'] ?? 0)));
            // Último día con lectura: hoy, ayer (racha viva pero pendiente hoy) o ninguno (sin racha).
            $lastRead = !empty($in['readToday']) ? $date
                : ($streak > 0 ? date('Y-m-d', strtotime($date . ' -1 day')) : null);
            $st = $pdo->prepare('UPDATE push_subscriptions SET streak = ?, last_read_date = ? WHERE endpoint = ?');
            $st->execute([$streak, $lastRead, $endpoint]);
            reply($st->rowCount() ? 200 : 404);

        case 'update':
            $time = (string)($in['time'] ?? '');
            $tz = (string)($in['tz'] ?? '');
            if (!valid_time($time) || !valid_tz($tz)) reply(400, ['error' => 'time']);
            $st = $pdo->prepare('UPDATE push_subscriptions SET remind_time = ?, timezone = ? WHERE endpoint = ?');
            $st->execute([$time, $tz, $endpoint]);
            reply($st->rowCount() ? 200 : 404);

        case 'unsubscribe':
            $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')->execute([$endpoint]);
            reply(200);

        case 'done':
            // La lectura de hoy ya está hecha: no hace falta recordarla.
            $date = (string)($in['date'] ?? '');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) reply(400, ['error' => 'date']);
            $pdo->prepare('UPDATE push_subscriptions SET last_done_date = ? WHERE endpoint = ?')->execute([$date, $endpoint]);
            reply(200);

        case 'test':
            $st = $pdo->prepare('SELECT * FROM push_subscriptions WHERE endpoint = ?');
            $st->execute([$endpoint]);
            $row = $st->fetch();
            if (!$row) reply(404, ['error' => 'not_found']);
            if ($row['last_test'] && time() - strtotime($row['last_test']) < 30) reply(429, ['error' => 'wait']);
            $pdo->prepare('UPDATE push_subscriptions SET last_test = ? WHERE endpoint = ?')->execute([date('Y-m-d H:i:s'), $endpoint]);
            $code = webpush_send($row, ['title' => '🔔 Recordatorio activado', 'body' => 'Así te avisaremos cada día de tu lectura bíblica.', 'test' => true], 600);
            reply($code >= 200 && $code < 300 ? 200 : 502, ['pushStatus' => $code]);
    }

    reply(400, ['error' => 'action']);
} catch (Throwable $e) {
    error_log('push.php: ' . $e->getMessage());
    reply(500, ['error' => 'server']);
}

<?php
// Envía los recordatorios diarios y el aviso de racha por la noche. Ejecutar cada 5-15 minutos:
//   - Cron de Hostinger:  php /home/USUARIO/domains/mylectura.mycongre.com/public_html/api/cron.php
//   - o por URL:          https://mylectura.mycongre.com/api/cron.php?token=... (ver panel de admin)
declare(strict_types=1);

require __DIR__ . '/webpush.php';

const SEND_WINDOW_MINUTES = 180; // si el cron se retrasa, aún se envía hasta 3 h después de la hora elegida
const EVENING_WINDOW_MINUTES = 120; // el aviso de la noche no se manda pasada la medianoche si el cron se retrasa mucho
const MAX_FAILURES = 5;

$isCli = PHP_SAPI === 'cli';
if (!$isCli) {
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    header('Content-Type: text/plain; charset=utf-8');
    if (!hash_equals(cron_state()['token'], (string)($_GET['token'] ?? ''))) {
        http_response_code(403);
        exit("Prohibido\n");
    }
}

// Evita dos ejecuciones a la vez.
$lock = fopen(DATA_DIR . '/cron.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    exit("Ya hay una ejecución en curso\n");
}

$pdo = db();

// Envía un aviso y anota el resultado. Devuelve false si la suscripción ya no existe.
function send_reminder(PDO $pdo, array &$sub, array $payload, string $dateColumn, string $localDay, array &$counts): bool
{
    try {
        $code = webpush_send($sub, $payload);
    } catch (Throwable $e) {
        error_log('cron.php: ' . $e->getMessage());
        $code = 0;
    }

    $today = date('Y-m-d');
    if ($code >= 200 && $code < 300) {
        $pdo->prepare("UPDATE push_subscriptions SET $dateColumn = ?, failures = 0 WHERE endpoint = ?")->execute([$localDay, $sub['endpoint']]);
        push_log($today, 'sent');
        $sub['failures'] = 0;
        $counts['sent']++;
        return true;
    }
    push_log($today, 'failed');
    if ($code === 404 || $code === 410 || $sub['failures'] + 1 >= MAX_FAILURES) {
        // Suscripción caducada (desinstaló la app, quitó el permiso…).
        $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')->execute([$sub['endpoint']]);
        $counts['removed']++;
        return false;
    }
    $pdo->prepare('UPDATE push_subscriptions SET failures = failures + 1 WHERE endpoint = ?')->execute([$sub['endpoint']]);
    $sub['failures']++;
    $counts['failed']++;
    return true;
}

// Minutos transcurridos desde la hora «HH:MM» (negativo si aún no ha llegado).
function minutes_since(DateTimeImmutable $now, string $time): int
{
    [$h, $m] = array_map('intval', explode(':', $time));
    return ((int)$now->format('H') * 60 + (int)$now->format('i')) - ($h * 60 + $m);
}

$counts = ['sent' => 0, 'failed' => 0, 'removed' => 0];
foreach ($pdo->query('SELECT * FROM push_subscriptions')->fetchAll() as $sub) {
    try {
        $now = new DateTimeImmutable('now', new DateTimeZone($sub['timezone']));
    } catch (Throwable) {
        $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Madrid'));
    }
    $localDay = $now->format('Y-m-d');
    $localYesterday = $now->modify('-1 day')->format('Y-m-d');

    // Recordatorio diario a la hora elegida.
    $late = minutes_since($now, $sub['remind_time']);
    if ($late >= 0 && $late <= SEND_WINDOW_MINUTES
        && $sub['last_sent_date'] !== $localDay && $sub['last_done_date'] !== $localDay) {
        if (!send_reminder($pdo, $sub, [
            'title' => '📖 Tu lectura de hoy',
            'body' => 'Dedica unos minutos a la lectura bíblica de hoy.',
        ], 'last_sent_date', $localDay, $counts)) continue;
    }

    // Aviso de racha por la noche: tenía racha hasta ayer y hoy aún no ha marcado nada.
    $late = minutes_since($now, $sub['evening_time']);
    $streak = (int)$sub['streak'];
    if ((int)$sub['evening_enabled'] === 1 && $late >= 0 && $late <= EVENING_WINDOW_MINUTES
        && $sub['last_evening_date'] !== $localDay
        && $sub['last_read_date'] === $localYesterday && $streak >= 1) {
        send_reminder($pdo, $sub, [
            'kind' => 'streak',
            'title' => $streak === 1 ? '🔥 No pierdas tu racha' : "🔥 No pierdas tu racha de $streak días",
            'body' => 'Aún estás a tiempo: dedica unos minutos a tu lectura de hoy 📖',
        ], 'last_evening_date', $localDay, $counts);
    }
}

// Códigos de sincronización sin usar en más de 400 días.
$pdo->prepare('DELETE FROM sync_spaces WHERE updated < ?')->execute([date('Y-m-d H:i:s', strtotime('-400 days'))]);

$result = "enviados={$counts['sent']} fallidos={$counts['failed']} eliminados={$counts['removed']}";
$state = cron_state();
$state['lastRun'] = date('Y-m-d H:i:s');
$state['lastResult'] = $result;
save_cron_state($state);

flock($lock, LOCK_UN);
echo $result, "\n";

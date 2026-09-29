<?php
// Envía los recordatorios diarios. Ejecutar cada 15 minutos:
//   - Cron de Hostinger:  php /home/USUARIO/domains/mylectura.mycongre.com/public_html/api/cron.php
//   - o por URL:          https://mylectura.mycongre.com/api/cron.php?token=... (ver panel de admin)
declare(strict_types=1);

require __DIR__ . '/webpush.php';

const SEND_WINDOW_MINUTES = 180; // si el cron se retrasa, aún se envía hasta 3 h después de la hora elegida
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
$sent = 0; $failed = 0; $removed = 0; $skipped = 0;

foreach ($pdo->query('SELECT * FROM push_subscriptions')->fetchAll() as $sub) {
    try {
        $now = new DateTimeImmutable('now', new DateTimeZone($sub['timezone']));
    } catch (Throwable) {
        $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Madrid'));
    }
    $localDay = $now->format('Y-m-d');
    [$h, $m] = array_map('intval', explode(':', $sub['remind_time']));
    $minutesLate = ((int)$now->format('H') * 60 + (int)$now->format('i')) - ($h * 60 + $m);

    if ($minutesLate < 0 || $minutesLate > SEND_WINDOW_MINUTES
        || $sub['last_sent_date'] === $localDay || $sub['last_done_date'] === $localDay) {
        $skipped++;
        continue;
    }

    try {
        $code = webpush_send($sub, [
            'title' => '📖 Tu lectura de hoy',
            'body' => 'Dedica unos minutos a la lectura bíblica de hoy.',
        ]);
    } catch (Throwable $e) {
        error_log('cron.php: ' . $e->getMessage());
        $code = 0;
    }

    $today = date('Y-m-d');
    if ($code >= 200 && $code < 300) {
        $pdo->prepare('UPDATE push_subscriptions SET last_sent_date = ?, failures = 0 WHERE endpoint = ?')->execute([$localDay, $sub['endpoint']]);
        push_log($today, 'sent');
        $sent++;
    } elseif ($code === 404 || $code === 410 || $sub['failures'] + 1 >= MAX_FAILURES) {
        // Suscripción caducada (desinstaló la app, quitó el permiso…).
        $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')->execute([$sub['endpoint']]);
        push_log($today, 'failed');
        $removed++;
    } else {
        $pdo->prepare('UPDATE push_subscriptions SET failures = failures + 1 WHERE endpoint = ?')->execute([$sub['endpoint']]);
        push_log($today, 'failed');
        $failed++;
    }
}

$result = "enviados=$sent fallidos=$failed eliminados=$removed sin_enviar=$skipped";
$state = cron_state();
$state['lastRun'] = date('Y-m-d H:i:s');
$state['lastResult'] = $result;
save_cron_state($state);

flock($lock, LOCK_UN);
echo $result, "\n";

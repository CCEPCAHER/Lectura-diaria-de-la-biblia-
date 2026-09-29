<?php
// Recibe las estadísticas anónimas que envía stats.js. No guarda IP ni datos personales.
declare(strict_types=1);

require __DIR__ . '/db.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input', false, null, 0, 4096);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) {
    http_response_code(400);
    exit;
}

$id = (string)($in['d'] ?? '');
$event = (string)($in['e'] ?? '');
if (!preg_match('/^[a-z0-9-]{16,40}$/i', $id) || !in_array($event, ['open', 'time', 'read', 'install'], true)) {
    http_response_code(400);
    exit;
}

$n = max(0, (int)($in['n'] ?? 0));
$platform = in_array($in['p'] ?? '', PLATFORMS, true) ? $in['p'] : 'otro';
$version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string)($in['v'] ?? '')), 0, 16);
$installed = ($event === 'install' || !empty($in['s'])) ? 1 : 0;

$opens = $event === 'open' ? 1 : 0;
$seconds = $event === 'time' ? min($n, 4 * 3600) : 0;
$chapters = $event === 'read' ? min($n, 1189) : 0;

$now = date('Y-m-d H:i:s');
$today = date('Y-m-d');

$clamp = static fn($v, int $max): int => max(0, min($max, (int)$v));

try {
    $pdo = db();
    $pdo->beginTransaction();

    $pdo->prepare(<<<'SQL'
        INSERT INTO devices (id, first_seen, last_seen, platform, version, installed, installed_at, opens, seconds, chapters_marked)
        VALUES (:id, :now, :now, :platform, :version, :installed, :installed_at, :opens, :seconds, :chapters)
        ON CONFLICT(id) DO UPDATE SET
            last_seen = excluded.last_seen,
            platform = CASE WHEN excluded.platform <> 'otro' THEN excluded.platform ELSE devices.platform END,
            version = CASE WHEN excluded.version <> '' THEN excluded.version ELSE devices.version END,
            installed = MAX(devices.installed, excluded.installed),
            installed_at = COALESCE(devices.installed_at, excluded.installed_at),
            opens = devices.opens + excluded.opens,
            seconds = devices.seconds + excluded.seconds,
            chapters_marked = devices.chapters_marked + excluded.chapters_marked
        SQL)->execute([
        ':id' => $id,
        ':now' => $now,
        ':platform' => $platform,
        ':version' => $version,
        ':installed' => $installed,
        ':installed_at' => $installed ? $now : null,
        ':opens' => $opens,
        ':seconds' => $seconds,
        ':chapters' => $chapters,
    ]);

    $sum = $in['sum'] ?? null;
    if (is_array($sum)) {
        $pdo->prepare('
            UPDATE devices SET chapters_read = :chapters, plan_started = :plan, delay_days = :delay, streak = :streak, awards = :awards
            WHERE id = :id
        ')->execute([
            ':chapters' => $clamp($sum['chapters'] ?? 0, 1189),
            ':plan' => empty($sum['plan']) ? 0 : 1,
            ':delay' => $clamp($sum['delay'] ?? 0, 3650),
            ':streak' => $clamp($sum['streak'] ?? 0, 36500),
            ':awards' => $clamp($sum['awards'] ?? 0, 50),
            ':id' => $id,
        ]);
    }

    $pdo->prepare('
        INSERT INTO activity (device_id, day, opens, seconds, chapters)
        VALUES (:id, :day, :opens, :seconds, :chapters)
        ON CONFLICT(device_id, day) DO UPDATE SET
            opens = activity.opens + excluded.opens,
            seconds = activity.seconds + excluded.seconds,
            chapters = activity.chapters + excluded.chapters
    ')->execute([':id' => $id, ':day' => $today, ':opens' => $opens, ':seconds' => $seconds, ':chapters' => $chapters]);

    $pdo->commit();
    http_response_code(204);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('collect.php: ' . $e->getMessage());
    http_response_code(500);
}

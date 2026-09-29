<?php
// Panel privado de estadísticas. La primera visita pide crear la contraseña de administrador.
declare(strict_types=1);

require __DIR__ . '/../api/db.php';
require_once __DIR__ . '/../api/webpush.php';

const ADMIN_FILE = DATA_DIR . '/admin.json';
const ATTEMPTS_FILE = DATA_DIR . '/login_attempts.json';
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 15 * 60;
const SESSION_IDLE_SECONDS = 8 * 3600;
const MIN_PASSWORD_LENGTH = 10;

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_name('lectura_admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0750, true);
}

function h($v): string { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }
function nf($v, int $dec = 0): string { return number_format((float)$v, $dec, ',', '.'); }

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_ok(): bool
{
    return isset($_POST['csrf'], $_SESSION['csrf']) && hash_equals($_SESSION['csrf'], (string)$_POST['csrf']);
}

function admin_hash(): ?string
{
    if (!is_file(ADMIN_FILE)) return null;
    $data = json_decode((string)file_get_contents(ADMIN_FILE), true);
    return is_array($data) && !empty($data['hash']) ? $data['hash'] : null;
}

function save_admin_hash(string $password, bool $createOnly): bool
{
    $json = json_encode(['hash' => password_hash($password, PASSWORD_DEFAULT), 'updated' => date('c')]);
    if ($createOnly) {
        // 'x' falla si el archivo ya existe: evita que dos personas creen la contraseña a la vez.
        $fh = @fopen(ADMIN_FILE, 'x');
        if (!$fh) return false;
        fwrite($fh, $json);
        fclose($fh);
    } else {
        file_put_contents(ADMIN_FILE, $json, LOCK_EX);
    }
    @chmod(ADMIN_FILE, 0600);
    return true;
}

function client_key(): string
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|lectura-admin');
}

function load_attempts(): array
{
    $data = is_file(ATTEMPTS_FILE) ? json_decode((string)file_get_contents(ATTEMPTS_FILE), true) : [];
    $data = is_array($data) ? $data : [];
    $now = time();
    return array_filter($data, static fn($a) => is_array($a) && ($now - ($a['first'] ?? 0)) < LOCK_SECONDS);
}

function is_locked(): bool
{
    $a = load_attempts()[client_key()] ?? null;
    return $a && $a['count'] >= MAX_ATTEMPTS;
}

function record_attempt(bool $success): void
{
    $all = load_attempts();
    $key = client_key();
    if ($success) {
        unset($all[$key]);
    } else {
        $all[$key] = ['count' => ($all[$key]['count'] ?? 0) + 1, 'first' => $all[$key]['first'] ?? time()];
    }
    file_put_contents(ATTEMPTS_FILE, json_encode($all), LOCK_EX);
}

function is_logged_in(): bool
{
    if (empty($_SESSION['admin'])) return false;
    if (time() - ($_SESSION['last_activity'] ?? 0) > SESSION_IDLE_SECONDS) {
        $_SESSION = [];
        return false;
    }
    $_SESSION['last_activity'] = time();
    return true;
}

function redirect_self(string $query = ''): void
{
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?') . ($query !== '' ? "?$query" : ''), true, 303);
    exit;
}

// ---- Acciones ----
$error = '';
$flash = $_SESSION['flash'] ?? '';
unset($_SESSION['flash']);
$hash = admin_hash();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $action = (string)($_POST['action'] ?? '');
    if (!csrf_ok()) {
        $error = 'La sesión ha caducado. Vuelve a intentarlo.';
    } elseif ($action === 'setup' && $hash === null) {
        $p1 = (string)($_POST['password'] ?? '');
        $p2 = (string)($_POST['password2'] ?? '');
        if (mb_strlen($p1) < MIN_PASSWORD_LENGTH) {
            $error = 'La contraseña debe tener al menos ' . MIN_PASSWORD_LENGTH . ' caracteres.';
        } elseif ($p1 !== $p2) {
            $error = 'Las contraseñas no coinciden.';
        } elseif (!save_admin_hash($p1, true)) {
            $error = 'La contraseña ya había sido creada.';
        } else {
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            $_SESSION['last_activity'] = time();
            $_SESSION['flash'] = 'Contraseña creada. ¡Bienvenido a tu panel!';
            redirect_self();
        }
    } elseif ($action === 'login' && $hash !== null) {
        if (is_locked()) {
            $error = 'Demasiados intentos. Espera 15 minutos.';
        } elseif (password_verify((string)($_POST['password'] ?? ''), $hash)) {
            record_attempt(true);
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            $_SESSION['last_activity'] = time();
            redirect_self();
        } else {
            record_attempt(false);
            usleep(700000);
            $error = 'Contraseña incorrecta.';
        }
    } elseif ($action === 'logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        redirect_self();
    } elseif ($action === 'password' && is_logged_in()) {
        $current = (string)($_POST['current'] ?? '');
        $p1 = (string)($_POST['password'] ?? '');
        $p2 = (string)($_POST['password2'] ?? '');
        if (!password_verify($current, (string)$hash)) {
            $error = 'La contraseña actual no es correcta.';
        } elseif (mb_strlen($p1) < MIN_PASSWORD_LENGTH || $p1 !== $p2) {
            $error = 'La nueva contraseña debe tener al menos ' . MIN_PASSWORD_LENGTH . ' caracteres y coincidir en ambos campos.';
        } else {
            save_admin_hash($p1, false);
            $_SESSION['flash'] = 'Contraseña actualizada.';
            redirect_self();
        }
    }
}

// ---- Vistas ----
function page(string $title, string $body): void
{
    ?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= h($title) ?></title>
<link rel="icon" href="../icons/icon-192x192.png" type="image/png">
<style>
:root {
  color-scheme: light;
  --page: #f3f4f1; --surface-1: #fcfcfb; --border: #e3e2dc;
  --text-primary: #0b0b0b; --text-secondary: #52514e; --text-muted: #7a7974;
  --series-1: #2a78d6; --track: #e8e7e1; --grid: #ecebe6;
  --accent: #0A2342; --danger: #c53030; --good: #1b7f4b;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --page: #111110; --surface-1: #1a1a19; --border: #2e2e2c;
    --text-primary: #ffffff; --text-secondary: #c3c2b7; --text-muted: #8f8e86;
    --series-1: #3987e5; --track: #2a2a28; --grid: #262624;
    --accent: #9ec5ff; --danger: #ff8a80; --good: #6fd39b;
  }
}
* { box-sizing: border-box; margin: 0; }
body { background: var(--page); color: var(--text-primary); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; padding: 16px; }
.wrap { max-width: 1100px; margin: 0 auto; display: grid; gap: 16px; }
.card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 16px; min-width: 0; }
h1 { font-size: 1.35rem; } h2 { font-size: 1rem; margin-bottom: 12px; } .sub { color: var(--text-secondary); font-size: .9rem; }
.top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.seg { display: inline-flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.seg a { padding: 6px 12px; color: var(--text-secondary); text-decoration: none; font-size: .9rem; }
.seg a[aria-current="true"] { background: var(--accent); color: var(--surface-1); }
button, .btn { font: inherit; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface-1); color: var(--text-primary); cursor: pointer; }
button.primary { background: var(--accent); color: var(--surface-1); border-color: var(--accent); width: 100%; }
input[type=password] { font: inherit; width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--page); color: var(--text-primary); margin: 4px 0 12px; }
label { font-size: .9rem; color: var(--text-secondary); }
.msg { padding: 10px 12px; border-radius: 8px; font-size: .9rem; }
.msg.err { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }
.msg.ok { background: color-mix(in srgb, var(--good) 12%, transparent); color: var(--good); }
.auth { max-width: 380px; margin: 10vh auto 0; display: grid; gap: 12px; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.kpi .label { color: var(--text-secondary); font-size: .85rem; }
.kpi .value { font-size: 1.9rem; font-weight: 650; font-variant-numeric: tabular-nums; line-height: 1.2; margin-top: 2px; }
.kpi .note { color: var(--text-muted); font-size: .8rem; }
.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 16px; }
.chart { position: relative; }
.chart svg { display: block; width: 100%; height: auto; overflow: visible; }
.chart .bar { fill: var(--series-1); }
.chart .hit { fill: transparent; cursor: default; }
.chart .hit:hover + .bar, .chart .bar.hover { opacity: .75; }
.chart .gridline { stroke: var(--grid); stroke-width: 1; }
.chart .axis { fill: var(--text-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.tip { position: absolute; pointer-events: none; background: var(--text-primary); color: var(--surface-1); font-size: .8rem; padding: 6px 8px; border-radius: 6px; white-space: nowrap; transform: translate(-50%, -110%); opacity: 0; transition: opacity .1s; }
.tip.on { opacity: 1; }
table { width: 100%; border-collapse: collapse; font-size: .9rem; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 7px 6px; border-bottom: 1px solid var(--border); }
th { color: var(--text-secondary); font-weight: 600; font-size: .8rem; }
td.num, th.num { text-align: right; }
.meter { height: 8px; background: var(--track); border-radius: 4px; overflow: hidden; min-width: 60px; }
.meter > span { display: block; height: 100%; background: var(--series-1); border-radius: 4px; }
details summary { cursor: pointer; color: var(--text-secondary); font-size: .85rem; margin-top: 10px; }
details table { margin-top: 8px; }
.foot { color: var(--text-muted); font-size: .8rem; }
.foot a { color: inherit; }
</style>
</head>
<body>
<?= $body ?>
</body>
</html>
<?php
    exit;
}

function auth_page(string $mode, string $error, string $flash): void
{
    $title = $mode === 'setup' ? 'Crear contraseña de administrador' : 'Panel de administración';
    ob_start(); ?>
<main class="auth card">
  <h1><?= h($title) ?></h1>
  <p class="sub"><?= $mode === 'setup'
      ? 'Es la primera vez que entras. Elige la contraseña con la que accederás a las estadísticas. Solo tú la conocerás.'
      : 'Lectura diaria de la Biblia · estadísticas de uso' ?></p>
  <?php if ($error): ?><p class="msg err"><?= h($error) ?></p><?php endif; ?>
  <?php if ($flash): ?><p class="msg ok"><?= h($flash) ?></p><?php endif; ?>
  <form method="post" autocomplete="on">
    <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="<?= $mode === 'setup' ? 'setup' : 'login' ?>">
    <input type="text" name="username" value="admin" autocomplete="username" hidden>
    <label for="password">Contraseña</label>
    <input type="password" id="password" name="password" required minlength="<?= $mode === 'setup' ? MIN_PASSWORD_LENGTH : 1 ?>"
           autocomplete="<?= $mode === 'setup' ? 'new-password' : 'current-password' ?>" autofocus>
    <?php if ($mode === 'setup'): ?>
      <label for="password2">Repite la contraseña</label>
      <input type="password" id="password2" name="password2" required minlength="<?= MIN_PASSWORD_LENGTH ?>" autocomplete="new-password">
    <?php endif; ?>
    <button type="submit" class="primary"><?= $mode === 'setup' ? 'Crear y entrar' : 'Entrar' ?></button>
  </form>
</main>
<?php
    page($title, (string)ob_get_clean());
}

if ($hash === null) {
    auth_page('setup', $error, $flash);
}
if (!is_logged_in()) {
    auth_page('login', $error, $flash);
}

// ---- Datos del panel ----
$pdo = db();
$q = static function (string $sql, array $p = []) use ($pdo): array { $st = $pdo->prepare($sql); $st->execute($p); return $st->fetchAll(); };
$q1 = static function (string $sql, array $p = []) use ($pdo) { $st = $pdo->prepare($sql); $st->execute($p); return $st->fetchColumn(); };

$range = (int)($_GET['dias'] ?? 30);
if (!in_array($range, [7, 30, 90], true)) {
    $range = 30;
}
$today = date('Y-m-d');
$since = static fn(int $days): string => date('Y-m-d', strtotime('-' . ($days - 1) . ' days'));
$from = $since($range);

$total = (int)$q1('SELECT COUNT(*) FROM devices');
$installed = (int)$q1('SELECT COUNT(*) FROM devices WHERE installed = 1');
$activeToday = (int)$q1('SELECT COUNT(DISTINCT device_id) FROM activity WHERE day = ?', [$today]);
$active7 = (int)$q1('SELECT COUNT(DISTINCT device_id) FROM activity WHERE day >= ?', [$since(7)]);
$active30 = (int)$q1('SELECT COUNT(DISTINCT device_id) FROM activity WHERE day >= ?', [$since(30)]);
$newInRange = (int)$q1('SELECT COUNT(*) FROM devices WHERE substr(first_seen, 1, 10) >= ?', [$from]);
$usage = $q('SELECT COALESCE(SUM(seconds), 0) AS secs, COUNT(*) AS days, COALESCE(SUM(chapters), 0) AS chapters FROM activity WHERE day >= ?', [$from])[0];
$avgMinutes = $usage['days'] > 0 ? $usage['secs'] / $usage['days'] / 60 : 0;
$totalHours = (int)$q1('SELECT COALESCE(SUM(seconds), 0) FROM devices') / 3600;
$eligible = (int)$q1('SELECT COUNT(*) FROM devices WHERE substr(first_seen, 1, 10) <= ?', [$since(8)]);
$retained = (int)$q1('SELECT COUNT(*) FROM devices WHERE substr(first_seen, 1, 10) <= ? AND last_seen >= ?', [$since(8), $since(7)]);

$days = [];
for ($t = strtotime($from); $t <= strtotime($today); $t += 86400) {
    $days[date('Y-m-d', $t)] = 0;
}
$activeSeries = $days; $newSeries = $days; $minutesSeries = $days; $installSeries = $days;
foreach ($q('SELECT day, COUNT(*) AS n, SUM(seconds) AS s FROM activity WHERE day >= ? GROUP BY day', [$from]) as $r) {
    if (isset($days[$r['day']])) { $activeSeries[$r['day']] = (int)$r['n']; $minutesSeries[$r['day']] = round($r['s'] / 60); }
}
foreach ($q('SELECT substr(first_seen, 1, 10) AS d, COUNT(*) AS n FROM devices WHERE substr(first_seen, 1, 10) >= ? GROUP BY d', [$from]) as $r) {
    if (isset($days[$r['d']])) $newSeries[$r['d']] = (int)$r['n'];
}
foreach ($q('SELECT substr(installed_at, 1, 10) AS d, COUNT(*) AS n FROM devices WHERE installed_at IS NOT NULL AND substr(installed_at, 1, 10) >= ? GROUP BY d', [$from]) as $r) {
    if (isset($days[$r['d']])) $installSeries[$r['d']] = (int)$r['n'];
}

$platformNames = ['android' => 'Android', 'ios' => 'iPhone / iPad', 'windows' => 'Windows', 'mac' => 'Mac', 'linux' => 'Linux', 'otro' => 'Otro'];
$platforms = $q('SELECT platform, COUNT(*) AS n, SUM(installed) AS inst FROM devices GROUP BY platform ORDER BY n DESC');

$buckets = $q("
    SELECT CASE
        WHEN chapters_read = 0 THEN '0 %'
        WHEN chapters_read <= 297 THEN '1–25 %'
        WHEN chapters_read <= 594 THEN '26–50 %'
        WHEN chapters_read <= 892 THEN '51–75 %'
        WHEN chapters_read < 1189 THEN '76–99 %'
        ELSE '100 % 🎉' END AS bucket,
        MIN(chapters_read) AS ord, COUNT(*) AS n
    FROM devices GROUP BY bucket ORDER BY ord");
$plan = $q('SELECT COALESCE(SUM(plan_started), 0) AS started,
                   COALESCE(SUM(CASE WHEN plan_started = 1 AND delay_days = 0 THEN 1 ELSE 0 END), 0) AS on_track,
                   AVG(CASE WHEN plan_started = 1 AND delay_days > 0 THEN delay_days END) AS avg_delay,
                   AVG(CASE WHEN last_seen >= ? THEN streak END) AS avg_streak,
                   MAX(streak) AS best_streak
            FROM devices', [$since(7)])[0];
$reminders = $q('SELECT COUNT(*) AS subs, COUNT(DISTINCT device_id) AS devices FROM push_subscriptions')[0];
$pushWeek = $q('SELECT COALESCE(SUM(sent), 0) AS sent, COALESCE(SUM(failed), 0) AS failed, COALESCE(SUM(clicked), 0) AS clicked FROM push_log WHERE day >= ?', [$since(7)])[0];
$reminderTimes = $q('SELECT remind_time, COUNT(*) AS n FROM push_subscriptions GROUP BY remind_time ORDER BY n DESC LIMIT 5');
$cron = cron_state();
$cronStale = !$cron['lastRun'] || time() - strtotime($cron['lastRun']) > 30 * 60;
$cronPath = realpath(__DIR__ . '/../api/cron.php') ?: __DIR__ . '/../api/cron.php';
$cronUrl = ($secure ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'mylectura.mycongre.com')
    . rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME']))), '/') . '/api/cron.php?token=' . $cron['token'];
$versions = $q('SELECT version, COUNT(*) AS n FROM devices WHERE last_seen >= ? GROUP BY version ORDER BY n DESC', [$since(30)]);

function pct(int $part, int $whole): string { return $whole > 0 ? nf($part / $whole * 100) . ' %' : '—'; }

function bar_chart(array $series, string $unit): string
{
    $w = 520; $h = 220; $padL = 34; $padB = 24; $padT = 8;
    $n = max(1, count($series));
    $max = max(1, ...array_values($series));
    // Paso "redondo" (1, 2, 5, 10, 20, 50…) para unas 5 líneas de guía.
    $raw = $max / 5;
    $mag = $raw <= 1 ? 1 : 10 ** (int)floor(log10($raw));
    $step = $mag * 10;
    foreach ([1, 2, 5, 10] as $m) {
        if ($m * $mag >= $raw) { $step = $m * $mag; break; }
    }
    $top = $step * (int)ceil($max / $step);
    $plotW = $w - $padL; $plotH = $h - $padB - $padT;
    $slot = $plotW / $n; $gap = min(2, $slot * 0.2); $bw = max(1, $slot - $gap);
    $svg = "<svg viewBox=\"0 0 $w $h\" role=\"img\" aria-label=\"" . h($unit) . " por día\">";
    for ($v = 0; $v <= $top; $v += $step) {
        $y = $padT + $plotH - ($v / $top) * $plotH;
        $svg .= sprintf('<line class="gridline" x1="%d" x2="%d" y1="%.1f" y2="%.1f"/>', $padL, $w, $y, $y);
        $svg .= sprintf('<text class="axis" x="%d" y="%.1f" text-anchor="end" dominant-baseline="middle">%s</text>', $padL - 6, $y, nf($v));
    }
    $labelEvery = (int)ceil($n / 6);
    $i = 0;
    foreach ($series as $day => $value) {
        $x = $padL + $i * $slot + $gap / 2;
        $bh = $value > 0 ? max(2, ($value / $top) * $plotH) : 0;
        $y = $padT + $plotH - $bh;
        $label = date('j/n', strtotime($day));
        $tip = h(date('d/m/Y', strtotime($day)) . ': ' . nf($value) . ' ' . $unit);
        $svg .= sprintf('<rect class="hit" x="%.1f" y="%d" width="%.1f" height="%d" data-tip="%s"/>', $padL + $i * $slot, $padT, $slot, $plotH, $tip);
        if ($bh > 0) {
            $r = min(4, $bw / 2, $bh);
            $svg .= sprintf(
                '<path class="bar" d="M%.1f,%.1f v%.1f a%.1f,%.1f 0 0 1 %.1f,-%.1f h%.1f a%.1f,%.1f 0 0 1 %.1f,%.1f v%.1f z"/>',
                $x, $padT + $plotH, -($bh - $r), $r, $r, $r, $r, $bw - 2 * $r, $r, $r, $r, $r, $bh - $r
            );
        }
        if ($i % $labelEvery === 0) {
            $svg .= sprintf('<text class="axis" x="%.1f" y="%d" text-anchor="middle">%s</text>', $x + $bw / 2, $h - 6, $label);
        }
        $i++;
    }
    return $svg . '</svg>';
}

function chart_card(string $title, string $subtitle, array $series, string $unit): string
{
    $rows = '';
    foreach (array_reverse($series, true) as $day => $v) {
        $rows .= '<tr><td>' . h(date('d/m/Y', strtotime($day))) . '</td><td class="num">' . nf($v) . '</td></tr>';
    }
    return '<section class="card"><h2>' . h($title) . '</h2><p class="sub" style="margin:-8px 0 8px">' . h($subtitle) . '</p>'
        . '<div class="chart">' . bar_chart($series, $unit) . '<div class="tip"></div></div>'
        . '<details><summary>Ver tabla</summary><table><thead><tr><th>Día</th><th class="num">' . h(ucfirst($unit)) . '</th></tr></thead><tbody>'
        . $rows . '</tbody></table></details></section>';
}

$kpi = static fn(string $label, string $value, string $note = ''): string =>
    '<div class="card kpi"><div class="label">' . h($label) . '</div><div class="value">' . h($value) . '</div>'
    . ($note !== '' ? '<div class="note">' . h($note) . '</div>' : '') . '</div>';

ob_start(); ?>
<div class="wrap">
  <header class="top">
    <div>
      <h1>📖 Lectura diaria · Panel</h1>
      <p class="sub">Datos anónimos · actualizado <?= h(date('d/m/Y H:i')) ?> (hora de Madrid)</p>
    </div>
    <div class="controls">
      <nav class="seg" aria-label="Periodo">
        <?php foreach ([7, 30, 90] as $d): ?>
          <a href="?dias=<?= $d ?>" aria-current="<?= $d === $range ? 'true' : 'false' ?>"><?= $d ?> días</a>
        <?php endforeach; ?>
      </nav>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
        <input type="hidden" name="action" value="logout">
        <button type="submit">Salir</button>
      </form>
    </div>
  </header>

  <?php if ($error): ?><p class="msg err"><?= h($error) ?></p><?php endif; ?>
  <?php if ($flash): ?><p class="msg ok"><?= h($flash) ?></p><?php endif; ?>

  <section class="kpis" aria-label="Resumen">
    <?= $kpi('Personas que la usan', nf($total), 'dispositivos distintos desde el inicio') ?>
    <?= $kpi('La han instalado', nf($installed), pct($installed, $total) . ' del total') ?>
    <?= $kpi('Activos hoy', nf($activeToday)) ?>
    <?= $kpi('Activos 7 días', nf($active7)) ?>
    <?= $kpi('Activos 30 días', nf($active30)) ?>
    <?= $kpi("Nuevos ($range días)", nf($newInRange)) ?>
    <?= $kpi('Minutos por visita diaria', nf($avgMinutes, 1), "media de los últimos $range días") ?>
    <?= $kpi("Capítulos marcados ($range días)", nf($usage['chapters'])) ?>
    <?= $kpi('Siguen usándola', pct($retained, $eligible), 'de quienes empezaron hace +7 días, activos esta semana') ?>
    <?= $kpi('Horas de uso totales', nf($totalHours, 1)) ?>
  </section>

  <div class="grid2">
    <?= chart_card('Personas activas por día', 'Dispositivos que abrieron la app cada día', $activeSeries, 'personas') ?>
    <?= chart_card('Personas nuevas por día', 'Primera vez que se abre la app en un dispositivo', $newSeries, 'nuevas') ?>
    <?= chart_card('Instalaciones por día', 'Dispositivos que la instalaron o la abrieron instalada por primera vez', $installSeries, 'instalaciones') ?>
    <?= chart_card('Minutos de uso por día', 'Tiempo activo sumado de todas las personas', $minutesSeries, 'minutos') ?>
  </div>

  <div class="grid2">
    <section class="card">
      <h2>Dispositivos</h2>
      <table>
        <thead><tr><th>Sistema</th><th class="num">Personas</th><th class="num">Instalada</th><th>Parte del total</th></tr></thead>
        <tbody>
        <?php foreach ($platforms as $p): ?>
          <tr>
            <td><?= h($platformNames[$p['platform']] ?? $p['platform']) ?></td>
            <td class="num"><?= nf($p['n']) ?></td>
            <td class="num"><?= nf($p['inst']) ?></td>
            <td><div class="meter"><span style="width:<?= $total ? round($p['n'] / $total * 100) : 0 ?>%"></span></div></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$platforms): ?><tr><td colspan="4" class="sub">Todavía no hay datos.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>Cuánto llevan leído</h2>
      <table>
        <thead><tr><th>Biblia leída</th><th class="num">Personas</th><th>Parte del total</th></tr></thead>
        <tbody>
        <?php foreach ($buckets as $b): ?>
          <tr>
            <td><?= h($b['bucket']) ?></td>
            <td class="num"><?= nf($b['n']) ?></td>
            <td><div class="meter"><span style="width:<?= $total ? round($b['n'] / $total * 100) : 0 ?>%"></span></div></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$buckets): ?><tr><td colspan="3" class="sub">Todavía no hay datos.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>Plan de lectura</h2>
      <table>
        <tbody>
          <tr><td>Han empezado el plan</td><td class="num"><?= nf($plan['started']) ?></td><td class="num sub"><?= pct((int)$plan['started'], $total) ?></td></tr>
          <tr><td>Van al día</td><td class="num"><?= nf($plan['on_track']) ?></td><td class="num sub"><?= pct((int)$plan['on_track'], (int)$plan['started']) ?></td></tr>
          <tr><td>Retraso medio (de quienes van atrasados)</td><td class="num"><?= $plan['avg_delay'] !== null ? nf($plan['avg_delay'], 1) . ' días' : '—' ?></td><td></td></tr>
          <tr><td>Racha media (activos 7 días)</td><td class="num"><?= $plan['avg_streak'] !== null ? nf($plan['avg_streak'], 1) . ' días' : '—' ?></td><td></td></tr>
          <tr><td>Mejor racha actual</td><td class="num"><?= nf($plan['best_streak'] ?? 0) ?> días</td><td></td></tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>Versiones en uso (30 días)</h2>
      <table>
        <thead><tr><th>Versión</th><th class="num">Personas</th></tr></thead>
        <tbody>
        <?php foreach ($versions as $v): ?>
          <tr><td><?= h($v['version'] !== '' ? $v['version'] : 'desconocida') ?></td><td class="num"><?= nf($v['n']) ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$versions): ?><tr><td colspan="2" class="sub">Todavía no hay datos.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </section>
  </div>

  <section class="card">
    <h2>🔔 Recordatorios diarios</h2>
    <?php if ($cronStale): ?>
      <p class="msg err" style="margin-bottom:12px">El envío automático no se ha ejecutado en los últimos 30 minutos<?= $cron['lastRun'] ? ' (última vez: ' . h(date('d/m/Y H:i', strtotime($cron['lastRun']))) . ')' : '' ?>. Configura el cron (ver abajo) para que los avisos lleguen.</p>
    <?php endif; ?>
    <div class="kpis">
      <div class="kpi"><div class="label">Activos</div><div class="value"><?= nf($reminders['subs']) ?></div><div class="note"><?= pct((int)$reminders['devices'], $total) ?> de las personas</div></div>
      <div class="kpi"><div class="label">Enviados (7 días)</div><div class="value"><?= nf($pushWeek['sent']) ?></div><div class="note"><?= nf($pushWeek['failed']) ?> fallidos</div></div>
      <div class="kpi"><div class="label">Abiertos (7 días)</div><div class="value"><?= nf($pushWeek['clicked']) ?></div><div class="note"><?= pct((int)$pushWeek['clicked'], (int)$pushWeek['sent']) ?> de los enviados</div></div>
      <div class="kpi"><div class="label">Horas más elegidas</div><div class="value" style="font-size:1.1rem"><?= $reminderTimes ? h(implode(' · ', array_map(fn($r) => $r['remind_time'], $reminderTimes))) : '—' ?></div></div>
    </div>
    <details>
      <summary>Configurar el envío automático (cron)</summary>
      <div style="margin-top:10px;display:grid;gap:8px;font-size:.9rem">
        <p>En Hostinger: <strong>hPanel → Avanzado → Cron Jobs</strong>, tipo «Personalizado», cada 5 minutos (<code>*/5 * * * *</code>), con este comando:</p>
        <code style="display:block;padding:8px;border:1px solid var(--border);border-radius:6px;overflow-wrap:anywhere">/usr/bin/php <?= h($cronPath) ?></code>
        <p>Si prefieres un servicio externo gratuito (p. ej. cron-job.org), usa esta URL. Es secreta: no la compartas.</p>
        <code style="display:block;padding:8px;border:1px solid var(--border);border-radius:6px;overflow-wrap:anywhere"><?= h($cronUrl) ?></code>
        <p class="sub">Última ejecución: <?= $cron['lastRun'] ? h(date('d/m/Y H:i', strtotime($cron['lastRun']))) . ' · ' . h($cron['lastResult']) : 'nunca' ?></p>
      </div>
    </details>
  </section>

  <section class="card">
    <details>
      <summary>Cambiar contraseña</summary>
      <form method="post" style="max-width:380px;margin-top:12px">
        <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
        <input type="hidden" name="action" value="password">
        <input type="text" name="username" value="admin" autocomplete="username" hidden>
        <label for="current">Contraseña actual</label>
        <input type="password" id="current" name="current" required autocomplete="current-password">
        <label for="np1">Nueva contraseña</label>
        <input type="password" id="np1" name="password" required minlength="<?= MIN_PASSWORD_LENGTH ?>" autocomplete="new-password">
        <label for="np2">Repite la nueva contraseña</label>
        <input type="password" id="np2" name="password2" required minlength="<?= MIN_PASSWORD_LENGTH ?>" autocomplete="new-password">
        <button type="submit" class="primary">Guardar</button>
      </form>
    </details>
  </section>

  <p class="foot">«Personas» = dispositivos distintos: si alguien usa la app en el móvil y en el ordenador cuenta dos veces, y si borra los datos del navegador cuenta como nueva. Quien desactiva las estadísticas no aparece. <a href="../">Abrir la app</a> · <a href="https://mycongre.com/" target="_blank" rel="noopener">mycongre.com</a></p>
</div>
<script>
document.querySelectorAll('.chart').forEach(chart => {
  const tip = chart.querySelector('.tip');
  chart.querySelectorAll('.hit').forEach(hit => {
    const bar = hit.nextElementSibling && hit.nextElementSibling.classList.contains('bar') ? hit.nextElementSibling : null;
    hit.addEventListener('mouseenter', () => {
      const box = chart.getBoundingClientRect(), r = hit.getBoundingClientRect();
      tip.textContent = hit.dataset.tip;
      tip.style.left = (r.left - box.left + r.width / 2) + 'px';
      tip.style.top = (bar ? bar.getBoundingClientRect().top - box.top : r.bottom - box.top) + 'px';
      tip.classList.add('on');
      if (bar) bar.classList.add('hover');
    });
    hit.addEventListener('mouseleave', () => { tip.classList.remove('on'); if (bar) bar.classList.remove('hover'); });
  });
});
</script>
<?php
page('Panel · Lectura diaria', (string)ob_get_clean());

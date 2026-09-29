<?php
// Lectura bíblica de la semana (reunión Vida y Ministerio), tomada de wol.jw.org.
// Se consulta una sola vez por semana y se guarda en data/weekly/.
declare(strict_types=1);

require __DIR__ . '/db.php';

const WEEKLY_DIR = DATA_DIR . '/weekly';
const WOL = 'https://wol.jw.org';
const RETRY_AFTER_FAIL = 3600; // si wol.jw.org falla, no se reintenta hasta pasada una hora

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('Content-Type: application/json; charset=utf-8');

function reply(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fetch_html(string $url): ?string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_ENCODING => '',
        CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; LecturaDiaria/1.0; +https://mylectura.mycongre.com)',
        CURLOPT_HTTPHEADER => ['Accept: text/html', 'Accept-Language: es-ES,es;q=0.9'],
    ]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return ($body !== false && $code === 200) ? (string)$body : null;
}

function load_dom(string $html): DOMXPath
{
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8" ?>' . $html);
    libxml_clear_errors();
    return new DOMXPath($doc);
}

function clean_text(string $text): string
{
    return trim(preg_replace('/\s+/u', ' ', $text));
}

// Semana ISO (lunes a domingo) de la fecha que envía el dispositivo.
$date = (string)($_GET['date'] ?? '');
$ts = preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? strtotime($date . ' 12:00:00') : false;
if ($ts === false || abs($ts - time()) > 400 * 86400) $ts = time();
$year = (int)date('o', $ts);
$week = (int)date('W', $ts);
$key = sprintf('%04d-%02d', $year, $week);
$cacheFile = WEEKLY_DIR . "/$key.json";
$failFile = WEEKLY_DIR . "/$key.fail";

if (is_file($cacheFile)) {
    reply(200, json_decode((string)file_get_contents($cacheFile), true));
}
if (is_file($failFile) && time() - filemtime($failFile) < RETRY_AFTER_FAIL) {
    reply(503, ['error' => 'unavailable', 'week' => $key]);
}
if (!is_dir(WEEKLY_DIR)) mkdir(WEEKLY_DIR, 0750, true);

$fail = static function (string $why) use ($failFile, $key): void {
    @touch($failFile);
    error_log("weekly.php $key: $why");
    reply(503, ['error' => 'unavailable', 'week' => $key]);
};

// 1. Página de reuniones de la semana → enlace a la Guía de actividades.
$meetings = fetch_html(WOL . "/es/wol/meetings/r4/lp-s/$year/$week");
if ($meetings === null) $fail('sin respuesta de la página de reuniones');
$xp = load_dom($meetings);
$docPath = null;
foreach ($xp->query('//li[contains(@class, "pub-mwb")]//a[@href]') as $a) {
    if (preg_match('#^/es/wol/d/r4/lp-s/\d+#', $a->getAttribute('href'), $m)) { $docPath = $m[0]; break; }
}
if ($docPath === null) {
    // Semana sin reunión entre semana (asamblea, Conmemoración…): se guarda para no volver a preguntar.
    $data = ['week' => $key, 'reading' => null];
    file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE));
    reply(200, $data);
}

// 2. Guía de actividades → título de la semana (h1) y lectura bíblica (h2 de la cabecera).
$mwb = fetch_html(WOL . $docPath);
if ($mwb === null) $fail('sin respuesta de la guía de actividades');
$xp = load_dom($mwb);
$titleNode = $xp->query('//header/h1')->item(0);
$readingNode = $xp->query('//header/h2')->item(0);
$reading = $readingNode ? clean_text($readingNode->textContent) : '';
if ($reading === '' || !preg_match('/\d/', $reading)) $fail('no se encontró la lectura en la cabecera');

$data = [
    'week' => $key,
    'title' => $titleNode ? clean_text($titleNode->textContent) : '',
    'reading' => $reading,
    'guideUrl' => WOL . $docPath,
];
file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE));
@unlink($failFile);
reply(200, $data);

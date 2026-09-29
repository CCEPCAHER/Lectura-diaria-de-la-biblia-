<?php
// Amigos sin cuentas: cada perfil tiene un código público (para invitar) y una clave secreta
// que solo guarda el dispositivo. Los amigos ven el apodo, la racha, si leyó hoy y el % leído.
declare(strict_types=1);

require __DIR__ . '/webpush.php';

const FRIEND_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_FRIENDS = 100;
const MAX_CHEERS_PER_DAY = 50;
const MAX_LOOKUP_MISSES_PER_HOUR = 30;

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('Content-Type: application/json; charset=utf-8');

function reply(int $code, array $data = []): void
{
    http_response_code($code);
    echo json_encode($data ?: ['ok' => $code < 300], JSON_UNESCAPED_UNICODE);
    exit;
}

function valid_code(string $code): bool
{
    return (bool)preg_match('/^[' . FRIEND_ALPHABET . ']{8}$/', $code);
}

function clean_nickname(string $name): string
{
    $name = preg_replace('/[\p{C}<>]+/u', '', $name);          // sin caracteres de control ni < >
    $name = trim(preg_replace('/\s+/u', ' ', $name));
    return mb_substr($name, 0, 24);
}

function valid_date(string $d): bool
{
    return (bool)preg_match('/^\d{4}-\d{2}-\d{2}$/', $d);
}

function new_code(PDO $pdo): string
{
    do {
        $code = '';
        foreach (str_split(random_bytes(8)) as $byte) $code .= FRIEND_ALPHABET[ord($byte) % 32];
        $exists = $pdo->prepare('SELECT 1 FROM friend_profiles WHERE id = ?');
        $exists->execute([$code]);
    } while ($exists->fetchColumn());
    return $code;
}

/** Comprueba la clave secreta del perfil que hace la petición. */
function auth_profile(PDO $pdo, array $in): array
{
    $id = strtoupper((string)($in['id'] ?? ''));
    $secret = (string)($in['secret'] ?? '');
    if (!valid_code($id) || !preg_match('/^[a-f0-9]{64}$/', $secret)) reply(401, ['error' => 'auth']);
    $st = $pdo->prepare('SELECT * FROM friend_profiles WHERE id = ?');
    $st->execute([$id]);
    $row = $st->fetch();
    if (!$row || !hash_equals($row['secret_hash'], hash('sha256', $secret))) reply(401, ['error' => 'auth']);
    return $row;
}

/** Fecha de hoy y de ayer según el dispositivo que pregunta (para saber si un amigo leyó «hoy»). */
function client_days(array $in): array
{
    $today = (string)($in['today'] ?? '');
    if (!valid_date($today)) $today = date('Y-m-d');
    return [$today, date('Y-m-d', strtotime($today . ' -1 day'))];
}

function public_friend(array $f, string $today, string $yesterday): array
{
    $active = $f['read_date'] !== null && $f['read_date'] >= $yesterday; // si no leyó ni hoy ni ayer, la racha se rompió
    return [
        'code' => $f['id'],
        'nickname' => $f['nickname'],
        'streak' => $active ? (int)$f['streak'] : 0,
        'bestStreak' => (int)$f['best_streak'],
        'percent' => (int)$f['percent'],
        'readToday' => $f['read_date'] === $today,
    ];
}

try {
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'] ?? '';

    // Vista previa de una invitación: solo el apodo.
    if ($method === 'GET' && ($_GET['action'] ?? '') === 'preview') {
        $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string)($_GET['code'] ?? '')));
        $client = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|lectura-friends');
        $hour = date('Y-m-d H');
        $misses = $pdo->prepare('SELECT misses FROM sync_misses WHERE client = ? AND hour = ?');
        $misses->execute([$client, $hour]);
        if ((int)$misses->fetchColumn() >= MAX_LOOKUP_MISSES_PER_HOUR) reply(429, ['error' => 'wait']);
        $st = $pdo->prepare('SELECT nickname FROM friend_profiles WHERE id = ?');
        $st->execute([$code]);
        $nick = valid_code($code) ? $st->fetchColumn() : false;
        if ($nick === false) {
            $pdo->prepare('INSERT INTO sync_misses (client, hour, misses) VALUES (?, ?, 1)
                           ON CONFLICT(client, hour) DO UPDATE SET misses = misses + 1')->execute([$client, $hour]);
            reply(404, ['error' => 'not_found']);
        }
        reply(200, ['code' => $code, 'nickname' => $nick]);
    }

    if ($method !== 'POST') reply(405, ['error' => 'method']);
    $in = json_decode((string)file_get_contents('php://input', false, null, 0, 8192), true);
    if (!is_array($in)) reply(400, ['error' => 'json']);
    $action = (string)($in['action'] ?? '');
    $now = date('Y-m-d H:i:s');

    if ($action === 'create') {
        $nickname = clean_nickname((string)($in['nickname'] ?? ''));
        if (mb_strlen($nickname) < 2) reply(400, ['error' => 'nickname']);
        $id = new_code($pdo);
        $secret = bin2hex(random_bytes(32));
        $pdo->prepare('INSERT INTO friend_profiles (id, secret_hash, nickname, created, last_seen) VALUES (?, ?, ?, ?, ?)')
            ->execute([$id, hash('sha256', $secret), $nickname, $now, $now]);
        reply(200, ['id' => $id, 'secret' => $secret, 'nickname' => $nickname]);
    }

    $me = auth_profile($pdo, $in);
    [$today, $yesterday] = client_days($in);

    switch ($action) {
        case 'update':
            $fields = ['last_seen = :now'];
            $params = [':now' => $now, ':id' => $me['id']];
            if (isset($in['nickname'])) {
                $nickname = clean_nickname((string)$in['nickname']);
                if (mb_strlen($nickname) < 2) reply(400, ['error' => 'nickname']);
                $fields[] = 'nickname = :nickname';
                $params[':nickname'] = $nickname;
            }
            if (is_array($in['stats'] ?? null)) {
                $s = $in['stats'];
                $fields[] = 'streak = :streak';
                $fields[] = 'best_streak = :best';
                $fields[] = 'percent = :percent';
                $params[':streak'] = max(0, min(36500, (int)($s['streak'] ?? 0)));
                $params[':best'] = max(0, min(36500, (int)($s['best'] ?? 0)));
                $params[':percent'] = max(0, min(100, (int)($s['percent'] ?? 0)));
                if (!empty($s['readToday'])) { $fields[] = 'read_date = :read_date'; $params[':read_date'] = $today; }
            }
            if (array_key_exists('pushEndpoint', $in)) {
                $endpoint = (string)$in['pushEndpoint'];
                $fields[] = 'push_endpoint = :endpoint';
                $params[':endpoint'] = is_valid_push_endpoint($endpoint) ? $endpoint : null;
            }
            $pdo->prepare('UPDATE friend_profiles SET ' . implode(', ', $fields) . ' WHERE id = :id')->execute($params);
            reply(200);

        case 'list':
            $st = $pdo->prepare('SELECT p.* FROM friendships f JOIN friend_profiles p ON p.id = f.b WHERE f.a = ? ORDER BY p.nickname COLLATE NOCASE');
            $st->execute([$me['id']]);
            $friends = array_map(fn($f) => public_friend($f, $today, $yesterday), $st->fetchAll());

            $cheered = $pdo->prepare('SELECT to_id FROM cheers WHERE from_id = ? AND day = ?');
            $cheered->execute([$me['id'], $today]);
            $cheeredToday = $cheered->fetchAll(PDO::FETCH_COLUMN);

            $st = $pdo->prepare('SELECT c.from_id, p.nickname FROM cheers c JOIN friend_profiles p ON p.id = c.from_id WHERE c.to_id = ? AND c.seen = 0 ORDER BY c.created');
            $st->execute([$me['id']]);
            $cheers = $st->fetchAll();
            $pdo->prepare('UPDATE cheers SET seen = 1 WHERE to_id = ? AND seen = 0')->execute([$me['id']]);

            $pdo->prepare('UPDATE friend_profiles SET last_seen = ? WHERE id = ?')->execute([$now, $me['id']]);
            reply(200, [
                'me' => ['code' => $me['id'], 'nickname' => $me['nickname']],
                'friends' => $friends,
                'cheeredToday' => $cheeredToday,
                'cheers' => array_map(fn($c) => ['code' => $c['from_id'], 'nickname' => $c['nickname']], $cheers),
            ]);

        case 'link':
            $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string)($in['code'] ?? '')));
            if (!valid_code($code) || $code === $me['id']) reply(400, ['error' => 'code']);
            $st = $pdo->prepare('SELECT * FROM friend_profiles WHERE id = ?');
            $st->execute([$code]);
            $friend = $st->fetch();
            if (!$friend) reply(404, ['error' => 'not_found']);
            $count = $pdo->prepare('SELECT COUNT(*) FROM friendships WHERE a = ?');
            foreach ([$me['id'], $code] as $who) {
                $count->execute([$who]);
                if ((int)$count->fetchColumn() >= MAX_FRIENDS) reply(409, ['error' => 'too_many']);
            }
            $ins = $pdo->prepare('INSERT OR IGNORE INTO friendships (a, b, created) VALUES (?, ?, ?)');
            $ins->execute([$me['id'], $code, $now]);
            $ins->execute([$code, $me['id'], $now]);
            reply(200, ['friend' => public_friend($friend, $today, $yesterday)]);

        case 'unlink':
            $code = strtoupper((string)($in['code'] ?? ''));
            $pdo->prepare('DELETE FROM friendships WHERE (a = ? AND b = ?) OR (a = ? AND b = ?)')->execute([$me['id'], $code, $code, $me['id']]);
            reply(200);

        case 'cheer':
            $code = strtoupper((string)($in['code'] ?? ''));
            $isFriend = $pdo->prepare('SELECT 1 FROM friendships WHERE a = ? AND b = ?');
            $isFriend->execute([$me['id'], $code]);
            if (!$isFriend->fetchColumn()) reply(403, ['error' => 'not_friend']);
            $sentToday = $pdo->prepare('SELECT COUNT(*) FROM cheers WHERE from_id = ? AND day = ?');
            $sentToday->execute([$me['id'], $today]);
            if ((int)$sentToday->fetchColumn() >= MAX_CHEERS_PER_DAY) reply(429, ['error' => 'wait']);
            $ins = $pdo->prepare('INSERT OR IGNORE INTO cheers (from_id, to_id, day, created) VALUES (?, ?, ?, ?)');
            $ins->execute([$me['id'], $code, $today, $now]);
            if ($ins->rowCount() === 0) reply(409, ['error' => 'already']);

            // Notificación al móvil del amigo, si tiene el recordatorio activado.
            $pushed = false;
            $st = $pdo->prepare('SELECT s.* FROM friend_profiles p JOIN push_subscriptions s ON s.endpoint = p.push_endpoint WHERE p.id = ?');
            $st->execute([$code]);
            if ($sub = $st->fetch()) {
                try {
                    $status = webpush_send($sub, [
                        'kind' => 'cheer',
                        'title' => '👏 ¡Ánimo!',
                        'body' => $me['nickname'] . ' te anima a seguir con tu lectura de la Biblia 🔥',
                    ], 24 * 3600);
                    $pushed = $status >= 200 && $status < 300;
                } catch (Throwable $e) {
                    error_log('friends.php cheer push: ' . $e->getMessage());
                }
            }
            reply(200, ['pushed' => $pushed]);

        case 'delete':
            $pdo->prepare('DELETE FROM friendships WHERE a = ? OR b = ?')->execute([$me['id'], $me['id']]);
            $pdo->prepare('DELETE FROM cheers WHERE from_id = ? OR to_id = ?')->execute([$me['id'], $me['id']]);
            $pdo->prepare('DELETE FROM friend_profiles WHERE id = ?')->execute([$me['id']]);
            reply(200);
    }
    reply(400, ['error' => 'action']);
} catch (Throwable $e) {
    error_log('friends.php: ' . $e->getMessage());
    reply(500, ['error' => 'server']);
}

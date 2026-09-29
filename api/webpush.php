<?php
// Web Push sin dependencias: claves VAPID (RFC 8292) y cifrado del mensaje aes128gcm (RFC 8291).
declare(strict_types=1);

require_once __DIR__ . '/db.php';

const VAPID_FILE = DATA_DIR . '/vapid.json';
const VAPID_SUBJECT = 'https://mycongre.com';
// Solo se envía a servicios de push conocidos (evita que alguien use el servidor para llamar a otras URLs).
const PUSH_HOST_SUFFIXES = ['.googleapis.com', '.mozilla.com', '.mozaws.net', '.push.apple.com', '.notify.windows.com'];

function b64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64url_decode(string $data): string
{
    $decoded = base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4), true);
    return $decoded === false ? '' : $decoded;
}

function is_valid_push_endpoint(string $endpoint): bool
{
    if (strlen($endpoint) > 1000 || !str_starts_with($endpoint, 'https://')) return false;
    $host = strtolower((string)parse_url($endpoint, PHP_URL_HOST));
    foreach (PUSH_HOST_SUFFIXES as $suffix) {
        if (str_ends_with('.' . $host, $suffix)) return true;
    }
    return false;
}

/** Claves VAPID del servidor; se generan la primera vez. */
function vapid_keys(): array
{
    if (is_file(VAPID_FILE)) {
        $keys = json_decode((string)file_get_contents(VAPID_FILE), true);
        if (is_array($keys) && !empty($keys['publicKey']) && !empty($keys['privatePem'])) return $keys;
    }
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0750, true);
    $key = openssl_pkey_new(['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC]);
    if ($key === false) throw new RuntimeException('No se pudo generar la clave VAPID: ' . openssl_error_string());
    openssl_pkey_export($key, $pem);
    $ec = openssl_pkey_get_details($key)['ec'];
    $keys = ['publicKey' => b64url_encode("\x04" . str_pad($ec['x'], 32, "\0", STR_PAD_LEFT) . str_pad($ec['y'], 32, "\0", STR_PAD_LEFT)), 'privatePem' => $pem];
    $fh = @fopen(VAPID_FILE, 'x');
    if ($fh) {
        fwrite($fh, json_encode($keys));
        fclose($fh);
        @chmod(VAPID_FILE, 0600);
        return $keys;
    }
    // Otro proceso la creó a la vez: usamos la suya.
    return json_decode((string)file_get_contents(VAPID_FILE), true);
}

/** Convierte una clave pública P-256 en bruto (65 bytes) a PEM. */
function p256_public_pem(string $raw): string
{
    $der = hex2bin('3059301306072a8648ce3d020106082a8648ce3d030107034200') . $raw;
    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode($der), 64, "\n") . "-----END PUBLIC KEY-----\n";
}

/** Firma ECDSA en DER → formato JOSE (r || s, 64 bytes). */
function der_to_jose(string $der): string
{
    $offset = 2 + (ord($der[1]) & 0x80 ? ord($der[1]) & 0x7f : 0);
    $parts = [];
    for ($i = 0; $i < 2; $i++) {
        $len = ord($der[$offset + 1]);
        $int = substr($der, $offset + 2, $len);
        $parts[] = str_pad(ltrim($int, "\0"), 32, "\0", STR_PAD_LEFT);
        $offset += 2 + $len;
    }
    return $parts[0] . $parts[1];
}

function vapid_authorization(string $endpoint, array $keys): string
{
    $url = parse_url($endpoint);
    $header = b64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $claims = b64url_encode(json_encode(['aud' => $url['scheme'] . '://' . $url['host'], 'exp' => time() + 12 * 3600, 'sub' => VAPID_SUBJECT]));
    $input = "$header.$claims";
    if (!openssl_sign($input, $der, $keys['privatePem'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('No se pudo firmar el JWT VAPID');
    }
    return 'vapid t=' . $input . '.' . b64url_encode(der_to_jose($der)) . ', k=' . $keys['publicKey'];
}

/** Cifra el mensaje para una suscripción (Content-Encoding: aes128gcm). */
function webpush_encrypt(string $payload, string $p256dh, string $authSecret): string
{
    $uaPublic = b64url_decode($p256dh);
    $auth = b64url_decode($authSecret);
    if (strlen($uaPublic) !== 65 || strlen($auth) !== 16) throw new InvalidArgumentException('Claves de suscripción no válidas');

    $local = openssl_pkey_new(['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC]);
    $ec = openssl_pkey_get_details($local)['ec'];
    $asPublic = "\x04" . str_pad($ec['x'], 32, "\0", STR_PAD_LEFT) . str_pad($ec['y'], 32, "\0", STR_PAD_LEFT);

    $shared = openssl_pkey_derive(openssl_pkey_get_public(p256_public_pem($uaPublic)), $local, 32);
    if ($shared === false) throw new RuntimeException('ECDH falló: ' . openssl_error_string());

    $ikm = hash_hkdf('sha256', $shared, 32, "WebPush: info\0" . $uaPublic . $asPublic, $auth);
    $salt = random_bytes(16);
    $cek = hash_hkdf('sha256', $ikm, 16, "Content-Encoding: aes128gcm\0", $salt);
    $nonce = hash_hkdf('sha256', $ikm, 12, "Content-Encoding: nonce\0", $salt);

    $ciphertext = openssl_encrypt($payload . "\x02", 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag);
    return $salt . pack('N', 4096) . chr(65) . $asPublic . $ciphertext . $tag;
}

/**
 * Envía un mensaje. Devuelve el código HTTP del servicio de push
 * (201 = entregado; 404/410 = suscripción caducada, hay que borrarla).
 */
function webpush_send(array $sub, array $message, int $ttl = 12 * 3600): int
{
    if (!is_valid_push_endpoint($sub['endpoint'])) return 400;
    $keys = vapid_keys();
    $body = webpush_encrypt(json_encode($message, JSON_UNESCAPED_UNICODE), $sub['p256dh'], $sub['auth']);
    $ch = curl_init($sub['endpoint']);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => [
            'Authorization: ' . vapid_authorization($sub['endpoint'], $keys),
            'Content-Encoding: aes128gcm',
            'Content-Type: application/octet-stream',
            'TTL: ' . $ttl,
            'Urgency: normal',
        ],
    ]);
    curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return $code;
}

const CRON_FILE = DATA_DIR . '/cron.json';

/** Estado del cron: token secreto para llamarlo por URL y la última ejecución. */
function cron_state(): array
{
    $state = is_file(CRON_FILE) ? json_decode((string)file_get_contents(CRON_FILE), true) : null;
    if (!is_array($state) || empty($state['token'])) {
        $state = ['token' => bin2hex(random_bytes(24)), 'lastRun' => null, 'lastResult' => null];
        save_cron_state($state);
    }
    return $state;
}

function save_cron_state(array $state): void
{
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0750, true);
    file_put_contents(CRON_FILE, json_encode($state), LOCK_EX);
    @chmod(CRON_FILE, 0600);
}

function push_log(string $day, string $field, int $n = 1): void
{
    if (!in_array($field, ['sent', 'failed', 'clicked'], true)) return;
    db()->prepare("INSERT INTO push_log (day, $field) VALUES (?, ?) ON CONFLICT(day) DO UPDATE SET $field = $field + excluded.$field")
        ->execute([$day, $n]);
}

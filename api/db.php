<?php
// Conexión a la base de datos SQLite de estadísticas (se crea sola la primera vez).
declare(strict_types=1);

date_default_timezone_set('Europe/Madrid');

const DATA_DIR = __DIR__ . '/../data';
const DB_FILE = DATA_DIR . '/lectura.sqlite';
const PLATFORMS = ['android', 'ios', 'windows', 'mac', 'linux', 'otro'];

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0750, true);
    }
    $pdo = new PDO('sqlite:' . DB_FILE, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA busy_timeout = 5000');
    migrate($pdo);
    return $pdo;
}

function migrate(PDO $pdo): void
{
    $pdo->exec(<<<'SQL'
        CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            first_seen TEXT NOT NULL,
            last_seen TEXT NOT NULL,
            platform TEXT NOT NULL DEFAULT 'otro',
            version TEXT NOT NULL DEFAULT '',
            installed INTEGER NOT NULL DEFAULT 0,
            installed_at TEXT,
            opens INTEGER NOT NULL DEFAULT 0,
            seconds INTEGER NOT NULL DEFAULT 0,
            chapters_marked INTEGER NOT NULL DEFAULT 0,
            chapters_read INTEGER NOT NULL DEFAULT 0,
            plan_started INTEGER NOT NULL DEFAULT 0,
            delay_days INTEGER NOT NULL DEFAULT 0,
            streak INTEGER NOT NULL DEFAULT 0,
            awards INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS activity (
            device_id TEXT NOT NULL,
            day TEXT NOT NULL,
            opens INTEGER NOT NULL DEFAULT 0,
            seconds INTEGER NOT NULL DEFAULT 0,
            chapters INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (device_id, day)
        );
        CREATE INDEX IF NOT EXISTS idx_activity_day ON activity(day);
        CREATE INDEX IF NOT EXISTS idx_devices_first_seen ON devices(first_seen);
        CREATE TABLE IF NOT EXISTS push_subscriptions (
            endpoint TEXT PRIMARY KEY,
            p256dh TEXT NOT NULL,
            auth TEXT NOT NULL,
            device_id TEXT,
            remind_time TEXT NOT NULL DEFAULT '08:00',
            timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
            created TEXT NOT NULL,
            last_sent_date TEXT,
            last_done_date TEXT,
            last_test TEXT,
            failures INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS push_log (
            day TEXT PRIMARY KEY,
            sent INTEGER NOT NULL DEFAULT 0,
            failed INTEGER NOT NULL DEFAULT 0,
            clicked INTEGER NOT NULL DEFAULT 0
        );
        SQL);
}

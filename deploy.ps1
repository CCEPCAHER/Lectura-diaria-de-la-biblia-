# deploy.ps1
# Sube la app a Hostinger (mylectura.mycongre.com) por FTP.
#
# Uso:
#   .\deploy.ps1                     -> sube todos los archivos de la app
#   .\deploy.ps1 index.html          -> sube solo ese archivo
#   .\deploy.ps1 script.js style.css -> sube varios archivos
#
# Credenciales: deploy.secrets.ps1 junto a este script (define $ftpHost, $ftpUser, $ftpPass; está en .gitignore)
# o variables de entorno LECTURA_FTP_HOST/USER/PASS (si no existen, usa las BIBLIA_FTP_*).
#   LECTURA_FTP_BASE  (opcional) carpeta remota, por defecto /domains/mylectura.mycongre.com/public_html

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Files
)

$secretsFile = Join-Path $(if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }) "deploy.secrets.ps1"
if (Test-Path $secretsFile) { . $secretsFile }

if (-not $ftpHost) { $ftpHost = if ($env:LECTURA_FTP_HOST) { $env:LECTURA_FTP_HOST } else { $env:BIBLIA_FTP_HOST } }
if (-not $ftpUser) { $ftpUser = if ($env:LECTURA_FTP_USER) { $env:LECTURA_FTP_USER } else { $env:BIBLIA_FTP_USER } }
if (-not $ftpPass) { $ftpPass = if ($env:LECTURA_FTP_PASS) { $env:LECTURA_FTP_PASS } else { $env:BIBLIA_FTP_PASS } }
$remoteBase = if ($env:LECTURA_FTP_BASE) { $env:LECTURA_FTP_BASE } else { "/domains/mylectura.mycongre.com/public_html" }

if (-not $ftpHost -or -not $ftpUser -or -not $ftpPass) {
    Write-Host "Faltan las credenciales FTP (LECTURA_FTP_HOST/USER/PASS)." -ForegroundColor Red
    exit 1
}

# data/ solo lleva su .htaccess: la base de datos y la contraseña se crean en el servidor.
$allFiles = @(
    ".htaccess", "index.html", "style.css", "pwa.js", "script.js", "stats.js", "reminders.js", "onboarding.js", "sync.js", "friends.js", "sw.js", "manifest.json",
    "icons/icon-192x192.png", "icons/icon-512x512.png", "og-image.jpg",
    "api/db.php", "api/collect.php", "api/webpush.php", "api/push.php", "api/cron.php", "api/sync.php", "api/weekly.php", "api/friends.php",
    "admin/index.php",
    "data/.htaccess"
)
$remoteDirs = @("icons", "api", "admin", "data")

$filesToUpload = if ($Files -and $Files.Count -gt 0) { $Files } else { $allFiles }
$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
$credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

function New-FtpRequest([string]$path, [string]$method) {
    $request = [System.Net.FtpWebRequest]::Create((New-Object System.Uri("ftp://$ftpHost$path")))
    $request.Credentials = $credentials
    $request.Method = $method
    $request.UseBinary = $true
    $request.UsePassive = $true
    $request.KeepAlive = $false
    return $request
}

foreach ($dir in $remoteDirs) {
    try { (New-FtpRequest "$remoteBase/$dir" ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)).GetResponse().Close() } catch { }
}

Write-Host "Subiendo $($filesToUpload.Count) archivo(s) a $remoteBase ..." -ForegroundColor Cyan
$fallidos = 0

foreach ($file in $filesToUpload) {
    $relative = $file -replace '\\', '/'
    $localFile = Join-Path $baseDir $relative
    if (-not (Test-Path $localFile)) {
        Write-Host "No existe: $relative" -ForegroundColor Yellow
        $fallidos++
        continue
    }
    try {
        $request = New-FtpRequest "$remoteBase/$relative" ([System.Net.WebRequestMethods+Ftp]::UploadFile)
        $bytes = [System.IO.File]::ReadAllBytes($localFile)
        $request.ContentLength = $bytes.Length
        $stream = $request.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        $request.GetResponse().Close()
        Write-Host "OK  $relative" -ForegroundColor Green
    } catch {
        Write-Host "ERROR $relative : $($_.Exception.Message)" -ForegroundColor Red
        $fallidos++
    }
}

if ($fallidos -gt 0) {
    Write-Host "Terminado con $fallidos error(es)." -ForegroundColor Red
    exit 1
}
Write-Host "Despliegue completado: https://mylectura.mycongre.com/" -ForegroundColor Cyan

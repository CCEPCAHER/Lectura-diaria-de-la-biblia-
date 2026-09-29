# Lectura diaria de la Biblia

App web gratuita (PWA) para leer la Biblia completa en un año: lectura sugerida del día, progreso por libro,
rachas, metas temáticas, progreso mensual/anual, recordatorios en calendario (.ics) y copia de seguridad.
Funciona sin conexión. Se publica en **https://mylectura.mycongre.com/**.

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html`, `style.css`, `script.js` | La app (el progreso se guarda en el `localStorage` del navegador) |
| `pwa.js` | Avisos, registro del Service Worker y botón «Instalar» |
| `stats.js` | Estadísticas anónimas de uso → `api/collect.php` (se pueden desactivar en Menú → Acerca de) |
| `sync.js`, `api/sync.php` | Sincronización entre dispositivos con un código; cifrado de extremo a extremo (el servidor no puede leer el progreso) |
| `friends.js`, `api/friends.php` | Amigos sin cuentas: apodo, enlace de invitación, la racha de cada amigo (solo eso) y botón «👏 Animar» (con notificación si tienen el recordatorio activo) |
| `onboarding.js` | Vídeo de bienvenida animado (7 escenas, subtítulos y narración opcional) y configuración rápida; se repite en Menú → Acerca de |
| `reminders.js` | Recordatorio diario: pide permiso y suscribe el dispositivo a las notificaciones push |
| `api/push.php`, `api/webpush.php` | Suscripciones y envío Web Push (claves VAPID propias, sin servicios externos) |
| `api/weekly.php` | Lectura bíblica de la semana (reunión Vida y Ministerio), tomada de wol.jw.org una vez por semana y guardada en `data/weekly/` |
| `api/cron.php` | Envía los recordatorios a la hora elegida por cada persona (lo ejecuta un cron) |
| `sw.js` | Modo sin conexión: red primero, caché como respaldo |
| `api/collect.php`, `api/db.php` | Recibe las estadísticas y las guarda en SQLite (`data/lectura.sqlite`) |
| `admin/index.php` | Panel privado de estadísticas |
| `data/` | Base de datos y contraseña del panel. Protegida por `.htaccess`, **no** está en git |

## Publicar en Hostinger

1. Crea el subdominio `mylectura.mycongre.com` en hPanel y activa SSL (HTTPS es obligatorio para instalar la app).
2. Comprueba que el subdominio use PHP 8.1 o superior (trae SQLite de serie).
3. Sube los archivos:
   ```powershell
   .\deploy.ps1
   ```
   Usa las variables `LECTURA_FTP_HOST/USER/PASS` (o, si no existen, las de biblia.mycongre.com).
   Si la carpeta del subdominio no es `/domains/mylectura.mycongre.com/public_html`, define `LECTURA_FTP_BASE`.
4. **Nada más subirla**, entra en https://mylectura.mycongre.com/admin/ y crea tu contraseña de administrador.
   Solo se puede crear una vez; después pide la contraseña.
5. Comprueba que https://mylectura.mycongre.com/data/lectura.sqlite devuelve **403** (prohibido).

6. **Recordatorios:** en hPanel → Avanzado → Cron Jobs crea una tarea «Personalizada» cada 5 minutos
   (`*/5 * * * *`) con el comando que aparece en el panel de admin (sección «Recordatorios diarios»),
   algo como `/usr/bin/php /home/USUARIO/domains/mylectura.mycongre.com/public_html/api/cron.php`.
   Si tu plan no tiene cron, usa la URL secreta del panel en un servicio gratuito como cron-job.org.

¿Olvidaste la contraseña? Borra `data/admin.json` por FTP y vuelve a entrar en `/admin/` para crear otra.

## Recordatorio diario

- Cada persona elige la hora en Menú → Recordatorio diario (o con el botón «🔔 Recordármelo cada día»).
- El aviso muestra la lectura del día («📖 Día 12: Génesis 31-32») y no se envía si ya la marcó como leída.
- Android, Windows, Mac y Linux: funciona en el navegador. **iPhone/iPad (iOS 16.4+): solo con la app instalada**
  en la pantalla de inicio.
- Las claves VAPID se generan solas en `data/vapid.json` la primera vez. No las borres: invalidarían todas las suscripciones.

## Qué mide el panel

- **Personas**: dispositivos distintos (identificador aleatorio, sin nombre, correo ni IP).
- **Instalaciones**: dispositivos que instalaron la app o la abrieron ya instalada.
- **Activos** hoy / 7 / 30 días, **nuevos** por día, **minutos de uso** (solo tiempo con la app visible y en uso).
- **Retención**: de quienes empezaron hace más de 7 días, cuántos la usaron esta semana.
- Progreso de lectura, estado del plan, rachas, sistemas y versiones.
- Recordatorios activos, enviados, abiertos y estado del cron.

Al publicar una versión nueva, sube el número `APP_VERSION` de `stats.js` y el `?v=` de los `<script>`/`<link>` de `index.html`
(así ningún móvil usa una copia vieja de los archivos) y el nombre de `CACHE` en `sw.js`.

## Probar en local

```bash
php -d extension=pdo_sqlite -S 127.0.0.1:5500
```

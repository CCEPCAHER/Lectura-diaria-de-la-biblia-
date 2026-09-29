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

¿Olvidaste la contraseña? Borra `data/admin.json` por FTP y vuelve a entrar en `/admin/` para crear otra.

## Qué mide el panel

- **Personas**: dispositivos distintos (identificador aleatorio, sin nombre, correo ni IP).
- **Instalaciones**: dispositivos que instalaron la app o la abrieron ya instalada.
- **Activos** hoy / 7 / 30 días, **nuevos** por día, **minutos de uso** (solo tiempo con la app visible y en uso).
- **Retención**: de quienes empezaron hace más de 7 días, cuántos la usaron esta semana.
- Progreso de lectura, estado del plan, rachas, sistemas y versiones.

Al publicar una versión nueva, sube el número `APP_VERSION` de `stats.js` para verlo en «Versiones en uso».

## Probar en local

```bash
php -d extension=pdo_sqlite -S 127.0.0.1:5500
```

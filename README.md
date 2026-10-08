# Compi · amigo virtual, agenda y ánimo (con Supabase)

Compi es una página web estática (HTML + JS) que usa **Supabase** como backend:
cuentas con correo y contraseña, y datos (perfil, agenda y registro de ánimo)
guardados en la nube para entrar desde cualquier dispositivo.

> **Importante:** Supabase aloja el *backend* (base de datos y cuentas), no la página.
> Su Storage no sirve archivos HTML como páginas web (los entrega como texto plano).
> Por eso la página se publica en un hosting estático gratuito (Netlify, Vercel,
> Cloudflare Pages o GitHub Pages) y se conecta a Supabase con las claves de `config.js`.

## Archivos

```
compi-supabase/
├── index.html            la app completa
├── config.js             aquí pegas tu URL y clave pública de Supabase
├── supabase/schema.sql   tablas, seguridad (RLS) y función para borrar cuenta
└── README.md
```

## Paso a paso

### 1. Crear el proyecto en Supabase
1. Entra a https://supabase.com, crea una cuenta y un **New project**.
2. Guarda la contraseña de la base de datos y espera a que termine de crearse.

### 2. Crear las tablas
1. En el panel: **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Revisa en **Table Editor** que existan `profiles`, `events` y `moods`
   (con el candado de RLS activado).

### 3. Configurar el inicio de sesión
1. **Authentication → Sign In / Providers**: deja habilitado **Email**.
2. Para probar rápido puedes desactivar **Confirm email**. En producción es mejor dejarlo activado.
3. **Authentication → URL Configuration**:
   - **Site URL**: la dirección donde publicarás la página (por ejemplo `https://compi.netlify.app`).
   - **Redirect URLs**: agrega esa misma dirección (y `http://localhost:3000` si pruebas en tu PC).
   Sin esto, los enlaces de confirmar correo y recuperar contraseña no te devolverán a la app.

### 4. Conectar la página
1. **Project Settings → API** (o el botón **Connect**): copia la **Project URL** y la clave pública (**anon** o **publishable**).
2. Pégalas en `config.js`.

> La clave pública está hecha para ir en el navegador. Lo que protege los datos
> es la seguridad por fila (RLS) que crea `schema.sql`. **Nunca** pongas la clave
> `service_role` o `secret` en la página.

### 5. Probar en tu computadora
```bash
cd compi-supabase
python3 -m http.server 3000     # o: npx serve -l 3000 .
```
Abre http://localhost:3000, crea una cuenta, completa tus gustos y agrega un recordatorio.
En Supabase → Table Editor deberías ver tus filas.

### 6. Publicar la página
Elige uno (todos tienen plan gratuito):
- **Netlify**: https://app.netlify.com/drop → arrastra la carpeta `compi-supabase`.
- **Vercel**: `npx vercel` dentro de la carpeta, o importa el repositorio.
- **Cloudflare Pages** o **GitHub Pages**: sube la carpeta a un repositorio y actívalo.

Cuando tengas la dirección final, vuelve al paso 3 y ponla en **Site URL** y **Redirect URLs**.

### 7. Verificación recomendada
- Crea **dos cuentas** y comprueba que cada una ve solo sus datos.
- Entra con la misma cuenta desde otro dispositivo y confirma que la agenda y el ánimo aparecen.
- Prueba "¿Olvidaste tu contraseña?" y "Borrar mi cuenta y mis datos".

## Qué se guarda y dónde

| Dato | Dónde |
|---|---|
| Cuenta (correo y contraseña cifrada) | Supabase Auth |
| Nombre y gustos | tabla `profiles` |
| Agenda y recordatorios (con repetición) | tabla `events` |
| Registro de ánimo (emoción, valor y fecha, sin texto) | tabla `moods` |
| Conversación con Compi | **solo en el navegador** del dispositivo (no se sube) |

El chat no se sube a propósito: contiene texto libre y personal. Si más adelante quieres
sincronizarlo, conviene avisarlo claramente en la pantalla de registro.

## Privacidad y responsabilidad
- El registro de ánimo se considera información sensible sobre la salud. Está protegido por RLS
  y cada persona puede borrar su cuenta y sus datos desde la pestaña **Ánimo**.
- Si Compi lo usarán personas fuera de tu entorno de pruebas, agrega un aviso de privacidad y pide
  consentimiento. En Perú aplica la Ley N.° 29733 (Protección de Datos Personales); conviene revisarla.
- Compi **no es un servicio de salud ni reemplaza a un psicólogo**. Ante crisis muestra la
  Línea 113 (marca 113, opción 3 y luego 5), la Línea 100 y el 105. Verifica de vez en cuando
  que esos números sigan vigentes.

## Modo local
Si dejas `config.js` con los valores de ejemplo (o no hay conexión a la librería de Supabase),
la app funciona igual en **modo local**: cuentas y datos se guardan solo en ese navegador.

## Limitaciones actuales
- Los avisos (notificaciones) solo suenan **mientras la página está abierta**. Para avisar con la
  página cerrada hace falta Web Push más una Edge Function de Supabase con `pg_cron`.
- Compi entiende lo que escribes con reglas y listas de frases, no con un modelo de IA.
  Para conversaciones abiertas se puede conectar un modelo de lenguaje mediante una Edge Function
  (la clave del modelo nunca debe ir en la página).
- Si dos dispositivos editan lo mismo a la vez, gana el último cambio guardado.

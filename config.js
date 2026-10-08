// Configuración de Compi para Supabase.
// 1) Supabase → Project Settings → API (o "Connect")
// 2) Copia la "Project URL" y la clave pública ("anon" o "publishable") y pégalas aquí.
// NUNCA pegues aquí la clave "service_role" ni "secret": esas son privadas.
// Si dejas los valores de ejemplo, la app funciona en modo local (sin nube).
window.COMPI_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU-ANON-KEY'
};

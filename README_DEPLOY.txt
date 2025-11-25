README - Cómo ejecutar build, probar funciones y generar `dist.zip`

Resumen
Este repo ya contiene los cambios necesarios para que los registros se guarden en Supabase:
- `netlify/functions/createProfile.js` — función server-side que inserta perfiles usando la service_role key.
- `src/lib/services/registerUser.ts` — llama a la función tras `signUp`.
- `migrations/002_create_schema.sql` — esquema y políticas RLS recomendadas.
- `build-and-zip.cmd` — script Windows para instalar, build y crear `dist.zip`.

Antes de ejecutar
1) Asegúrate de tener Node.js (v18) y npm instalados.
2) Crea `.env.local` en la raíz del proyecto con estas variables (NO lo comitees):
   VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<tu_anon_key>"
   SUPABASE_SERVICE_ROLE_KEY="<tu_service_role_key>"  # obligatorio para la función createProfile
   SUPABASE_URL="https://<tu-proyecto>.supabase.co"

Pasos para ejecutar (Windows cmd.exe)
1) Abrir cmd y situarse en la carpeta del proyecto:
   cd "c:\Users\Usuario\OneDrive\Desktop\proyectos solopara despliegue listo\sistema_notas"

2) Ejecutar el script que instala dependencias, build y genera dist.zip:
   build-and-zip.cmd

3) Si el script falla, copia aquí el output completo para que te ayude a diagnosticar.

Probar funciones localmente (opcional, usa Netlify CLI)
1) Instalar Netlify CLI si no lo tienes:
   npm install -g netlify-cli
2) Iniciar entorno local de Netlify (leerá el .env.local):
   netlify dev
3) En otra terminal, invocar la función createProfile (ejemplo):
   curl -X POST http://localhost:8888/.netlify/functions/createProfile ^
    -H "Content-Type: application/json" ^
    -d "{\"id\":\"11111111-1111-1111-1111-111111111111\",\"name\":\"Test\",\"email\":\"test@example.com\",\"role\":\"student\",\"level\":\"1\",\"grade\":\"A\"}"

Desplegar `dist` en Netlify
- Opción rápida: arrastra `dist` (o `dist.zip`) al panel de Deploys (drag & drop).
- Opción CLI reproducible:
  netlify deploy --prod --dir=dist

Verificaciones finales
- En Supabase Dashboard → Auth → Users: confirma que el usuario se creó.
- En Supabase Dashboard → Table Editor → public.users: confirma que el perfil existe.
- En Netlify → Site → Functions → Logs: revisa invocaciones de `createProfile` si hay errores.

Si necesitas, pega aquí el output de `build-and-zip.cmd`, `netlify dev` logs, o la respuesta de la función y lo analizo.

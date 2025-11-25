# Despliegue en Netlify y conexión a Supabase

Resumen rápido:
- Este proyecto usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` durante el build y en las funciones Netlify.
- No guardes `.env.local` en el repositorio; en su lugar configura las variables de entorno en el panel de Netlify.

Pasos recomendados para desplegar correctamente y de forma segura:

1) Rotar la ANON key en Supabase (recomendado ahora)
   - Abre https://app.supabase.com → tu proyecto → Settings → API → Revoke/Regenerate anon key.
   - Genera una nueva `anon` key y cópiala.

2) Configurar variables de entorno en Netlify
   - En Netlify, abre tu sitio → Site settings → Build & deploy → Environment → Environment variables.
   - Añade las siguientes variables (exacto nombre):
     - `VITE_SUPABASE_URL` = `https://<tu-proyecto>.supabase.co` (ej. `https://nqdoabqqnvuwnvgtjizk.supabase.co`)
     - `VITE_SUPABASE_ANON_KEY` = `<la_nueva_anon_key>`
   - Guarda los cambios.
      - Guarda los cambios.

   Nota importante (service role):
   - Para que la función server-side `createProfile` pueda insertar perfiles aún cuando el usuario
      no tenga sesión (por ejemplo cuando se requiere verificación de email), añade también en Netlify:
      - `SUPABASE_SERVICE_ROLE_KEY` = `<your-service-role-key>`
      - `SUPABASE_URL` = `https://<tu-proyecto>.supabase.co`

      La `service_role` key nunca debe ir en el bundle del cliente. Sólo se usa desde funciones server-side.

3) Qué hace el proyecto en Netlify
   - `netlify/functions/proxy.js` usa `process.env.VITE_SUPABASE_URL` y `process.env.VITE_SUPABASE_ANON_KEY` para hacer proxy a la API de Supabase desde funciones (correcto).
   - El cliente en `src/lib/supabaseClient.ts` usa `import.meta.env.VITE_SUPABASE_*` y por tanto recibirá esos valores durante el build en Netlify.

4) Si no quieres exponer la `anon` key en el bundle del cliente
   - Opcional: cambia la app para que todas las llamadas desde el navegador vayan al proxy (`/netlify/functions/proxy`) y que la función pasarela haga las llamadas a Supabase. Esto requiere reescribir las llamadas `supabase.from(...)` a fetch hacia los endpoints del proxy o implementar wrappers.
   - Alternativa (más sencilla): aceptar que la `anon` key es pública para operaciones permitidas por RLS (modo de uso común). Nunca uses la `service_role` key en el cliente.

5) Desplegar
   - Push a tu repo remoto conectado a Netlify; Netlify ejecutará `npm run build` y usará las vars de entorno configuradas.

6) Limpieza git (si la clave estuvo comiteada anteriormente)
   - Si `.env.local` fue comprometido en commits previos, considera limpiar el historial (ej. BFG o `git filter-repo`) y forzar push. Atención: esto reescribe el historial y afecta a colaboradores.

Comandos útiles (Windows `cmd.exe`):

1) Para confirmar que `node` y `npm` están bien en local:
```
node -v
npm -v
```

2) Para desplegar localmente (prueba antes de push):
```
npm install
npm run build
```

Si quieres, puedo:
- Añadir un script de ayuda para mostrar variables esperadas.
- Preparar un commit que deje claramente en el README.md las instrucciones resumidas.
- Guiarte paso a paso para rotar la key en Supabase y configurar las vars en Netlify.

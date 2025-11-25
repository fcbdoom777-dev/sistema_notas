Migración: Añadir columnas `level` y `grade` a la tabla `users`

Descripción

Este directorio contiene la migración SQL para añadir las columnas `level` y `grade` a la tabla `users` en la base de datos Supabase.

Archivo principal

- `001_add_level_grade.sql`: Agrega columnas `level` (text) y `grade` (text), un constraint opcional para `level` y dos índices opcionales.

Instrucciones de uso (consola web - recomendado)

1. Abre https://app.supabase.com y entra en tu proyecto.
2. Ve a Database → SQL Editor.
3. Haz click en "New query" y pega el contenido de `001_add_level_grade.sql` (o sube el archivo si lo prefieres).
4. Haz click en "RUN".
5. Verifica ejecución: la salida debe mostrar `COMMIT` y sin errores.

Verificaciones útiles

- Ver algunos registros y las nuevas columnas:

```sql
SELECT id, email, name, role, level, grade
FROM public.users
LIMIT 50;
```

- Contar por nivel y grado:

```sql
SELECT level, grade, COUNT(*) AS cnt
FROM public.users
GROUP BY level, grade
ORDER BY level NULLS LAST, grade NULLS LAST;
```

Rollback (si necesitas deshacer)

```sql
BEGIN;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_level_check;
DROP INDEX IF EXISTS idx_users_level;
DROP INDEX IF EXISTS idx_users_grade;
ALTER TABLE public.users DROP COLUMN IF EXISTS level;
ALTER TABLE public.users DROP COLUMN IF EXISTS grade;

COMMIT;
```

Notas importantes

- Haz backup antes de aplicar en producción.
- Si tu frontend ya envía `level` y `grade`, ejecuta esta migración ANTES de usar la UI contra la base real para evitar errores de columna desconocida.
- Revisa políticas RLS si están activas en la tabla `users`.

Si quieres, puedo ayudarte a ejecutar esto en tu proyecto ahora (guía paso a paso en la consola web) o crear una migration en tu flujo de migraciones preferido (p. ej. supabase migrations).
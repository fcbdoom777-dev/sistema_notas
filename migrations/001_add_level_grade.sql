BEGIN;

-- 1) Añadir columnas text si no existen
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS level text,
  ADD COLUMN IF NOT EXISTS grade text;

-- 2) (Opcional) Añadir constraint solo si no existe (Postgres no soporta ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'users' AND c.conname = 'users_level_check'
  ) THEN
    EXECUTE 'ALTER TABLE public.users ADD CONSTRAINT users_level_check CHECK (level IS NULL OR level IN (''prescolar'',''primaria'',''secundaria''))';
  END IF;
END
$$;

-- 3) Índices opcionales para acelerar filtros por nivel/grade
CREATE INDEX IF NOT EXISTS idx_users_level ON public.users (level);
CREATE INDEX IF NOT EXISTS idx_users_grade ON public.users (grade);

COMMIT;

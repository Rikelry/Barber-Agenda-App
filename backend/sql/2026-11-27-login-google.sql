-- Login com Google: colunas para vincular a conta Google e para registrar
-- edições manuais de nome/avatar (o login com Google não sobrescreve o que o
-- usuário alterou manualmente). Contas Google não têm senha, então
-- password_hash passa a ser opcional.
alter table public.users
  add column if not exists avatar_url text,
  add column if not exists google_id text,
  add column if not exists name_edited_at timestamptz,
  add column if not exists avatar_edited_at timestamptz;

alter table public.users alter column password_hash drop not null;

create unique index if not exists users_google_id_key on public.users (google_id) where google_id is not null;

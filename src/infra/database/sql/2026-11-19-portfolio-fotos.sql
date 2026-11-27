-- Portfólio do profissional: fotos dos cortes, com legenda, serviço e "mostrar nas Inspirações".
-- Rodada no Supabase do grupo em 19/11/2026. RLS ligado e sem políticas: só o backend
-- (chave de serviço) lê e grava; a chave pública do app não acessa a tabela direto.
create table if not exists public.portfolio_fotos (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  image_url text not null,
  caption varchar(120),
  service_id uuid references public.services(id) on delete set null,
  featured boolean not null default false,
  -- O profissional confirma que o cliente da foto autorizou a publicação (LGPD).
  client_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_fotos_professional_idx on public.portfolio_fotos (professional_id, created_at desc);
create index if not exists portfolio_fotos_featured_idx on public.portfolio_fotos (featured, created_at desc) where featured;

alter table public.portfolio_fotos enable row level security;

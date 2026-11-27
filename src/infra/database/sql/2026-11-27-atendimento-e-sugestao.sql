-- Tela Trabalho (27/11/26). Rodar no Supabase depois de 2026-11-26-agendamento-pendente.sql.
-- 1) Status novos: aguardando_cliente (horário sugerido), em_andamento e nao_compareceu.
-- 2) Motivo da recusa e horário sugerido no agendamento.
-- 3) Um usuário pode atender em várias barbearias (um vínculo por barbearia).
do $$
declare
  tipo text;
  restricao text;
begin
  select udt_name into tipo
  from information_schema.columns
  where table_schema = 'public' and table_name = 'appointments' and column_name = 'status';

  if tipo in ('text', 'varchar') then
    for restricao in
      select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      where rel.relname = 'appointments' and con.contype = 'c'
        and pg_get_constraintdef(con.oid) ilike '%status%'
    loop
      execute format('alter table public.appointments drop constraint %I', restricao);
    end loop;
    alter table public.appointments
      add constraint appointments_status_check
      check (status in ('pendente', 'aguardando_cliente', 'agendado', 'em_andamento', 'concluido',
                        'recusado', 'cancelado', 'nao_compareceu'));
  else
    execute format('alter type %I add value if not exists %L', tipo, 'aguardando_cliente');
    execute format('alter type %I add value if not exists %L', tipo, 'em_andamento');
    execute format('alter type %I add value if not exists %L', tipo, 'nao_compareceu');
  end if;

  -- Vínculo único por usuário vira único por (usuário, barbearia).
  for restricao in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'professionals' and con.contype = 'u'
      and pg_get_constraintdef(con.oid) ilike '%(user_id)%'
  loop
    execute format('alter table public.professionals drop constraint %I', restricao);
  end loop;
end $$;

drop index if exists public.professionals_user_id_key;
create unique index if not exists professionals_user_barbershop_key
  on public.professionals (user_id, barbershop_id);

alter table public.appointments
  add column if not exists rejection_reason varchar(200),
  add column if not exists proposed_date date,
  add column if not exists proposed_start_time time,
  add column if not exists proposed_end_time time;

create index if not exists appointments_proposed_idx
  on public.appointments (professional_id, proposed_date)
  where status = 'aguardando_cliente';

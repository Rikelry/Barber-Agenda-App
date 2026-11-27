-- Pedidos de horário: o cliente pede ('pendente'), o profissional ou o dono aprova ('agendado')
-- ou recusa ('recusado'). Rodar no Supabase do grupo antes de subir o backend novo.
-- Funciona com a coluna status como enum ou como texto com CHECK.
do $$
declare
  tipo text;
  restricao text;
begin
  select udt_name into tipo
  from information_schema.columns
  where table_schema = 'public' and table_name = 'appointments' and column_name = 'status';

  if tipo in ('text', 'varchar') then
    -- Remove o CHECK antigo do status (qualquer nome) e cria o novo.
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
      check (status in ('pendente', 'agendado', 'recusado', 'concluido', 'cancelado'));
  else
    -- Coluna enum: só acrescenta os valores novos.
    execute format('alter type %I add value if not exists %L', tipo, 'pendente');
    execute format('alter type %I add value if not exists %L', tipo, 'recusado');
  end if;
end $$;

-- A agenda da barbearia (dono) lista por barbearia e data.
create index if not exists appointments_barbershop_date_idx
  on public.appointments (barbershop_id, date, start_time);

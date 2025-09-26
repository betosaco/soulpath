-- Create teacher_payment_settings table
create table if not exists public.teacher_payment_settings (
  id serial primary key,
  teacher_id integer unique not null references public.teachers(id) on delete cascade,
  bank_name varchar(255),
  account_number varchar(60),
  account_type varchar(50),
  ruc varchar(20),
  payout_email varchar(255),
  payout_phone varchar(30),
  document_type varchar(30),
  document_number varchar(30),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_teacher_payment_settings_teacher on public.teacher_payment_settings(teacher_id);

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_teacher_payment_settings on public.teacher_payment_settings;
create trigger set_updated_at_teacher_payment_settings
before update on public.teacher_payment_settings
for each row execute procedure public.set_updated_at();



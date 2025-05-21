-- Create writings table
create table if not exists public.writings (
  id uuid default gen_random_uuid() primary key,
  created_at date not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title jsonb not null,
  slug text not null,
  content jsonb not null,
  excerpt jsonb,
  category text not null,
  tags jsonb,
  image_url text not null default '/ugursahan.webp',
  is_published boolean default true,
  reading_time smallint not null check (reading_time > 0 and reading_time <= 999),
  views integer default 0,
  author_id uuid references auth.users(id) on delete cascade not null,
  constraint writings_category_check check (category in ('Şiirler', 'Anılar ve Öyküler', 'Denemeler', 'İnovasyon ve Girişimcilik', 'Tadımlar'))
);

-- Enable Row Level Security (RLS)
alter table public.writings enable row level security;

-- Create policies
create policy "Yazılar herkese açık" on public.writings
  for select using (true);

create policy "Sadece yazarlar yazı ekleyebilir" on public.writings
  for insert with check (auth.uid() = author_id);

create policy "Yazarlar kendi yazılarını düzenleyebilir" on public.writings
  for update using (auth.uid() = author_id);

create policy "Yazarlar kendi yazılarını silebilir" on public.writings
  for delete using (auth.uid() = author_id);

-- Create indexes
create index writings_author_id_idx on public.writings(author_id);
create index writings_category_idx on public.writings(category);
create index writings_created_at_idx on public.writings(created_at desc);
create index writings_is_published_idx on public.writings(is_published);
create unique index writings_slug_unique on public.writings(slug);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_writings_updated_at
  before update on public.writings
  for each row
  execute function public.handle_updated_at(); 
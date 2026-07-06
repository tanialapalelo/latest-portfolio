-- experiences
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  period text not null,
  accent text not null default 'periwinkle',
  bullets jsonb not null default '[]',
  sort_order int not null default 0
);

alter table experiences enable row level security;
create policy "Public read experiences" on experiences for select using (true);
create policy "Auth insert experiences" on experiences for insert with check (auth.uid() is not null);
create policy "Auth update experiences" on experiences for update using (auth.uid() is not null);
create policy "Auth delete experiences" on experiences for delete using (auth.uid() is not null);

-- education (single row)
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  year text not null,
  certifications jsonb not null default '[]'
);

alter table education enable row level security;
create policy "Public read education" on education for select using (true);
create policy "Auth insert education" on education for insert with check (auth.uid() is not null);
create policy "Auth update education" on education for update using (auth.uid() is not null);
create policy "Auth delete education" on education for delete using (auth.uid() is not null);

-- projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  case_study_number text not null,
  tagline text not null,
  accent text not null default 'periwinkle',
  tech jsonb not null default '[]',
  sort_order int not null default 0
);

alter table projects enable row level security;
create policy "Public read projects" on projects for select using (true);
create policy "Auth insert projects" on projects for insert with check (auth.uid() is not null);
create policy "Auth update projects" on projects for update using (auth.uid() is not null);
create policy "Auth delete projects" on projects for delete using (auth.uid() is not null);

-- community
create table if not exists community (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  href text not null,
  accent text not null default 'periwinkle',
  sort_order int not null default 0
);

alter table community enable row level security;
create policy "Public read community" on community for select using (true);
create policy "Auth insert community" on community for insert with check (auth.uid() is not null);
create policy "Auth update community" on community for update using (auth.uid() is not null);
create policy "Auth delete community" on community for delete using (auth.uid() is not null);

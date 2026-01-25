-- SQL pour configurer le stockage Supabase
-- A exécuter dans l'éditeur SQL de Supabase (https://supabase.com/dashboard/project/_/sql)

-- 1. Créer le bucket 'uploads' s'il n'existe pas (Public)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- 2. Politique : Tout le monde peut voir (Lecture Publique)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'uploads' );

-- 3. Politique : Tout le monde peut uploader (Upload Public - pour simplifier/démo)
-- ATTENTION : En prod, restreindre aux utilisateurs authentifiés : (auth.role() = 'authenticated')
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'uploads' );

-- 4. Politique : Les utilisateurs peuvent modifier/supprimer leurs propres fichiers (Optionnel)
create policy "User Update Own"
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'uploads' );

create policy "User Delete Own"
  on storage.objects for delete
  using ( auth.uid() = owner );

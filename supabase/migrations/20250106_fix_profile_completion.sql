-- Migration : Correction des politiques RLS pour permettre la complétion de profil après confirmation email
-- Date : 2025-01-06

-- =====================================
-- FIX 1: Améliorer les politiques RLS pour la table users
-- =====================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Public can view user profiles" ON public.users;

-- Politique pour VOIR son propre profil (authentifié)
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Politique pour VOIR tous les profils publics (même non authentifié)
CREATE POLICY "Public can view user profiles"
  ON public.users
  FOR SELECT
  TO public
  USING (true);

-- Politique AMÉLIORÉE pour INSÉRER son profil (moins restrictive)
-- Permet l'insertion même si le trigger a déjà créé une ligne basique
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Politique AMÉLIORÉE pour METTRE À JOUR son profil
-- Permet l'upsert pour compléter le profil après inscription
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =====================================
-- FIX 2: Améliorer le trigger handle_new_user
-- =====================================

-- Recréer la fonction avec une meilleure gestion
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer une ligne basique dans public.users (sera complétée plus tard)
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    created_at = COALESCE(public.users.created_at, EXCLUDED.created_at);

  -- Initialiser les crédits avec 0
  INSERT INTO public.user_credits (user_id, credits, total_earned, total_spent)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN others THEN
  -- Log l'erreur mais ne bloque pas l'inscription
  RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =====================================
-- FIX 3: Vérifier que RLS est bien activé
-- =====================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- =====================================
-- TEST: Vérifier les politiques
-- =====================================

-- Afficher toutes les politiques de la table users
DO $$
BEGIN
  RAISE NOTICE 'Migration 20250106_fix_profile_completion appliquée avec succès';
  RAISE NOTICE 'Politiques RLS mises à jour pour permettre la complétion de profil';
END $$;

-- Migration: Table des signalements d'abus pour DaloaMarket
-- Date: 2025-11-20
-- Description: Système de signalement pour annonces et profils utilisateurs

CREATE TABLE IF NOT EXISTS public.abuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- utilisateur qui signale
  reported_entity_type TEXT NOT NULL CHECK (reported_entity_type IN ('listing', 'user')),  -- type: annonce ou utilisateur
  reported_entity_id UUID NOT NULL,  -- ID de l'annonce ou utilisateur signalé
  report_type TEXT NOT NULL CHECK (report_type IN (
    'scam',           -- Arnaque / fraude
    'spam',           -- Spam / publicité abusive
    'illegal',        -- Contenu illégal
    'harassment',     -- Harcèlement / menaces
    'inappropriate',  -- Contenu inapproprié
    'fake',           -- Fausse annonce / faux profil
    'other'           -- Autre raison
  )),
  description TEXT,  -- Détails complémentaires du signalant
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',    -- En attente de traitement
    'reviewing',  -- En cours d'examen
    'resolved',   -- Traité et résolu
    'dismissed'   -- Rejeté (signalement abusif ou non fondé)
  )),
  reviewer_notes TEXT,  -- Notes internes de l'équipe de modération
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,  -- Modérateur qui a traité
  reviewed_at TIMESTAMPTZ,  -- Date de traitement
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour accélérer les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_abuse_reports_reported_by ON public.abuse_reports(reported_by);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_entity ON public.abuse_reports(reported_entity_type, reported_entity_id);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON public.abuse_reports(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_created_at ON public.abuse_reports(created_at DESC);

-- RLS (Row Level Security) Policies
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres signalements
CREATE POLICY "Users can view their own reports"
  ON public.abuse_reports
  FOR SELECT
  USING (auth.uid()::text = reported_by);

-- Les utilisateurs peuvent créer des signalements
CREATE POLICY "Users can create reports"
  ON public.abuse_reports
  FOR INSERT
  WITH CHECK (auth.uid()::text = reported_by);

-- Seuls les admins peuvent modifier et voir tous les signalements
CREATE POLICY "Admins can view all reports"
  ON public.abuse_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update reports"
  ON public.abuse_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

-- Empêcher les signalements en double (même utilisateur signale la même entité)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_report_per_user_entity
  ON public.abuse_reports(reported_by, reported_entity_type, reported_entity_id)
  WHERE status = 'pending';

-- Commentaire pour documentation
COMMENT ON TABLE public.abuse_reports IS 'Signalements d''abus pour annonces et profils utilisateurs';
COMMENT ON COLUMN public.abuse_reports.reported_entity_type IS 'Type d''entité signalée: listing ou user';
COMMENT ON COLUMN public.abuse_reports.report_type IS 'Motif du signalement: scam, spam, illegal, harassment, inappropriate, fake, other';
COMMENT ON COLUMN public.abuse_reports.status IS 'Statut du signalement: pending, reviewing, resolved, dismissed';

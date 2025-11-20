# 🔄 Reset complet Supabase + Reconnexion du site

Ce guide explique comment recréer un projet Supabase propre, appliquer le schéma existant (migrations), reconfigurer l’auth et le storage, puis reconnecter le site (local + Netlify).

Temps estimé: 45–60 min

---

## 🧭 Vue d’ensemble
- Nouveau projet Supabase vierge (URL/keys neuves)
- Application du schéma via nos migrations stables
- Configuration Auth (email) et Storage (buckets)
- Mise à jour des variables d’environnement (local + Netlify)
- Vérifications: profil, RLS, 1ère annonce, paiements

Important: on repart propre. Sauf besoin explicite, on ne migre pas les anciennes données.

---

## ✅ Prérequis
- Accès au Dashboard Supabase: https://app.supabase.com (Owner/maintainer)
- Accès Netlify (site: DaloaMarket)
- Supabase CLI (optionnel, avancé): https://supabase.com/docs/guides/cli
- Repo local ouvert (ce projet)

---

## 1) Créer un nouveau projet Supabase
1. Supabase Dashboard → New project
2. Choisir l’org, nommer: `daloamarket-prod` (par ex.)
3. Régler mot de passe Postgres (gardez-le dans un coffre)
4. Attendre le provisionnement (~2-3 min)
5. Aller dans Project Settings → API:
   - Copier `Project URL` (ex: https://xxxx.supabase.co)
   - Copier `anon public key`
   - Copier `service_role key` (secret)

Conservez ces 3 valeurs, on les mettra dans `.env` (local) et Netlify.

---

## 2) Configurer l’Auth
Project Settings → Authentication:
- Disable email confirmations si vous voulez simplifier (ou laisser ON si flux email confirmé)
- Site URL (General): `https://daloamarket.shop`
- Additional Redirect URLs: 
  - `https://daloamarket.shop/*`
  - `http://localhost:5173/*`
- Email templates (optionnel): assurez-vous que le lien de redirection pointe vers le site ci-dessus.

---

## 3) Configurer le Storage
- Storage → Create bucket `listings` (Public)
- Storage → Create bucket `manual-payments` (Private)

Les migrations ajouteront les politiques RLS et droits nécessaires (ex: uploads sur `manual-payments`).

---

## 4) Appliquer le schéma (migrations)
Nous avons plusieurs fichiers dans `supabase/migrations/`. Pour un reset propre, appliquez SEULEMENT la série canonique ci-dessous, dans cet ordre, via SQL Editor (copier/coller le contenu de chaque fichier puis exécuter). Évitez les fichiers “tests” à 6 chiffres (ex: `101010.sql`, `111111.sql`, etc.) qui dupliquent/contredisent la version canonique.

Ordre recommandé:
1. `20250527173154_morning_breeze.sql` (schema principal: tables, rls de base, triggers, etc.)
2. `20250528001708_raspy_paper.sql` (buckets/stockage + politiques storage)
3. `20250528190000_user_credits.sql` (système de crédits stable)
4. `20250530100000_fix_user_signup.sql` (trigger signup robuste)
5. `20250531120000_rls_users_public_select.sql` (RLS users lecture publique)
6. `20250531180000_user_credits_trigger.sql` (trigger user_credits)
7. `20250601_reviews.sql` (table reviews)
8. `20250601_decrement_user_credit.sql` (fonction décrément crédit)
9. `20250614_add_first_listing_at_to_users.sql` (colonne first_listing_at)
10. `20250614_first_listing_trigger.sql` (trigger première annonce)
11. `20250730_favorites.sql` (table favoris)
12. `20251016_favorites_rls_and_policies.sql` (RLS / policies favorites + vérifications)

Notes:
- Si un fichier est vide dans votre copie locale, sautez-le et passez au suivant.
- Les fichiers à 6 chiffres (ex: `101010.sql`, `111111.sql`, `222222.sql`, etc.) sont des brouillons/anciens essais. Ne les exécutez pas.

Option avancée (CLI): vous pouvez archiver localement les fichiers `*six_chiffres*.sql` pour que la CLI n’essaie pas de les pousser:
```powershell
# Dans la racine du projet
New-Item -ItemType Directory -Path .\supabase\migrations\_archive -Force
Get-ChildItem .\supabase\migrations\ -Filter "??????.sql" | Move-Item -Destination .\supabase\migrations\_archive
```
Ensuite, exécuter une poussée distante (si vous avez lié le projet) :
```powershell
# Requiert Supabase CLI et un projet linké
supabase link --project-ref <PROJECT_REF>
supabase db push  # pousse les migrations restantes dans l’ordre
```

---

## 5) Variables d’environnement
Mettez à jour les variables locales et Netlify.

Local (`.env`):
```
VITE_SUPABASE_URL=https://<NOUVEAU_PROJECT>.supabase.co
VITE_SUPABASE_ANON_KEY=<NOUVELLE_ANON_KEY>
```

Netlify (Site settings → Environment):
- Build (client):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Functions (serveur):
  - `SUPABASE_URL` (même que VITE_SUPABASE_URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (clé service_role)
- App:
  - `SITE_URL` = `https://daloamarket.shop`
  - Paiement (si FusionPay):
    - `FUSIONPAY_API_URL` = URL création paiement
    - `FUSIONPAY_STATUS_URL_BASE` = `https://www.pay.moneyfusion.net/paiementNotif/`

Sauvegardez, redeployez.

---

## 6) Redéployer
Sur Netlify:
- Trigger un nouveau deploy
- Ouvrir `https://daloamarket.shop`, vérifier que l’appli charge

Local (dev):
```powershell
# Dans ce dossier
npm install
npx kill-port 5173
npm run dev
```

---

## 7) Tests de validation
1. Inscription → email/connexion → page de complétion profil
   - Vérifier que la table `users` est écrite et RLS OK
2. Créer une première annonce → vérifier `first_listing_at`
3. Paiement (bouton Mobile Money)
   - Redirection vers page de paiement
   - Webhook → table `transactions` mise à jour
   - Passage `listings.status = 'active'` si paiement validé
4. Messagerie → envoi d’un message test
5. Pages publiques: Search/Home fonctionnent (RLS `listings` lecture publique)

---

## Dépannage
- Erreurs RLS: vérifier dans SQL Editor que les policies mentionnées dans les migrations 20250531… et 20251016… sont bien présentes.
- Service worker (cache): en dev on ne l’enregistre plus; en prod utilisez un hard refresh si un ancien cache traîne.
- 404/Module MIME: généralement un cache ancien (vider). Nous avons déjà inclus des protections SW côté prod.

---

## Foire aux questions
- Peut-on migrer les anciens utilisateurs? Pas simplement (les comptes sont dans `auth.users`). Si nécessaire on peut importer des profils côté `public.users`, mais l’auth (mots de passe / magic links) ne migre pas automatiquement.
- Peut-on garder l’ancien projet comme backup? Oui, laissez-le actif le temps de valider le nouveau.

---

## Annexe: Raccourcis PowerShell utiles (Windows)
```powershell
# Lancer le dev proprement
npx kill-port 5173
npm run dev

# Archiver les anciennes migrations "6 chiffres"
New-Item -ItemType Directory -Path .\supabase\migrations\_archive -Force
Get-ChildItem .\supabase\migrations\ -Filter "??????.sql" | Move-Item -Destination .\supabase\migrations\_archive
```

Bon reset ! Quand vous avez créé le projet et collé les 12 migrations listées, dites-moi et je vérifierai RLS/Triggers avec vous avant le go-live.

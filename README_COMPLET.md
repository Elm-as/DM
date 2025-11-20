# 📦 DaloaMarket - README

> Plateforme de petites annonces pour le campus de Daloa, Côte d'Ivoire

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/daloa-market/deploys)

---

## 🎯 À propos

**DaloaMarket** est une marketplace locale qui permet aux étudiants et habitants de Daloa d'acheter et vendre facilement des articles.

### ✨ Fonctionnalités principales

- 🔐 **Authentification sécurisée** (Supabase Auth)
- 📝 **Publication d'annonces** (système de crédits)
- 💬 **Messagerie intégrée** (discussions avec les vendeurs)
- ⭐ **Système de notation** (avis et notes utilisateurs)
- 💳 **Paiement automatisé** (PayDunya - Orange Money, MTN, Wave)
- 🚀 **Boost d'annonces** (mise en avant payante)
- 📱 **100% responsive** (PC, tablette, mobile)
- 🌙 **PWA ready** (installable comme app mobile)

---

## 🛠️ Stack Technique

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Router** (navigation)
- **Framer Motion** (animations)
- **React Hook Form** (forms)
- **React Hot Toast** (notifications)

### Backend
- **Supabase** (BaaS - auth, database, storage)
- **PostgreSQL** (base de données)
- **Netlify Functions** (serverless)
- **PayDunya API** (paiements mobiles)

### Outils
- **ESLint** + **Prettier** (linting)
- **Vitest** (tests)
- **Git** (versioning)

---

## 📂 Structure du projet

```
DaloaMarket-main/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── auth/           # Authentification
│   │   ├── layout/         # Layout (Header, Footer, etc.)
│   │   ├── listings/       # Annonces
│   │   ├── payment/        # Paiements
│   │   ├── profile/        # Profil utilisateur
│   │   ├── search/         # Recherche
│   │   └── ui/             # Composants UI génériques
│   ├── contexts/           # Contextes React (Supabase, Auth)
│   ├── hooks/              # Hooks personnalisés
│   ├── lib/                # Utilitaires (Supabase, PayDunya, utils)
│   ├── pages/              # Pages de l'application
│   └── main.tsx            # Point d'entrée
├── netlify/
│   └── functions/          # Fonctions serverless
│       ├── paydunya-create-invoice.js
│       ├── paydunya-webhook.js  ⭐ NOUVEAU
│       ├── paydunya-callback.js
│       └── send-*.js       # Emails
├── supabase/
│   └── migrations/         # Migrations SQL
│       ├── 20250527173154_morning_breeze.sql
│       ├── 20250528190000_user_credits.sql
│       └── 20250106_fix_profile_completion.sql  ⭐ NOUVEAU
├── public/                 # Assets statiques
├── GUIDE_DEPLOIEMENT.md    ⭐ NOUVEAU - Guide complet
├── CORRECTIONS.md          ⭐ NOUVEAU - Récap des corrections
├── TESTS.md                ⭐ NOUVEAU - Tests à effectuer
└── package.json
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+ ([installer](https://nodejs.org/))
- npm ou yarn
- Compte Supabase ([créer](https://supabase.com))
- Compte PayDunya ([créer](https://paydunya.com))
- Compte Netlify ([créer](https://netlify.com))

### Étapes

1. **Cloner le repo** :
   ```bash
   git clone https://github.com/votre-username/DaloaMarket.git
   cd DaloaMarket
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   
   Créez un fichier `.env` à la racine :
   ```env
   # Supabase
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # SECRET - Ne pas commit !
   
   # PayDunya (Production)
   PAYDUNYA_MASTER_KEY=xxx
   PAYDUNYA_PRIVATE_KEY=xxx
   PAYDUNYA_PUBLIC_KEY=xxx
   PAYDUNYA_TOKEN=xxx
   PAYDUNYA_MODE=live
   
   # Email (optionnel)
   RESEND_API_KEY=re_xxx
   ```

4. **Appliquer les migrations Supabase** :
   
   Dans le SQL Editor de Supabase, exécutez les migrations dans l'ordre :
   - `supabase/migrations/20250527173154_morning_breeze.sql`
   - `supabase/migrations/20250528190000_user_credits.sql`
   - `supabase/migrations/20250106_fix_profile_completion.sql` ⭐

5. **Démarrer en local** :
   ```bash
   npm run dev
   ```
   
   Ou avec Netlify Functions :
   ```bash
   npm run dev:netlify
   ```

6. **Accéder à l'app** :
   ```
   http://localhost:5173
   ```

---

## 📖 Documentation

### Guides disponibles

- **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)** ⭐
  - Configuration complète (Supabase, PayDunya, Netlify)
  - Tests et vérifications
  - Optimisations mobile
  - Dépannage

- **[CORRECTIONS.md](./CORRECTIONS.md)** ⭐
  - Récapitulatif des problèmes et solutions
  - Fichiers créés/modifiés
  - Prochaines étapes

- **[TESTS.md](./TESTS.md)** ⭐
  - Tests SQL
  - Tests E2E
  - Tests de sécurité
  - Checklist avant déploiement

---

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer Vite (localhost:5173)
npm run dev:netlify      # Démarrer avec Netlify Dev (localhost:8888)

# Build
npm run build            # Compiler pour production (dist/)
npm run preview          # Prévisualiser le build

# Tests
npm run test             # Lancer les tests (Vitest)
npm run lint             # Vérifier le code (ESLint)

# Déploiement (automatique via Git)
git push origin main     # Netlify déploie automatiquement
```

---

## 🧪 Tests

Avant le déploiement, assurez-vous d'exécuter tous les tests :

```bash
# Tests unitaires
npm run test

# Tests E2E (manuels)
# Voir TESTS.md pour la checklist complète

# Vérifications
npm run lint
npm run build
```

---

## 🚀 Déploiement

### Netlify (Automatique)

1. Connectez votre repo GitHub à Netlify
2. Configurez les variables d'environnement dans Netlify
3. Poussez sur `main` :
   ```bash
   git push origin main
   ```
4. Netlify déploie automatiquement ! ✨

**Voir [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md) pour plus de détails**

---

## 📱 PWA (Progressive Web App)

L'application est installable comme une app native :

1. Ouvrez le site sur mobile
2. Cliquez sur "Ajouter à l'écran d'accueil"
3. L'icône DaloaMarket apparaît sur votre écran

---

## 🔒 Sécurité

- ✅ **Authentification** : Supabase Auth (JWT tokens)
- ✅ **RLS (Row Level Security)** : Politiques PostgreSQL strictes
- ✅ **HTTPS** : Obligatoire (Netlify)
- ✅ **Sanitization** : Inputs nettoyés (XSS protection)
- ✅ **Rate limiting** : Via Supabase
- ✅ **Service Role Key** : Jamais exposée côté client

---

## 📊 Performance

### Optimisations appliquées

- ✅ **Code splitting** (React.lazy)
- ✅ **Lazy loading** des images
- ✅ **Compression Gzip/Brotli** (Netlify)
- ✅ **CDN** global (Netlify)
- ✅ **Caching** optimisé
- ✅ **Bundle size** optimisé (Vite)

### Scores Lighthouse (objectifs)

```
Performance:    > 80
Accessibility:  > 90
Best Practices: > 90
SEO:            > 80
```

---

## 🐛 Dépannage

### Problème : "Session invalide" après confirmation email

**Solution** : Vérifiez que la migration `20250106_fix_profile_completion.sql` a été appliquée.

```sql
-- Dans Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'users';
```

Vous devez voir 4 politiques (voir [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md))

### Problème : Webhook PayDunya ne fonctionne pas

**Solution** : Vérifiez les logs Netlify Functions et la configuration du webhook dans PayDunya.

```bash
# Dans Netlify Dashboard
Functions > paydunya-webhook > Logs
```

### Problème : Images ne s'affichent pas

**Solution** : Vérifiez les politiques RLS du Storage Supabase.

```sql
-- Dans Supabase SQL Editor
SELECT * FROM storage.buckets WHERE id = 'listings';
```

**Plus de solutions dans [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)**

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 📞 Contact

- **Email** : support@daloamarket.com
- **Instagram** : [@daloamarket](https://instagram.com/daloamarket)
- **Facebook** : [DaloaMarket](https://facebook.com/daloamarket)

---

## 🎉 Remerciements

- **Supabase** pour le backend incroyable
- **PayDunya** pour les paiements mobiles en Afrique
- **Netlify** pour l'hébergement gratuit
- **Communauté open-source** pour les outils utilisés

---

## 📌 Roadmap

### Version 1.0 (Lancement) ✅
- [x] Authentification complète
- [x] Publication d'annonces
- [x] Système de crédits
- [x] Messagerie
- [x] Paiements PayDunya
- [x] Système de notation
- [x] Responsive design

### Version 1.1 (Q1 2025) 🔄
- [ ] Paiement automatique PayDunya (webhook activé)
- [ ] Notifications push (PWA)
- [ ] Optimisations mobile supplémentaires
- [ ] Google Analytics
- [ ] Sentry (monitoring d'erreurs)

### Version 2.0 (Q2 2025) 🚀
- [ ] App mobile native (React Native)
- [ ] Système de favori amélioré
- [ ] Filtres de recherche avancés
- [ ] Chat en temps réel
- [ ] Mode sombre
- [ ] Multi-langues (français, anglais)

---

**Fait avec ❤️ pour le campus de Daloa**

🚀 **Prêt pour le lancement !**

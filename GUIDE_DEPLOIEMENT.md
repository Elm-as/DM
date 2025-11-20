# 🚀 Guide de Déploiement - DaloaMarket

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Configuration Supabase](#configuration-supabase)
3. [Configuration PayDunya](#configuration-paydunya)
4. [Configuration Netlify](#configuration-netlify)
5. [Tests et vérification](#tests-et-vérification)
6. [Optimisations mobile](#optimisations-mobile)
7. [Maintenance](#maintenance)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte [Supabase](https://supabase.com) (gratuit)
- ✅ Un compte [PayDunya](https://paydunya.com) (Production)
- ✅ Un compte [Netlify](https://netlify.com) (gratuit)
- ✅ Node.js installé (v18+)
- ✅ Git installé

---

## 🗄️ Configuration Supabase

### Étape 1 : Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez les informations suivantes :
   - `Project URL` (ex: https://xxxxx.supabase.co)
   - `anon/public key` (clé publique)
   - `service_role key` (clé secrète - À GARDER CONFIDENTIELLE ⚠️)

### Étape 2 : Appliquer les migrations SQL

Dans votre projet Supabase, allez dans **SQL Editor** et exécutez les migrations dans l'ordre :

1. **Migration principale** : `supabase/migrations/20250527173154_morning_breeze.sql`
2. **Crédits utilisateurs** : `supabase/migrations/20250528190000_user_credits.sql`
3. **Correction profil** : `supabase/migrations/20250106_fix_profile_completion.sql` ⭐ **NOUVELLE**

**Important** : Exécutez chaque migration une par une et vérifiez qu'il n'y a pas d'erreur.

### Étape 3 : Configurer l'authentification par email

1. Dans Supabase, allez dans **Authentication > Providers**
2. Activez **Email**
3. Configurez :
   - ✅ **Enable Email Confirmations** : Activé
   - ✅ **Redirect URL** : `https://votre-site.netlify.app/auth/confirm`
   - ✅ **Custom SMTP** (optionnel mais recommandé) : Configurez votre propre serveur email

### Étape 4 : Vérifier les politiques RLS

Exécutez cette requête SQL pour vérifier que les politiques sont bien en place :

```sql
-- Voir toutes les politiques de la table users
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'users';
```

Vous devez voir :
- ✅ `Users can view their own profile`
- ✅ `Public can view user profiles`
- ✅ `Users can insert their own profile`
- ✅ `Users can update their own profile`

### Étape 5 : Créer les buckets de storage

1. Allez dans **Storage**
2. Créez les buckets suivants :
   - `listings` (public)
   - `manual-payments` (privé)

Pour chaque bucket, configurez les politiques RLS (voir `supabase/migrations/20250528001708_raspy_paper.sql`)

---

## 💳 Configuration PayDunya

### Étape 1 : Obtenir les clés API

1. Connectez-vous à [PayDunya Dashboard](https://app.paydunya.com)
2. Allez dans **Settings > API Keys**
3. Notez vos clés **PRODUCTION** :
   - `Master Key`
   - `Private Key`
   - `Public Key`
   - `Token`

⚠️ **Important** : N'utilisez JAMAIS les clés de test en production !

### Étape 2 : Configurer le webhook

Dans le dashboard PayDunya :

1. Allez dans **Settings > Webhooks**
2. Ajoutez une nouvelle URL de webhook :
   ```
   https://votre-site.netlify.app/.netlify/functions/paydunya-webhook
   ```
3. Sélectionnez les événements :
   - ✅ `invoice.completed`
   - ✅ `invoice.cancelled`

4. Activez le webhook

### Étape 3 : Tester le webhook (optionnel)

Utilisez un outil comme [webhook.site](https://webhook.site) pour tester que PayDunya envoie bien les données.

---

## 🌐 Configuration Netlify

### Étape 1 : Déployer le site

1. Connectez votre repo GitHub à Netlify
2. Paramètres de build :
   ```
   Build command: npm run build
   Publish directory: dist
   Functions directory: netlify/functions
   ```

### Étape 2 : Configurer les variables d'environnement

Dans **Site settings > Environment variables**, ajoutez :

#### Variables Supabase
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  ⚠️ Service Role Key (SECRET)
```

#### Variables PayDunya (Production)
```
PAYDUNYA_MASTER_KEY=xxx
PAYDUNYA_PRIVATE_KEY=xxx
PAYDUNYA_PUBLIC_KEY=xxx
PAYDUNYA_TOKEN=xxx
PAYDUNYA_MODE=live
```

#### Variable Email (Resend - optionnel)
```
RESEND_API_KEY=re_xxx
```

### Étape 3 : Configurer les redirections

Le fichier `netlify.toml` est déjà configuré correctement. Vérifiez qu'il contient :

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Étape 4 : Déployer

```bash
git add .
git commit -m "Configuration production"
git push origin main
```

Netlify déploiera automatiquement.

---

## ✅ Tests et vérification

### Test 1 : Inscription et complétion de profil

1. Créez un nouveau compte avec un email réel
2. Vérifiez votre boîte email et cliquez sur le lien de confirmation
3. Vous devez être redirigé vers `/auth/complete-profile`
4. Complétez le formulaire :
   - Nom complet : `Test User`
   - Téléphone : `+225 07 12 34 56 78`
   - Quartier : Sélectionnez un quartier
5. Cliquez sur "Compléter mon profil"
6. ✅ Vous devez être redirigé vers la page d'accueil sans erreur

**Si ça ne fonctionne pas** :
- Vérifiez les logs dans la console du navigateur (F12)
- Vérifiez que la migration `20250106_fix_profile_completion.sql` a bien été appliquée
- Vérifiez les politiques RLS avec la requête SQL ci-dessus

### Test 2 : Achat de crédits (Système actuel - Manuel)

1. Connectez-vous
2. Allez sur `/achat-credits`
3. Suivez le processus :
   - Sélectionnez un pack
   - Effectuez un paiement test via Mobile Money
   - Téléchargez une capture d'écran
   - Remplissez le formulaire
4. ✅ Un email doit être envoyé automatiquement à l'admin

### Test 3 : Webhook PayDunya (Nouveau système - À activer)

**⚠️ Ce test nécessite une vraie transaction PayDunya**

1. Sur le site, créez une annonce (pour tester le flux complet)
2. Le système actuel utilise encore le manuel - Pour activer le webhook :
   - Modifiez `AchatCreditsPage.tsx` pour utiliser PayDunya au lieu du formulaire manuel
   - Ou créez un nouveau bouton "Payer avec PayDunya"

3. Effectuez un paiement test via PayDunya
4. Vérifiez les logs Netlify Functions :
   ```
   Netlify Dashboard > Functions > paydunya-webhook > Logs
   ```
5. ✅ Les crédits doivent être ajoutés automatiquement

### Test 4 : Création d'annonce

1. Connectez-vous
2. Allez sur `/listings/create`
3. Créez une annonce test
4. ✅ L'annonce doit apparaître sur la page d'accueil

---

## 📱 Optimisations mobile

### Problèmes identifiés et solutions

#### 1. Taille des textes trop petite
**Solution** : Ajoutez des classes responsive dans `index.css`

```css
/* Amélioration des tailles de police mobile */
@media (max-width: 640px) {
  body {
    font-size: 16px; /* Minimum recommandé pour mobile */
  }
  
  h1 {
    font-size: 1.75rem; /* Plus lisible */
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .btn-primary, .btn-secondary {
    font-size: 16px; /* Évite le zoom sur iOS */
    padding: 12px 24px; /* Boutons plus grands */
  }
  
  input, select, textarea {
    font-size: 16px; /* Évite le zoom sur iOS */
  }
}
```

#### 2. Espacements insuffisants
**Solution** : Utilisez les classes Tailwind responsive

```tsx
// Au lieu de : className="p-4"
// Utilisez : className="p-4 md:p-6 lg:p-8"

// Au lieu de : className="text-xl"
// Utilisez : className="text-base md:text-lg lg:text-xl"
```

#### 3. Menu mobile
Le `MobileMenu.tsx` existe déjà mais peut être amélioré :

```tsx
// Ajoutez des animations smooth et un overlay
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25 }}
  className="fixed inset-0 z-50 bg-white"
>
  {/* Contenu du menu */}
</motion.div>
```

#### 4. Images trop lourdes
Optimisez les images avec :

```bash
npm install sharp
```

Et créez un script d'optimisation dans `scripts/optimize-images.js`

#### 5. Touch targets
Assurez-vous que tous les boutons et liens ont une taille minimale de 44x44px :

```css
/* Ajoutez dans index.css */
button, a, input[type="checkbox"], input[type="radio"] {
  min-height: 44px;
  min-width: 44px;
}
```

---

## 🔧 Maintenance

### Surveiller les logs

#### Supabase
- **Logs** : Supabase Dashboard > Logs
- **Slow queries** : Database > Query Performance

#### Netlify
- **Functions logs** : Functions > Logs
- **Deploy logs** : Deploys > [Your deploy] > Logs

### Sauvegardes automatiques

Supabase fait des sauvegardes automatiques, mais vous pouvez aussi :

```bash
# Backup manuel de la base de données
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit fix

# Rebuilder et redéployer
npm run build
git add .
git commit -m "Update dependencies"
git push origin main
```

### Surveillance des erreurs

Installez Sentry (optionnel mais recommandé) :

```bash
npm install @sentry/react
```

Et configurez-le dans `main.tsx`.

---

## 🆘 Dépannage

### Problème : "Session invalide" après confirmation email

**Solution** : 
1. Vérifiez que la migration `20250106_fix_profile_completion.sql` a été appliquée
2. Vérifiez les politiques RLS (voir SQL ci-dessus)
3. Dans Supabase, vérifiez que **Enable Email Confirmations** est activé

### Problème : Webhook PayDunya ne fonctionne pas

**Solution** :
1. Vérifiez les logs Netlify Functions
2. Testez le webhook avec [webhook.site](https://webhook.site)
3. Vérifiez que l'URL du webhook est correcte dans PayDunya
4. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée dans Netlify

### Problème : Images ne s'affichent pas

**Solution** :
1. Vérifiez que les buckets Supabase Storage sont publics
2. Vérifiez les politiques RLS du storage
3. Vérifiez que les URLs des images sont correctes

### Problème : Design cassé sur mobile

**Solution** :
1. Testez sur un vrai appareil (pas juste l'émulateur Chrome)
2. Utilisez les classes Tailwind responsive (`sm:`, `md:`, `lg:`)
3. Vérifiez les tailles de police (minimum 16px)
4. Vérifiez les touch targets (minimum 44x44px)

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** (Supabase, Netlify, Browser Console)
2. **Consultez la documentation** :
   - [Supabase Docs](https://supabase.com/docs)
   - [PayDunya Docs](https://paydunya.com/developers)
   - [Netlify Docs](https://docs.netlify.com)
3. **Contactez le support** :
   - Supabase : support@supabase.com
   - PayDunya : support@paydunya.com
   - Netlify : support@netlify.com

---

## ✨ Prochaines étapes recommandées

1. ✅ **Activer le paiement automatique PayDunya** :
   - Remplacer le formulaire manuel par l'intégration PayDunya
   - Tester le webhook en production

2. ✅ **Optimiser les performances** :
   - Activer la compression Gzip
   - Optimiser les images
   - Lazy load des composants

3. ✅ **SEO** :
   - Ajouter des meta tags
   - Créer un sitemap
   - Configurer Google Analytics

4. ✅ **Notifications** :
   - Ajouter des notifications push (PWA)
   - Emails de confirmation automatiques

5. ✅ **Marketing** :
   - Créer une page Instagram/Facebook
   - Lancer sur le campus de Daloa 🎉

---

**Bon déploiement ! 🚀**

*Si vous avez des questions, n'hésitez pas à me contacter.*

# 🧪 Script de Test - DaloaMarket

## Tests à effectuer avant le déploiement

### ✅ Test 1 : Vérification de la migration SQL

**Dans Supabase SQL Editor** :

```sql
-- 1. Vérifier que les politiques RLS existent
SELECT 
  schemaname,
  tablename, 
  policyname, 
  roles, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Résultat attendu (4 politiques) :
-- ✅ Public can view user profiles (SELECT, TO public)
-- ✅ Users can insert their own profile (INSERT, TO authenticated)
-- ✅ Users can update their own profile (UPDATE, TO authenticated)
-- ✅ Users can view their own profile (SELECT, TO authenticated)
```

```sql
-- 2. Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Résultat attendu :
-- ✅ on_auth_user_created | INSERT | users | EXECUTE FUNCTION public.handle_new_user()
```

```sql
-- 3. Vérifier la fonction handle_new_user
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Résultat attendu :
-- ✅ handle_new_user | FUNCTION | DEFINER
```

```sql
-- 4. Test de création d'utilisateur (SIMULATION)
-- ⚠️ NE PAS EXÉCUTER EN PRODUCTION - JUSTE POUR COMPRENDRE
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test' || floor(random() * 10000)::text || '@example.com';
BEGIN
  -- Simuler l'insertion dans auth.users (ce que fait Supabase automatiquement)
  -- Note: Vous ne pouvez pas vraiment insérer dans auth.users depuis SQL
  -- Ce code est juste pour montrer la logique
  
  -- Le trigger handle_new_user devrait :
  -- 1. Créer une ligne dans public.users
  INSERT INTO public.users (id, email, created_at)
  VALUES (test_user_id, test_email, NOW())
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  
  -- 2. Créer une ligne dans user_credits
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (test_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Vérifier que tout a été créé
  IF EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) AND
     EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = test_user_id) THEN
    RAISE NOTICE 'Test réussi pour user_id: %', test_user_id;
  ELSE
    RAISE EXCEPTION 'Test échoué';
  END IF;
  
  -- Nettoyer
  DELETE FROM public.user_credits WHERE user_id = test_user_id;
  DELETE FROM public.users WHERE id = test_user_id;
  
  RAISE NOTICE 'Test nettoyé avec succès';
END $$;
```

---

### ✅ Test 2 : Inscription et complétion de profil (E2E)

**Étapes manuelles** :

1. **Créer un compte test** :
   ```
   URL: https://votre-site.netlify.app/auth/register
   Email: test+$(date +%s)@example.com  # Email unique
   Password: TestPassword123!
   ```

2. **Vérifier l'email** :
   - Ouvrez votre boîte email
   - Cliquez sur le lien de confirmation
   - ✅ Vous devez être redirigé vers `/auth/complete-profile`

3. **Compléter le profil** :
   ```
   Nom complet: Test User
   Téléphone: +225 07 12 34 56 78
   Quartier: Lobia
   ```

4. **Vérifier dans Supabase** :
   ```sql
   -- Récupérer le dernier utilisateur créé
   SELECT 
     u.id,
     u.email,
     u.full_name,
     u.phone,
     u.district,
     u.created_at,
     uc.credits
   FROM public.users u
   LEFT JOIN public.user_credits uc ON u.id = uc.user_id
   ORDER BY u.created_at DESC
   LIMIT 1;
   ```

   **Résultat attendu** :
   ```
   ✅ id: [uuid]
   ✅ email: test@example.com
   ✅ full_name: Test User
   ✅ phone: +225 07 12 34 56 78
   ✅ district: Lobia
   ✅ credits: 0
   ```

5. **Vérifier dans le browser** :
   - Ouvrez la console (F12)
   - ✅ Aucune erreur ne doit apparaître
   - ✅ Vous devez être redirigé vers la page d'accueil

---

### ✅ Test 3 : Webhook PayDunya (Local avec Ngrok)

**Prérequis** :
```bash
npm install -g ngrok
```

**Étapes** :

1. **Démarrer le serveur en local** :
   ```bash
   npm run dev:netlify
   # ou
   netlify dev
   ```

2. **Exposer le serveur avec Ngrok** :
   ```bash
   ngrok http 8888
   ```
   
   Notez l'URL : `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

3. **Configurer le webhook dans PayDunya** :
   ```
   URL: https://xxxx-xx-xx-xx-xx.ngrok-free.app/.netlify/functions/paydunya-webhook
   ```

4. **Simuler un paiement** :
   
   **Option A : Vraie transaction PayDunya** (recommandé)
   - Créez une facture de test
   - Effectuez un paiement
   - Vérifiez les logs
   
   **Option B : Simuler un webhook avec cURL** :
   ```bash
   curl -X POST https://xxxx-xx-xx-xx-xx.ngrok-free.app/.netlify/functions/paydunya-webhook \
     -H "Content-Type: application/json" \
     -d '{
       "data": {
         "status": "completed",
         "invoice_token": "test-token-123",
         "total_amount": 500,
         "custom_data": {
           "user_id": "[VOTRE_USER_ID_TEST]",
           "type": "pack",
           "credits": 3,
           "pack_name": "Starter"
         }
       }
     }'
   ```

5. **Vérifier les logs** :
   - Dans le terminal Netlify, vous devez voir :
     ```
     📥 Webhook PayDunya reçu: { ... }
     📊 Status: completed
     💰 Montant: 500
     🆔 Custom data: { user_id: ..., type: pack, credits: 3 }
     ✅ Pack détecté: Starter (3 crédits)
     ✅ Transaction créée
     ✅ Utilisateur [id] crédité de 3 crédits
     💳 Nouveau solde: 3 crédits
     ```

6. **Vérifier dans Supabase** :
   ```sql
   -- Vérifier la transaction
   SELECT * FROM transactions 
   WHERE paydunya_token = 'test-token-123'
   ORDER BY created_at DESC;
   
   -- Vérifier les crédits
   SELECT * FROM user_credits 
   WHERE user_id = '[VOTRE_USER_ID_TEST]';
   ```

   **Résultat attendu** :
   ```
   ✅ Transaction créée avec status = 'completed'
   ✅ Crédits ajoutés (credits = 3, total_earned = 3)
   ```

---

### ✅ Test 4 : Responsive Mobile (Chrome DevTools)

1. **Ouvrir Chrome DevTools** :
   - `F12` ou `Ctrl+Shift+I`
   - Cliquez sur l'icône mobile (ou `Ctrl+Shift+M`)

2. **Tester différents appareils** :
   ```
   ✅ iPhone SE (375x667) - Petit écran
   ✅ iPhone 12 Pro (390x844) - Moyen
   ✅ iPad (768x1024) - Tablette
   ✅ Desktop (1920x1080)
   ```

3. **Points à vérifier** :

   **HomePage** :
   ```
   ✅ Grille : 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
   ✅ Textes lisibles sans zoom
   ✅ Boutons facilement cliquables (min 44x44px)
   ✅ Pas de scroll horizontal
   ```

   **Header** :
   ```
   ✅ Menu burger visible et cliquable
   ✅ Logo visible
   ✅ Barre de recherche adaptative
   ```

   **ListingCard** :
   ```
   ✅ Images optimisées (pas de déformation)
   ✅ Prix et titre lisibles
   ✅ Boutons d'action accessibles
   ```

   **Forms (Login, Register, CompleteProfile)** :
   ```
   ✅ Inputs de taille confortable (min 16px font)
   ✅ Labels visibles
   ✅ Messages d'erreur clairs
   ✅ Boutons submit bien dimensionnés
   ```

4. **Tester les interactions** :
   ```
   ✅ Scroll fluide
   ✅ Tap sur boutons réactif
   ✅ Navigation fonctionnelle
   ✅ Formulaires utilisables
   ```

---

### ✅ Test 5 : Performance (Lighthouse)

1. **Ouvrir Chrome DevTools** > **Lighthouse**

2. **Lancer l'audit** :
   - Mode : Mobile
   - Catégories : Performance, Accessibility, Best Practices, SEO

3. **Scores attendus** :
   ```
   ✅ Performance: > 80
   ✅ Accessibility: > 90
   ✅ Best Practices: > 90
   ✅ SEO: > 80
   ```

4. **Points d'attention** :
   - **First Contentful Paint** : < 1.8s
   - **Largest Contentful Paint** : < 2.5s
   - **Cumulative Layout Shift** : < 0.1
   - **Total Blocking Time** : < 200ms

5. **Optimisations recommandées si scores faibles** :
   ```
   - Compresser les images (WebP, lazy load)
   - Minimiser les JS/CSS
   - Activer la compression Gzip/Brotli
   - Utiliser un CDN pour les assets statiques
   ```

---

### ✅ Test 6 : Sécurité

**Test SQL Injection** :

1. Dans le formulaire de login, essayez :
   ```
   Email: admin@test.com' OR '1'='1
   Password: anything
   ```
   
   ✅ **Résultat attendu** : Erreur "Email ou mot de passe incorrect"
   ❌ **Si ça passe** : Vous avez un problème (mais Supabase protège normalement)

**Test XSS (Cross-Site Scripting)** :

1. Dans un formulaire (ex: création d'annonce), essayez :
   ```
   Titre: <script>alert('XSS')</script>
   Description: <img src=x onerror="alert('XSS')">
   ```
   
   ✅ **Résultat attendu** : Le script ne s'exécute pas (échappé)
   ❌ **Si un alert apparaît** : Vous avez un problème de XSS

**Test CSRF (Cross-Site Request Forgery)** :

1. Vérifiez que les tokens CSRF sont en place :
   - Supabase Auth gère ça automatiquement avec les tokens JWT
   
   ✅ **Résultat attendu** : Toutes les requêtes API incluent un header `Authorization: Bearer [token]`

---

### ✅ Checklist finale avant déploiement

```
Configuration :
  ✅ Variables d'environnement Netlify configurées
  ✅ Webhook PayDunya configuré
  ✅ Migration SQL appliquée dans Supabase
  ✅ Buckets Storage créés et configurés
  ✅ Authentification Supabase activée

Tests :
  ✅ Test inscription/login/profil réussi
  ✅ Test webhook PayDunya réussi (simulation)
  ✅ Test responsive mobile réussi
  ✅ Test performance Lighthouse > 80
  ✅ Test sécurité (SQL injection, XSS) réussi

Code :
  ✅ Pas d'erreurs dans la console
  ✅ Pas d'avertissements critiques
  ✅ Build réussi (`npm run build`)
  ✅ Lint réussi (`npm run lint`)

Documentation :
  ✅ README.md à jour
  ✅ GUIDE_DEPLOIEMENT.md disponible
  ✅ CORRECTIONS.md disponible
  ✅ Tests documentés

Monitoring :
  ✅ Google Analytics configuré (optionnel)
  ✅ Sentry configuré (optionnel)
  ✅ Uptime monitoring configuré (optionnel)
```

---

## 🚨 Que faire en cas d'erreur ?

### Erreur : "Session invalide" après login

**Solution** :
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Réappliquer la migration si nécessaire
-- (voir GUIDE_DEPLOIEMENT.md)
```

### Erreur : Webhook ne reçoit rien

**Solution** :
```bash
# Vérifier que le webhook est bien configuré dans PayDunya
# Vérifier les logs Netlify Functions
# Tester avec ngrok en local
```

### Erreur : Images ne s'affichent pas

**Solution** :
```sql
-- Vérifier les politiques Storage
SELECT * FROM storage.objects WHERE bucket_id = 'listings' LIMIT 5;

-- Vérifier que le bucket est public
SELECT * FROM storage.buckets WHERE id = 'listings';
```

---

**Bon test ! 🧪✅**

*Si tous les tests passent, vous êtes prêt pour le déploiement en production !*

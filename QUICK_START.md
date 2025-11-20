# ⚡ Quick Start - DaloaMarket

> **Temps estimé : 30 minutes** ⏱️

---

## 🎯 Objectif

Corriger les bugs critiques et déployer DaloaMarket en production.

---

## 📋 Prérequis (5 min)

Assurez-vous d'avoir :

- [x] Accès à **Supabase Dashboard** (https://app.supabase.com)
- [x] Accès à **PayDunya Dashboard** (https://app.paydunya.com)
- [x] Accès à **Netlify Dashboard** (https://app.netlify.com)
- [x] Les **clés API PayDunya** (Master Key, Private Key, Public Key, Token)
- [x] Les clés API PayDunya **PRODUCTION** (Master Key, Private Key, Token)

---

## 🚀 Étape 1 : Corriger le profil utilisateur (10 min)

### ❌ Problème actuel
Les utilisateurs ne peuvent pas compléter leur profil après confirmation email.

### ✅ Solution

1. **Ouvrez Supabase Dashboard**
   - Connectez-vous à https://app.supabase.com
   - Sélectionnez votre projet DaloaMarket

2. **Allez dans SQL Editor**
   - Menu de gauche > SQL Editor
   - Cliquez sur "New query"

3. **Copiez-collez cette migration SQL** :
   
   Ouvrez le fichier : `supabase/migrations/20250106_fix_profile_completion.sql`
   
   Copiez tout son contenu et collez-le dans l'éditeur SQL.

4. **Exécutez la migration**
   - Cliquez sur "Run" (ou Ctrl+Enter)
   - ✅ Vous devez voir : `Success. No rows returned`

5. **Vérifiez que ça a fonctionné**
   
   Exécutez cette requête :
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'users';
   ```
   
   ✅ **Résultat attendu** : 4 politiques
   - `Public can view user profiles`
   - `Users can view their own profile`
   - `Users can insert their own profile`
   - `Users can update their own profile`

---

## 💳 Étape 2 : Automatiser les paiements (10 min)

### ❌ Problème actuel
Vous devez manuellement créditer les comptes après réception des captures d'écran.

### ✅ Solution

#### A. Configurer Netlify (5 min)

1. **Ouvrez Netlify Dashboard**
   - Connectez-vous à https://app.netlify.com
   - Sélectionnez votre site DaloaMarket

2. **Allez dans les variables d'environnement**
   - Site settings > Environment variables
   - Vérifiez/ajoutez ces variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SUPABASE_SERVICE_KEY` | `eyJ...` | Supabase Dashboard → Settings → API → service_role key |
| `PAYDUNYA_MODE` | `live` | Mode production ✅ |
| `PAYDUNYA_MASTER_KEY` | `IyFjblm5-qHE4-jO8P-Lrn3-tsO785CUqu4i` | Votre Master Key |
| `PAYDUNYA_PRIVATE_KEY` | `live_private_XWuadr0OGDY5LePhjOAvbq7mi0Y` | Clé privée LIVE |
| `PAYDUNYA_PUBLIC_KEY` | `live_public_VTsXSUVf0mW55Xhze8tfwlhXsLo` | Clé publique LIVE |
| `PAYDUNYA_TOKEN` | `VS2Eff1F0yAjoAzbjXPb` | Token LIVE |

   ⚠️ **IMPORTANT** :
   - Utilisez les clés de **PRODUCTION** (commencent par `live_`)
   - NE PAS utiliser les clés de test (`test_...`)
   - Ces valeurs proviennent de votre dashboard PayDunya

3. **Redéployez le site** (optionnel, automatique au prochain push Git)

#### B. Vérifier la configuration PayDunya (2 min)

✅ **Déjà configuré dans votre compte !**

Votre IPN (Instant Payment Notification) est déjà activé :
- **Endpoint** : `https://daloamarket.netlify.app/.netlify/functions/paydunya-callback`
- **Statut** : Activé ✅

**Rien à faire**, votre configuration est correcte !

---

## 🧪 Étape 3 : Tester l'application (10 min)

### Test 1 : Inscription + Profil (5 min)

1. **Ouvrez votre site**
   ```
   https://daloa-market.netlify.app
   ```

2. **Créez un compte test**
   - Cliquez sur "S'inscrire"
   - Email : `test+$(date +%s)@example.com` (email unique)
   - Mot de passe : `TestPassword123!`

3. **Confirmez l'email**
   - Ouvrez votre boîte email
   - Cliquez sur le lien de confirmation
   - ✅ Vous devez être redirigé vers `/auth/complete-profile`

4. **Complétez le profil**
   - Nom complet : `Test User`
   - Téléphone : `+225 07 12 34 56 78`
   - Quartier : Sélectionnez un quartier
   - Cliquez sur "Compléter mon profil"

5. **✅ Vérification**
   - Vous devez être redirigé vers la page d'accueil
   - Aucune erreur dans la console (F12)
   - Votre nom apparaît en haut à droite

### Test 2 : Paiement automatique (5 min)

⚠️ **Ce test nécessite un VRAI paiement** (montant minimum : 500 FCFA)

1. **Connectez-vous avec votre compte**

2. **Allez sur la page "Acheter des crédits"**
   ```
   https://daloa-market.netlify.app/achat-credits
   ```

3. **Sélectionnez le pack Starter (500 FCFA)**

4. **IMPORTANT : Pour tester le webhook automatique**
   
   Vous devez modifier temporairement `AchatCreditsPage.tsx` pour utiliser PayDunya au lieu du formulaire manuel.
   
   **OU** (plus simple pour tester) :
   
   Utilisez cette fonction de test dans la console du navigateur (F12) :
   ```javascript
   // Simuler un webhook PayDunya
   fetch('/.netlify/functions/paydunya-webhook', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       data: {
         status: 'completed',
         invoice_token: 'test-' + Date.now(),
         total_amount: 500,
         custom_data: {
           user_id: 'YOUR_USER_ID',  // Remplacer par votre ID
           type: 'pack',
           credits: 3
         }
       }
     })
   }).then(r => r.json()).then(console.log);
   ```
   
   Pour trouver votre `user_id` :
   ```javascript
   // Dans la console (F12)
   JSON.parse(localStorage.getItem('supabase.auth.token')).currentSession.user.id
   ```

5. **✅ Vérification**
   - Vérifiez les logs Netlify :
     ```
     Netlify Dashboard > Functions > paydunya-webhook > Logs
     ```
   - Vous devez voir : `✅ Utilisateur [id] crédité de 3 crédits`
   
   - Vérifiez dans Supabase :
     ```sql
     SELECT * FROM user_credits WHERE user_id = '[VOTRE_ID]';
     ```
   - Vous devez voir : `credits: 3`

---

## 🎉 C'est fini !

### ✅ Checklist finale

- [x] Migration SQL appliquée (Profil utilisateur corrigé)
- [x] Webhook PayDunya configuré (Paiements automatiques)
- [x] Tests réussis (Inscription + Paiement)
- [x] Aucune erreur dans les logs

### 🚀 Vous êtes prêt à lancer !

---

## 📚 Pour aller plus loin

Consultez ces guides pour plus de détails :

1. **GUIDE_DEPLOIEMENT.md** - Configuration complète
2. **PLAN_LANCEMENT.md** - Stratégie marketing
3. **TESTS.md** - Tests approfondis
4. **ARCHITECTURE.md** - Schéma technique

---

## 🆘 Problèmes ?

### ❌ "Session invalide" après confirmation email

**Solution** :
1. Vérifiez que la migration SQL a bien été appliquée
2. Dans Supabase SQL Editor :
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```
   Vous devez voir 4 politiques.

### ❌ Webhook ne reçoit rien

**Solution** :
1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien dans Netlify
2. Vérifiez que l'URL du webhook est correcte dans PayDunya
3. Consultez les logs Netlify Functions

### ❌ Erreur "RLS policy violation"

**Solution** :
1. Réappliquez la migration SQL
2. Vérifiez que vous êtes bien connecté

---

## 🎯 Prochaine étape : Lancer !

Maintenant que tout fonctionne, suivez le **PLAN_LANCEMENT.md** pour :

1. **Semaine 1** : Soft launch avec 10 ambassadeurs
2. **Semaine 2** : Lancement officiel (500 utilisateurs)
3. **Semaine 3+** : Croissance (2000+ utilisateurs)

---

**Bon lancement ! 🚀🔥**

*Vous avez tout ce qu'il faut pour réussir !* 💪

# 🧪 Guide de Test - Paiement Automatique PayDunya

> **Temps estimé : 15 minutes**

---

## 🎯 Objectif

Valider que le système de paiement automatique fonctionne correctement :
1. Créer une facture PayDunya
2. Effectuer un paiement test
3. Vérifier que les crédits sont ajoutés automatiquement

---

## 📋 Prérequis

- [x] Migration SQL appliquée (profil complété)
- [x] Variables Netlify configurées (PAYDUNYA_*, SUPABASE_SERVICE_KEY)
- [x] IPN PayDunya activé
- [x] Compte utilisateur test créé sur DaloaMarket

---

## ✅ Test 1 : Achat de crédits (Paiement réel)

### Étape 1 : Préparer un compte test

1. **Connectez-vous à DaloaMarket**
   - URL : https://daloamarket.netlify.app
   - Créez un compte ou utilisez un compte existant

2. **Notez le nombre de crédits actuel**
   - Allez dans votre profil
   - Notez : `Crédits actuels = X`

### Étape 2 : Acheter un pack de crédits

1. **Allez sur la page d'achat**
   - Cliquez sur "Acheter des crédits"
   - Sélectionnez un pack (ex: 500 FCFA = 3 crédits)

2. **Cliquez sur "Payer maintenant"**
   - Vous serez redirigé vers PayDunya
   - URL : `https://app.paydunya.com/checkout/xxxxx`

3. **Effectuez le paiement**
   - Choisissez votre méthode (Orange Money, MTN, Wave, etc.)
   - Suivez les instructions de paiement
   - ⚠️ **Attention** : Ce sera un vrai paiement !

### Étape 3 : Vérifier le webhook

1. **Ouvrez les logs Netlify Functions**
   - Netlify Dashboard → Functions → `paydunya-callback`
   - Cliquez sur "View logs"

2. **Vérifiez les logs** :
   ```
   ✅ "Callback PayDunya reçu"
   ✅ "Traitement callback: { status: 'completed', ... }"
   ✅ "Crédits ajoutés avec succès: { userId: ..., credits: 3 }"
   ```

3. **Si erreur**, notez le message et vérifiez :
   - Variables d'environnement Netlify
   - Clés PayDunya (LIVE, pas TEST)
   - SUPABASE_SERVICE_KEY

### Étape 4 : Vérifier les crédits

1. **Retournez sur DaloaMarket**
   - Rafraîchissez la page profil
   - Vérifiez : `Crédits actuels = X + 3` (ou le montant acheté)

2. **Vérifiez dans Supabase**
   - Supabase Dashboard → Table Editor → `user_credits`
   - Trouvez votre utilisateur
   - Vérifiez que `credits` a été incrémenté

3. **Vérifiez la transaction**
   - Table Editor → `transactions`
   - Trouvez la transaction
   - Vérifiez : `status = 'completed'`, `type = 'pack'`

---

## ✅ Test 2 : Paiement d'une annonce (Optionnel)

### Étape 1 : Créer une annonce

1. **Allez sur "Créer une annonce"**
2. **Remplissez le formulaire**
3. **Cliquez sur "Publier"**
4. **Si vous n'avez plus de crédits gratuits, vous serez redirigé vers PayDunya**

### Étape 2 : Payer l'annonce

1. **Effectuez le paiement** (200 FCFA)
2. **Vérifiez les logs Netlify** (comme Test 1)
3. **Vérifiez que l'annonce est publiée** :
   - Statut = `active`
   - Visible sur la page d'accueil

---

## 🔍 Vérifications Supabase (SQL)

### Vérifier les crédits d'un utilisateur

```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  uc.credits,
  uc.total_earned,
  uc.total_spent
FROM users u
LEFT JOIN user_credits uc ON u.id = uc.user_id
WHERE u.email = 'votre-email@example.com';
```

### Vérifier les transactions récentes

```sql
SELECT 
  t.id,
  t.user_id,
  t.amount,
  t.type,
  t.status,
  t.paydunya_token,
  t.created_at,
  u.email
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 10;
```

### Vérifier les annonces publiées

```sql
SELECT 
  l.id,
  l.title,
  l.status,
  l.user_id,
  u.email,
  l.created_at
FROM listings l
LEFT JOIN users u ON l.user_id = u.id
WHERE l.status = 'active'
ORDER BY l.created_at DESC
LIMIT 10;
```

---

## 🐛 Dépannage

### Problème : Le webhook n'est pas appelé

**Causes possibles** :
- IPN PayDunya désactivé
- URL webhook incorrecte
- Fonction Netlify ne s'exécute pas

**Solutions** :
1. Vérifiez PayDunya Dashboard → IPN → Statut = Activé
2. Vérifiez l'URL : `https://daloamarket.netlify.app/.netlify/functions/paydunya-callback`
3. Testez manuellement le webhook :
   ```bash
   curl -X POST https://daloamarket.netlify.app/.netlify/functions/paydunya-callback \
     -H "Content-Type: application/json" \
     -d '{"status":"completed","token":"test123","custom_data":{"user_id":"your-user-id","type":"pack","credits":3}}'
   ```

### Problème : Les crédits ne sont pas ajoutés

**Causes possibles** :
- SUPABASE_SERVICE_KEY manquante ou incorrecte
- Fonction RPC `add_user_credits` n'existe pas
- Erreur dans le webhook

**Solutions** :
1. Vérifiez Netlify → Environment Variables → `SUPABASE_SERVICE_KEY`
2. Vérifiez Supabase → SQL Editor :
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_name = 'add_user_credits';
   ```
3. Consultez les logs Netlify Functions pour l'erreur exacte

### Problème : Erreur "Configuration PayDunya manquante"

**Causes possibles** :
- Variables PAYDUNYA_* manquantes dans Netlify
- Utilisation des clés TEST au lieu de LIVE

**Solutions** :
1. Vérifiez Netlify → Environment Variables :
   - `PAYDUNYA_MASTER_KEY`
   - `PAYDUNYA_PRIVATE_KEY`
   - `PAYDUNYA_PUBLIC_KEY`
   - `PAYDUNYA_TOKEN`
   - `PAYDUNYA_MODE` = `live`
2. Utilisez les clés qui commencent par `live_` (pas `test_`)

---

## ✅ Checklist de validation

- [ ] Achat de crédits fonctionne
- [ ] Webhook PayDunya est appelé
- [ ] Logs Netlify montrent "Crédits ajoutés avec succès"
- [ ] Crédits visibles dans le profil utilisateur
- [ ] Transaction enregistrée avec `status = 'completed'`
- [ ] Paiement d'annonce fonctionne (si testé)
- [ ] Annonce publiée après paiement (si testé)

---

## 🎯 Résultat attendu

Si tout fonctionne correctement :

1. **Utilisateur achète 500 FCFA de crédits**
   → PayDunya redirige vers page de paiement
   → Utilisateur paie avec Orange Money/MTN/Wave
   → PayDunya envoie notification à notre webhook
   → Webhook ajoute 3 crédits automatiquement
   → Utilisateur voit ses crédits augmenter

2. **Plus besoin d'intervention manuelle** ✅
   - Pas de capture d'écran à envoyer
   - Pas d'admin pour valider
   - Crédits instantanés après paiement

---

## 📚 Références

- [Documentation PayDunya IPN](https://paydunya.com/developers/v1/docs)
- [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md) - Guide complet
- [QUICK_START.md](./QUICK_START.md) - Démarrage rapide
- [CORRECTIONS.md](./CORRECTIONS.md) - Problèmes résolus

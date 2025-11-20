# 🚀 Déploiement Rapide - URGENT

> **Problème actuel** : Erreur de build Netlify (repository introuvable)

---

## 🔴 ERREUR NETLIFY

```
Failed during stage 'preparing repo': 
remote: Repository not found.
fatal: repository 'https://github.com/Daloaarket/DaloaMarket/' not found
```

**Cause** : Le repository GitHub `Daloaarket/DaloaMarket` n'existe pas (typo dans "Daloaarket")

---

## ✅ SOLUTION 1 : Déploiement manuel via Netlify CLI (5 min)

### Étape 1 : Installer Netlify CLI

```powershell
npm install -g netlify-cli
```

### Étape 2 : Se connecter à Netlify

```powershell
netlify login
```

Une page web s'ouvrira pour autoriser la connexion.

### Étape 3 : Lier votre projet

```powershell
cd c:\Users\elmas\Downloads\DaloaMarket\DaloaMarket-main
netlify link
```

Sélectionnez votre site `daloa-market` dans la liste.

### Étape 4 : Ajouter les variables d'environnement

**IMPORTANT** : Ajoutez d'abord les variables PayDunya dans Netlify Dashboard :

**Netlify Dashboard** → Site Settings → Environment Variables → Add

| Variable | Valeur |
|----------|--------|
| `PAYDUNYA_MODE` | `live` |
| `PAYDUNYA_MASTER_KEY` | `IyFjblm5-qHE4-jO8P-Lrn3-tsO785CUqu4i` |
| `PAYDUNYA_PRIVATE_KEY` | `live_private_XWuadr0OGDY5LePhjOAvbq7mi0Y` |
| `PAYDUNYA_PUBLIC_KEY` | `live_public_VTsXSUVf0mW55Xhze8tfwlhXsLo` |
| `PAYDUNYA_TOKEN` | `VS2Eff1F0yAjoAzbjXPb` |
| `VITE_APP_URL` | `https://daloamarket.shop` |

### Étape 5 : Build local

```powershell
npm install
npm run build
```

### Étape 6 : Déployer

```powershell
netlify deploy --prod
```

---

## ✅ SOLUTION 2 : Reconfigurer Git dans Netlify (10 min)

### Étape 1 : Créer un nouveau repository GitHub

1. Allez sur https://github.com/new
2. Nom : `DaloaMarket` (sans typo)
3. Visibility : Private ou Public
4. Créer le repository

### Étape 2 : Pousser votre code

```powershell
cd c:\Users\elmas\Downloads\DaloaMarket\DaloaMarket-main

# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .
git commit -m "Initial commit - DaloaMarket production"

# Lier au nouveau repository (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/DaloaMarket.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 3 : Reconfigurer Netlify

1. **Netlify Dashboard** → Site Settings → Build & deploy
2. Cliquez sur **"Link to a different repository"**
3. Sélectionnez votre nouveau repository `VOTRE_USERNAME/DaloaMarket`
4. Build settings :
   - Build command : `npm run build`
   - Publish directory : `dist`
   - Base directory : (laisser vide)

### Étape 4 : Ajouter les variables d'environnement

Voir Solution 1 → Étape 4

### Étape 5 : Déclencher le build

Netlify Dashboard → Deploys → **Trigger deploy**

---

## 🌐 Mise à jour du domaine personnalisé

Vous avez configuré `daloamarket.shop` - parfait !

### ✅ Variables à mettre à jour dans Netlify

```
VITE_APP_URL = https://daloamarket.shop
```

### ✅ IPN PayDunya à configurer

**PayDunya Dashboard** → Settings → IPN

```
Endpoint : https://daloamarket.shop/.netlify/functions/paydunya-callback
Statut : Activé ✅
```

---

## 📝 Checklist complète

### Configuration Netlify

- [ ] Variables d'environnement ajoutées :
  - [ ] `PAYDUNYA_MODE = live`
  - [ ] `PAYDUNYA_MASTER_KEY = IyFjblm5-qHE4-jO8P-Lrn3-tsO785CUqu4i`
  - [ ] `PAYDUNYA_PRIVATE_KEY = live_private_XWuadr0OGDY5LePhjOAvbq7mi0Y`
  - [ ] `PAYDUNYA_PUBLIC_KEY = live_public_VTsXSUVf0mW55Xhze8tfwlhXsLo`
  - [ ] `PAYDUNYA_TOKEN = VS2Eff1F0yAjoAzbjXPb`
  - [ ] `VITE_APP_URL = https://daloamarket.shop`
  - [ ] `SUPABASE_SERVICE_KEY = eyJ...` (déjà configuré ✅)

- [ ] Repository Git configuré (Solution 1 OU Solution 2)
- [ ] Domaine personnalisé configuré : `daloamarket.shop` ✅

### Configuration PayDunya

- [ ] IPN Endpoint mis à jour : `https://daloamarket.shop/.netlify/functions/paydunya-callback`
- [ ] IPN activé ✅

### Configuration Supabase

- [ ] Migration SQL appliquée ✅

### Tests

- [ ] Site accessible sur `https://daloamarket.shop`
- [ ] Inscription + profil fonctionne
- [ ] Achat de crédits fonctionne
- [ ] Webhook PayDunya fonctionne

---

## 🆘 En cas de problème

### Erreur : `npm install` échoue

```powershell
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur : `netlify deploy` échoue

```powershell
# Vérifier que vous êtes lié au bon site
netlify status

# Relancer le link
netlify unlink
netlify link
```

### Erreur : Build réussit mais le site ne fonctionne pas

1. Vérifiez que les variables d'environnement sont bien définies
2. Vérifiez la console navigateur pour les erreurs
3. Vérifiez les logs Netlify Functions

---

## 🎯 Objectif

**Site opérationnel sur `daloamarket.shop` dans l'heure** avec :
- ✅ Build réussi
- ✅ Variables PayDunya configurées
- ✅ IPN webhook fonctionnel
- ✅ Inscription + profil + paiement opérationnels

---

## 📞 Prochaines étapes après déploiement

1. Tester l'inscription (voir `TEST_PAIEMENT.md`)
2. Tester l'achat de crédits
3. Vérifier les logs Netlify Functions
4. Optimiser le design mobile (voir `CORRECTIONS.md`)
5. Lancer le soft launch (voir `PLAN_LANCEMENT.md`)

**Vous êtes presque là ! 💪**

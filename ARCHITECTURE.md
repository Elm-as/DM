# 🏗️ Architecture Technique - DaloaMarket

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                                 │
│                                                                      │
│  👤 Étudiants      🏢 Vendeurs      🛡️ Admin                       │
└────────────┬─────────────────────────────────────────┬──────────────┘
             │                                          │
             │                                          │
             ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                           │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  HomePage    │  │ ListingPage  │  │  ProfilePage │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  LoginPage   │  │  SearchPage  │  │ MessagesPage │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  Hébergement : Netlify (CDN Global)                                 │
│  URL : https://daloa-market.netlify.app                             │
└────────────┬─────────────────────────────────────────┬──────────────┘
             │                                          │
             │ API Calls (REST)                        │
             │                                          │
             ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  BACKEND (Supabase + Functions)                      │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Supabase Auth                              │  │
│  │  - Inscription / Login                                         │  │
│  │  - Confirmation email                                          │  │
│  │  - Reset password                                              │  │
│  │  - JWT Tokens                                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  Supabase Database (PostgreSQL)                │  │
│  │                                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │  users   │  │ listings │  │ messages │  │ reviews  │     │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │  │
│  │                                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │  │
│  │  │  credits │  │transactions│  │favorites │                   │  │
│  │  └──────────┘  └──────────┘  └──────────┘                    │  │
│  │                                                                │  │
│  │  🔒 RLS (Row Level Security) activé sur toutes les tables    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  Supabase Storage                              │  │
│  │  - Bucket : listings (photos d'annonces)                      │  │
│  │  - Bucket : manual-payments (captures d'écran)                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              Netlify Functions (Serverless)                    │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────┐           │  │
│  │  │  paydunya-create-invoice.js                    │           │  │
│  │  │  - Créer une facture PayDunya                  │           │  │
│  │  │  - Retourner l'URL de paiement                 │           │  │
│  │  └────────────────────────────────────────────────┘           │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────┐           │  │
│  │  │  paydunya-webhook.js ⭐ NOUVEAU                │           │  │
│  │  │  - Recevoir les notifications PayDunya         │           │  │
│  │  │  - Créditer automatiquement l'utilisateur      │           │  │
│  │  │  - Enregistrer la transaction                  │           │  │
│  │  └────────────────────────────────────────────────┘           │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────┐           │  │
│  │  │  send-credit-request.js                        │           │  │
│  │  │  - Envoyer email admin (système manuel)        │           │  │
│  │  └────────────────────────────────────────────────┘           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────────────┬──────────────┘
             │                                          │
             │                                          │
             ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICES EXTERNES                                 │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        PayDunya API                            │  │
│  │  - Orange Money                                                │  │
│  │  - MTN Mobile Money                                            │  │
│  │  - Wave                                                        │  │
│  │  - Moov Money                                                  │  │
│  │                                                                │  │
│  │  Webhook URL: /.netlify/functions/paydunya-webhook            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        Resend API                              │  │
│  │  - Emails transactionnels                                      │  │
│  │  - Confirmations                                               │  │
│  │  - Notifications                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de données principaux

### 1️⃣ Inscription et complétion de profil

```
Utilisateur
   │
   ├─► Frontend: RegisterPage
   │     │
   │     └─► Supabase Auth: signUp()
   │           │
   │           └─► Trigger: handle_new_user()
   │                 │
   │                 ├─► INSERT INTO users (id, email)
   │                 └─► INSERT INTO user_credits (user_id, credits: 0)
   │
   ├─► Email: Confirmation link
   │
   ├─► Frontend: EmailConfirmedPage
   │     │
   │     └─► Redirect: /auth/complete-profile
   │
   └─► Frontend: CompleteProfilePage
         │
         └─► Supabase: updateUserProfile()
               │
               └─► UPDATE users SET full_name, phone, district
                     │
                     └─► ✅ Profil complété !
```

### 2️⃣ Achat de crédits (Automatique avec PayDunya)

```
Utilisateur
   │
   ├─► Frontend: AchatCreditsPage
   │     │
   │     └─► Sélectionne un pack (500 FCFA = 3 crédits)
   │
   ├─► Netlify Function: paydunya-create-invoice
   │     │
   │     ├─► POST https://app.paydunya.com/api/v1/checkout-invoice/create
   │     │     Body: {
   │     │       total_amount: 500,
   │     │       custom_data: { user_id: "xxx", type: "pack", credits: 3 }
   │     │     }
   │     │
   │     └─► Retour: { checkout_url: "https://...", token: "xxx" }
   │
   ├─► PayDunya: Page de paiement
   │     │
   │     └─► Utilisateur paie avec Orange Money / MTN / Wave
   │
   ├─► PayDunya: Webhook POST /.netlify/functions/paydunya-webhook ⭐
   │     Body: {
   │       status: "completed",
   │       invoice_token: "xxx",
   │       total_amount: 500,
   │       custom_data: { user_id: "xxx", credits: 3 }
   │     }
   │
   └─► Netlify Function: paydunya-webhook
         │
         ├─► Vérifier: status === "completed"
         │
         ├─► INSERT INTO transactions (user_id, amount, type: "credit_purchase")
         │
         ├─► UPDATE user_credits SET credits = credits + 3
         │
         └─► ✅ Crédits ajoutés automatiquement !
```

### 3️⃣ Publication d'annonce

```
Utilisateur
   │
   ├─► Frontend: ListingCreatePage
   │     │
   │     ├─► Upload photos → Supabase Storage (bucket: listings)
   │     │
   │     └─► Supabase: INSERT INTO listings
   │           Body: {
   │             user_id, title, description, price, category,
   │             photos: ["url1", "url2"], status: "active"
   │           }
   │
   ├─► Supabase Function: decrement_user_credit(user_id) ⭐
   │     │
   │     └─► UPDATE user_credits SET credits = credits - 1
   │           WHERE user_id = xxx AND credits > 0
   │
   └─► Trigger: set_first_listing_at() (si 1ère annonce)
         │
         └─► UPDATE users SET first_listing_at = NOW()
               WHERE id = xxx AND first_listing_at IS NULL
```

### 4️⃣ Messagerie

```
Utilisateur A
   │
   ├─► Frontend: ListingDetailPage
   │     │
   │     └─► Clic sur "Contacter le vendeur"
   │
   ├─► Frontend: ChatPage
   │     │
   │     └─► Supabase: INSERT INTO messages
   │           Body: {
   │             listing_id, sender_id, receiver_id, content
   │           }
   │
   └─► Real-time: Supabase Realtime Subscriptions
         │
         └─► Utilisateur B reçoit le message instantanément
```

### 5️⃣ Système de notation

```
Utilisateur A (Acheteur)
   │
   ├─► Après transaction avec Utilisateur B (Vendeur)
   │
   ├─► Frontend: ReviewForm
   │     │
   │     └─► Supabase: INSERT INTO reviews
   │           Body: {
   │             reviewer_id: A,
   │             reviewed_id: B,
   │             listing_id: xxx,
   │             rating: 5,
   │             comment: "Excellent vendeur !"
   │           }
   │
   └─► Calcul de la note moyenne de B
         │
         └─► UPDATE users SET rating = AVG(reviews.rating)
               WHERE id = B
```

---

## 🔐 Sécurité et RLS (Row Level Security)

### Politiques RLS appliquées

```sql
-- Table: users
✅ Public can view user profiles (SELECT, TO public)
✅ Users can view their own profile (SELECT, TO authenticated)
✅ Users can insert their own profile (INSERT, TO authenticated)
✅ Users can update their own profile (UPDATE, TO authenticated)

-- Table: listings
✅ Anyone can view active listings (SELECT)
✅ Users can create their own listings (INSERT)
✅ Users can update their own listings (UPDATE)
✅ Users can delete their own listings (DELETE)

-- Table: messages
✅ Users can view their own messages (SELECT, sender_id OR receiver_id)
✅ Users can send messages (INSERT)
✅ Users can update their own messages (UPDATE, sender_id)

-- Table: user_credits
✅ Users can view their own credits (SELECT)
✅ Users can insert their own credits (INSERT)
✅ Users can update their own credits (UPDATE)

-- Table: transactions
✅ Users can view their own transactions (SELECT)
✅ Users can create their own transactions (INSERT)

-- Table: reviews
✅ Anyone can view reviews (SELECT)
✅ Users can create reviews (INSERT)
✅ Users can update their own reviews (UPDATE)
✅ Users can delete their own reviews (DELETE)

-- Table: favorites
✅ Users can view their favorites (SELECT)
✅ Users can create favorites (INSERT)
✅ Users can delete their favorites (DELETE)
```

---

## 📊 Base de données - Schéma détaillé

```sql
-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  phone TEXT,
  full_name TEXT,
  district TEXT,
  rating NUMERIC,
  first_listing_at TIMESTAMPTZ,
  role TEXT DEFAULT 'user',
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_credits
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  credits INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  last_update TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  district TEXT NOT NULL,
  photos TEXT[] NOT NULL,
  status TEXT DEFAULT 'active',
  boosted_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  paydunya_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id),
  reviewed_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (reviewer_id, listing_id)
);

-- Table: favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);
```

---

## 🚀 Optimisations de performance

### Frontend
- ✅ **Code splitting** avec React.lazy()
- ✅ **Lazy loading** des images
- ✅ **Memoization** avec useMemo/useCallback
- ✅ **Bundle optimization** avec Vite
- ✅ **CDN** global (Netlify)

### Backend
- ✅ **Indexes** sur les colonnes fréquemment requêtées
- ✅ **Connexion pooling** (Supabase)
- ✅ **Caching** au niveau Supabase
- ✅ **Serverless functions** (pas de serveur idle)

### Base de données
```sql
-- Indexes existants
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_district ON listings(district);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_messages_listing_id ON messages(listing_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);
```

---

## 🔧 Variables d'environnement

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Backend (Netlify Environment Variables)
```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # ⚠️ SECRET

# PayDunya
PAYDUNYA_MASTER_KEY=xxx
PAYDUNYA_PRIVATE_KEY=xxx
PAYDUNYA_PUBLIC_KEY=xxx
PAYDUNYA_TOKEN=xxx
PAYDUNYA_MODE=live

# Email (optionnel)
RESEND_API_KEY=re_xxx
```

---

**Architecture robuste, scalable et sécurisée ! ✅**

*Prête pour des milliers d'utilisateurs !* 🚀

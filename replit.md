# DaloaMarket - Replit Setup Documentation

## Project Overview
DaloaMarket is a marketplace application built with React, Vite, and Supabase. It includes payment processing via PayDunya and email notifications via Resend.

**Last Updated:** November 20, 2025

## Technical Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React icons, Framer Motion
- **State Management:** React Context API
- **Forms:** React Hook Form
- **Notifications:** React Hot Toast

### Backend
- **Database:** Supabase (PostgreSQL)
- **Serverless Functions:** Netlify Functions
- **Authentication:** Supabase Auth
- **Payment Gateway:** PayDunya
- **Email Service:** Resend

## Project Structure

```
DaloaMarket/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Contexts (Supabase, Auth)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (Supabase client, PayDunya)
│   ├── pages/           # Application pages/views
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── netlify/
│   └── functions/       # Serverless backend functions
├── supabase/
│   └── migrations/      # Database migration files
├── public/              # Static assets
└── package.json
```

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PayDunya
PAYDUNYA_MODE=live
PAYDUNYA_MASTER_KEY=your-master-key
PAYDUNYA_PRIVATE_KEY=your-private-key
PAYDUNYA_PUBLIC_KEY=your-public-key
PAYDUNYA_TOKEN=your-token

# Resend
RESEND_API_KEY=your-resend-api-key

# Application
VITE_APP_URL=https://your-replit-url.repl.co
SITE_URL=https://your-replit-url.repl.co
```

See `.env.example` for a complete template.

## Replit Configuration

### Port Configuration
- **Frontend Server:** Port 5000 (Replit webview requirement)
- **Host:** 0.0.0.0 (allows Replit proxy)
- **Allowed Hosts:** Enabled for Replit iframe support

### Workflow
The project runs with a single workflow:
- **Frontend Server:** `npm run dev` (Vite dev server on port 5000)

### Node.js Version
- **Required:** Node.js 20+ (specified in package.json engines)
- **Installed:** nodejs-20

## Development

### Running Locally
The workflow automatically starts the development server:
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## Key Features

1. **User Authentication** - Supabase Auth integration
2. **Listings Management** - Create, edit, delete marketplace listings
3. **Payment Processing** - PayDunya integration for credits and boosts
4. **Credit System** - Users purchase credits to post listings
5. **Search & Filters** - Advanced search functionality
6. **User Profiles** - Seller profiles and settings
7. **Messaging** - User-to-user communication
8. **Reviews** - Rating system for sellers
9. **Favorites** - Save favorite listings

## Database

The application uses Supabase (PostgreSQL) with:
- Row Level Security (RLS) policies
- Database migrations in `supabase/migrations/`
- Tables for users, listings, messages, reviews, favorites, transactions

## Serverless Functions

Located in `netlify/functions/`:
- `paydunya-create-invoice.js` - Creates payment invoices
- `paydunya-webhook.js` - Handles payment callbacks
- Various email notification functions

## Deployment

The project is configured for Netlify deployment with:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

For Replit deployment, use the built-in deployment tool after configuration.

## Recent Changes

### November 20, 2025 - Critical Bug Fix: Profile Completion Loop

**Bug Description:**
After completing the user profile, the application continued to display "profil à compléter" (profile to complete) even after successful database update. This caused an infinite redirect loop preventing users from accessing the application.

**Root Cause:**
Race condition between React state updates and navigation:
1. User completes profile → `updateUserProfile()` saves to database
2. `updateUserProfile()` triggers async `setUserProfile()` state update  
3. Code calls `refreshUserProfile()` then immediately `navigate('/')`
4. Navigation occurs before `isProfileComplete` memo re-computes from updated `userProfile` state
5. User reaches homepage → `PrivateRoute` checks `isProfileComplete` (still `false`) → redirects to `/complete-profile` → infinite loop

**Technical Details:**
- React batches state updates asynchronously for performance
- `useMemo` only re-computes when dependencies change
- Navigation triggered before memo dependency (`userProfile`) fully propagated through React's update cycle
- Service Worker ruled out - only caches static assets, not API responses

**Solution Applied:**
Changed navigation from React Router's `navigate('/')` to `window.location.href = '/'` in `CompleteProfilePage.tsx`. This forces a full page reload which:
- Clears all React state
- Re-initializes `SupabaseContext` from scratch
- Fetches fresh profile data from Supabase
- Guarantees `isProfileComplete` calculates from current database state

**Files Modified:**
- `src/pages/auth/CompleteProfilePage.tsx` - Replaced React Router navigation with full page reload after profile update

**Trade-offs:**
- Full page reload is heavier than client-side navigation
- User experiences brief page flash instead of smooth transition
- Ensures data consistency - critical for authentication flow

**Testing Required:**
- Desktop: Complete profile flow without hard refresh ✓
- Mobile: Complete profile on Chrome/Safari (Android/iOS)
- Verify no additional caching issues on mobile PWA

**Architect Review:** PASS - Solution is functionally sound and breaks the race condition

---

### November 20, 2025 - Initial Replit Setup
- Migrated from Node.js 18 to Node.js 20
- Updated Vite config for Replit environment:
  - Port 5000 with 0.0.0.0 host
  - Enabled allowedHosts for proxy support
- Updated .gitignore with standard Vite patterns
- Created .env.example template
- Set up Frontend Server workflow
- Added @types/node for TypeScript support

## Architecture Notes

- **Frontend-only on Replit:** The Vite dev server serves the React application
- **Netlify Functions:** Backend logic runs as serverless functions (deployed separately)
- **Supabase:** Handles all database operations and authentication
- **PWA Support:** Service worker registered in production

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link if needed

### Adding Environment Variables
1. Update `.env` file
2. For frontend access, prefix with `VITE_`
3. For backend/functions, no prefix needed
4. Restart the workflow after changes

### Database Changes
1. Create migration in `supabase/migrations/`
2. Apply via Supabase CLI or dashboard
3. Update TypeScript types if needed

## Troubleshooting

### Port 5000 not accessible
- Verify workflow is running
- Check Vite config has `host: '0.0.0.0'` and `port: 5000`
- Ensure `allowedHosts: true` is set

### Supabase connection issues
- Verify environment variables are set correctly
- Check network connectivity
- Review Supabase dashboard for service status

### Build failures
- Clear node_modules and reinstall: `npm ci`
- Check for TypeScript errors: `npm run build`
- Review LSP diagnostics for syntax errors

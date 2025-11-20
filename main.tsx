import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { SupabaseProvider } from './contexts/SupabaseContext.tsx';
import './index.css';

// Suppress specific React Router 'Future Flag' warnings which are benign
// These warnings originate from React Router v6 notifying about optional v7 behaviors
// We filter them here to keep the dev console focused on actionable warnings.
const _origConsoleWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  try {
    if (args && args.length > 0 && typeof args[0] === 'string') {
      const msg = args[0] as string;
      if (
        msg.includes('React Router Future Flag Warning') ||
        msg.includes('v7_startTransition') ||
        msg.includes('v7_relativeSplatPath')
      ) {
        return; // swallow this specific router deprecation/flag notice
      }
    }
  } catch {
    // fallback to original if anything goes wrong
    _origConsoleWarn(...args);
    return;
  }
  _origConsoleWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <App />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>
);

// Enregistrement du service worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[SW] enregistré:', reg.scope);

      // Diagnostic: afficher caches existants
      if (window.caches) {
        const names = await caches.keys();
        console.log('[SW] caches présents:', names);
      }

      // Mode debug facultatif: mettre localStorage.FORCE_SW_RESET = '1' puis recharger
      if (localStorage.getItem('FORCE_SW_RESET') === '1') {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) {
          try {
            await r.unregister();
            console.log('[SW] désenregistré pour reset:', r.scope);
          } catch (e) {
            console.warn('[SW] échec unregister:', e);
          }
        }
        // Nettoyer caches
        if (window.caches) {
          const names = await caches.keys();
            await Promise.all(names.map(n => caches.delete(n)));
            console.log('[SW] caches supprimés');
        }
        localStorage.removeItem('FORCE_SW_RESET');
        // Recharger dur
        window.location.reload();
      }
    } catch (e) {
      console.warn('[SW] échec enregistrement:', e);
    }
  });
}
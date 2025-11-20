/**
 * FusionPay Webhook - Réception des événements de paiement
 * Événements: payin.session.pending | payin.session.completed | payin.session.cancelled
 *
 * Env requis pour mises à jour DB:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_KEY (Service Role)
 */

const { createClient } = require('@supabase/supabase-js');

function mapStatus(s) {
  if (!s) return 'pending';
  const v = String(s).toLowerCase();
  if (v.includes('completed') || v === 'paid') return 'completed';
  if (v.includes('cancel') || v === 'failure' || v === 'failed' || v === 'no paid') return 'failed';
  return 'pending';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const hasDb = !!(supabaseUrl && serviceKey);

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON invalide' }) };
  }

  // Exemples de champs reçus (selon la doc fournie)
  const {
    event: evt,
    tokenPay,
    statut,
    personal_Info,
    numeroSend,
    nomclient,
    Montant,
    frais,
    return_url,
    createdAt
  } = payload || {};

  const status = mapStatus(statut || evt);
  const info = Array.isArray(personal_Info) && personal_Info[0] ? personal_Info[0] : {};
  const listingId = info.listingId || null;
  const userId = info.userId || null;

  try {
    if (hasDb) {
      const supabase = createClient(supabaseUrl, serviceKey);

      // Idempotence: on cherche une transaction existante pour ce token
      const { data: existing, error: selErr } = await supabase
        .from('transactions')
        .select('id, status')
        .eq('paydunya_token', tokenPay)
        .limit(1)
        .maybeSingle();

      if (selErr) throw selErr;

      if (!existing) {
        // Insérer la transaction initiale
        const { error: insErr } = await supabase.from('transactions').insert({
          user_id: userId,
          listing_id: listingId,
          amount: Montant || 0,
          type: 'listing_payment',
          status: status,
          paydunya_token: tokenPay
        });
        if (insErr) throw insErr;
      } else if (existing.status !== status) {
        // Mettre à jour le statut si évolution
        const { error: updErr } = await supabase
          .from('transactions')
          .update({ status })
          .eq('id', existing.id);
        if (updErr) throw updErr;
      }

      // Activation de l'annonce si paiement confirmé
      if (status === 'completed' && listingId) {
        const { error: updListErr } = await supabase
          .from('listings')
          .update({ status: 'active' })
          .eq('id', listingId);
        if (updListErr) throw updListErr;
      }
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Erreur' }) };
  }
};

/**
 * FusionPay - Create Payment Session
 * Crée une session de paiement via l'API FusionPay et renvoie l'URL de paiement.
 *
 * Env requis:
 * - FUSIONPAY_API_URL: URL API fournie par le dashboard FusionPay
 * - SITE_URL: URL publique du site (ex: https://daloamarket.shop)
 */

const axios = require('axios');

exports.handler = async (event) => {
  // CORS preflight
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

  const API_URL = process.env.FUSIONPAY_API_URL;
  const SITE_URL = process.env.SITE_URL || 'https://daloamarket.shop';

  if (!API_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuration manquante: FUSIONPAY_API_URL' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      amount = 200,
      listingId,
      listingTitle = 'Publication annonce',
      userId,
      fullName,
      phone
    } = body;

    if (!listingId || !fullName || !phone) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Champs requis: listingId, fullName, phone' }) };
    }

    const paymentData = {
      totalPrice: amount,
      article: [ { [listingTitle]: amount } ],
      personal_Info: [ { userId, listingId } ],
      numeroSend: String(phone).replace(/\s+/g, ''),
      nomclient: fullName,
      return_url: `${SITE_URL}/payment/success?type=fusionpay&listing_id=${encodeURIComponent(listingId)}`,
      webhook_url: `${SITE_URL}/.netlify/functions/fusionpay-webhook`
    };

    const { data } = await axios.post(API_URL, paymentData, {
      headers: { 'Content-Type': 'application/json' }
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    const msg = error?.response?.data || error?.message || 'Erreur inconnue';
    return { statusCode: 500, body: JSON.stringify({ error: msg }) };
  }
};

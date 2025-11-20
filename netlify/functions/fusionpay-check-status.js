/**
 * FusionPay - Check Payment Status
 * Interroge l'API de statut pour un token donné et retourne le JSON.
 *
 * Env optionnels:
 * - FUSIONPAY_STATUS_URL_BASE (par défaut https://www.pay.moneyfusion.net/paiementNotif/)
 */

const axios = require('axios');

exports.handler = async (event) => {
  const token = event.queryStringParameters?.token;
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Paramètre token manquant' }) };
  }

  const BASE = process.env.FUSIONPAY_STATUS_URL_BASE || 'https://www.pay.moneyfusion.net/paiementNotif/';

  try {
    const { data } = await axios.get(`${BASE}${encodeURIComponent(token)}`);
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

/**
 * Webhook PayDunya - Gestion automatique des paiements de crédits
 * 
 * Ce webhook est appelé par PayDunya lorsqu'un paiement est effectué.
 * Il crédite automatiquement le compte de l'utilisateur.
 * 
 * URL du webhook à configurer dans PayDunya : 
 * https://votre-site.netlify.app/api/paydunya-webhook
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clé SERVICE_ROLE pour bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration PayDunya
const PAYDUNYA_MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
const PAYDUNYA_TOKEN = process.env.PAYDUNYA_TOKEN;

// Mapping des montants vers les crédits
const CREDIT_PACKS = {
  500: { credits: 3, name: 'Starter' },
  1500: { credits: 10, name: 'Regular' },
  3500: { credits: 30, name: 'Pro' },
};

exports.handler = async (event, context) => {
  // Autoriser uniquement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parser le body de la requête
    const body = JSON.parse(event.body);
    
    console.log('📥 Webhook PayDunya reçu:', JSON.stringify(body, null, 2));

    // Vérifier la signature PayDunya (sécurité)
    const hash = body.hash; // PayDunya envoie un hash pour vérifier l'authenticité
    const data = body.data;

    if (!data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Données invalides' }),
      };
    }

    // Extraire les informations importantes
    const {
      status,
      invoice_token,
      custom_data, // On va stocker l'user_id ici
      total_amount,
    } = data;

    console.log('📊 Status:', status);
    console.log('💰 Montant:', total_amount);
    console.log('🆔 Custom data:', custom_data);

    // Vérifier que le paiement est validé
    if (status !== 'completed') {
      console.log('⏳ Paiement non complété, status:', status);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Paiement non complété' }),
      };
    }

    // Extraire l'user_id du custom_data
    const userId = custom_data?.user_id;
    if (!userId) {
      console.error('❌ user_id manquant dans custom_data');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'user_id manquant' }),
      };
    }

    // Déterminer le nombre de crédits à ajouter
    const amount = parseInt(total_amount);
    const creditPack = CREDIT_PACKS[amount];

    if (!creditPack) {
      console.error('❌ Montant inconnu:', amount);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Montant invalide' }),
      };
    }

    console.log(`✅ Pack détecté: ${creditPack.name} (${creditPack.credits} crédits)`);

    // 1. Vérifier si la transaction existe déjà
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('paydunya_token', invoice_token)
      .single();

    if (existingTransaction) {
      console.log('⚠️ Transaction déjà traitée');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Transaction déjà traitée' }),
      };
    }

    // 2. Créer la transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: 'credit_purchase',
        status: 'completed',
        paydunya_token: invoice_token,
      });

    if (transactionError) {
      console.error('❌ Erreur création transaction:', transactionError);
      throw transactionError;
    }

    console.log('✅ Transaction créée');

    // 3. Créditer l'utilisateur
    const { data: userCredits, error: fetchError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('❌ Erreur récupération crédits:', fetchError);
      throw fetchError;
    }

    const newCredits = (userCredits?.credits || 0) + creditPack.credits;
    const newTotalEarned = (userCredits?.total_earned || 0) + creditPack.credits;

    const { error: updateError } = await supabase
      .from('user_credits')
      .update({
        credits: newCredits,
        total_earned: newTotalEarned,
        last_update: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('❌ Erreur mise à jour crédits:', updateError);
      throw updateError;
    }

    console.log(`✅ Utilisateur ${userId} crédité de ${creditPack.credits} crédits`);
    console.log(`💳 Nouveau solde: ${newCredits} crédits`);

    // 4. Envoyer un email de confirmation (optionnel)
    // TODO: Intégrer Resend ou un autre service d'email

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `${creditPack.credits} crédits ajoutés avec succès`,
        credits: newCredits,
      }),
    };

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erreur lors du traitement du paiement',
        details: error.message,
      }),
    };
  }
};

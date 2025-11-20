import React from 'react';
import { Shield, Lock, Eye, Trash2, Download, UserX, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            Politique de Confidentialité
          </h1>
          
          <div className="prose max-w-none text-grey-700">
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-medium text-blue-900 mb-2">
                <Lock className="inline h-5 w-5 mr-2" />
                Votre vie privée est importante pour nous
              </p>
              <p className="text-blue-800 text-sm">
                DaloaMarket s'engage à protéger vos données personnelles et à respecter votre vie privée. Cette politique décrit comment nous collectons, utilisons, stockons et protégeons vos informations.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Responsable du traitement des données</h2>
            <p>
              Le responsable du traitement de vos données personnelles est <strong>DaloaMarket</strong>, plateforme de marketplace locale basée à Daloa, Côte d'Ivoire.
            </p>
            <ul className="list-none pl-0 mb-4">
              <li><strong>Email :</strong> support@daloamarket.shop</li>
              <li><strong>Téléphone :</strong> +225 07 07 57 18 53</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-primary" />
              2. Données collectées
            </h2>
            <p className="mb-3">
              Nous collectons uniquement les informations nécessaires au fonctionnement de la plateforme :
            </p>
            
            <div className="space-y-4 mb-4">
              <div className="p-4 bg-grey-50 border-l-4 border-grey-400 rounded">
                <h3 className="font-semibold mb-2">📋 Données d'inscription</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Nom complet</strong> (affiché publiquement sur votre profil)</li>
                  <li><strong>Adresse email</strong> (pour connexion et notifications)</li>
                  <li><strong>Numéro de téléphone</strong> (affiché publiquement pour contact direct)</li>
                  <li><strong>Quartier/Localisation</strong> à Daloa (pour faciliter les rencontres)</li>
                  <li><strong>Mot de passe</strong> (chiffré et jamais stocké en clair)</li>
                </ul>
              </div>
              
              <div className="p-4 bg-grey-50 border-l-4 border-grey-400 rounded">
                <h3 className="font-semibold mb-2">📸 Données des annonces</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Photos</strong> des articles à vendre (stockées de façon sécurisée)</li>
                  <li><strong>Descriptions</strong> et informations sur les articles</li>
                  <li><strong>Prix</strong> et catégorie des articles</li>
                  <li><strong>Date de publication</strong> et statut de l'annonce</li>
                </ul>
              </div>
              
              <div className="p-4 bg-grey-50 border-l-4 border-grey-400 rounded">
                <h3 className="font-semibold mb-2">💬 Données d'utilisation</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Messages</strong> échangés via la messagerie interne</li>
                  <li><strong>Favoris</strong> et annonces sauvegardées</li>
                  <li><strong>Historique de navigation</strong> (pages consultées, recherches)</li>
                  <li><strong>Données techniques</strong> (adresse IP, type de navigateur, système d'exploitation)</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Utilisation des données</h2>
            <p className="mb-3">
              Vos données sont utilisées <strong>exclusivement</strong> pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Création et gestion de votre compte</strong> utilisateur</li>
              <li><strong>Publication et affichage</strong> de vos annonces</li>
              <li><strong>Mise en relation</strong> avec d'autres utilisateurs (acheteurs/vendeurs)</li>
              <li><strong>Messagerie interne</strong> pour faciliter les échanges</li>
              <li><strong>Notifications</strong> (nouveaux messages, confirmations de paiement, alertes)</li>
              <li><strong>Amélioration de la plateforme</strong> (statistiques anonymisées, analyse des bugs)</li>
              <li><strong>Lutte contre la fraude</strong> et modération des contenus abusifs</li>
              <li><strong>Conformité légale</strong> (réponses aux demandes des autorités judiciaires)</li>
            </ul>
            
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded mb-4">
              <p className="font-medium text-green-900 mb-2">
                ✅ Engagement de transparence
              </p>
              <ul className="list-disc pl-5 text-green-800 text-sm space-y-1">
                <li><strong>Aucune revente de vos données</strong> à des tiers ou annonceurs</li>
                <li><strong>Aucun usage commercial externe</strong> (pas de publicité ciblée basée sur vos données)</li>
                <li><strong>Aucun partage</strong> avec des partenaires marketing ou des courtiers en données</li>
                <li>Vos données restent sur DaloaMarket et ne sont jamais monétisées</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Paiements et données bancaires</h2>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
              <p className="font-medium text-yellow-900 mb-2">
                <AlertCircle className="inline h-5 w-5 mr-2" />
                Protection des données de paiement
              </p>
              <ul className="list-disc pl-5 text-yellow-800 text-sm space-y-1">
                <li>Les paiements pour l'achat de crédits sont réalisés <strong>manuellement</strong> via Mobile Money</li>
                <li><strong>Aucune donnée bancaire n'est collectée</strong> ni stockée par DaloaMarket</li>
                <li>Les transactions entre acheteurs et vendeurs se font <strong>en personne</strong>, sans intervention de DaloaMarket</li>
                <li>Nous ne gérons pas les paiements entre utilisateurs</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Partage des données avec des tiers</h2>
            <p className="mb-3">
              DaloaMarket ne partage vos données personnelles qu'avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Supabase</strong> (hébergement de la base de données - conformité RGPD européen)</li>
              <li><strong>Netlify</strong> (hébergement du site web - serveurs sécurisés)</li>
              <li><strong>Autorités judiciaires</strong> (uniquement sur réquisition légale ou mandat judiciaire)</li>
            </ul>
            <p className="text-sm italic text-grey-600">
              Ces partenaires techniques sont tenus par des accords de confidentialité et ne peuvent pas utiliser vos données à d'autres fins.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Sécurité des données</h2>
            <p className="mb-3">
              Nous mettons en place des mesures de sécurité pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Chiffrement SSL/TLS</strong> pour toutes les connexions au site</li>
              <li><strong>Mots de passe hashés</strong> avec algorithmes cryptographiques sécurisés</li>
              <li><strong>Base de données protégée</strong> avec authentification stricte</li>
              <li><strong>Sauvegardes régulières</strong> pour prévenir la perte de données</li>
              <li><strong>Modération active</strong> pour détecter et bloquer les comptes frauduleux</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              7. Vos droits sur vos données (RGPD)
            </h2>
            <p className="mb-4">
              Conformément aux principes du RGPD (Règlement Général sur la Protection des Données), vous disposez des droits suivants :
            </p>
            
            <div className="space-y-4 mb-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-blue-900 flex items-center mb-2">
                  <Eye className="h-5 w-5 mr-2" />
                  Droit d'accès
                </h3>
                <p className="text-blue-800 text-sm">
                  Vous pouvez <strong>consulter toutes vos données personnelles</strong> stockées sur DaloaMarket à tout moment via votre profil ou en nous contactant.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">✏️ Droit de rectification</h3>
                <p className="text-blue-800 text-sm">
                  Vous pouvez <strong>modifier vos informations personnelles</strong> (nom, email, téléphone, quartier) à tout moment depuis votre page de paramètres.
                </p>
                <Link to="/settings" className="text-blue-600 underline text-sm mt-2 inline-block">
                  → Accéder aux paramètres
                </Link>
              </div>
              
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h3 className="font-semibold text-red-900 flex items-center mb-2">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Droit à l'effacement ("droit à l'oubli")
                </h3>
                <p className="text-red-800 text-sm mb-2">
                  Vous pouvez <strong>demander la suppression complète de votre compte</strong> et de toutes vos données personnelles à tout moment.
                </p>
                <p className="text-red-700 text-sm font-medium mb-2">
                  Comment supprimer votre compte ?
                </p>
                <ol className="list-decimal pl-5 text-red-800 text-sm space-y-1">
                  <li>Connectez-vous à votre compte</li>
                  <li>Allez dans <strong>Paramètres → Supprimer le compte</strong></li>
                  <li>Confirmez la suppression (action irréversible)</li>
                  <li>Toutes vos données seront supprimées sous 72h maximum</li>
                </ol>
                <p className="text-red-700 text-sm mt-2 italic">
                  Alternative : Contactez-nous à support@daloamarket.shop pour demander la suppression manuelle.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                <h3 className="font-semibold text-purple-900 flex items-center mb-2">
                  <Download className="h-5 w-5 mr-2" />
                  Droit à la portabilité
                </h3>
                <p className="text-purple-800 text-sm">
                  Vous pouvez <strong>récupérer vos données dans un format lisible</strong> (JSON, CSV) pour les transférer vers un autre service. Contactez-nous pour obtenir une exportation de vos données.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <h3 className="font-semibold text-orange-900 flex items-center mb-2">
                  <UserX className="h-5 w-5 mr-2" />
                  Droit d'opposition
                </h3>
                <p className="text-orange-800 text-sm">
                  Vous pouvez <strong>vous opposer au traitement de vos données</strong> à des fins de marketing (désactivation des emails promotionnels) ou d'analyse statistique. Contactez-nous pour exercer ce droit.
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Conservation des données</h2>
            <p className="mb-3">
              Nous conservons vos données personnelles selon les durées suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Compte actif :</strong> Vos données sont conservées tant que votre compte existe</li>
              <li><strong>Après suppression de compte :</strong> Suppression définitive sous 72h (sauf obligations légales)</li>
              <li><strong>Annonces supprimées :</strong> Archivées 30 jours puis supprimées définitivement</li>
              <li><strong>Messages :</strong> Supprimés automatiquement après suppression de compte</li>
              <li><strong>Logs techniques :</strong> Conservés 90 jours pour sécurité et débogage</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Cookies et technologies de suivi</h2>
            <p className="mb-3">
              DaloaMarket utilise des technologies minimales pour assurer le bon fonctionnement :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Cookies de session :</strong> Pour maintenir votre connexion sécurisée</li>
              <li><strong>Stockage local (LocalStorage) :</strong> Pour vos préférences (langue, thème)</li>
              <li><strong>Pas de cookies publicitaires</strong> ni de trackers tiers (Google Analytics désactivé en version bêta)</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Données visibles publiquement</h2>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
              <p className="font-medium text-yellow-900 mb-2">
                ⚠️ Attention : Certaines données sont publiques
              </p>
              <p className="text-yellow-800 text-sm mb-2">
                Les informations suivantes sont <strong>visibles par tous les utilisateurs</strong> de DaloaMarket :
              </p>
              <ul className="list-disc pl-5 text-yellow-800 text-sm space-y-1">
                <li>Votre nom complet</li>
                <li>Votre numéro de téléphone</li>
                <li>Votre quartier à Daloa</li>
                <li>Vos annonces et leurs photos/descriptions</li>
                <li>Votre note moyenne et vos avis reçus</li>
              </ul>
              <p className="text-yellow-700 text-sm mt-2 italic">
                Ne partagez jamais d'informations sensibles (coordonnées bancaires, mots de passe, documents d'identité) dans vos annonces ou messages.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">11. Mineurs</h2>
            <p>
              DaloaMarket est réservé aux personnes âgées de <strong>18 ans et plus</strong>. Nous ne collectons pas sciemment de données auprès de mineurs. Si vous êtes parent et que vous découvrez que votre enfant nous a fourni des informations personnelles, contactez-nous pour suppression immédiate.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">12. Modifications de la politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification importante, nous vous en informerons par email ou notification sur la plateforme. La date de dernière mise à jour est indiquée en bas de page.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">13. Contact pour questions sur la vie privée</h2>
            <p className="mb-3">
              Pour toute question sur la protection de vos données ou pour exercer vos droits :
            </p>
            <ul className="list-none pl-0 mb-4">
              <li><strong>Email :</strong> support@daloamarket.shop (réponse sous 48-72h)</li>
              <li><strong>Téléphone :</strong> +225 07 07 57 18 53</li>
            </ul>
            
            <div className="p-4 bg-primary-50 border-l-4 border-primary rounded mb-4">
              <p className="font-medium text-primary-900 mb-2">
                📚 Ressources utiles
              </p>
              <ul className="list-disc pl-5 text-primary-800 text-sm space-y-1">
                <li>
                  <Link to="/faq" className="underline">
                    FAQ : Comment supprimer mon compte ?
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="underline">
                    Conditions Générales d'Utilisation (CGU)
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="underline">
                    Page d'aide et support
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-grey-200">
              <p className="text-sm text-grey-600">
                <strong>Date de dernière mise à jour :</strong> 20 Novembre 2025
              </p>
              <p className="text-sm text-grey-600 mt-2">
                <strong>Version :</strong> 2.0 (Politique complète avec droits RGPD)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

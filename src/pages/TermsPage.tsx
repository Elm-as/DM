import React from 'react';
import { AlertTriangle, Shield, Ban, Scale } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Conditions Générales d'Utilisation (CGU)</h1>
          
          <div className="prose max-w-none text-grey-700">
            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              DaloaMarket est actuellement en <strong>phase de test (version bêta)</strong>.<br />
              Cette plateforme évolue rapidement grâce à vos retours. Certaines fonctionnalités ou conditions peuvent changer sans préavis.<br />
              <strong>Aucune structure juridique formelle n'est encore créée.</strong> L'activité reste à petite échelle et s'adapte selon les retours des utilisateurs.
            </div>
            
            <p className="text-lg">
              Bienvenue sur DaloaMarket. En utilisant notre plateforme, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              1. Acceptation des conditions
            </h2>
            <p>
              En accédant à DaloaMarket, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Nature de la plateforme</h2>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
              <p className="font-medium text-blue-900 mb-2">
                DaloaMarket est une plateforme de mise en relation uniquement
              </p>
              <ul className="list-disc pl-5 text-blue-800 space-y-1">
                <li><strong>DaloaMarket n'est pas partie aux transactions</strong> entre acheteurs et vendeurs</li>
                <li>Nous ne gérons pas les paiements entre utilisateurs (rencontres en personne)</li>
                <li>Nous ne garantissons pas la qualité, la sécurité ou la légalité des articles vendus</li>
                <li>Les transactions se font de gré à gré entre particuliers</li>
                <li>DaloaMarket n'assume aucune responsabilité sur les litiges entre utilisateurs</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Responsabilité de l'utilisateur</h2>
            <p className="font-medium mb-2">
              En publiant une annonce sur DaloaMarket, vous reconnaissez et acceptez que :
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Vous êtes seul responsable</strong> du contenu de vos annonces et de leur légalité</li>
              <li><strong>Vous garantissez</strong> être le propriétaire légitime de l'article ou autorisé à le vendre</li>
              <li><strong>Vous certifiez</strong> que l'article est légal à vendre en République de Côte d'Ivoire</li>
              <li><strong>Les informations fournies</strong> (description, prix, photos) sont exactes et complètes</li>
              <li><strong>Les photos téléchargées</strong> représentent fidèlement l'article vendu (pas de photos trompeuses)</li>
              <li><strong>Vous respectez</strong> toutes les lois et réglementations ivoiriennes applicables</li>
              <li><strong>Vous assumez</strong> toute responsabilité civile et pénale en cas de vente illégale ou frauduleuse</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <Ban className="h-6 w-6 mr-2 text-red-600" />
              4. Contenus strictement interdits
            </h2>
            <p className="font-medium text-red-700 mb-3">
              La publication des contenus suivants est strictement interdite et entraînera des sanctions immédiates :
            </p>
            
            <div className="space-y-4 mb-4">
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                <h3 className="font-semibold text-red-900 mb-2">🚫 Arnaques et fraudes</h3>
                <ul className="list-disc pl-5 text-red-800 text-sm space-y-1">
                  <li>Annonces mensongères ou trompeuses</li>
                  <li>Vente de produits inexistants</li>
                  <li>Escroqueries de type "phishing" ou demandes d'argent</li>
                  <li>Pyramides de Ponzi, systèmes multi-niveaux frauduleux</li>
                  <li>Faux documents, fausses certifications</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                <h3 className="font-semibold text-red-900 mb-2">🚫 Spam et abus</h3>
                <ul className="list-disc pl-5 text-red-800 text-sm space-y-1">
                  <li>Annonces en double ou multiples publications du même article</li>
                  <li>Spam commercial ou publicitaire non sollicité</li>
                  <li>Utilisation de robots, scripts ou automatisation abusive</li>
                  <li>Création de faux comptes ou usurpation d'identité</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                <h3 className="font-semibold text-red-900 mb-2">🚫 Exploitation et contenus dangereux</h3>
                <ul className="list-disc pl-5 text-red-800 text-sm space-y-1">
                  <li>Exploitation de mineurs ou contenu pédopornographique</li>
                  <li>Traite d'êtres humains ou services d'exploitation</li>
                  <li>Harcèlement, menaces, incitation à la haine ou à la violence</li>
                  <li>Discrimination raciale, ethnique, religieuse ou sexuelle</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                <h3 className="font-semibold text-red-900 mb-2">🚫 Produits et services illégaux</h3>
                <ul className="list-disc pl-5 text-red-800 text-sm space-y-1">
                  <li>Armes à feu, armes blanches, explosifs et matériel militaire</li>
                  <li>Drogues, stupéfiants, substances illicites</li>
                  <li>Médicaments sur ordonnance sans autorisation</li>
                  <li>Produits contrefaits ou volés</li>
                  <li>Tabac, alcool (sans licence appropriée)</li>
                  <li>Contenus pornographiques ou à caractère sexuel explicite</li>
                  <li>Animaux vivants protégés ou en voie d'extinction</li>
                  <li>Organes humains, fluides corporels</li>
                  <li>Services de prostitution ou d'escort</li>
                  <li>Jeux d'argent illégaux, paris non autorisés</li>
                  <li>Tout autre article interdit par le Code pénal ivoirien</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
              5. Sanctions et mesures disciplinaires
            </h2>
            <p className="font-medium mb-3">
              En cas de non-respect des présentes CGU, DaloaMarket se réserve le droit d'appliquer les sanctions suivantes, sans préavis et sans obligation de justification :
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Suppression immédiate</strong> de l'annonce ou du contenu litigieux</li>
              <li><strong>Suspension temporaire</strong> du compte utilisateur (7 à 30 jours)</li>
              <li><strong>Blocage définitif</strong> du compte en cas de récidive ou d'infraction grave</li>
              <li><strong>Non-remboursement</strong> des crédits utilisés pour publier l'annonce supprimée</li>
              <li><strong>Interdiction de créer un nouveau compte</strong> (blocage par email, téléphone, IP)</li>
              <li><strong>Signalement aux autorités compétentes</strong> en cas d'activité criminelle</li>
              <li><strong>Collaboration avec la police</strong> pour les infractions pénales (escroquerie, vente illégale, etc.)</li>
            </ul>
            
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
              <p className="font-medium text-yellow-900">
                ⚠️ Aucun remboursement de crédits ou de frais ne sera effectué en cas de sanction pour violation des CGU.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Système de signalement d'abus</h2>
            <p className="mb-3">
              DaloaMarket met à disposition un système de signalement accessible sur chaque annonce et profil utilisateur.
            </p>
            <p className="mb-2">
              <strong>Comment signaler un contenu abusif ?</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Cliquez sur le bouton <strong>"Signaler"</strong> présent sur l'annonce ou le profil concerné</li>
              <li>Sélectionnez le motif du signalement (arnaque, spam, contenu illégal, etc.)</li>
              <li>Ajoutez des détails complémentaires si nécessaire</li>
              <li>Votre signalement sera examiné par notre équipe de modération sous 48-72h</li>
            </ul>
            <p className="text-sm text-grey-600 italic">
              Note : Les signalements abusifs ou répétés sans fondement peuvent entraîner des sanctions pour le signalant.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Inscription et compte utilisateur</h2>
            <p>
              Pour utiliser certaines fonctionnalités de DaloaMarket, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe et de restreindre l'accès à votre appareil. Vous acceptez d'assumer la responsabilité de toutes les activités qui se produisent sous votre compte.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Publication d'annonces et crédits</h2>
            <p className="mb-3">
              Pour publier une annonce sur DaloaMarket, vous devez disposer d'un crédit ou payer l'annonce à l'unité (200 FCFA) par paiement manuel.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Les crédits servent uniquement à publier des annonces</li>
              <li>Ils sont achetés manuellement via les moyens de paiement proposés (Mobile Money, etc.)</li>
              <li><strong>Aucun crédit n'est remboursé</strong> en cas de suppression d'annonce, quelle qu'en soit la raison</li>
              <li>La fonctionnalité de boost d'annonce a été retirée. Toutes les annonces sont affichées de façon équitable</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Services premium - Conditions et non-remboursement</h2>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
              <p className="mb-2"><strong>Crédits et services payants :</strong></p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Les crédits achetés sont valables pour une durée <strong>illimitée</strong></li>
                <li><strong>Aucun remboursement</strong> n'est possible une fois le paiement effectué</li>
                <li>Les crédits ne peuvent pas être transférés à un autre compte</li>
                <li>En cas de blocage de compte pour violation des CGU, les crédits restants sont perdus</li>
                <li>Aucun renouvellement automatique : chaque achat est manuel et volontaire</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Licence sur le contenu publié</h2>
            <p>
              En publiant une annonce sur DaloaMarket, vous accordez à DaloaMarket une licence non exclusive, mondiale, gratuite et transférable pour :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Afficher votre annonce sur la plateforme DaloaMarket</li>
              <li>Republier votre annonce sur d'autres supports DaloaMarket (réseaux sociaux, newsletter, campagnes marketing)</li>
              <li>Utiliser vos photos et descriptions à des fins promotionnelles pour DaloaMarket</li>
              <li>Modifier le format de l'annonce pour s'adapter aux différents supports (mobile, tablette, PC)</li>
            </ul>
            <p className="text-sm italic text-grey-600">
              Vous conservez la propriété intellectuelle de vos contenus, mais vous autorisez DaloaMarket à les utiliser dans le cadre de la promotion de la plateforme.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">11. Transactions entre utilisateurs</h2>
            <p className="mb-3">
              DaloaMarket est une plateforme qui met en relation acheteurs et vendeurs. <strong>Nous ne sommes pas partie aux transactions entre utilisateurs</strong> et n'assumons aucune responsabilité pour les problèmes pouvant survenir lors de ces transactions.
            </p>
            <p className="mb-3">
              <strong>Recommandations de sécurité :</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Rencontrez-vous dans un lieu public et fréquenté</li>
              <li>Vérifiez l'article avant de payer</li>
              <li>Ne payez jamais d'avance sans avoir vu l'article</li>
              <li>Méfiez-vous des offres trop alléchantes</li>
              <li>Signalez tout comportement suspect via le bouton "Signaler"</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center">
              <Scale className="h-6 w-6 mr-2 text-primary" />
              12. Limitation de responsabilité
            </h2>
            <div className="p-4 bg-grey-100 border-l-4 border-grey-500 rounded mb-4">
              <p className="mb-2">
                DaloaMarket ne peut être tenu responsable :
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Des litiges entre acheteurs et vendeurs</li>
                <li>De la qualité, de la conformité ou de la légalité des articles vendus</li>
                <li>Des dommages résultant de transactions entre utilisateurs</li>
                <li>Des pertes financières ou matérielles liées à l'utilisation de la plateforme</li>
                <li>Des interruptions de service, bugs ou erreurs techniques</li>
                <li>De la perte de données ou de contenu</li>
                <li>Des actions malveillantes d'utilisateurs (escroquerie, vol, etc.)</li>
              </ul>
            </div>
            <p className="text-sm">
              DaloaMarket ne garantit pas que le service sera ininterrompu, opportun, sécurisé ou sans erreur. L'utilisation de la plateforme se fait à vos propres risques.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">13. Propriété intellectuelle</h2>
            <p>
              Le contenu de DaloaMarket, y compris les textes, graphiques, logos, images, ainsi que leur compilation, est la propriété de DaloaMarket et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle. Vous ne pouvez pas reproduire, dupliquer, copier, vendre, revendre ou exploiter une partie du service sans autorisation expresse écrite.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">14. Modifications des conditions</h2>
            <p>
              DaloaMarket se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">15. Loi applicable et juridiction</h2>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded mb-4">
              <p className="mb-2">
                <strong>Droit ivoirien et juridiction locale :</strong>
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Ces conditions sont régies par <strong>les lois de la République de Côte d'Ivoire</strong></li>
                <li>Tout litige relatif à l'utilisation de DaloaMarket sera soumis à la compétence exclusive des <strong>tribunaux d'Abidjan</strong></li>
                <li>En cas de conflit avec des lois étrangères, le droit ivoirien prévaut</li>
              </ul>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">16. Contact et réclamations</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation ou pour signaler un problème, contactez-nous :
            </p>
            <ul className="list-none pl-0 mb-4">
              <li><strong>Email :</strong> support@daloamarket.shop</li>
              <li><strong>Téléphone :</strong> +225 07 07 57 18 53</li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-grey-200">
              <p className="text-sm text-grey-600">
                <strong>Date de dernière mise à jour :</strong> 20 Novembre 2025
              </p>
              <p className="text-sm text-grey-600 mt-2">
                <strong>Version :</strong> 2.0 (Version complète avec modération renforcée)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

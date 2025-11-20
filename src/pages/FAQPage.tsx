import React from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
  category?: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const FAQS: FAQItem[] = [
    // Catégorie: Paiement et crédits
    {
      category: "Paiement et crédits",
      question: "Comment fonctionne le paiement des annonces ?",
      answer: "Le paiement se fait manuellement après la création de votre annonce. Vous recevrez les instructions à l'écran. Il n'y a plus de paiement automatique ni de boost.",
    },
    {
      category: "Paiement et crédits",
      question: "À quoi servent les crédits ?",
      answer: "Les crédits servent uniquement à publier des annonces. Il n'y a plus de boost ni d'autres options payantes.",
    },
    {
      category: "Paiement et crédits",
      question: "Comment acheter des crédits ?",
      answer: "Rendez-vous sur la page 'Acheter des crédits' et suivez les instructions. Le paiement est manuel via Mobile Money.",
    },
    {
      category: "Paiement et crédits",
      question: "Puis-je booster mon annonce ?",
      answer: "Non, la fonctionnalité de boost a été retirée. Toutes les annonces sont affichées de façon équitable.",
    },
    {
      category: "Paiement et crédits",
      question: "Les crédits sont-ils remboursables ?",
      answer: "Non, les crédits achetés ne sont pas remboursables, conformément aux Conditions Générales d'Utilisation. Même en cas de suppression d'annonce ou de compte, aucun remboursement n'est effectué.",
    },
    
    // Catégorie: Sécurité et signalement
    {
      category: "Sécurité et signalement",
      question: "Comment signaler une annonce suspecte ou abusive ?",
      answer: (
        <div>
          <p className="mb-2">Pour signaler un contenu abusif :</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Ouvrez l'annonce ou le profil concerné</li>
            <li>Cliquez sur le bouton <strong>"Signaler"</strong> (généralement en haut à droite)</li>
            <li>Sélectionnez le motif du signalement :
              <ul className="list-disc pl-5 mt-1">
                <li>Arnaque ou fraude</li>
                <li>Spam ou publicité abusive</li>
                <li>Contenu illégal ou interdit</li>
                <li>Harcèlement ou menaces</li>
                <li>Autre (précisez dans les détails)</li>
              </ul>
            </li>
            <li>Ajoutez des détails complémentaires si nécessaire</li>
            <li>Notre équipe examinera votre signalement sous 48-72h</li>
          </ol>
          <p className="mt-3 text-sm italic text-grey-600">
            Note : Les signalements abusifs ou répétés sans fondement peuvent entraîner des sanctions pour le signalant.
          </p>
        </div>
      ),
    },
    {
      category: "Sécurité et signalement",
      question: "Que se passe-t-il après un signalement ?",
      answer: "Notre équipe de modération examine le signalement sous 48-72h. Si le contenu viole les CGU, l'annonce sera supprimée et le compte de l'utilisateur pourra être suspendu ou bloqué définitivement selon la gravité. Vous recevrez une notification du résultat de votre signalement.",
    },
    {
      category: "Sécurité et signalement",
      question: "Quels contenus sont strictement interdits ?",
      answer: (
        <div>
          <p className="mb-2">Les contenus suivants sont interdits et entraînent des sanctions immédiates :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Arnaques</strong> : annonces mensongères, produits inexistants, faux documents</li>
            <li><strong>Spam</strong> : annonces en double, publicité abusive, robots</li>
            <li><strong>Exploitation</strong> : harcèlement, menaces, discrimination, contenu pédopornographique</li>
            <li><strong>Produits illégaux</strong> : armes, drogues, médicaments sur ordonnance, produits volés</li>
          </ul>
          <p className="mt-2">
            <Link to="/terms" className="text-primary underline">
              Voir la liste complète dans les CGU →
            </Link>
          </p>
        </div>
      ),
    },
    {
      category: "Sécurité et signalement",
      question: "Comment puis-je me protéger des arnaques ?",
      answer: (
        <div>
          <p className="mb-2">Suivez ces recommandations de sécurité :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rencontrez-vous toujours dans un <strong>lieu public et fréquenté</strong></li>
            <li><strong>Vérifiez l'article</strong> avant de payer</li>
            <li><strong>Ne payez jamais d'avance</strong> sans avoir vu l'article</li>
            <li>Méfiez-vous des offres <strong>trop alléchantes</strong> (prix anormalement bas)</li>
            <li>Consultez les <strong>avis</strong> du vendeur avant de le contacter</li>
            <li><strong>Signalez</strong> tout comportement suspect immédiatement</li>
          </ul>
        </div>
      ),
    },
    
    // Catégorie: Compte et données personnelles
    {
      category: "Compte et données personnelles",
      question: "Comment supprimer mon compte et mes données personnelles ?",
      answer: (
        <div>
          <p className="mb-2 font-medium">Vous avez deux options pour supprimer votre compte :</p>
          
          <div className="mb-3">
            <p className="font-medium text-primary mb-1">Option 1 : Suppression depuis votre compte</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connectez-vous à votre compte DaloaMarket</li>
              <li>Allez dans <strong>Paramètres</strong></li>
              <li>Cliquez sur <strong>"Supprimer le compte"</strong> (en bas de page)</li>
              <li>Confirmez la suppression (action irréversible)</li>
              <li>Toutes vos données seront supprimées sous 72h maximum</li>
            </ol>
            <Link to="/settings" className="text-primary underline text-sm inline-block mt-2">
              → Accéder aux paramètres
            </Link>
          </div>
          
          <div>
            <p className="font-medium text-primary mb-1">Option 2 : Demande par email</p>
            <p className="text-sm">
              Envoyez un email à <strong>support@daloamarket.shop</strong> avec :
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              <li>Objet : "Demande de suppression de compte"</li>
              <li>Votre nom complet et email d'inscription</li>
              <li>Nous traiterons votre demande sous 72h</li>
            </ul>
          </div>
          
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-800">
              <strong>⚠️ Attention :</strong> La suppression de compte est <strong>définitive et irréversible</strong>. 
              Toutes vos annonces, messages, favoris et crédits restants seront perdus.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "Compte et données personnelles",
      question: "Quelles données sont supprimées lors de la suppression de compte ?",
      answer: (
        <div>
          <p className="mb-2">La suppression de compte entraîne la suppression complète de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Votre profil (nom, email, téléphone, quartier)</li>
            <li>Toutes vos annonces et leurs photos</li>
            <li>Tous vos messages échangés</li>
            <li>Vos favoris et annonces sauvegardées</li>
            <li>Vos avis et notes reçus</li>
            <li>Votre historique de navigation</li>
          </ul>
          <p className="mt-2 text-sm italic text-grey-600">
            Seules les données légalement requises pour la comptabilité (historique de paiements) sont conservées 5 ans pour conformité fiscale.
          </p>
        </div>
      ),
    },
    {
      category: "Compte et données personnelles",
      question: "Puis-je modifier mes informations personnelles ?",
      answer: (
        <div>
          <p className="mb-2">Oui, vous pouvez modifier vos informations à tout moment :</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Connectez-vous à votre compte</li>
            <li>Allez dans <strong>Paramètres</strong></li>
            <li>Modifiez votre nom, email, téléphone ou quartier</li>
            <li>Cliquez sur <strong>"Enregistrer les modifications"</strong></li>
          </ol>
          <Link to="/settings" className="text-primary underline text-sm inline-block mt-2">
            → Accéder aux paramètres
          </Link>
        </div>
      ),
    },
    {
      category: "Compte et données personnelles",
      question: "Mes données sont-elles revendues à des tiers ?",
      answer: (
        <div>
          <p className="font-medium text-green-700 mb-2">
            Non, absolument pas. DaloaMarket s'engage à ne jamais revendre vos données.
          </p>
          <p className="mb-2">Vos données sont utilisées uniquement pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Le fonctionnement de la plateforme (création de compte, annonces, messagerie)</li>
            <li>Les notifications (nouveaux messages, confirmations)</li>
            <li>L'amélioration du service (statistiques anonymisées)</li>
          </ul>
          <p className="mt-2">
            <Link to="/privacy" className="text-primary underline">
              En savoir plus sur notre politique de confidentialité →
            </Link>
          </p>
        </div>
      ),
    },
    {
      category: "Compte et données personnelles",
      question: "Puis-je récupérer mes données (portabilité) ?",
      answer: "Oui, conformément au RGPD, vous pouvez demander une exportation de vos données personnelles dans un format lisible (JSON ou CSV). Contactez-nous à support@daloamarket.shop avec l'objet 'Demande d'exportation de données' et nous vous enverrons vos données sous 7 jours ouvrés.",
    },
    
    // Catégorie: Sanctions et modération
    {
      category: "Sanctions et modération",
      question: "Que se passe-t-il si je viole les règles ?",
      answer: (
        <div>
          <p className="mb-2">En cas de violation des CGU, DaloaMarket peut appliquer les sanctions suivantes :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Suppression de l'annonce</strong> litigieuse (sans remboursement des crédits)</li>
            <li><strong>Suspension temporaire</strong> du compte (7 à 30 jours)</li>
            <li><strong>Blocage définitif</strong> du compte en cas de récidive ou infraction grave</li>
            <li><strong>Interdiction de créer un nouveau compte</strong></li>
            <li><strong>Signalement aux autorités</strong> pour les infractions pénales (escroquerie, vente illégale)</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-red-700">
            Aucun remboursement n'est effectué en cas de sanction.
          </p>
        </div>
      ),
    },
    {
      category: "Sanctions et modération",
      question: "Mon compte a été bloqué, que faire ?",
      answer: "Si votre compte a été bloqué pour violation des CGU, contactez-nous à support@daloamarket.shop en expliquant votre situation. Nous examinerons votre cas sous 72h. Attention : les blocages pour infractions graves (arnaque, contenu illégal) sont définitifs et sans appel.",
    },
  ];
  
  // Grouper les FAQs par catégorie
  const categories = Array.from(new Set(FAQS.map(faq => faq.category || "Autre")));
  
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded">
            <AlertTriangle className="inline h-5 w-5 mr-2" />
            DaloaMarket est en <strong>phase de test (version bêta)</strong>. Certaines fonctionnalités peuvent évoluer rapidement. Merci pour votre compréhension et vos retours !
          </div>
          
          <h1 className="text-2xl font-bold mb-6">Questions fréquentes (FAQ)</h1>
          
          {/* Liens rapides vers les sections importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <h3 className="font-semibold text-red-900 mb-1">Signaler un abus</h3>
              <p className="text-sm text-red-800">
                Cliquez sur "Signaler" sur l'annonce ou profil concerné
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <Shield className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">
                <Link to="/privacy" className="hover:underline">
                  Vos données
                </Link>
              </h3>
              <p className="text-sm text-blue-800">
                Consultez notre politique de confidentialité
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
              <Trash2 className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-900 mb-1">
                <Link to="/settings" className="hover:underline">
                  Supprimer mon compte
                </Link>
              </h3>
              <p className="text-sm text-purple-800">
                Paramètres → Supprimer le compte
              </p>
            </div>
          </div>
          
          {/* FAQs par catégorie */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-primary mb-4">{category}</h2>
              <div className="space-y-4">
                {FAQS.filter(faq => (faq.category || "Autre") === category).map((faq: FAQItem) => {
                  const globalIndex = FAQS.indexOf(faq);
                  return (
                    <div 
                      key={globalIndex} 
                      className="border border-grey-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none hover:bg-grey-50"
                        aria-label={`Toggle FAQ ${globalIndex + 1}: ${faq.question}`}
                      >
                        <span>{faq.question}</span>
                        {openIndex === globalIndex ? (
                          <ChevronUp className="h-5 w-5 text-grey-500 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-grey-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      
                      {openIndex === globalIndex && (
                        <div className="p-4 pt-0 text-grey-600 border-t border-grey-200">
                          {typeof faq.answer === 'string' ? faq.answer : faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-primary-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Vous avez d'autres questions ?</h2>
            <p className="text-grey-600 mb-4">
              N'hésitez pas à nous contacter si vous ne trouvez pas la réponse à votre question.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="mailto:support@daloamarket.shop" 
                className="btn-primary inline-block text-center transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Contacter le support
              </a>
              <Link 
                to="/help" 
                className="btn-secondary inline-block text-center transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Page d'aide
              </Link>
            </div>
          </div>

          <div className="mt-8 text-sm text-grey-600 text-center">
            Besoin d'informations sur le projet ou son créateur ? <Link to="/about" className="text-primary underline">Voir la page À propos</Link>
          </div>
          
          <div className="mt-6 p-4 bg-grey-50 rounded-lg border border-grey-200">
            <p className="text-sm text-grey-700 mb-2">
              <strong>Liens utiles :</strong>
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>
                <Link to="/terms" className="text-primary underline">
                  Conditions Générales d'Utilisation (CGU)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary underline">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-primary underline">
                  Comment ça marche ?
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

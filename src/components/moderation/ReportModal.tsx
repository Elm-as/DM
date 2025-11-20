import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'listing' | 'user';
  entityId: string;
  entityTitle?: string;
}

type ReportType = 'scam' | 'spam' | 'illegal' | 'harassment' | 'inappropriate' | 'fake' | 'other';

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityTitle
}) => {
  const { session } = useSupabase();
  const [selectedType, setSelectedType] = useState<ReportType | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes: { value: ReportType; label: string; description: string }[] = [
    {
      value: 'scam',
      label: 'Arnaque / Fraude',
      description: 'Annonce mensongère, produit inexistant, escroquerie'
    },
    {
      value: 'spam',
      label: 'Spam / Publicité abusive',
      description: 'Annonces en double, spam commercial, robots'
    },
    {
      value: 'illegal',
      label: 'Contenu illégal',
      description: 'Produits interdits, vente illégale, contenu dangereux'
    },
    {
      value: 'harassment',
      label: 'Harcèlement / Menaces',
      description: 'Harcèlement, menaces, intimidation'
    },
    {
      value: 'inappropriate',
      label: 'Contenu inapproprié',
      description: 'Contenu offensant, discriminatoire ou déplacé'
    },
    {
      value: 'fake',
      label: 'Fausse annonce / Faux profil',
      description: 'Informations fausses, usurpation d\'identité'
    },
    {
      value: 'other',
      label: 'Autre raison',
      description: 'Autre motif de signalement'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Vous devez être connecté pour signaler un contenu');
      return;
    }

    if (!selectedType) {
      toast.error('Veuillez sélectionner un motif de signalement');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('abuse_reports')
        .insert({
          reported_by: session.user.id,
          reported_entity_type: entityType,
          reported_entity_id: entityId,
          report_type: selectedType,
          description: description.trim() || null,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Vous avez déjà signalé ce contenu');
        } else {
          console.error('Report submission error:', error);
          toast.error('Erreur lors de l\'envoi du signalement');
        }
        return;
      }

      toast.success('Signalement envoyé avec succès. Nous l\'examinerons sous 48-72h.');
      onClose();
      setSelectedType('');
      setDescription('');
    } catch (error) {
      console.error('Unexpected error during report submission:', error);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-card shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-grey-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-bold">
              Signaler {entityType === 'listing' ? 'cette annonce' : 'ce profil'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-grey-500 hover:text-grey-700"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {entityTitle && (
            <div className="mb-4 p-3 bg-grey-50 rounded border border-grey-200">
              <p className="text-sm text-grey-600">Signalement concernant :</p>
              <p className="font-medium">{entityTitle}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-grey-700 mb-3">
              Motif du signalement <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedType === type.value
                      ? 'border-primary bg-primary-50'
                      : 'border-grey-200 hover:border-primary hover:bg-grey-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={selectedType === type.value}
                    onChange={(e) => setSelectedType(e.target.value as ReportType)}
                    className="mt-1 mr-3 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-grey-900">{type.label}</div>
                    <div className="text-sm text-grey-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-grey-700 mb-2">
              Détails complémentaires (optionnel)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Ajoutez des informations supplémentaires pour nous aider à comprendre le problème..."
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note importante :</strong> Notre équipe examinera votre signalement sous 48-72h. 
              Les signalements abusifs ou répétés sans fondement peuvent entraîner des sanctions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-grey-300 text-grey-700 rounded-lg hover:bg-grey-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedType}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer le signalement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../hooks/useSupabase';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  stopPropagation?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ listingId, className = '', stopPropagation = false }) => {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchFav = async () => {
      if (!user?.id || !isSupabaseConfigured) {
        setIsFav(false);
        return;
      }
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();
      if (!error && data) {
        setIsFav(true);
      } else {
        setIsFav(false);
      }
    };
    fetchFav();
  }, [user?.id, listingId]);

  const toggle = async (e?: React.MouseEvent) => {
    if (stopPropagation && e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      navigate('/login', { state: { from: `/listings/${listingId}` } });
      return;
    }
    if (!isSupabaseConfigured) return;

    setLoading(true);
    try {
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        if (error) throw error;
        setIsFav(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
        setIsFav(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
        isFav ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-white/90 text-grey-700 hover:bg-white'
      } shadow-md border border-grey-200 ${className}`}
    >
      <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;

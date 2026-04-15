import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn) { setWishlist([]); setWishlistIds(new Set()); return; }
    try {
      const { data } = await getWishlist();
      setWishlist(data.data || []);
      setWishlistIds(new Set((data.data || []).map(p => p._id)));
    } catch { setWishlist([]); }
  }, [isLoggedIn]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) { toast.error('Please login first'); return; }
    if (wishlistIds.has(productId)) {
      try {
        await removeFromWishlist(productId);
        setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
        setWishlist(prev => prev.filter(p => p._id !== productId));
        toast.success('Removed from wishlist');
      } catch { toast.error('Failed to update wishlist'); }
    } else {
      try {
        await addToWishlist(productId);
        setWishlistIds(prev => new Set([...prev, productId]));
        fetchWishlist();
        toast.success('Added to wishlist!', { icon: '❤️' });
      } catch { toast.error('Failed to update wishlist'); }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistIds, toggleWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

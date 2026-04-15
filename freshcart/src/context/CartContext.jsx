import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCart(null); return; }
    try {
      const { data } = await getCart();
      setCart(data.data);
      setCartId(data.data?._id);
    } catch {
      setCart(null);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId) => {
    setLoading(true);
    try {
      const { data } = await addToCart(productId);
      setCart(data.data);
      setCartId(data.data?._id);
      toast.success('Added to cart!', { icon: '🛒' });
    } catch {
      toast.error('Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (id, count) => {
    if (count < 1) return removeItem(id);
    try {
      const { data } = await updateCartItem(id, count);
      setCart(data.data);
    } catch { toast.error('Failed to update cart'); }
  };

  const removeItem = async (id) => {
    try {
      const { data } = await removeCartItem(id);
      setCart(data.data);
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  const clearAllCart = async () => {
    try {
      await clearCart();
      setCart(null);
      setCartId(null);
    } catch { toast.error('Failed to clear cart'); }
  };

  const applyCode = async (coupon) => {
    try {
      const { data } = await applyCoupon(coupon);
      setCart(data.data);
      toast.success('Coupon applied!', { icon: '🎉' });
      return true;
    } catch {
      toast.error('Invalid coupon code');
      return false;
    }
  };

  const count = cart?.products?.reduce((sum, p) => sum + p.count, 0) || 0;
  const total = cart?.totalCartPrice || 0;
  const totalAfterDiscount = cart?.totalAfterDiscount;

  return (
    <CartContext.Provider value={{ cart, cartId, count, total, totalAfterDiscount, loading, addItem, updateItem, removeItem, clearAllCart, applyCode, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

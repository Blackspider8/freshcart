import axios from 'axios';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.token = token;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/signin', data);
export const forgotPassword = (data) => api.post('/auth/forgotPasswords', data);
export const verifyResetCode = (data) => api.post('/auth/verifyResetCode', data);
export const resetPassword = (data) => api.put('/auth/resetPassword', data);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoryProducts = (id) => api.get(`/products?category[in][]=${id}`);

// Brands
export const getBrands = () => api.get('/brands');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (productId) => api.post('/cart', { productId });
export const updateCartItem = (id, count) => api.put(`/cart/${id}`, { count });
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');
export const applyCoupon = (coupon) => api.put('/cart/applyCoupon', { coupon });

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post('/wishlist', { productId });
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

// Orders
export const createCashOrder = (cartId, shippingAddress) => api.post(`/orders/${cartId}`, { shippingAddress });
export const createOnlineOrder = (cartId, shippingAddress) => api.post(`/orders/checkout-session/${cartId}?url=${window.location.origin}`, { shippingAddress });
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);

export default api;

import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Categories = lazy(() => import('./pages/Categories'));
const Brands = lazy(() => import('./pages/Brands'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'categories', element: <Categories /> },
      { path: 'categories/:id', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'cart', element: <Cart /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'orders', element: <Orders /> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense
            fallback={
              <div style={{ display: 'flex', justifyContent: 'center', padding: '72px 0' }}>
                <div className="spinner" />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

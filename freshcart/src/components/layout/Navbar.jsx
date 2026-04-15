import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="#22c55e"/>
              <path d="M8 10h2l3 9 3-7 3 7 3-9h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="23" cy="23" r="3" fill="white"/>
              <circle cx="14" cy="23" r="3" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">FreshCart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {isLoggedIn && (
            <>
              <NavLink to="/" className={({isActive}) => `nav-link${isActive?' active':''}`}>Home</NavLink>
              <NavLink to="/products" className={({isActive}) => `nav-link${isActive?' active':''}`}>Products</NavLink>
              <NavLink to="/categories" className={({isActive}) => `nav-link${isActive?' active':''}`}>Categories</NavLink>
              <NavLink to="/brands" className={({isActive}) => `nav-link${isActive?' active':''}`}>Brands</NavLink>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={wishCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
              </Link>
              <Link to="/cart" className="nav-icon-btn" title="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {count > 0 && <span className="nav-badge">{count}</span>}
              </Link>
              <Link to="/orders" className="nav-icon-btn" title="Orders">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}

          {/* Mobile menu */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {isLoggedIn ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-link">Home</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="mobile-link">Products</Link>
              <Link to="/categories" onClick={() => setMenuOpen(false)} className="mobile-link">Categories</Link>
              <Link to="/brands" onClick={() => setMenuOpen(false)} className="mobile-link">Brands</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="mobile-link">Cart {count > 0 && `(${count})`}</Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="mobile-link">Wishlist {wishCount > 0 && `(${wishCount})`}</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="mobile-link">My Orders</Link>
              <button onClick={handleLogout} className="mobile-link" style={{color:'var(--red-500)',textAlign:'left'}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-link">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-link">Register</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: white; border-bottom: 1px solid var(--gray-200);
          transition: box-shadow 0.2s;
        }
        .navbar.scrolled { box-shadow: var(--shadow-md); }
        .navbar-inner { display: flex; align-items: center; height: 68px; gap: 32px; }
        .navbar-logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon svg { width: 36px; height: 36px; }
        .logo-text { font-family: var(--font-heading); font-size: 22px; font-weight: 600; color: var(--gray-900); }
        .navbar-links { display: flex; gap: 4px; flex: 1; }
        .nav-link { padding: 6px 12px; border-radius: var(--radius-full); font-size: 14px; font-weight: 500; color: var(--gray-600); transition: all 0.15s; }
        .nav-link:hover { color: var(--gray-900); background: var(--gray-100); }
        .nav-link.active { color: var(--green-600); background: var(--green-50); font-weight: 600; }
        .navbar-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .nav-icon-btn { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); color: var(--gray-600); transition: all 0.15s; }
        .nav-icon-btn:hover { background: var(--gray-100); color: var(--gray-900); }
        .nav-icon-btn svg { width: 22px; height: 22px; }
        .nav-badge { position: absolute; top: 4px; right: 4px; min-width: 16px; height: 16px; padding: 0 4px; background: var(--green-500); color: white; font-size: 10px; font-weight: 700; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; }
        .mobile-menu-btn { display: none; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: var(--radius); background: var(--gray-100); color: var(--gray-700); }
        .mobile-menu-btn svg { width: 20px; height: 20px; }
        .mobile-menu { border-top: 1px solid var(--gray-200); background: white; padding: 12px; display: flex; flex-direction: column; gap: 2px; }
        .mobile-link { padding: 10px 16px; border-radius: var(--radius); font-size: 14px; font-weight: 500; color: var(--gray-700); transition: background 0.15s; background: transparent; width: 100%; display: block; }
        .mobile-link:hover { background: var(--gray-100); }
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .mobile-menu-btn { display: flex; }
          .navbar-actions .btn { display: none; }
          .nav-icon-btn { display: flex; }
        }
      `}</style>
    </nav>
  );
}

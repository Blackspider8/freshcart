import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div style={{width:36,height:36,borderRadius:10,background:'var(--green-500)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg viewBox="0 0 32 32" fill="none" width="24" height="24">
                  <path d="M4 8h2l3 9 3-7 3 7 3-9h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="21" cy="22" r="3" fill="white"/>
                  <circle cx="12" cy="22" r="3" fill="white"/>
                </svg>
              </div>
              <span style={{fontFamily:'var(--font-heading)',fontSize:20,fontWeight:600}}>FreshCart</span>
            </div>
            <p className="footer-desc">Fresh groceries and essentials delivered to your door. Quality you can taste, prices you'll love.</p>
            <div className="footer-social">
              {['facebook','twitter','instagram','youtube'].map(s => (
                <a key={s} href="#" className="social-btn" aria-label={s}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/brands">Brands</Link>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/orders">Orders</Link>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <p style={{color:'var(--gray-400)',fontSize:14}}>📍 Cairo, Egypt</p>
            <p style={{color:'var(--gray-400)',fontSize:14}}>📞 +20 100 000 0000</p>
            <p style={{color:'var(--gray-400)',fontSize:14}}>✉️ hello@freshcart.com</p>
            <div style={{marginTop:12}}>
              <p style={{fontSize:13,color:'var(--gray-500)',marginBottom:8}}>Download App</p>
              <div style={{display:'flex',gap:8}}>
                <div style={{padding:'6px 12px',borderRadius:8,border:'1.5px solid var(--gray-300)',fontSize:12,color:'var(--gray-600)',fontWeight:500}}>App Store</div>
                <div style={{padding:'6px 12px',borderRadius:8,border:'1.5px solid var(--gray-300)',fontSize:12,color:'var(--gray-600)',fontWeight:500}}>Google Play</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 FreshCart. All rights reserved.</p>
          <div style={{display:'flex',gap:16}}>
            <a href="#" style={{fontSize:13,color:'var(--gray-400)'}}>Privacy Policy</a>
            <a href="#" style={{fontSize:13,color:'var(--gray-400)'}}>Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer { background: var(--gray-900); color: white; padding: 60px 0 24px; margin-top: 80px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 48px; margin-bottom: 48px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .footer-desc { font-size: 14px; color: var(--gray-400); line-height: 1.7; }
        .footer-social { display: flex; gap: 8px; margin-top: 20px; }
        .social-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--gray-800); display: flex; align-items: center; justify-content: center; color: var(--gray-400); transition: all 0.2s; }
        .social-btn:hover { background: var(--green-500); color: white; }
        .footer-col h4 { font-size: 14px; font-weight: 700; color: white; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-col a { display: block; font-size: 14px; color: var(--gray-400); margin-bottom: 10px; transition: color 0.15s; }
        .footer-col a:hover { color: var(--green-400); }
        .footer-bottom { border-top: 1px solid var(--gray-800); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .footer-bottom p { font-size: 13px; color: var(--gray-500); }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom { flex-direction: column; gap: 12px; text-align: center; } }
      `}</style>
    </footer>
  );
}

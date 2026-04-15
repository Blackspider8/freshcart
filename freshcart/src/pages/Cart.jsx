import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, count, total, totalAfterDiscount, updateItem, removeItem, clearAllCart, applyCode } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isLoggedIn) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:64,marginBottom:16}}>🛒</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>Please login to view your cart</h2>
      <p style={{color:'var(--gray-400)',marginBottom:24}}>Sign in to add items and checkout</p>
      <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
    </div>
  );

  if (!cart || count === 0) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:80,marginBottom:16}}>🛒</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>Your cart is empty</h2>
      <p style={{color:'var(--gray-400)',marginBottom:24}}>Add some products to your cart to get started</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    setApplying(true);
    await applyCode(coupon.trim());
    setApplying(false);
  };

  const discount = totalAfterDiscount ? total - totalAfterDiscount : 0;

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <div>
            <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>Shopping Cart</h1>
            <p style={{color:'var(--gray-400)',marginTop:4}}>{count} item{count!==1?'s':''}</p>
          </div>
          <button className="btn btn-ghost btn-sm" style={{color:'var(--red-500)'}} onClick={clearAllCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.products.map(item => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item.product._id}`} className="cart-item-img">
                  <img src={item.product.imageCover} alt={item.product.title}/>
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${item.product._id}`}>
                    <h3 className="cart-item-title">{item.product.title}</h3>
                  </Link>
                  <p style={{fontSize:12,color:'var(--green-600)',fontWeight:600,marginTop:2}}>{item.product.category?.name}</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12}}>
                    <div className="qty-ctrl">
                      <button onClick={() => updateItem(item.product._id, item.count - 1)}>−</button>
                      <span>{item.count}</span>
                      <button onClick={() => updateItem(item.product._id, item.count + 1)}>+</button>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:18,fontWeight:700,color:'var(--gray-900)'}}>{item.price * item.count} EGP</p>
                      <p style={{fontSize:12,color:'var(--gray-400)'}}>{item.price} EGP each</p>
                    </div>
                  </div>
                </div>
                <button className="cart-remove-btn" onClick={() => removeItem(item.product._id)} title="Remove">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="card" style={{padding:24}}>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:20}}>Order Summary</h2>

              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
                <div className="summary-row">
                  <span>Subtotal ({count} items)</span>
                  <span>{total} EGP</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row" style={{color:'var(--green-600)'}}>
                    <span>Discount</span>
                    <span>-{discount} EGP</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery</span>
                  <span style={{color:'var(--green-600)',fontWeight:600}}>Free</span>
                </div>
                <div style={{height:1,background:'var(--gray-200)',margin:'4px 0'}}/>
                <div className="summary-row" style={{fontWeight:700,fontSize:18,color:'var(--gray-900)'}}>
                  <span>Total</span>
                  <span>{totalAfterDiscount || total} EGP</span>
                </div>
              </div>

              {/* Coupon */}
              <div style={{marginBottom:20}}>
                <p style={{fontSize:13,fontWeight:600,color:'var(--gray-600)',marginBottom:8}}>Have a coupon?</p>
                <div style={{display:'flex',gap:8}}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="form-input"
                    style={{flex:1,padding:'9px 12px'}}
                  />
                  <button className="btn btn-outline btn-sm" onClick={handleCoupon} disabled={applying || !coupon.trim()}>
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{width:'100%'}}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="btn btn-ghost btn-sm" style={{width:'100%',marginTop:10,justifyContent:'center'}}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
              {[
                ['🔒','Secure Checkout'],
                ['🚚','Free Delivery'],
                ['↩️','Easy Returns'],
              ].map(([icon, label]) => (
                <div key={label} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'white',borderRadius:'var(--radius)',boxShadow:'var(--shadow-sm)',fontSize:13,color:'var(--gray-600)',fontWeight:500}}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 14px; }
        .cart-item { display: flex; gap: 16px; background: white; border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow); position: relative; transition: box-shadow 0.2s; }
        .cart-item:hover { box-shadow: var(--shadow-md); }
        .cart-item-img { width: 100px; height: 100px; border-radius: var(--radius); overflow: hidden; background: var(--gray-50); flex-shrink: 0; padding: 8px; }
        .cart-item-img img { width: 100%; height: 100%; object-fit: contain; }
        .cart-item-info { flex: 1; }
        .cart-item-title { font-size: 15px; font-weight: 600; color: var(--gray-800); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cart-remove-btn { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%; background: var(--gray-100); color: var(--gray-400); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .cart-remove-btn:hover { background: var(--red-500); color: white; }
        .qty-ctrl { display: flex; align-items: center; border: 1.5px solid var(--gray-200); border-radius: var(--radius-full); overflow: hidden; }
        .qty-ctrl button { width: 32px; height: 32px; font-size: 18px; font-weight: 600; color: var(--gray-600); background: white; transition: background 0.15s; display: flex; align-items: center; justify-content: center; }
        .qty-ctrl button:hover { background: var(--gray-100); }
        .qty-ctrl span { padding: 0 12px; font-weight: 700; font-size: 14px; color: var(--gray-800); }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--gray-600); }
        @media(max-width:768px) { .cart-layout{grid-template-columns:1fr;} .cart-item-img{width:72px;height:72px;} }
      `}</style>
    </div>
  );
}

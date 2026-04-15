import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  'pending': { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
  'processing': { bg: '#dbeafe', color: '#1e40af', label: '🔄 Processing' },
  'delivered': { bg: '#dcfce7', color: '#166534', label: '✅ Delivered' },
  'cancelled': { bg: '#fee2e2', color: '#991b1b', label: '❌ Cancelled' },
};

function getStatus(order) {
  if (order.isDelivered) return 'delivered';
  if (order.isCancelled) return 'cancelled';
  if (order.isPaid) return 'processing';
  return 'pending';
}

export default function Orders() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) { setLoading(false); return; }
    getUserOrders(user.id)
      .then(({ data }) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isLoggedIn, user]);

  if (!isLoggedIn) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:64,marginBottom:16}}>📦</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>Please login to view your orders</h2>
      <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
    </div>
  );

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}>
      <div className="spinner"/>
    </div>
  );

  if (orders.length === 0) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:80,marginBottom:16}}>📭</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>No orders yet</h2>
      <p style={{color:'var(--gray-400)',marginBottom:24}}>Start shopping to see your orders here</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>My Orders</h1>
          <p style={{color:'var(--gray-400)',marginTop:4}}>{orders.length} order{orders.length!==1?'s':''}</p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {orders.map(order => {
            const status = getStatus(order);
            const st = STATUS_COLORS[status];
            const isOpen = expanded === order._id;
            const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

            return (
              <div key={order._id} className="order-card">
                <div className="order-header" onClick={() => setExpanded(isOpen ? null : order._id)}>
                  <div style={{display:'flex',alignItems:'center',gap:16,flex:1}}>
                    <div style={{width:48,height:48,borderRadius:'var(--radius)',background:'var(--green-50)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>📦</div>
                    <div>
                      <p style={{fontWeight:700,fontSize:15,color:'var(--gray-900)'}}>Order #{order.id}</p>
                      <p style={{fontSize:13,color:'var(--gray-400)',marginTop:2}}>{date} · {order.cartItems?.length || 0} item{(order.cartItems?.length||0)!==1?'s':''}</p>
                    </div>
                  </div>

                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <span style={{padding:'4px 12px',borderRadius:'var(--radius-full)',background:st.bg,color:st.color,fontSize:12,fontWeight:600}}>{st.label}</span>
                    <div>
                      <p style={{fontWeight:700,fontSize:16,color:'var(--gray-900)',textAlign:'right'}}>{order.totalOrderPrice} EGP</p>
                      <p style={{fontSize:12,color:'var(--gray-400)',textAlign:'right'}}>{order.paymentMethodType === 'card' ? '💳 Card' : '💵 Cash'}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:'var(--gray-400)',transform:isOpen?'rotate(180deg)':'none',transition:'transform 0.2s',flexShrink:0}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className="order-body">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
                      <div style={{background:'var(--gray-50)',borderRadius:'var(--radius)',padding:16}}>
                        <p style={{fontSize:12,fontWeight:700,color:'var(--gray-500)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Shipping Address</p>
                        {order.shippingAddress ? (
                          <>
                            <p style={{fontSize:14,fontWeight:600}}>{order.shippingAddress.city}</p>
                            <p style={{fontSize:13,color:'var(--gray-500)',marginTop:2}}>{order.shippingAddress.details}</p>
                            <p style={{fontSize:13,color:'var(--gray-500)'}}>{order.shippingAddress.phone}</p>
                          </>
                        ) : <p style={{fontSize:13,color:'var(--gray-400)'}}>N/A</p>}
                      </div>
                      <div style={{background:'var(--gray-50)',borderRadius:'var(--radius)',padding:16}}>
                        <p style={{fontSize:12,fontWeight:700,color:'var(--gray-500)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Order Details</p>
                        <div style={{display:'flex',flexDirection:'column',gap:6}}>
                          {[
                            ['Tax Price', order.taxPrice+' EGP'],
                            ['Shipping', order.shippingPrice ? order.shippingPrice+' EGP' : 'Free'],
                            ['Total', order.totalOrderPrice+' EGP'],
                          ].map(([label, val]) => (
                            <div key={label} style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                              <span style={{color:'var(--gray-500)'}}>{label}</span>
                              <span style={{fontWeight:600}}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p style={{fontSize:13,fontWeight:700,color:'var(--gray-700)',marginBottom:10}}>Items</p>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {(order.cartItems || []).map(item => (
                        <div key={item._id} style={{display:'flex',gap:12,alignItems:'center'}}>
                          <div style={{width:52,height:52,borderRadius:'var(--radius)',overflow:'hidden',background:'var(--gray-100)',padding:4,flexShrink:0}}>
                            <img src={item.product?.imageCover} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                          </div>
                          <div style={{flex:1}}>
                            <p style={{fontSize:13,fontWeight:600,color:'var(--gray-800)'}}>{item.product?.title}</p>
                            <p style={{fontSize:12,color:'var(--gray-400)'}}>Qty: {item.count} × {item.price} EGP</p>
                          </div>
                          <p style={{fontWeight:700,fontSize:14}}>{item.count*item.price} EGP</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .order-card { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow); overflow: hidden; }
        .order-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; cursor: pointer; transition: background 0.15s; gap: 12px; }
        .order-header:hover { background: var(--gray-50); }
        .order-body { padding: 0 24px 24px; border-top: 1px solid var(--gray-100); padding-top: 20px; }
        @media(max-width:640px) { .order-header{flex-direction:column;align-items:flex-start;gap:12px;} }
      `}</style>
    </div>
  );
}

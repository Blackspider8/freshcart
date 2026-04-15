import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:64,marginBottom:16}}>❤️</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>Please login to view your wishlist</h2>
      <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
    </div>
  );

  if (wishlist.length === 0) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div style={{fontSize:80,marginBottom:16}}>💔</div>
      <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8}}>Your wishlist is empty</h2>
      <p style={{color:'var(--gray-400)',marginBottom:24}}>Save items you love by clicking the heart icon</p>
      <Link to="/products" className="btn btn-primary btn-lg">Discover Products</Link>
    </div>
  );

  const handleMoveToCart = (productId) => {
    addItem(productId);
  };

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>My Wishlist</h1>
          <p style={{color:'var(--gray-400)',marginTop:4}}>{wishlist.length} saved item{wishlist.length!==1?'s':''}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20}}>
          {wishlist.map(product => {
            const stars = Math.round(product.ratingsAverage || 0);
            return (
              <div key={product._id} className="wish-card">
                <button className="wish-remove" onClick={() => toggleWishlist(product._id)} title="Remove from wishlist">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                <Link to={`/products/${product._id}`} className="wish-img">
                  <img src={product.imageCover} alt={product.title}/>
                </Link>

                <div style={{padding:'14px'}}>
                  <p style={{fontSize:11,color:'var(--green-600)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{product.category?.name}</p>
                  <Link to={`/products/${product._id}`}>
                    <h3 style={{fontSize:14,fontWeight:600,color:'var(--gray-800)',lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',marginBottom:8}}>{product.title}</h3>
                  </Link>

                  <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:10}}>
                    <div className="stars">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} viewBox="0 0 20 20" fill={i<=stars?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5" width="13" height="13">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span style={{fontSize:11,color:'var(--gray-400)'}}>({product.ratingsQuantity})</span>
                  </div>

                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      {product.priceAfterDiscount ? (
                        <>
                          <p style={{fontSize:16,fontWeight:700,color:'var(--gray-900)'}}>{product.priceAfterDiscount} EGP</p>
                          <p style={{fontSize:12,color:'var(--gray-400)',textDecoration:'line-through'}}>{product.price} EGP</p>
                        </>
                      ) : (
                        <p style={{fontSize:16,fontWeight:700,color:'var(--gray-900)'}}>{product.price} EGP</p>
                      )}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleMoveToCart(product._id)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .wish-card { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow); overflow: hidden; position: relative; transition: all 0.25s; border: 1px solid var(--gray-100); }
        .wish-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .wish-remove { position: absolute; top: 10px; right: 10px; z-index: 1; width: 34px; height: 34px; border-radius: 50%; background: white; box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center; color: var(--red-500); transition: all 0.2s; }
        .wish-remove:hover { background: var(--red-500); color: white; }
        .wish-img { display: block; aspect-ratio: 1; overflow: hidden; background: var(--gray-50); padding: 16px; }
        .wish-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.3s; }
        .wish-card:hover .wish-img img { transform: scale(1.05); }
        .stars { display: flex; gap: 2px; color: var(--yellow-400); }
      `}</style>
    </div>
  );
}

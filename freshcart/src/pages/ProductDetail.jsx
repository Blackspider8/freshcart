import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem, loading: cartLoading } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(({ data }) => {
      const p = data.data;
      setProduct(p);
      setActiveImg(0);
      if (p?.category?._id) {
        getProducts({ 'category[in][]': p.category._id, limit: 4 }).then(({ data: rd }) => {
          setRelated((rd.data || []).filter(r => r._id !== id).slice(0, 4));
        });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}>
      <div className="spinner"/>
    </div>
  );

  if (!product) return (
    <div className="container">
      <div className="empty-state">
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    </div>
  );

  const images = [product.imageCover, ...(product.images || [])].filter(Boolean);
  const stars = Math.round(product.ratingsAverage || 0);

  const handleAddCart = () => {
    if (!isLoggedIn) { toast.error('Please login first'); return; }
    addItem(product._id);
  };

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{display:'flex',gap:8,alignItems:'center',marginBottom:28,fontSize:13,color:'var(--gray-400)'}}>
          <Link to="/" style={{color:'var(--gray-400)'}}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{color:'var(--gray-400)'}}>Products</Link>
          <span>/</span>
          <span style={{color:'var(--gray-700)',fontWeight:500}}>{product.title}</span>
        </nav>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-img-wrap">
              <img src={images[activeImg]} alt={product.title} className="main-img"/>
              {product.priceAfterDiscount && (
                <span className="detail-badge">
                  -{Math.round((1-product.priceAfterDiscount/product.price)*100)}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumb-list">
                {images.map((img,i) => (
                  <button key={i} className={`thumb${activeImg===i?' active':''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt=""/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <span style={{background:'var(--green-100)',color:'var(--green-700)',padding:'4px 10px',borderRadius:'var(--radius-full)',fontSize:12,fontWeight:600}}>
                {product.category?.name}
              </span>
              {product.brand && (
                <span style={{background:'var(--gray-100)',color:'var(--gray-600)',padding:'4px 10px',borderRadius:'var(--radius-full)',fontSize:12,fontWeight:600}}>
                  {product.brand?.name}
                </span>
              )}
            </div>

            <h1 style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:600,lineHeight:1.3,marginBottom:12}}>{product.title}</h1>

            {/* Rating */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <div className="stars">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} viewBox="0 0 20 20" fill={i<=stars?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span style={{fontSize:14,color:'var(--gray-500)'}}>
                {product.ratingsAverage?.toFixed(1)} ({product.ratingsQuantity} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{marginBottom:20}}>
              {product.priceAfterDiscount ? (
                <div style={{display:'flex',alignItems:'baseline',gap:10}}>
                  <span style={{fontSize:32,fontWeight:800,color:'var(--green-600)'}}>{product.priceAfterDiscount} EGP</span>
                  <span style={{fontSize:18,color:'var(--gray-400)',textDecoration:'line-through'}}>{product.price} EGP</span>
                </div>
              ) : (
                <span style={{fontSize:32,fontWeight:800,color:'var(--gray-900)'}}>{product.price} EGP</span>
              )}
            </div>

            <p style={{fontSize:15,color:'var(--gray-500)',lineHeight:1.7,marginBottom:24}}>{product.description}</p>

            {/* Stock */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:product.quantity>0?'var(--green-500)':'var(--red-500)'}}/>
              <span style={{fontSize:14,fontWeight:600,color:product.quantity>0?'var(--green-600)':'var(--red-500)'}}>
                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty + Add to cart */}
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
              <div className="qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.quantity,q+1))}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" style={{flex:1}} onClick={handleAddCart} disabled={cartLoading || product.quantity===0}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Add to Cart
              </button>
              <button
                className={`btn${wishlistIds.has(product._id)?' btn-danger':' btn-outline'}`}
                onClick={() => toggleWishlist(product._id)}
                style={{padding:'14px'}}
              >
                <svg viewBox="0 0 24 24" fill={wishlistIds.has(product._id)?'currentColor':'none'} stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            {/* Meta */}
            <div style={{padding:16,background:'var(--gray-50)',borderRadius:'var(--radius)',display:'flex',flexDirection:'column',gap:8}}>
              {[
                ['Sold','🛒', product.sold+' units'],
                ['Category','📁', product.category?.name],
                ['Brand','🏷️', product.brand?.name || 'N/A'],
              ].map(([label, icon, val]) => (
                <div key={label} style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'var(--gray-500)'}}>{icon} {label}</span>
                  <span style={{fontWeight:600,color:'var(--gray-800)'}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{marginTop:64}}>
            <h2 style={{fontFamily:'var(--font-heading)',fontSize:26,fontWeight:600,marginBottom:24}}>Related Products</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20}}>
              {related.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .detail-images { display: flex; flex-direction: column; gap: 12px; }
        .main-img-wrap { position: relative; background: white; border-radius: var(--radius-xl); overflow: hidden; aspect-ratio: 1; box-shadow: var(--shadow-lg); }
        .main-img { width: 100%; height: 100%; object-fit: contain; padding: 32px; }
        .detail-badge { position: absolute; top: 16px; left: 16px; background: var(--red-500); color: white; font-size: 13px; font-weight: 700; padding: 5px 12px; border-radius: var(--radius-full); }
        .thumb-list { display: flex; gap: 10px; }
        .thumb { width: 72px; height: 72px; border-radius: var(--radius); overflow: hidden; background: white; border: 2px solid var(--gray-200); cursor: pointer; transition: border-color 0.15s; padding: 4px; }
        .thumb.active { border-color: var(--green-500); }
        .thumb img { width: 100%; height: 100%; object-fit: contain; }
        .qty-ctrl { display: flex; align-items: center; gap: 0; border: 1.5px solid var(--gray-200); border-radius: var(--radius-full); overflow: hidden; }
        .qty-ctrl button { width: 40px; height: 48px; font-size: 20px; font-weight: 600; color: var(--gray-600); background: white; transition: background 0.15s; }
        .qty-ctrl button:hover { background: var(--gray-100); }
        .qty-ctrl span { padding: 0 16px; font-weight: 700; font-size: 16px; color: var(--gray-800); }
        @media(max-width:768px) { .detail-grid{grid-template-columns:1fr;} }
      `}</style>
    </div>
  );
}

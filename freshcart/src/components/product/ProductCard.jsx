import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, loading } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const isWishlisted = wishlistIds.has(product._id);

  const stars = Math.round(product.ratingsAverage || 0);

  const handleCart = (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login first'); return; }
    addItem(product._id);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.imageCover} alt={product.title} className="product-img" loading="lazy" />
        <button className={`wishlist-btn${isWishlisted ? ' active' : ''}`} onClick={handleWishlist} title="Add to wishlist">
          <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        {product.priceAfterDiscount && (
          <span className="discount-badge">
            -{Math.round((1 - product.priceAfterDiscount / product.price) * 100)}%
          </span>
        )}
      </div>

      <div className="product-body">
        <p className="product-category">{product.category?.name}</p>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          <div className="stars">
            {[1,2,3,4,5].map(i => (
              <svg key={i} viewBox="0 0 20 20" fill={i <= stars ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span style={{fontSize:12,color:'var(--gray-400)'}}>({product.ratingsQuantity || 0})</span>
        </div>

        <div className="product-footer">
          <div>
            {product.priceAfterDiscount ? (
              <>
                <p className="product-price">{product.priceAfterDiscount} EGP</p>
                <p className="product-price-old">{product.price} EGP</p>
              </>
            ) : (
              <p className="product-price">{product.price} EGP</p>
            )}
          </div>
          <button className="add-cart-btn" onClick={handleCart} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Add
          </button>
        </div>
      </div>

      <style>{`
        .product-card { display: flex; flex-direction: column; background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); transition: all 0.25s; border: 1px solid var(--gray-100); }
        .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--green-200); }
        .product-img-wrap { position: relative; aspect-ratio: 1; overflow: hidden; background: var(--gray-50); }
        .product-img { width: 100%; height: 100%; object-fit: contain; padding: 16px; transition: transform 0.35s; }
        .product-card:hover .product-img { transform: scale(1.05); }
        .wishlist-btn { position: absolute; top: 10px; right: 10px; width: 34px; height: 34px; border-radius: 50%; background: white; box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center; color: var(--gray-400); transition: all 0.2s; }
        .wishlist-btn:hover, .wishlist-btn.active { color: var(--red-500); }
        .discount-badge { position: absolute; top: 10px; left: 10px; background: var(--red-500); color: white; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: var(--radius-full); }
        .product-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .product-category { font-size: 11px; color: var(--green-600); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .product-title { font-size: 14px; font-weight: 600; color: var(--gray-800); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .product-rating { display: flex; align-items: center; gap: 4px; }
        .stars { display: flex; gap: 2px; color: var(--yellow-400); }
        .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .product-price { font-size: 16px; font-weight: 700; color: var(--gray-900); }
        .product-price-old { font-size: 12px; color: var(--gray-400); text-decoration: line-through; }
        .add-cart-btn { display: flex; align-items: center; gap: 5px; padding: 7px 14px; background: var(--green-500); color: white; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .add-cart-btn:hover { background: var(--green-600); }
        .add-cart-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </Link>
  );
}

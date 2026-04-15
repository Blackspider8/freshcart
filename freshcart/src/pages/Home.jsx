import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/product/ProductCard';

const EXTRA_CATEGORIES = [
  { key: 'super-market', name: 'Super Market', icon: '🛍️', query: 'super market' },
  { key: 'music', name: 'Music', icon: '🎵', query: 'music' },
  { key: 'beauty', name: 'Beauty', icon: '💄', query: 'beauty' },
  { key: 'health', name: 'Health', icon: '💊', query: 'health' },
];

function HeroBanner() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-tag">🌿 Fresh & Organic</span>
          <h1 className="hero-title">
            Groceries <em>Delivered</em><br/>to Your Door
          </h1>
          <p className="hero-desc">Shop fresh produce, pantry essentials, and more. Fast delivery, unbeatable prices.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
            <Link to="/categories" className="btn btn-outline btn-lg">Browse Categories</Link>
          </div>
          <div className="hero-stats">
            {[['10K+','Products'],['50K+','Customers'],['4.8★','Rating']].map(([num,label]) => (
              <div key={label} className="hero-stat">
                <strong>{num}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob"/>
          <div className="hero-cards">
            <div className="hero-floating-card" style={{top:'10%',left:'5%',animationDelay:'0s'}}>
              <span>🥑</span><div><strong>Avocado</strong><small>12 EGP</small></div>
            </div>
            <div className="hero-floating-card" style={{top:'55%',right:'5%',animationDelay:'0.5s'}}>
              <span>🍓</span><div><strong>Strawberries</strong><small>25 EGP</small></div>
            </div>
            <div className="hero-floating-card" style={{bottom:'10%',left:'20%',animationDelay:'1s'}}>
              <span>🥕</span><div><strong>Carrots</strong><small>8 EGP</small></div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"
            alt="Fresh groceries"
            className="hero-img"
          />
        </div>
      </div>

      <style>{`
        .hero { background: linear-gradient(135deg, var(--green-50) 0%, #fff 60%); padding: 60px 0; overflow: hidden; }
        .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; min-height: 500px; }
        .hero-content { display: flex; flex-direction: column; gap: 20px; animation: fadeIn 0.6s ease both; }
        .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--green-100); color: var(--green-700); padding: 6px 14px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; width: fit-content; }
        .hero-title { font-family: var(--font-heading); font-size: clamp(36px,4vw,56px); font-weight: 600; line-height: 1.1; color: var(--gray-900); }
        .hero-title em { font-style: italic; color: var(--green-600); }
        .hero-desc { font-size: 17px; color: var(--gray-500); max-width: 400px; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-stats { display: flex; gap: 32px; margin-top: 8px; }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .hero-stat strong { font-size: 22px; font-weight: 800; color: var(--gray-900); }
        .hero-stat span { font-size: 13px; color: var(--gray-400); }
        .hero-visual { position: relative; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.6s 0.2s ease both; }
        .hero-blob { position: absolute; width: 400px; height: 400px; border-radius: 60% 40% 70% 30%/50% 60% 40% 50%; background: radial-gradient(circle,var(--green-100) 0%,var(--green-50) 100%); }
        .hero-img { position: relative; z-index: 1; width: 380px; height: 380px; object-fit: cover; border-radius: 50%; box-shadow: var(--shadow-xl); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .hero-floating-card { position: absolute; z-index: 2; display: flex; align-items: center; gap: 8px; background: white; padding: 10px 14px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); font-size: 13px; animation: float 3s ease-in-out infinite; }
        .hero-floating-card span { font-size: 24px; }
        .hero-floating-card strong { display: block; font-weight: 600; color: var(--gray-800); }
        .hero-floating-card small { color: var(--green-600); font-weight: 600; }
        @media(max-width:768px) { .hero-inner{grid-template-columns:1fr;} .hero-visual{display:none;} }
      `}</style>
    </section>
  );
}

function CategoryStrip({ categories }) {
  if (!categories.length && EXTRA_CATEGORIES.length === 0) return null;
  return (
    <section style={{padding:'48px 0'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:600}}>Shop by Category</h2>
          <Link to="/categories" className="btn btn-ghost btn-sm" style={{color:'var(--green-600)'}}>View all →</Link>
        </div>
        <div className="cat-strip">
          {EXTRA_CATEGORIES.map((cat) => (
            <Link key={cat.key} to={`/products?search=${encodeURIComponent(cat.query)}`} className="cat-chip">
              <div className="cat-chip-img">
                <span style={{ fontSize: 28 }}>{cat.icon}</span>
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
          {categories.slice(0,8).map(cat => (
            <Link key={cat._id} to={`/categories/${cat._id}`} className="cat-chip">
              <div className="cat-chip-img">
                {cat.image ? <img src={cat.image} alt={cat.name}/> : <span style={{fontSize:28}}>🛒</span>}
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .cat-strip { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }
        .cat-chip { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 90px; cursor: pointer; transition: transform 0.2s; }
        .cat-chip:hover { transform: translateY(-4px); }
        .cat-chip-img { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; background: var(--green-50); display: flex; align-items: center; justify-content: center; border: 2px solid var(--green-100); transition: border-color 0.2s; }
        .cat-chip:hover .cat-chip-img { border-color: var(--green-400); }
        .cat-chip-img img { width: 100%; height: 100%; object-fit: cover; }
        .cat-chip span { font-size: 12px; font-weight: 600; color: var(--gray-700); text-align: center; }
      `}</style>
    </section>
  );
}

function PromoSection() {
  return (
    <section style={{padding:'0 0 48px'}}>
      <div className="container">
        <div className="promo-grid">
          <div className="promo-card promo-main">
            <div>
              <span className="promo-tag">Limited Offer</span>
              <h3>Get 20% off<br/>Fresh Fruits</h3>
              <p>Use code: <strong>FRESH20</strong></p>
              <Link to="/products" className="btn btn-primary" style={{marginTop:16}}>Shop Now</Link>
            </div>
            <span style={{fontSize:80}}>🍊</span>
          </div>
          <div className="promo-card promo-sm" style={{background:'linear-gradient(135deg,#fef3c7,#fde68a)'}}>
            <div>
              <h3 style={{fontSize:20}}>Free Delivery</h3>
              <p style={{fontSize:13}}>On orders over 200 EGP</p>
            </div>
            <span style={{fontSize:48}}>🚚</span>
          </div>
          <div className="promo-card promo-sm" style={{background:'linear-gradient(135deg,#ede9fe,#ddd6fe)'}}>
            <div>
              <h3 style={{fontSize:20}}>New Arrivals</h3>
              <p style={{fontSize:13}}>Organic & natural products</p>
            </div>
            <span style={{fontSize:48}}>🌱</span>
          </div>
        </div>
      </div>
      <style>{`
        .promo-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 16px; }
        .promo-card { padding: 28px; border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: space-between; overflow: hidden; }
        .promo-main { background: linear-gradient(135deg, var(--green-500), var(--green-700)); grid-row: span 2; flex-direction: column; align-items: flex-start; gap: 0; color: white; }
        .promo-main h3 { font-family: var(--font-heading); font-size: 32px; font-weight: 600; line-height: 1.2; margin-top: 8px; }
        .promo-main p { font-size: 15px; opacity: 0.9; margin-top: 8px; }
        .promo-main span { align-self: flex-end; }
        .promo-tag { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 600; }
        .promo-sm h3 { font-weight: 700; color: var(--gray-900); }
        .promo-sm p { color: var(--gray-600); margin-top: 4px; }
        @media(max-width:768px) { .promo-grid{grid-template-columns:1fr;grid-template-rows:auto;} .promo-main{grid-row:auto;} }
      `}</style>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 12 }),
      getCategories()
    ]).then(([p, c]) => {
      setProducts(p.data.data || []);
      setCategories(c.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroBanner />
      <CategoryStrip categories={categories} />
      <PromoSection />

      <section style={{paddingBottom: 80}}>
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
            <div>
              <h2 style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:600}}>Featured Products</h2>
              <p style={{color:'var(--gray-400)',fontSize:14,marginTop:4}}>Hand-picked fresh items just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {Array(8).fill(0).map((_,i) => (
                <div key={i} style={{borderRadius:'var(--radius-lg)',overflow:'hidden',background:'white',boxShadow:'var(--shadow)'}}>
                  <div className="skeleton" style={{height:200}}/>
                  <div style={{padding:14,display:'flex',flexDirection:'column',gap:8}}>
                    <div className="skeleton" style={{height:12,width:'60%'}}/>
                    <div className="skeleton" style={{height:16,width:'80%'}}/>
                    <div className="skeleton" style={{height:16,width:'40%'}}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid fade-in">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{background:'var(--green-50)',padding:'48px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {[
              ['🚚','Fast Delivery','Get your groceries within 2 hours'],
              ['🌿','100% Organic','Fresh from local farms daily'],
              ['💰','Best Prices','Unbeatable deals every day'],
              ['🔒','Secure Payment','Your data is always safe'],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{textAlign:'center',padding:'24px 16px'}}>
                <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
                <h3 style={{fontSize:16,fontWeight:700,color:'var(--gray-900)',marginBottom:6}}>{title}</h3>
                <p style={{fontSize:14,color:'var(--gray-500)'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 20px; }
      `}</style>
    </div>
  );
}

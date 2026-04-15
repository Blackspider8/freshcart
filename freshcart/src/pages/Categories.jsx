import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, getCategoryProducts } from '../api';
import ProductCard from '../components/product/ProductCard';

const EXTRA_CATEGORIES = [
  { key: 'super-market', name: 'Super Market', icon: '🛍️', query: 'super market', color: '#d1fae5' },
  { key: 'music', name: 'Music', icon: '🎵', query: 'music', color: '#dbeafe' },
  { key: 'beauty', name: 'Beauty', icon: '💄', query: 'beauty', color: '#fce7f3' },
  { key: 'health', name: 'Health', icon: '💊', query: 'health', color: '#fef3c7' },
];

export default function Categories() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(id || null);
  const [loading, setLoading] = useState(true);
  const [activeName, setActiveName] = useState('');

  useEffect(() => {
    getCategories().then(({ data }) => {
      setCategories(data.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setActive(id || null);
  }, [id]);

  useEffect(() => {
    if (!active) { setProducts([]); return; }
    const cat = categories.find(c => c._id === active);
    if (cat) setActiveName(cat.name);
    setLoading(true);
    getCategoryProducts(active)
      .then(({ data }) => setProducts(data.data || []))
      .finally(() => setLoading(false));
  }, [active, categories]);

  const COLORS = ['#dcfce7','#dbeafe','#fce7f3','#fef3c7','#ede9fe','#ffedd5','#cffafe','#f0fdf4'];

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>Categories</h1>
          <p style={{color:'var(--gray-400)',marginTop:4}}>Browse products by category</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
            Popular Departments
          </h2>
          <div className="extra-categories-grid">
            {EXTRA_CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={`/products?search=${encodeURIComponent(cat.query)}`}
                className="extra-cat-card"
                style={{ background: cat.color }}
              >
                <span style={{ fontSize: 28 }}>{cat.icon}</span>
                <span>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Category grid */}
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <button
              key={cat._id}
              className={`cat-card${active===cat._id?' cat-card-active':''}`}
              style={{background: active===cat._id ? 'var(--green-500)' : COLORS[i % COLORS.length]}}
              onClick={() => setActive(active===cat._id ? null : cat._id)}
            >
              {cat.image && (
                <div className="cat-card-img">
                  <img src={cat.image} alt={cat.name}/>
                </div>
              )}
              <p className="cat-card-name" style={{color: active===cat._id ? 'white' : 'var(--gray-800)'}}>{cat.name}</p>
            </button>
          ))}
        </div>

        {/* Products for selected category */}
        {active && (
          <div style={{marginTop:48}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <h2 style={{fontFamily:'var(--font-heading)',fontSize:26,fontWeight:600}}>{activeName}</h2>
              <span style={{fontSize:14,color:'var(--gray-400)'}}>{products.length} products</span>
            </div>

            {loading ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20}}>
                {Array(8).fill(0).map((_,i) => (
                  <div key={i} style={{borderRadius:'var(--radius-lg)',overflow:'hidden',background:'white',boxShadow:'var(--shadow)'}}>
                    <div className="skeleton" style={{height:200}}/>
                    <div style={{padding:14,display:'flex',flexDirection:'column',gap:8}}>
                      <div className="skeleton" style={{height:12,width:'60%'}}/>
                      <div className="skeleton" style={{height:16,width:'80%'}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{textAlign:'center',padding:'48px',color:'var(--gray-400)'}}>
                <div style={{fontSize:48,marginBottom:12}}>📭</div>
                <p>No products found in this category</p>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20}} className="fade-in">
                {products.map(p => <ProductCard key={p._id} product={p}/>)}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .extra-categories-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(170px,1fr)); gap: 12px; }
        .extra-cat-card { display: flex; align-items: center; gap: 10px; padding: 14px; border-radius: var(--radius-lg); color: var(--gray-800); font-weight: 700; transition: transform 0.15s, box-shadow 0.15s; }
        .extra-cat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); gap: 16px; }
        .cat-card { padding: 20px 16px; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
        .cat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .cat-card-active { border-color: var(--green-600) !important; box-shadow: var(--shadow-lg) !important; }
        .cat-card-img { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.6); }
        .cat-card-img img { width: 100%; height: 100%; object-fit: cover; }
        .cat-card-name { font-size: 13px; font-weight: 700; text-align: center; line-height: 1.3; }
      `}</style>
    </div>
  );
}

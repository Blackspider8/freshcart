import { useState, useEffect } from 'react';
import { getBrands, getProducts } from '../api';
import ProductCard from '../components/product/ProductCard';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(null);
  const [activeName, setActiveName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then(({ data }) => {
      setBrands(data.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!active) { setProducts([]); return; }
    const brand = brands.find(b => b._id === active);
    if (brand) setActiveName(brand.name);
    setLoading(true);
    getProducts({ 'brand[in][]': active, limit: 20 })
      .then(({ data }) => setProducts(data.data || []))
      .finally(() => setLoading(false));
  }, [active, brands]);

  if (loading && brands.length === 0) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}>
      <div className="spinner"/>
    </div>
  );

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>Brands</h1>
          <p style={{color:'var(--gray-400)',marginTop:4}}>Shop your favorite brands</p>
        </div>

        <div className="brands-grid">
          {brands.map(brand => (
            <button
              key={brand._id}
              className={`brand-card${active===brand._id?' brand-card-active':''}`}
              onClick={() => setActive(active===brand._id ? null : brand._id)}
            >
              {brand.image ? (
                <img src={brand.image} alt={brand.name} className="brand-img"/>
              ) : (
                <div style={{width:80,height:80,borderRadius:'var(--radius)',background:'var(--gray-100)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>🏷️</div>
              )}
              <p className="brand-name">{brand.name}</p>
            </button>
          ))}
        </div>

        {active && (
          <div style={{marginTop:48}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <h2 style={{fontFamily:'var(--font-heading)',fontSize:26,fontWeight:600}}>{activeName} Products</h2>
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
                <p>No products found for this brand</p>
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
        .brands-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); gap: 16px; }
        .brand-card { background: white; border-radius: var(--radius-lg); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: var(--shadow); cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
        .brand-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--gray-200); }
        .brand-card-active { border-color: var(--green-500) !important; box-shadow: 0 4px 12px rgba(34,197,94,0.2) !important; }
        .brand-img { width: 80px; height: 60px; object-fit: contain; }
        .brand-name { font-size: 13px; font-weight: 700; color: var(--gray-800); text-align: center; }
      `}</style>
    </div>
  );
}

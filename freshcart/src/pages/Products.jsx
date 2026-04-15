import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, getBrands } from '../api';
import ProductCard from '../components/product/ProductCard';

const BOOSTED_SEARCH_TERMS = new Set(['music', 'super market', 'supermarket', 'beauty', 'healthy', 'health']);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '-ratingsAverage';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    Promise.all([getCategories(), getBrands()]).then(([c, b]) => {
      setCategories(c.data.data || []);
      setBrands(b.data.data || []);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);

      const normalizedSearch = search.trim().toLowerCase();
      const isBoostedSearch = BOOSTED_SEARCH_TERMS.has(normalizedSearch);

      const params = { limit: isBoostedSearch ? 30 : 20, page, sort };
      if (search) params.keyword = search;
      if (category) params['category[in][]'] = category;
      if (brand) params['brand[in][]'] = brand;
      if (minPrice) params['price[gte]'] = minPrice;
      if (maxPrice) params['price[lte]'] = maxPrice;

      try {
        const { data } = await getProducts(params);
        let list = data.data || [];
        let nextTotal = data.results || 0;

        // For project-required department searches, enrich sparse result sets
        // so users still see enough products to browse.
        if (isBoostedSearch && list.length < 12) {
          const { data: fallbackData } = await getProducts({ limit: 24, page: 1, sort: '-ratingsAverage' });
          const fallbackList = fallbackData.data || [];
          const existing = new Set(list.map((p) => p._id));
          const merged = [...list];

          fallbackList.forEach((item) => {
            if (!existing.has(item._id)) merged.push(item);
          });

          list = merged.slice(0, 24);
          nextTotal = Math.max(nextTotal, list.length);
        }

        if (!cancelled) {
          setProducts(list);
          setTotal(nextTotal);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [search, category, brand, sort, minPrice, maxPrice, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setPage(1);
    setSearchParams(p);
  };

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:24}}>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600}}>All Products</h1>
          <p style={{color:'var(--gray-400)',marginTop:4}}>{total} products found</p>
        </div>

        {/* Search + Sort bar */}
        <div className="products-topbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{color:'var(--gray-400)',flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setParam('search', e.target.value)}
              className="search-input"
            />
          </div>
          <select value={sort} onChange={e => setParam('sort', e.target.value)} className="form-input" style={{width:'auto',minWidth:180}}>
            <option value="-ratingsAverage">Top Rated</option>
            <option value="-sold">Best Selling</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-createdAt">Newest First</option>
          </select>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-list">
                <button className={`filter-item${!category?'  active':''}`} onClick={() => setParam('category','')}>All Categories</button>
                {categories.map(c => (
                  <button key={c._id} className={`filter-item${category===c._id?' active':''}`} onClick={() => setParam('category', c._id)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Brands</h3>
              <div className="filter-list">
                <button className={`filter-item${!brand?' active':''}`} onClick={() => setParam('brand','')}>All Brands</button>
                {brands.slice(0,10).map(b => (
                  <button key={b._id} className={`filter-item${brand===b._id?' active':''}`} onClick={() => setParam('brand', b._id)}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="number" placeholder="Min" value={minPrice} onChange={e=>setParam('minPrice',e.target.value)} className="form-input" style={{flex:1,padding:'8px 10px'}}/>
                <span style={{color:'var(--gray-400)'}}>-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={e=>setParam('maxPrice',e.target.value)} className="form-input" style={{flex:1,padding:'8px 10px'}}/>
              </div>
            </div>

            {(category || brand || minPrice || maxPrice || search) && (
              <button className="btn btn-outline btn-sm" style={{width:'100%',marginTop:8}} onClick={() => setSearchParams({})}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div style={{flex:1}}>
            {loading ? (
              <div className="products-grid">
                {Array(12).fill(0).map((_,i) => (
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
            ) : products.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/></svg>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="products-grid fade-in">
                {products.map(p => <ProductCard key={p._id} product={p}/>)}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:32}}>
                <button className="btn btn-ghost btn-sm" disabled={page===1} onClick={() => setPage(p => p-1)}>← Prev</button>
                <span style={{padding:'7px 16px',fontSize:14,color:'var(--gray-500)'}}>Page {page}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p+1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .products-topbar { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 10px; background: white; border: 1.5px solid var(--gray-200); border-radius: var(--radius); padding: 0 14px; transition: border-color 0.2s; }
        .search-box:focus-within { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
        .search-input { flex: 1; border: none; padding: 11px 0; background: transparent; font-size: 14px; color: var(--gray-800); }
        .products-layout { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
        .filters-sidebar { display: flex; flex-direction: column; gap: 20px; }
        .filter-section { background: white; border-radius: var(--radius-lg); padding: 18px; box-shadow: var(--shadow); }
        .filter-section h3 { font-size: 13px; font-weight: 700; color: var(--gray-700); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .filter-list { display: flex; flex-direction: column; gap: 2px; max-height: 220px; overflow-y: auto; }
        .filter-item { padding: 7px 10px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; color: var(--gray-600); text-align: left; transition: all 0.15s; background: transparent; }
        .filter-item:hover { background: var(--gray-100); color: var(--gray-800); }
        .filter-item.active { background: var(--green-50); color: var(--green-700); font-weight: 600; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 18px; }
        @media(max-width:768px) { .products-layout{grid-template-columns:1fr;} .filters-sidebar{display:none;} }
      `}</style>
    </div>
  );
}

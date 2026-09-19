import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import PageHero from '../components/ui/PageHero';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';
import Button from '../components/ui/Button';

const FILTERS = [
  { id: 'all', label: 'All Products' },
  { id: 'best', label: 'Best Sellers' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'under400', label: 'Under Rs. 400' },
];

export default function Products() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [selected, setSelected] = useState(null);
  const { products } = useCatalog();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (filter === 'best') return p.category === 'best';
      if (filter === 'new') return p.category === 'new';
      if (filter === 'under400') return p.price < 400;
      return true;
    });

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.longDesc.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, query, filter, sort]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  }, [products, query]);

  const clearAll = () => {
    setQuery('');
    setFilter('all');
    setSort('default');
  };

  return (
    <>
      <PageHero
        title="Our Premium Collection"
        subtitle="100% Natural, No Added Preservatives, Rich Aroma — crafted with tradition"
      />

      <div className="search-wrapper">
        <div className="search-bar">
          <i className="fas fa-search" />
          <input
            type="search"
            placeholder="Search for spices, e.g. turmeric, chili..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              &times;
            </button>
          )}
          <Button size="sm">Search</Button>
        </div>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setQuery(p.name)}>
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="products-page">
        <div className="container">
          <div className="filter-bar">
            <div className="filter-chips">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`chip ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="filter-sort">
              <label>
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A–Z</option>
                  <option value="name-za">Name: Z–A</option>
                </select>
              </label>
              <span className="result-count">{filtered.length} products</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search" />
              <h3>No products found</h3>
              <p>Try a different search or clear your filters.</p>
              <Button onClick={clearAll}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRating
                  onQuickView={setSelected}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

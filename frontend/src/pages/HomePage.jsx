import Hero from "../components/Hero.jsx";
import Categories from "../components/Categories.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function HomePage({
  items,
  categories,
  activeCategory,
  onCategorySelect,
  savedIds,
  onToggleWishlist,
  onChat,
  userId
}) {
  const featuredItems = items.slice(0, 8);

  return (
    <div className="page-content">
      <Hero onCategorySelect={onCategorySelect} />
      <Categories categories={categories} activeCategory={activeCategory} onSelect={onCategorySelect} />

      <section className="section-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured</span>
            <h2>Featured products</h2>
          </div>
          <span>{featuredItems.length} items</span>
        </div>
        <div className="product-grid">
          {featuredItems.length > 0 ? (
            featuredItems.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                saved={savedIds.has(item._id)}
                onToggleWishlist={onToggleWishlist}
                onChat={onChat}
                userId={userId}
              />
            ))
          ) : (
            <div className="empty-state">No featured items available. Check back soon.</div>
          )}
        </div>
      </section>
    </div>
  );
}

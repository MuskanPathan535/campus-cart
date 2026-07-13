import ProductCard from "../components/ProductCard.jsx";

export default function WishlistPage({ items, savedIds, onToggleWishlist, onChat, userId }) {
  return (
    <div className="page-content">
      <section className="section-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Wishlist</span>
            <h2>Saved products</h2>
          </div>
          <span>{items.length} saved</span>
        </div>
        <div className="product-grid">
          {items.length > 0 ? (
            items.map((item) => (
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
            <div className="empty-state">No saved items yet. Add products to your wishlist.</div>
          )}
        </div>
      </section>
    </div>
  );
}

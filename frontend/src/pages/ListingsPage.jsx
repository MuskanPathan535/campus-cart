import ProductCard from "../components/ProductCard.jsx";

export default function ListingsPage({ items, savedIds, onToggleWishlist, onChat, onToggleSold, onDelete, userId }) {
  return (
    <div className="page-content">
      <section className="section-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">My listings</span>
            <h2>Products you posted</h2>
          </div>
          <span>{items.length} listings</span>
        </div>
        {items.length > 0 ? (
          <div className="product-grid">
            {items.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                saved={savedIds.has(item._id)}
                onToggleWishlist={onToggleWishlist}
                onChat={onChat}
                onDelete={onDelete}
                showDelete
                isOwner={item.seller?._id === userId}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">You have not listed any items yet.</div>
        )}
      </section>
    </div>
  );
}

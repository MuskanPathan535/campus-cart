import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MessageCircle, Tag } from "lucide-react";
import { assetUrl } from "../api.js";

export default function ProductPage({ items, savedIds, onToggleWishlist, onChat, onToggleSold, user }) {
  const { id } = useParams();
  const item = useMemo(() => items.find((product) => product._id === id), [items, id]);
  const owner = item?.seller?._id === user?.id;

  if (!item) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h3>Product not found</h3>
          <p>This item is no longer available or the page was refreshed.</p>
          <Link to="/" className="button button-secondary">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content product-page">
      <section className="product-detail-panel">
        <div className="product-gallery">
          <img src={assetUrl(item.imageUrl)} alt={item.title} />
        </div>
        <div className="product-info">
          <span className="eyebrow">{item.category}</span>
          <h1>{item.title}</h1>
          <p className="product-price-large">₹{item.price}</p>
          <p className="product-description">{item.description}</p>
          <div className="product-meta">
            <span>{item.condition}</span>
            <span>{item.location}</span>
          </div>

          <div className="product-actions">
            {!owner ? (
              <button type="button" className="button button-primary" onClick={() => onChat(item)}>
                <MessageCircle size={16} /> Chat seller
              </button>
            ) : (
              <button type="button" className="button button-outline" disabled>
                Your listing
              </button>
            )}
            <button
              type="button"
              className={savedIds.has(item._id) ? "button button-secondary saved" : "button button-secondary"}
              onClick={() => onToggleWishlist(item)}
            >
              <Heart size={16} /> {savedIds.has(item._id) ? "Saved" : "Save"}
            </button>
            {owner && (
              <button type="button" className="button button-outline" onClick={() => onToggleSold(item)}>
                <Tag size={16} /> {item.isSold ? "Mark Available" : "Mark Sold"}
              </button>
            )}
          </div>

          <div className="seller-card">
            <h3>Seller information</h3>
            <p>{item.seller?.name || "Campus seller"}</p>
            <small>{item.seller?.course || item.seller?.hostel || "Student seller"}</small>
          </div>
        </div>
      </section>
    </div>
  );
}

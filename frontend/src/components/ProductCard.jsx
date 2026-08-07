import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { assetUrl } from "../api.js";

export default function ProductCard({ item, saved, onToggleWishlist, onChat, onDelete, showDelete, userId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const imageStyle = item.imageUrl ? { backgroundImage: `url(${assetUrl(item.imageUrl)})` } : undefined;
  const owner = item.seller?._id === userId;
  const canChat = !!onChat && !owner;

  const handleDelete = () => {
    if (!onDelete) return;
    setMenuOpen(false);
    if (window.confirm("Delete this listing?")) {
      onDelete(item._id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <article className="product-card">
      <div className="product-image" style={imageStyle}>
        {!item.imageUrl && <div className="product-placeholder">No image</div>}
        <span className="product-category">{item.category}</span>
        {showDelete && onDelete && owner && (
          <div className="more-menu-wrapper" ref={menuRef} onClick={(event) => event.stopPropagation()}>
            <button
              className="more-button"
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="More actions"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="more-menu">
                <button className="more-menu-item" type="button" onClick={handleDelete}>
                  Delete listing
                </button>
              </div>
            )}
          </div>
        )}
        <button className={saved ? "wishlist-button saved" : "wishlist-button"} type="button" onClick={() => onToggleWishlist(item)}>
          <Heart size={16} />
        </button>
      </div>
      <div className="product-body">
        <div>
          <h3>{item.title}</h3>
          <p className="product-price">₹{item.price}</p>
        </div>
        <p className="product-seller">Seller: {item.seller?.name || "Campus seller"}</p>
        <div className="product-actions">
          <Link to={`/product/${item._id}`} className="button button-secondary small">
            View details
          </Link>
          {canChat ? (
            <button className="button button-outline small" type="button" onClick={() => onChat(item)}>
              <MessageCircle size={16} />
              Chat
            </button>
          ) : owner ? (
            <button className="button button-outline small" type="button" disabled>
              Your listing
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

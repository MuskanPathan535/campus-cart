import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, MessageCircle, Plus, User, ChevronDown } from "lucide-react";

export default function Navbar({
  user,
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onOpenAuth,
  onLogout
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="brand logo-row">
        <Link to="/" className="brand-mark">
          <ShoppingBagIcon />
        </Link>
        <div>
          <Link to="/" className="brand-title">
            Campus Cart
          </Link>
          <span className="brand-subtitle">Student marketplace</span>
        </div>
      </div>

      <form
        className="navbar-search"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Search size={16} />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search calculators, books, laptops..."
          aria-label="Search items"
        />
      </form>

      <div className="navbar-controls">
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Select category"
        >
          <option value="All">All categories</option>
          {categories.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        <Link to="/sell" className="button button-primary">
          <Plus size={16} /> Sell Item
        </Link>

        <Link to="/wishlist" className="icon-button" title="Wishlist">
          <Heart size={18} />
        </Link>

        {user ? (
          <Link to="/chat" className="icon-button" title="Chat">
            <MessageCircle size={18} />
          </Link>
        ) : (
          <button type="button" className="icon-button" title="Chat" onClick={() => onOpenAuth("login")}>
            <MessageCircle size={18} />
          </button>
        )}

        {user ? (
          <div className="profile-menu">
            <button className="profile-button" type="button" onClick={() => setMenuOpen((value) => !value)}>
              <User size={18} />
              <span>{user.name}</span>
              <ChevronDown size={16} />
            </button>
            {menuOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/listings" onClick={() => setMenuOpen(false)}>
                  My Listings
                </Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                  Wishlist
                </Link>
                <button type="button" onClick={() => { setMenuOpen(false); onLogout(); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-actions">
            <button type="button" className="button button-secondary" onClick={() => onOpenAuth("login")}>
              Login
            </button>
            <button type="button" className="button button-primary" onClick={() => onOpenAuth("register")}> 
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function ShoppingBagIcon() {
  return (
    <div className="brand-mark">
      <span>✦</span>
    </div>
  );
}

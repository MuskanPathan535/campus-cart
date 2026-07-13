import { Link } from "react-router-dom";

export default function Hero({ onCategorySelect }) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">Campus marketplace</span>
        <h1>Buy Smart. Sell Fast. Meet on Campus.</h1>
        <p>Buy and sell calculators, books, cycles, laptops, electronics and hostel essentials.</p>
        <div className="hero-actions">
          <Link to="/sell" className="button button-primary">
            Sell an item
          </Link>
          <button type="button" className="button button-secondary" onClick={() => onCategorySelect("Books")}>Browse books</button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-card">
          <h3>Campus favorites</h3>
          <p>Fresh student deals across textbooks, gadgets, and hostel essentials.</p>
        </div>
      </div>
    </section>
  );
}

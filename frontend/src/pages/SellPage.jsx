export default function SellPage({ user, busy, onSubmit }) {
  return (
    <div className="page-content">
      <section className="section-panel sell-page">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Sell item</span>
            <h2>List your product for campus buyers.</h2>
          </div>
        </div>
        {user ? (
          <form className="panel-form sell-form" onSubmit={onSubmit}>
            <input name="title" placeholder="Title" required />
            <textarea name="description" placeholder="Description" required />
            <div className="row-two">
              <input name="price" type="number" min="0" placeholder="Price in INR" required />
              <select name="category" required defaultValue="">
                <option value="" disabled>Select category</option>
                <option>Books</option>
                <option>Electronics</option>
                <option>Cycle</option>
                <option>Furniture</option>
                <option>Hostel</option>
                <option>Calculator</option>
              </select>
            </div>
            <div className="row-two">
              <select name="condition" required defaultValue="">
                <option value="" disabled>Select condition</option>
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
              <input name="location" placeholder="Hostel / Department" required />
            </div>
            <label className="upload-field">
              Upload image
              <input name="image" type="file" accept="image/png,image/jpeg,image/webp" />
            </label>
            <button className="button button-primary full" disabled={busy} type="submit">
              {busy ? "Publishing..." : "Submit Listing"}
            </button>
          </form>
        ) : (
          <div className="empty-state">
            <h3>Login to sell items</h3>
            <p>Your profile unlocks listing creation and chat features.</p>
          </div>
        )}
      </section>
    </div>
  );
}

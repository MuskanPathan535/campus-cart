export default function Categories({ categories, activeCategory, onSelect }) {
  return (
    <section className="categories-panel">
      {categories.map((category) => (
        <button
          key={category.label}
          type="button"
          className={activeCategory === category.label ? "category-card active" : "category-card"}
          onClick={() => onSelect(category.label)}
        >
          <div className="category-icon">{category.icon && <category.icon size={20} />}</div>
          <span>{category.label}</span>
        </button>
      ))}
    </section>
  );
}

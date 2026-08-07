import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-content">
      <div className="empty-state">
        <h3>Page not found</h3>
        <p>Looks like you followed a broken link.</p>
        <Link to="/" className="button button-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}

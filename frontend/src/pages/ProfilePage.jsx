export default function ProfilePage({ user }) {
  return (
    <div className="page-content">
      <section className="section-panel profile-page">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Profile</span>
            <h2>Your campus account</h2>
          </div>
        </div>
        <div className="profile-card">
          <h3>{user?.name || "Student"}</h3>
          <p>{user?.email}</p>
          <div className="profile-meta">
            <span>{user?.course || "Course not set"}</span>
            <span>{user?.hostel || "Hostel not set"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

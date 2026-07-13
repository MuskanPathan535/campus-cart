import { useEffect } from "react";
import { X, User } from "lucide-react";

export default function AuthModal({ mode, setMode, busy, onSubmit, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close auth modal">
          <X size={20} />
        </button>
        <div className="modal-header">
          <div className="brand-mark small">
            <User size={20} />
          </div>
          <div>
            <h2>{mode === "login" ? "Welcome back" : "Create your Campus profile"}</h2>
            <p>{mode === "login" ? "Sign in and start selling on campus." : "Register to list, save, and chat."}</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button className={mode === "login" ? "selected" : ""} type="button" onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "selected" : ""} type="button" onClick={() => setMode("register")}>Register</button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === "register" && <input name="name" placeholder="Full name" required />}
          <input name="email" type="email" placeholder="Email address" required />
          <input name="password" type="password" placeholder="Password" minLength="6" required />
          {mode === "register" && (
            <div className="row-two">
              <input name="course" placeholder="Course / branch" />
              <input name="hostel" placeholder="Hostel" />
            </div>
          )}
          <button className="button button-primary full" type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="home-navbar">
      <div className="home-logo">
        ENFIANCE
      </div>

      <nav className="home-nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#about">About</a>
        <a href="#support">Support</a>
      </nav>

      <div className="home-nav-actions">
        <Link
          to="/login"
          className="btn-secondary"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="btn-primary"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import DashboardPreview from './DashboardPreview';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">

        <div className="hero-left">

          <span className="hero-badge">
            Modern International Payments
          </span>

          <h1>
            Modern Payments
            <br />
            <span>Without the Complexity.</span>
          </h1>

          <p>
            Send money across borders quickly, securely, and confidently.
            Whether you're supporting family, paying friends, or managing
            international payments, Enfiance keeps the experience simple.
          </p>

          <div className="hero-buttons">
            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="btn-secondary"
            >
              Sign In
            </Link>
          </div>

          <div className="hero-stats">

            <div>
              <h3>Fast</h3>
              <span>Transfers</span>
            </div>

            <div>
              <h3>Secure</h3>
              <span>By Design</span>
            </div>

            <div>
              <h3>Simple</h3>
              <span>User Experience</span>
            </div>

          </div>

        </div>

        <DashboardPreview />

      </div>
    </section>
  );
}

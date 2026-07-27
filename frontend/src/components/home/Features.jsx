import {
  ShieldCheck,
  Clock3,
  Globe2,
} from 'lucide-react';

export default function Features() {
  return (
    <section
      id="features"
      className="features-section"
    >
      <div className="section-heading">
        <span>WHY ENFIANCE</span>

        <h2>
          Built Around Trust,
          <br />
          Speed, and Simplicity.
        </h2>

        <p>
          Enfiance removes unnecessary complexity so you can focus on
          what matters most—moving money securely and confidently.
        </p>
      </div>

      <div className="feature-grid">

        <div className="feature-card">
          <Clock3
            size={34}
            className="feature-icon"
          />

          <h3>Fast Transfers</h3>

          <p>
            Move money quickly with a simple experience designed for
            everyday life.
          </p>
        </div>

        <div className="feature-card">
          <ShieldCheck
            size={34}
            className="feature-icon"
          />

          <h3>Security You Can Trust</h3>

          <p>
            Modern security practices help protect every account and
            every transfer.
          </p>
        </div>

        <div className="feature-card">
          <Globe2
            size={34}
            className="feature-icon"
          />

          <h3>Global Reach</h3>

          <p>
            Designed for families, professionals, and businesses
            sending money across borders.
          </p>
        </div>

      </div>
    </section>
  );
}

import {
  ArrowUpRight,
  ArrowDownLeft,
  BadgeCheck,
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="dashboard-preview">

      <div className="preview-header">
        <div>
          <p className="preview-label">
            Available Balance
          </p>

          <h2>$1,248.32</h2>
        </div>

        <div className="preview-status">
          <BadgeCheck size={18} />
          Ready
        </div>
      </div>

      <div className="preview-actions">

        <button className="preview-button">
          <ArrowUpRight size={18} />
          Send Money
        </button>

        <button className="preview-button secondary">
          <ArrowDownLeft size={18} />
          Request
        </button>

      </div>

      <div className="preview-activity">

        <h3>Recent Activity</h3>

        <div className="activity-item">
          <div>
            <strong>Money Sent</strong>
            <p>Family Transfer</p>
          </div>

          <span>-$150.00</span>
        </div>

        <div className="activity-item">
          <div>
            <strong>Money Received</strong>
            <p>Account Deposit</p>
          </div>

          <span className="positive">
            +$500.00
          </span>
        </div>

        <div className="activity-item">
          <div>
            <strong>Payment Request</strong>
            <p>Awaiting Response</p>
          </div>

          <span>$75.00</span>
        </div>

      </div>

    </div>
  );
}

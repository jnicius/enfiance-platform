import './SideMenu.css';

export default function SideMenu({
  open,
  onClose,
  onLogout,
}) {
  return (
    <>
      <div
        className={`menu-overlay ${open ? 'show' : ''}`}
        onClick={onClose}
      />

      <div
        className={`side-menu ${open ? 'open' : ''}`}
      >
        <div className="menu-header">
          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

          <h2>Enfiance</h2>

          <p>Your Digital Wallet</p>
        </div>

        <div className="menu-items">

          <button>🏠 Dashboard</button>

          <button>👤 Profile</button>

          <button>📜 Transactions</button>

          <button>💸 Payment Requests</button>

          <button>👥 Contacts</button>

          <button>⚙️ Settings</button>

        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </div>
    </>
  );
}

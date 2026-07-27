export default function AppHeader({
  firstName,
  onMenu,
  onLogout,
}) {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          className="menu-button"
          onClick={onMenu}
          title="Menu"
        >
          ☰
        </button>

        <div className="brand">
          ENFIANCE
        </div>
      </div>

      <div className="app-header-right">
        <button
          className="notification-button"
          title="Notifications"
        >
          🔔
        </button>

        <button
          className="profile-button"
          onClick={onLogout}
          title="Logout"
        >
          👤 {firstName}
        </button>
      </div>
    </header>
  );
}

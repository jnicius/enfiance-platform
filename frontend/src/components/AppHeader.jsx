import { useNavigate } from 'react-router-dom';

import {
  Menu,
  Bell,
  CircleUserRound,
} from 'lucide-react';

export default function AppHeader({
  firstName,
  onMenu,
}) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          className="menu-button"
          onClick={onMenu}
          title="Menu"
        >
          <Menu size={20} />
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
          <Bell size={18} />
        </button>

        <button
          className="profile-button"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <CircleUserRound
            size={18}
            style={{ marginRight: '8px' }}
          />

          {firstName}
        </button>
      </div>
    </header>
  );
}

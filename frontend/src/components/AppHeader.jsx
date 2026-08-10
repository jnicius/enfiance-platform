import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          className="menu-button"
          onClick={onMenu}
          title={t('navigation.menu')}
        >
          <Menu size={20} />
        </button>

        <div className="brand notranslate" translate="no">
          ENFIANCE
        </div>
      </div>

      <div className="app-header-right">
        <button
          className="notification-button"
          title={t('navigation.notifications')}
        >
          <Bell size={18} />
        </button>

        <button
          className="profile-button"
          onClick={() => navigate('/profile')}
          title={t('navigation.profile')}
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

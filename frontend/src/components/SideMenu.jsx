import { useTranslation } from 'react-i18next';

import LanguageSelector from './LanguageSelector';
import './SideMenu.css';

export default function SideMenu({
  open,
  onClose,
  onLogout,
}) {
  const { t } = useTranslation();

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
            title={t('navigation.closeMenu')}
            aria-label={t('navigation.closeMenu')}
          >
            ✕
          </button>

          <h2 className="notranslate" translate="no">Enfiance</h2>

          <p>{t('navigation.walletTagline')}</p>
        </div>

        <div className="menu-items">
          <button>
            🏠 {t('navigation.dashboard')}
          </button>

          <button>
            👤 {t('navigation.profile')}
          </button>

          <button>
            📜 {t('navigation.transactions')}
          </button>

          <button>
            💸 {t('navigation.paymentRequests')}
          </button>

          <button>
            👥 {t('navigation.contacts')}
          </button>

          <button>
            ⚙️ {t('navigation.settings')}
          </button>
        </div>

        <div className="side-menu-language">
          <LanguageSelector />
        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          🚪 {t('navigation.logout')}
        </button>
      </div>
    </>
  );
}

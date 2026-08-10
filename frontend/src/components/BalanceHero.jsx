import { useTranslation } from 'react-i18next';

import {
  CreditCard,
  SendHorizontal,
  HandCoins,
  ChartColumnIncreasing,
  BadgeCheck,
} from 'lucide-react';

export default function BalanceHero({
  firstName,
  balance,
  onAddMoney,
  onSend,
  onRequest,
  onActivity,
}) {
  const { t } = useTranslation();

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return t('dashboard.greetingMorning');
    }

    if (hour < 18) {
      return t('dashboard.greetingAfternoon');
    }

    return t('dashboard.greetingEvening');
  };

  const formatBalance = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="balance-hero">
      <div className="balance-title">
        {greeting()},
      </div>

      <div className="balance-name">
        {firstName}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#4ade80',
          marginBottom: '30px',
          fontWeight: 600,
        }}
      >
        <BadgeCheck size={18} />

        {t('dashboard.verifiedAccount')}
      </div>

      <div className="action-grid">

        <div className="balance-title">
          {t('dashboard.balance')}
        </div>

        <div className="balance-amount">
          ${formatBalance(balance)}
        </div>

        <div
          className="action-card"
          onClick={onAddMoney}
        >
          <div className="action-icon">
            <CreditCard size={28} />
          </div>

          <div className="action-title">
            {t('dashboard.addMoney')}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            {t('dashboard.fundAccount')}
          </div>
        </div>

        <div
          className="action-card"
          onClick={onSend}
        >
          <div className="action-icon">
            <SendHorizontal size={28} />
          </div>

          <div className="action-title">
            {t('dashboard.send')}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            {t('dashboard.transferMoney')}
          </div>
        </div>

        <div
          className="action-card"
          onClick={onRequest}
        >
          <div className="action-icon">
            <HandCoins size={28} />
          </div>

          <div className="action-title">
            {t('dashboard.request')}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            {t('dashboard.requestPayment')}
          </div>
        </div>

        <div
          className="action-card"
          onClick={onActivity}
        >
          <div className="action-icon">
            <ChartColumnIncreasing size={28} />
          </div>

          <div className="action-title">
            {t('dashboard.activity')}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            {t('dashboard.viewTransactions')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalanceHero({
  firstName,
  balance,
  onAddMoney,
  onSend,
  onRequest,
  onActivity,
}) {
  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatBalance = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="balance-hero">
      <div className="balance-title">
        {greeting()}, {firstName} 👋
      </div>

      <div className="balance-amount">
        ${formatBalance(balance)}
      </div>

      <p
        style={{
          color: "var(--muted)",
          marginBottom: "30px",
          fontSize: "16px",
        }}
      >
        Your account is verified and ready to send and receive money.
      </p>

      <div className="action-grid">
        <div
          className="action-card"
          onClick={onAddMoney}
        >
          <div className="action-icon">💳</div>

          <div className="action-title">
            Add Money
          </div>

          <div
            style={{
              color: "var(--muted)",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Fund your account
          </div>
        </div>

        <div
          className="action-card"
          onClick={onSend}
        >
          <div className="action-icon">📤</div>

          <div className="action-title">
            Send
          </div>

          <div
            style={{
              color: "var(--muted)",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Transfer money
          </div>
        </div>

        <div
          className="action-card"
          onClick={onRequest}
        >
          <div className="action-icon">📥</div>

          <div className="action-title">
            Request
          </div>

          <div
            style={{
              color: "var(--muted)",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Request a payment
          </div>
        </div>

        <div
          className="action-card"
          onClick={onActivity}
        >
          <div className="action-icon">📊</div>

          <div className="action-title">
            Activity
          </div>

          <div
            style={{
              color: "var(--muted)",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            View transactions
          </div>
        </div>
      </div>
    </div>
  );
}

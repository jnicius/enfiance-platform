export default function HeroCard({
  firstName,
  balance,
  onAddMoney,
}) {
  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';

    return 'Good Evening';
  };

  return (
    <div
      style={{
        background: '#182347',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '30px',
      }}
    >
      <div
        style={{
          color: '#8fa4ff',
          fontSize: '16px',
        }}
      >
        {greeting()}
      </div>

      <h1
        style={{
          color: '#ffffff',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        {firstName} 👋
      </h1>

      <div
        style={{
          color: '#5be65b',
          fontWeight: 'bold',
        }}
      >
        ✔ Verified Account
      </div>

      <div
        style={{
          marginTop: '35px',
          color: '#9fa9d1',
          fontSize: '18px',
        }}
      >
        Available Balance
      </div>

      <div
        style={{
          color: '#5be65b',
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '25px',
        }}
      >
        ${balance}
      </div>

      <button
        onClick={onAddMoney}
        style={{
          background: '#59d14f',
          color: '#fff',
          border: 'none',
          padding: '16px 28px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        + Add Money
      </button>
    </div>
  );
}

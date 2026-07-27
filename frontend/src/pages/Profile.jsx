import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );

    setUser(storedUser);
  }, []);

  if (!user) {
    return (
      <div
        style={{
          color: 'white',
          padding: '40px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1020',
        color: 'white',
        padding: '40px',
      }}
    >
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: '30px',
          padding: '10px 18px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ← Back to Dashboard
      </button>

      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: '#151d3b',
          borderRadius: '24px',
          padding: '40px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              background: '#2a315e',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            👤
          </div>

          <h1>
            {user.firstName} {user.lastName}
          </h1>

          <p>@{user.username}</p>
        </div>

        <hr />

        <h3>Email</h3>
        <p>{user.email}</p>

        <h3>Username</h3>
        <p>{user.username}</p>

        <h3>Wallet Address</h3>
        <p
          style={{
            wordBreak: 'break-all',
          }}
        >
          {user.walletAddress}
        </p>

        <h3>Member Since</h3>
        <p>Coming Soon</p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              user.walletAddress || ''
            );
          }}
          style={{
            marginTop: '25px',
            padding: '15px 25px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Copy Wallet Address
        </button>
      </div>
    </div>
  );
}

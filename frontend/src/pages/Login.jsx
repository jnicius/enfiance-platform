import { useState } from 'react';
import { Link } from 'react-router-dom';

import API from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const res = await API.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...res.data.user,
          wallet: res.data.wallet,
        })
      );

      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your Enfiance account."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register">
            Create one
          </Link>
        </>
      }
    >
      <form
        className="auth-form-stack"
        onSubmit={handleLogin}
      >
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <div
          style={{
            textAlign: 'right',
            marginTop: '-6px',
            marginBottom: '18px',
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: '#9fb2d8',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Signing in...'
            : 'Sign In'}
        </button>

        {error && (
          <p
            style={{
              color: '#ff7070',
              textAlign: 'center',
              marginTop: '16px',
            }}
          >
            {error}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import API from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';

export default function Login() {
const { t } = useTranslation();
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
          t('login.failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={
        <>
          {t('login.noAccount')}{' '}
          <Link to="/register">
            {t('login.createOne')}
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
          placeholder={t('login.email')}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder={t('login.password')}
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
            {t('login.forgotPassword')}
          </Link>
        </div>

        <button
          className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? t('login.signingIn')
            : t('login.signIn')}
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

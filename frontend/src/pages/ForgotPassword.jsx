import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import AuthLayout from '../components/auth/AuthLayout';

export default function ForgotPassword() {
const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        '/api/auth/forgot-password',
        {
          email,
        }
      );

      setMessage(
        t('forgotPassword.instructionsSent')
      );
    } catch (err) {
      setMessage(
        t('forgotPassword.instructionsSent')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('forgotPassword.title')}
      subtitle={t('forgotPassword.subtitle')}
      footer={
        <>
          {t('forgotPassword.rememberPassword')}{' '}
          <Link to="/login">
            {t('forgotPassword.signIn')}
          </Link>
        </>
      }
    >
      <form
        className="auth-form-stack"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-input"
          type="email"
          placeholder={t('forgotPassword.emailAddress')}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <button
          className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? t('forgotPassword.sending')
            : t('forgotPassword.sendResetLink')}
        </button>

        {message && (
          <p
            style={{
              marginTop: '18px',
              color: '#9fb2d8',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

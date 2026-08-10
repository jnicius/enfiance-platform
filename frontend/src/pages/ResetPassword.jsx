import { useState } from 'react';
import {
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';

export default function ResetPassword() {
const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        t('resetPassword.passwordsDoNotMatch')
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          t('resetPassword.failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('resetPassword.title')}
      subtitle={t('resetPassword.subtitle')}
      footer={
        <>
          {t('resetPassword.rememberPassword')}{' '}
          <Link to="/login">
            {t('resetPassword.signIn')}
          </Link>
        </>
      }
    >
      <form
        className="auth-form-stack"
        onSubmit={handleReset}
      >
        <PasswordInput
          placeholder={t('resetPassword.newPassword')}
          value={password}
          onChange={setPassword}
          required
        />

        <PasswordInput
          placeholder={t('resetPassword.confirmPassword')}
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />

        <button
          className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? t('resetPassword.resetting')
            : t('resetPassword.resetPassword')}
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

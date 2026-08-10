import { useState } from 'react';
import {
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';

import axios from 'axios';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';

export default function ResetPassword() {
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
        'Passwords do not match.'
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
          'Reset failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Choose a strong password to secure your account."
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login">
            Sign In
          </Link>
        </>
      }
    >
      <form
        className="auth-form-stack"
        onSubmit={handleReset}
      >
        <PasswordInput
          placeholder="New Password"
          value={password}
          onChange={setPassword}
          required
        />

        <PasswordInput
          placeholder="Confirm Password"
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
            ? 'Resetting...'
            : 'Reset Password'}
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

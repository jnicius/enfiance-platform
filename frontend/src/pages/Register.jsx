import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import AuthLayout from '../components/auth/AuthLayout';

export default function Register() {
const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    // -------------------------
    // PASSWORD VALIDATION
    // -------------------------

    if (
      form.password !==
      form.confirmPassword
    ) {

      alert(
        t('register.passwordsDoNotMatch')
      );

      return;
    }

    try {

      setLoading(true);

      await axios.post(
        '/api/auth/register',
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      alert(
        t('register.success')
      );

      window.location.href =
        '/login';

    } catch (err) {

      alert(
        err?.response?.data?.message ||
        t('register.failed')
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <AuthLayout
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      footer={
        <>
          {t('register.alreadyHaveAccount')}{' '}
          <Link to="/login">
        {t('register.signIn')}
      </Link>
        </>
      }
    >

      <form
          onSubmit={handleRegister}
          className="space-y-6"
        >

          {/* FULL NAME */}

          <input
            type="text"

            placeholder={t('register.fullName')}

            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }

            className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          {/* EMAIL */}

          <input
            type="email"

            placeholder={t('register.email')}

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }

            className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          {/* PASSWORD */}

          <div className="relative">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }

              placeholder={t('register.password')}

              value={form.password}

              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }

              className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
            />

            <button
              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {
                showPassword
                  ? t('register.hide')
                  : t('register.show')
              }
            </button>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }

              placeholder={t('register.confirmPassword')}

              value={form.confirmPassword}

              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword:
                    e.target.value,
                })
              }

              className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
            />

            <button
              type="button"

              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }

              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {
                showConfirmPassword
                  ? t('register.hide')
                  : t('register.show')
              }
            </button>

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"

            disabled={loading}

            className="auth-button"
          >

            {
              loading
                ? t('register.creatingAccount')
                : t('register.register')
            }

          </button>

        </form>
     </AuthLayout>
  );
}

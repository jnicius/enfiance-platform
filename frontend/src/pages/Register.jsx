import { useState } from 'react';
import axios from 'axios';

export default function Register() {

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
        'Passwords do not match'
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
        'Registration successful'
      );

      window.location.href =
        '/login';

    } catch (err) {

      alert(
        err?.response?.data?.message ||
        'Registration failed'
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#0B1120] border border-white/10 rounded-3xl p-10 shadow-2xl">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-[#D4AF37] mb-3">
            ENFIANCE
          </h1>

          <p className="text-gray-400">
            Create your account
          </p>

        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-6"
        >

          {/* FULL NAME */}

          <input
            type="text"

            placeholder="Full Name"

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

            placeholder="Email"

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

              placeholder="Password"

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
                  ? 'Hide'
                  : 'Show'
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

              placeholder="Confirm Password"

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
                  ? 'Hide'
                  : 'Show'
              }
            </button>

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"

            disabled={loading}

            className="w-full bg-[#D4AF37] hover:bg-[#e8c85a] text-black font-bold py-4 rounded-2xl transition"
          >

            {
              loading
                ? 'Creating Account...'
                : 'Register'
            }

          </button>

        </form>

      </div>

    </div>
  );
}

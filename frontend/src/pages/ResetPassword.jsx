import { useState } from 'react';

import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import axios from 'axios';

export default function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

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

  const handleReset = async (
    e
  ) => {

    e.preventDefault();

    // -------------------------
    // PASSWORD MATCH
    // -------------------------

    if (
      password !==
      confirmPassword
    ) {

      setMessage(
        'Passwords do not match'
      );

      return;
    }

    try {

      setLoading(true);

      const res =
        await axios.post(

          `/api/auth/reset-password/${token}`,

          {
            password,
          }
        );

      setMessage(
        res.data.message
      );

      setTimeout(() => {

        navigate('/login');

      }, 2500);

    } catch (err) {

      setMessage(

        err?.response?.data?.message ||

        'Reset failed'
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
            Create new password
          </p>

        </div>

        <form
          onSubmit={handleReset}
          className="space-y-6"
        >

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#e8c85a] text-black font-bold py-4 rounded-2xl transition"
          >

            {
              loading
                ? 'Resetting...'
                : 'Reset Password'
            }

          </button>

          {

            message && (

              <p className="text-center text-white text-sm">

                {message}

              </p>
            )
          }

        </form>

      </div>

    </div>
  );
}

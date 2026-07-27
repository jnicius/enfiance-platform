import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {

  const [email, setEmail] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

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
        'If an account exists, reset instructions have been sent.'
      );

    } catch (err) {

      setMessage(
        'If an account exists, reset instructions have been sent.'
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
            Reset your password
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="email"

            placeholder="Enter your email"

            value={email}

            onChange={(e) =>
              setEmail(
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
                ? 'Sending...'
                : 'Reset Password'
            }

          </button>

          {

            message && (

              <div className="text-center text-sm text-gray-300">

                {message}

              </div>

            )

          }

        </form>

      </div>

    </div>
  );
}

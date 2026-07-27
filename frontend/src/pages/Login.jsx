import { useState } from 'react';

import API from '../services/api';

export default function Login() {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // -------------------------
  // LOGIN
  // -------------------------

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError('');

        const res =
          await API.post(
            '/auth/login',
            {
              email,
              password,
            }
          );

        console.log(
          'LOGIN RESPONSE:',
          res.data
        );

        // SAVE TOKEN
        localStorage.setItem(
          'token',
          res.data.token
        );

        // SAVE USER
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...res.data.user,
            wallet: res.data.wallet,
          })
        );

        // FORCE REDIRECT
        window.location.href =
          '/dashboard';

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

    <div
      style={{
        background: '#050b22',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial',
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          background: '#151d3b',
          padding: '60px',
          borderRadius: '30px',
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
        }}
      >

        <h1
          style={{
            color: 'white',
            fontSize: '60px',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Enfiance Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            padding: '22px',
            borderRadius: '15px',
            border: 'none',
            fontSize: '24px',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={{
            padding: '22px',
            borderRadius: '15px',
            border: 'none',
            fontSize: '24px',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '22px',
            borderRadius: '15px',
            border: 'none',
            background: '#5ecb52',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {
            loading
              ? 'Loading...'
              : 'Login'
          }
        </button>

        {
          error && (
            <p
              style={{
                color: '#ff7070',
                fontSize: '20px',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )
        }

      </form>

    </div>
  );
}

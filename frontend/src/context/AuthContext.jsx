import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [wallet, setWallet] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // -------------------------
  // LOAD SESSION
  // -------------------------
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token =
          localStorage.getItem('token');

        const storedUser =
          localStorage.getItem('user');

        const storedWallet =
          localStorage.getItem('wallet');

        if (
          token &&
          storedUser &&
          storedWallet
        ) {
          setUser(
            JSON.parse(storedUser)
          );

          setWallet(
            JSON.parse(storedWallet)
          );
        }
      } catch (err) {
        console.error(
          'Session load failed',
          err
        );

        logout();
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = (
    token,
    userData,
    walletData
  ) => {
    localStorage.setItem(
      'token',
      token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

    localStorage.setItem(
      'wallet',
      JSON.stringify(walletData)
    );

    setUser(userData);
    setWallet(walletData);
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    localStorage.removeItem('wallet');

    setUser(null);
    setWallet(null);

    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

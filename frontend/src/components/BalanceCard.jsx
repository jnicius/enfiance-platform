import { useEffect, useState } from 'react';

import API from '../services/api';

export default function BalanceCard({
  user,
  refreshKey
}) {

  const [balance, setBalance] =
    useState('0.00');

  const [loading, setLoading] =
    useState(false);

  const [showWallet, setShowWallet] =
    useState(false);

  const [copyMessage, setCopyMessage] =
    useState('');

  const fetchBalance = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem('token');

      const res = await API.get(
        '/wallet/balance',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(
        res.data.balance || '0.00'
      );

    } catch (err) {

      console.error(
        'Balance error:',
        err
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchBalance();
  }, [refreshKey]);

  const wallet =
    user?.walletAddress ||
    'Wallet unavailable';

  const hiddenWallet =
    wallet.length > 12
      ? `${wallet.slice(0, 6)}...${wallet.slice(-6)}`
      : wallet;

  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(
        wallet
      );

      setCopyMessage('Wallet copied');

      setTimeout(() => {
        setCopyMessage('');
      }, 2000);

    } catch (err) {

      console.error(err);

    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">

      {/* Top */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <p className="text-gray-400 text-sm">
            Available Balance
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ${balance}
          </h2>

        </div>

        <button
          onClick={fetchBalance}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
        >

          {loading
            ? 'Refreshing...'
            : 'Refresh'}

        </button>

      </div>

      {/* Wallet */}
      <div>

        <div className="flex justify-between items-center mb-2">

          <p className="text-gray-400 text-sm">
            Wallet Address
          </p>

          <div className="flex gap-2">

            {/* Reveal */}
            <button
              onClick={() =>
                setShowWallet(!showWallet)
              }
              className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition"
            >

              {showWallet
                ? 'Hide'
                : 'Reveal'}

            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition"
            >

              Copy

            </button>

          </div>

        </div>

        <div className="bg-black border border-gray-700 rounded-xl p-4 font-mono text-green-400 break-all">

          {showWallet
            ? wallet
            : hiddenWallet}

        </div>

        {/* Copy Message */}
        {copyMessage && (

          <p className="text-green-400 text-sm mt-3">
            {copyMessage}
          </p>

        )}

      </div>

    </div>
  );
}

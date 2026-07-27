import { useState, useEffect }
  from 'react';

import API from '../services/api';

import toast
  from 'react-hot-toast';



export default function SendMoney({
  refreshDashboard
  selectRecipient
}) {

  const [recipient, setRecipient] =
    useState('');

   useEffect(() => {

     if (selectedRecipient) {

       setRecipient(
         selectedRecipient
       );

     }

  }, [selectedRecipient]);

  const [amount, setAmount] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [recipientValid, setRecipientValid] =
    useState(null);

  const [recipientData, setRecipientData] =
    useState(null);

  const user =
    JSON.parse(
      localStorage.getItem('user')
    );

  /* -------------------------
     LIVE RECIPIENT LOOKUP
  -------------------------- */

  useEffect(() => {

    const validateRecipient =
      async () => {

        if (!recipient) {

          setRecipientValid(null);
          setRecipientData(null);

          return;
        }

        try {

          const token =
            localStorage.getItem('token');

          const res = await API.get(
            `/search/user?query=${recipient}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          if (res.data.success) {

            setRecipientValid(true);

            setRecipientData(
              res.data.user
            );

          } else {

            setRecipientValid(false);

            setRecipientData(null);

          }

        } catch {

          setRecipientValid(false);

          setRecipientData(null);

        }
      };

    const timeout =
      setTimeout(() => {

        validateRecipient();

      }, 500);

    return () =>
      clearTimeout(timeout);

  }, [recipient]);

  /* -------------------------
     VALIDATION
  -------------------------- */

  const validateTransfer = () => {

    setMessage('');
    setError('');

    if (!recipient || !amount) {

      return setError(
        'All fields are required.'
      );

    }

    if (!recipientValid) {

      return setError(
        'Recipient not found.'
      );

    }

    if (Number(amount) <= 0) {

      return setError(
        'Amount must be greater than zero.'
      );

    }

    if (
      recipient.toLowerCase() ===
      user.email.toLowerCase()
    ) {

      return setError(
        'You cannot send money to yourself.'
      );

    }

    setShowConfirm(true);
  };

  /* -------------------------
     SEND PAYMENT
  -------------------------- */

  const handleSend = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem('token');

      await API.post(
        '/transactions/send',
        {
          recipient,
          amount,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        'Payment sent successfully.'
      );

      setRecipient('');
      setAmount('');

      setRecipientData(null);

      refreshDashboard();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        'Transfer failed.'
      );

    } finally {

      setLoading(false);

      setShowConfirm(false);

    }
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">

        {/* Header */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Send Money
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Secure digital USD transfers
          </p>

        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Recipient */}
          <div>

            <label className="block text-sm text-gray-400 mb-2">

              Recipient Email

            </label>

            <input
              type="text"
              value={recipient}
              onChange={(e) =>
                setRecipient(e.target.value)
              }
              placeholder="example@email.com"
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500"
            />

            {/* Validation */}
            {recipient && (

              <div className="mt-3">

                {recipientValid ? (

                  <div className="bg-green-900/30 border border-green-700 rounded-xl p-3 text-green-300 text-sm">

                    Recipient found:
                    {' '}
                    {recipientData?.email}

                  </div>

                ) : (

                  <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm">

                    Recipient not found

                  </div>

                )}

              </div>

            )}

          </div>

          {/* Amount */}
          <div>

            <label className="block text-sm text-gray-400 mb-2">

              Amount (USD)

            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="0.00"
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500"
            />

          </div>

          {/* Error */}
          
          {/* Success */}
          

          {/* Submit */}
          <button
            onClick={validateTransfer}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 py-4 rounded-xl font-bold transition"
          >

            {loading
              ? 'Processing Transfer...'
              : 'Continue'}

          </button>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-6">
              Confirm Transfer
            </h2>

            <div className="space-y-4 mb-8">

              <div>

                <p className="text-gray-400 text-sm">
                  Recipient
                </p>

                <p className="text-lg font-semibold">
                  {recipient}
                </p>

              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Amount
                </p>

                <p className="text-3xl font-bold text-green-400">
                  ${amount}
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  setShowConfirm(false)
                }
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl transition"
              >

                Cancel

              </button>

              <button
                onClick={handleSend}
                className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold transition"
              >

                Confirm

              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
}

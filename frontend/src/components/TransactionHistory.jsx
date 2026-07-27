import { useEffect, useState } from 'react';

import API from '../services/api';



export default function TransactionHistory({
  refreshKey
})


  const [transactions, setTransactions] =
    useState([]);

  const [selectedTx, setSelectedTx] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchTransactions = async () => {

    try {

      const token =
        localStorage.getItem('token');

      const res = await API.get(
        '/transactions/history',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data || []);

    } catch (err) {

      console.error(
        'Transaction history error:',
        err
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshkey]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Your latest platform transactions
          </p>

        </div>

        <div className="text-gray-500 text-sm">
          {transactions.length} Transactions
        </div>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="text-center py-10 text-gray-500">
          Loading transactions...
        </div>

      ) : transactions.length === 0 ? (

        /* Empty State */
        <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">

          <p className="text-gray-500">
            No transactions yet.
          </p>

        </div>

      ) : (

        /* Transactions */
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">

          {transactions.map((tx, index) => {

            const isSent =
              tx.type === 'sent';

            return (

              <div
                key={index}

                onClick={() =>
                  setSelectedTx(tx)
                }
                
                className="
                  cursor-pointer
                  bg-black
                  border
                  border-gray-800
                  rounded-xl
                  p-5
                  hover:border-green-500
                  transition
                 "
               >

                <div className="flex justify-between items-start">

                  {/* LEFT */}
                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="font-semibold text-lg">

                        {isSent
                          ? 'Sent Payment'
                          : 'Received Payment'}

                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isSent
                            ? 'bg-red-900 text-red-300'
                            : 'bg-green-900 text-green-300'
                        }`}
                      >

                        {isSent
                          ? 'SENT'
                          : 'RECEIVED'}

                      </span>

                    </div>

                    <p className="text-gray-400 text-sm mt-3">

                      {isSent
                        ? `To: ${tx.recipient}`
                        : `From: ${tx.sender}`}

                    </p>

                    <p className="text-gray-600 text-xs mt-2">

                      {new Date(
                        tx.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                  {/* RIGHT */}
                  <div className="text-right">

                    <h2
                      className={`text-2xl font-bold ${
                        isSent
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >

                      {isSent ? '-' : '+'}$
                      {tx.amount}

                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                      COMPLETED
                    </p>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

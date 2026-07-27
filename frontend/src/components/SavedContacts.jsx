import { useEffect, useState } from 'react';

import API from '../services/api';

export default function SavedContacts({
  refreshKey,
  setSelectedRecipient
}) {

  const [contacts, setContacts] =
    useState([]);

  /* -------------------------
     FETCH CONTACTS
  -------------------------- */

  const fetchContacts =
    async () => {

      try {

        const token =
          localStorage.getItem('token');

        const res = await API.get(
          '/contacts',
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setContacts(
          res.data || []
        );

      } catch (err) {

        console.error(
          'Contacts error:',
          err
        );

      }
    };

  /* -------------------------
     AUTO REFRESH
  -------------------------- */

  useEffect(() => {

    fetchContacts();

  }, [refreshKey]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">

      {/* HEADER */}
      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Saved Contacts
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Quickly pay trusted recipients
        </p>

      </div>

      {/* EMPTY STATE */}
      {contacts.length === 0 ? (

        <div className="bg-black border border-gray-800 rounded-xl p-6 text-center text-gray-500">

          No saved contacts yet.

        </div>

      ) : (

        /* CONTACTS LIST */
        <div className="space-y-4">

          {contacts.map(
            (contact, index) => (

              <button
                key={index}

                /* -------------------------
                   CLICK CONTACT
                -------------------------- */

                onClick={() =>
                  setSelectedRecipient(
                    contact.recipientEmail
                  )
                }

                className="w-full bg-black border border-gray-800 hover:border-green-500 rounded-xl p-4 transition text-left"
              >

                <div className="flex justify-between items-center">

                  {/* LEFT */}
                  <div>

                    <h3 className="font-semibold text-lg">

                      {contact.recipientName ||
                        'Unknown User'}

                    </h3>

                    <p className="text-gray-400 text-sm">

                      {contact.recipientEmail}

                    </p>

                  </div>

                  {/* RIGHT */}
                  <div className="text-green-400 text-xl">

                    →

                  </div>

                </div>

              </button>

            )
          )}

        </div>

      )}

    </div>
  );
}

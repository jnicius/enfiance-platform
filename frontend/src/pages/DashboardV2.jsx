
import { useEffect, useState } from 'react';

import API from '../services/api';

import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

import { QRCodeCanvas } from 'qrcode.react';


import BalanceHero from '../components/BalanceHero';
import '../styles/dashboard.css';

import AppHeader from '../components/AppHeader';

import SideMenu from '../components/SideMenu';

export default function Dashboard() {

  // -------------------------
  // STATE
  // -------------------------

  const [requestMessage, setRequestMessage] =
    useState('');

  const [usdcBalance, setUsdcBalance] =
    useState('...');

  const [history, setHistory] =
    useState([]);


  const [contacts, setContacts] =
    useState([]);

  const [paymentRequests, setPaymentRequests] =
    useState([]);

  const [sending, setSending] =
    useState(false);


  const [recipient, setRecipient] =
    useState('');

  const [amount, setAmount] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [transferStatus, setTransferStatus] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const [requestAmount, setRequestAmount] =
    useState('');

  const [requestId, setRequestId] =
    useState('');


  const [requestRecipient, setRequestRecipient] =
    useState('');

  const [requestNote, setRequestNote] =
    useState('');


  const [incomingRequests, setIncomingRequests] =
    useState([]);

  const [menuOpen, setMenuOpen] = useState(false);


  // -------------------------
  // USER
  // -------------------------

  const storedUser =
    JSON.parse(
      localStorage.getItem('user')
    );

  const walletAddress =
    storedUser?.wallet?.address;
  
  const username =
  storedUser?.username ||
  storedUser?.email?.split('@')[0] ||
  'user';

  const totalReceived =
  history
    .filter(
      (tx) =>
        tx.sender !== walletAddress
    )
    .reduce(
      (total, tx) =>
        total +
        Number(tx.amount || 0),
      0
    );

const totalSent =
  history
    .filter(
      (tx) =>
        tx.sender === walletAddress
    )
    .reduce(
      (total, tx) =>
        total +
        Number(tx.amount || 0),
      0
    );



const generateRequest = async () => {

    if (
    !requestAmount ||
    Number(requestAmount) <= 0
  ) {

    setRequestMessage(
      'Please enter a valid amount'
    );

    return;
  }

  try {

    setRequestMessage('');

    const token =
      localStorage.getItem('token');

    const response =
      await API.post(
        '/payments/request',
        {
          recipient: requestRecipient,
          amount: requestAmount,
          message: requestNote,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
     console.log(
       'REQUEST RESPONSE:',
       response.data
     );

    if (
      response.data.success
    ) {

      // setRequestId(
      //  response.data.request.requestId
      //  );

      console.log(
        'REQUEST RESPONSE:',
        response.data
      );

      setRequestId(
        response.data.request.requestId
      );



      setRequestMessage(
        'Payment request created successfully'
      );
 
      setRequestAmount('');
      setRequestRecipient('');
      setRequestNote('');
    }

  } catch (error) {

    console.error(error);

    setRequestMessage(
      'Failed to create request'
    );
  }
};


    const netFlow =
      totalReceived -
      totalSent;

    const payRequest = async (requestId) => {

      try {

        const token =
          localStorage.getItem('token');

        const res =
          await API.post(
            `/request/pay/${requestId}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
             },
            }
         );

      console.log(
        'PAY REQUEST:',
       res.data
     );

     loadIncomingRequests();
     loadBalances();
     loadHistory();

  } catch (error) {

    console.error(
      'Pay request error:',
      error
    );

    alert(
      'Failed to pay request'
    );
  }
};

  // -------------------------
  // LOAD BALANCES
  // -------------------------

  const loadBalances =
    async () => {

      try {

        if (!walletAddress) {
          return;
        }

        const res =
          await API.get(
            `/wallet/balances/${walletAddress}`
          );


        setUsdcBalance(
          res.data.usdc
        );

      } catch (error) {

        console.error(
          'Balance load error:',
          error
        );
      }
    };

  // -------------------------
  // LOAD HISTORY
  // -------------------------

  const loadHistory =
    async () => {

      try {

        const res =
          await API.get(
            '/wallet/history'
          );

        if (
          res.data.success
        ) {

          setHistory(
            res.data.history
          );
        }
      console.log(
  'HISTORY',
  res.data.history
);


      } catch (error) {

        console.error(
          'History error:',
          error
        );
      }
    };




    const loadIncomingRequests =
      async () => {

        try {

          const token =
            localStorage.getItem('token');

          const res =
            await API.get(
              '/request/incoming',
              {  
                headers: {
                  Authorization:
                    `Bearer ${token}`,
               },
             }
           );

          if (
            res.data.success
          ) {
            setIncomingRequests(
              res.data.requests
            );
          }

        } catch (error) {

          console.error(
            'Incoming requests error:',
            error
         );
        }
      };





   // -------------------------
   // LOAD REQUESTS
   // -------------------------

   const loadRequests =
     async () => {

       try {
 
         const token =
           localStorage.getItem('token');

         const res =
           await API.get(
             '/payments/requests',
             {
               headers: {
                 Authorization:
                   `Bearer ${token}`,
              },
            }
          );

        if (
          res.data.success
        ) {

          setPaymentRequests(
            res.data.requests
          );
        }

      } catch (error) {

        console.error(
          'Requests error:',
          error
       );
     }
   };


    
  // -------------------------
  // LOAD CONTACTS
  // -------------------------

  const loadContacts =
    async () => {

      try {

        const res =
          await API.get(
            '/wallet/contacts'
          );

        console.log(
          'CONTACTS:',
          res.data
        );

        setContacts(
          res.data.contacts || []
        );

      } catch (err) {

        console.error(
          'Contacts error:',
          err
        );
      }
    };

  // -------------------------
  // AUTO LOAD
  // -------------------------

  useEffect(() => {

    if (!walletAddress) {
      return;
    }

    loadBalances();
    loadHistory();
    loadContacts();
    loadRequests();
    loadIncomingRequests();

    const interval =
      setInterval(() => {

        loadBalances();
        loadHistory();
        loadContacts();
        loadRequests();
        loadIncomingRequests();

      }, 30000);

    return () =>
      clearInterval(interval);

  }, [walletAddress]);

  

    // -------------------------
    // RAMP
    // -------------------------

  const openRamp = () => {

    if (!walletAddress) {

      setMessage(
        'Wallet not found'
      );

      return;
    }

    new RampInstantSDK({

      hostAppName: 'Enfiance',

      hostLogoUrl:
        'https://www.enfiance.com/logo.png',

      userAddress:
        walletAddress,

      swapAsset: 'USDC',

      fiatCurrency: 'USD',

      defaultFlow: 'ONRAMP',

      network: 'SOLANA',

    }).show();
  };

  // -------------------------
  // SEND USDC
  // -------------------------

  const sendUSDC =
    async () => {

      if (!recipient.trim()) {

        setMessage(
          'Recipient required'
        );

        return;
      }

      if (
        !amount ||
        parseFloat(amount) <= 0
      ) {

        setMessage(
          'Invalid amount'
        );

        return;
      }

      try {

        setSending(true);

        setLoading(true);

        // -------------------------
        // STEP 1
        // -------------------------

        setTransferStatus(
          'Submitting transaction...'
        );

        // -------------------------
        // API CALL
        // -------------------------

        await API.post(
          '/wallet/send',
          {
            recipient:
              recipient.trim(),

            amount:
              parseFloat(amount),
          }
        );

        // -------------------------
        // STEP 2
        // -------------------------

        setTransferStatus(
          'Confirming on blockchain...'
        );

        // -------------------------
        // SMALL DELAY
        // -------------------------

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              1500
            )
        );

        // -------------------------
        // STEP 3
        // -------------------------

        setTransferStatus(
          'Transfer complete'
        );

        setMessage(
          'Transfer successful'
        );

        // -------------------------
        // RESET FORM
        // -------------------------

        setRecipient('');
        setAmount('');

        // -------------------------
        // REFRESH DATA
        // -------------------------

        await loadBalances();

        await loadHistory();

        await loadContacts();

        setSending(false);

        // -------------------------
        // CLEAR STATUS
        // -------------------------

        setTimeout(() => {

          setMessage('');

          setTransferStatus('');

        }, 4000);

      } catch (error) {

        console.error(error);

        setSending(false);

        setTransferStatus('');

        setMessage(
          error?.response?.data?.message ||
          'Transfer failed'
        );

      } finally {

        setLoading(false);
      }
    };

  // -------------------------
  // LOGOUT
  // -------------------------

  const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.location.href =
      '/login';
  };

  return (
  <div
    style={{
      background: '#050b22',
      minHeight: '100vh',
      padding: '30px',
      color: 'white',
      fontFamily: 'Arial',
    }}
  >

    <AppHeader
      firstName={
        storedUser?.firstName ||
        storedUser?.username ||
        'User'
      }
      onMenu={() => setMenuOpen(true)}
      onLogout={logout}
    />

    <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={logout}
    />

    <BalanceHero
      firstName={
        storedUser?.firstName ||
        storedUser?.username ||
        'User'
      }
      balance={usdcBalance}
      onAddMoney={openRamp}

      onSend={() => {
        const el = document.getElementById("send-money");

        if (!el) return;

        window.scrollTo({
          top: el.offsetTop - 20,
          behavior: "smooth",
        });
      }}



      onRequest={() => {
        const el = document.getElementById("request-money");
        if (!el) return;

        window.scrollTo({
          top: el.offsetTop - 20,
          behavior: "smooth",
        });
      }}
  



      onActivity={() => {
        const el = document.getElementById("recent-activity");
        if (!el) return;

        window.scrollTo({
          top: el.offsetTop - 20,
          behavior: "smooth",
        });
      }}
  />
 
   
      <div
  style={{
    background: '#102044',
    border: '1px solid #2d4d8f',
    borderRadius: '20px',
    padding: '20px',
    marginTop: '30px',
    marginBottom: '20px',
  }}
>

  <h2
    style={{
      color: '#67e667',
      marginBottom: '10px',
    }}
   >
     Need to Add Money?
   </h2>

   <p
     style={{
       color: '#d0d0d0',
       fontSize: '18px',
       marginBottom: '25px',
     }}
    >
     Fund your wallet instantly using your debit card or bank account.
    </p>

    <button
      onClick={openRamp}
      style={{
        background: '#5ecb52',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 28px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      Add Funds
    </button>
  </div>



      {/* RECEIVE MONEY */}

<div
  style={{
    background: '#151d3b',
    borderRadius: '30px',
    padding: '35px',
    marginTop: '40px',
  }}
>
  <h1>Receive Money</h1>

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
    }}
  >
    <QRCodeCanvas
      value={walletAddress}
      size={180}
    />

    <p
  style={{
    color: '#aaa',
    marginTop: '10px',
    textAlign: 'center',
  }}
>
  Share your username to receive money instantly.
</p>


    <h2
      style={{
        color: '#67e667',
        marginTop: '20px',
      }}
    >
      @{username}
    </h2>

    <div
  style={{
    marginTop: '15px',
    textAlign: 'center',
  }}
>
  <div
    style={{
      color: '#67e667',
      fontWeight: 'bold',
      marginBottom: '5px',
    }}
  >
    Account ID
  </div>

  <div
    style={{
      color: '#aaa',
      wordBreak: 'break-all',
      maxWidth: '500px',
    }}
  >
    {walletAddress}
  </div>
</div>


    <div
      style={{
        display: 'flex',
        gap: '15px',
        marginTop: '20px',
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => {
          navigator.clipboard.writeText(
            `@${username}`
          );

          setMessage(
            'Username copied'
          );
        }}
        style={{
          background: '#2a315e',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 25px',
          cursor: 'pointer',
        }}
      >
        Copy Username
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(
            walletAddress
          );

          setMessage(
            'Account copied'
          );
        }}
        style={{
          background: '#2a315e',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 25px',
          cursor: 'pointer',
        }}
      >
        Copy Account
      </button>
    </div>
  </div>
</div>




      {/* SEND */}
      <div
        id="send-money"
        style={{
          background: '#151d3b',
          borderRadius: '30px',
          padding: '35px',
          marginTop: '40px',
        }}
      >

        <h1>Send Money</h1>

        <input
          type="text"
          placeholder="@username or account"
          value={recipient}
          onChange={(e) =>
            setRecipient(e.target.value)
          }
          style={{
            width: '100%',
            padding: '20px',
            marginTop: '20px',
            borderRadius: '15px',
            border: 'none',
            background: '#232b4d',
            color: 'white',
            fontSize: '24px',
          }}
        />


        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          style={{
            width: '100%',
            padding: '20px',
            marginTop: '20px',
            borderRadius: '15px',
            border: 'none',
            background: '#232b4d',
            color: 'white',
            fontSize: '24px',
         }}
       />

       <textarea
         placeholder="Message"
         value={message}
         onChange={(e) =>
           setMessage(
             e.target.value
           )
         }
          style={{
            width: '100%',
            padding: '20px',
            marginTop: '20px',
            borderRadius: '15px',
            border: 'none',
            background: '#232b4d',
            color: 'white',
            fontSize: '18px',
            minHeight: '100px',
          }}
        />


        <button
          onClick={sendUSDC}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '25px',
            padding: '22px',
            borderRadius: '15px',
            border: 'none',
            background: loading
              ? '#3d7f36'
              : '#5ecb52',
            color: 'white',
            fontSize: '26px',
            fontWeight: 'bold',
            cursor: loading
              ? 'not-allowed'
              : 'pointer',
          }}
        >

          {
            loading
              ? transferStatus || 'Processing...'
              : 'Send Money'
          }

        </button>

        {
          message && (

            <p
              style={{
                marginTop: '25px',
                color:
                  message.includes('successful')
                    ? '#67e667'
                    : '#ff6b6b',
                fontSize: '22px',
                fontWeight: 'bold',
              }}
            >
              {message}
            </p>
          )
        }

      </div>

      

      {/* REQUEST MONEY */}
      <div
        id="request-money"
        style={{
          background: '#151d3b',
          borderRadius: '30px',
          padding: '35px',
          marginTop: '40px',
        }}
       >
        <h1>Request Payment</h1>

  <p
   style={{
     color: '#aaa',
     marginTop: '10px',
     marginBottom: '20px',
   }}
 >
  Create a payment request and share it with friends, family, or customers.
</p>
  
  <input
    type="text"
    placeholder="Recipient Username or Email"
    value={requestRecipient}
    onChange={(e) =>
      setRequestRecipient(
        e.target.value
      )
    }
    style={{
      width: '100%',
      padding: '20px',
      marginTop: '20px',
      borderRadius: '15px',
      border: 'none',
      background: '#232b4d',
      color: 'white',
      fontSize: '20px',
    }}
  />
  
  <textarea
    placeholder="Message (optional)"
    value={requestNote}
    onChange={(e) =>
      setRequestNote(
        e.target.value
      )
    }
    style={{
      width: '100%',
      padding: '20px',
      marginTop: '20px',
      borderRadius: '15px',
      border: 'none',
      background: '#232b4d',
      color: 'white',
      fontSize: '18px',
      minHeight: '100px',
    }}
  />

  <input
  type="number"
  placeholder="Amount"
  value={requestAmount}
  onChange={(e) =>
    setRequestAmount(
      e.target.value
    )
  }
  style={{
      width: '100%',
      padding: '20px',
      marginTop: '20px',
      borderRadius: '15px',
      border: 'none',
      background: '#232b4d',
      color: 'white',
      fontSize: '24px',
    }}
  />

  <button
  onClick={generateRequest}
  style={{
      width: '100%',
      marginTop: '20px',
      padding: '20px',
      borderRadius: '15px',
      border: 'none',
      background: '#5ecb52',
      color: 'white',
      fontSize: '22px',
      fontWeight: 'bold',
      cursor: 'pointer',
    }}
  >
    Send Request
  </button>


{
  requestMessage && (

    <p
      style={{
        marginTop: '20px',
        color:
          requestMessage.includes('success')
            ? '#67e667'
            : '#ff6b6b',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {requestMessage}
    </p>

  )
}



{
  requestId && (

    <div
      style={{
        marginTop: '20px',
        textAlign: 'center',
      }}
    >

      <div
        style={{
          color: '#67e667',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        Request Created
      </div>

  
    <div
        style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        {requestId}
      </div>

    </div>

  )
}

</div>



     {/* PENDING REQUESTS */}

<div
  style={{
    background: '#151d3b',
    borderRadius: '30px',
    padding: '35px',
    marginTop: '30px',
  }}
>

  <h1>
    Pending Requests
  </h1>

  {
    paymentRequests.length === 0

      ? (

        <p
          style={{
            color: '#aaa',
          }}
        >
          No requests yet
        </p>

      )

      : (

        paymentRequests.map(
          (request) => (

            <div
              key={request.id}
              style={{
                background: '#232b4d',
                padding: '20px',
                borderRadius: '15px',
                marginTop: '15px',
              }}
            >

              <div
                style={{
                  color: '#67e667',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                {request.requestId}
              </div>

              <div
                style={{
                  marginTop: '10px',
                  fontSize: '22px',
                  color: 'white',
                }}
              >
                ${request.amount}
              </div>

              <div
                style={{
                  color: '#aaa',
                  marginTop: '5px',
                }}
              >
                {request.status}
              </div>

            </div>
          )
        )
      )
  }

</div>
      {/* RECENT CONTACTS */}

      <div
  style={{
    background: '#151d3b',
    borderRadius: '30px',
    padding: '35px',
    marginTop: '30px',
  }}
>

  <h1>Incoming Requests</h1>

  {
    incomingRequests.length === 0
      ? (
        <p
          style={{
            color: '#aaa',
          }}
        >
          No incoming requests
        </p>
      )
      : (
        incomingRequests.map(
          (request) => (

            <div
              key={request.id}
              style={{
                background: '#232b4d',
                padding: '20px',
                borderRadius: '15px',
                marginTop: '15px',
              }}
            >

              <div>
                <strong>From:</strong>{' '}
                {request.requesterUsername}
              </div>

              <div>
                <strong>Amount:</strong>{' '}
                ${request.amount}
              </div>

              <div>
                <strong>Message:</strong>{' '}
                {request.message || 'No message'}
              </div>

              <button
                onClick={() =>
                  payRequest(
                    request.requestId
                  )
                }
                style={{
                  marginTop: '15px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#5ecb52',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Pay Request
              </button>
              </div>
          )
        )
      )
  }

</div> 




      <div
        style={{
          background: '#1c2247',
          padding: '20px',
          borderRadius: '20px',
          marginTop: '30px',
        }}
      >

        <h3
          style={{
            color: 'white',
            marginBottom: '15px',
          }}
        >
          Recent Contacts
        </h3>

        {

          contacts.length === 0

          ? (

            <p
              style={{
                color: '#aaa',
              }}
            >
              No contacts yet
            </p>

          )

          : (

            contacts.map((contact) => (

              <div

                key={contact.id}

                onClick={() => {

                  setRecipient(

                    contact.recipientName

                      ? (

                          contact.recipientName.startsWith('@')

                            ? contact.recipientName

                            : `@${contact.recipientName}`
                        )

                      : (

                          contact.recipientEmail ||

                          contact.recipientWallet
                        )
                  );
                }}

                style={{
                  background: '#2a315e',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
              >

                <div
                  style={{
                    color: '#7CFC5B',
                    fontWeight: 'bold',
                  }}
                >
                  {
                    contact.recipientName ||
                    'Enfiance User'
                  }
                </div>

                <div
                  style={{
                    color: '#ccc',
                    fontSize: '14px',
                  }}
                >
                  {
                    contact.recipientEmail
                  }
                </div>

              </div>
            ))
          )
        }

      </div>

      <div
  style={{
    background: '#151d3b',
    borderRadius: '30px',
    padding: '35px',
    marginTop: '40px',
  }}
>

  <h1>
    Transaction Summary
  </h1>

  <div
    style={{
      display: 'flex',
      gap: '25px',
      flexWrap: 'wrap',
      marginTop: '20px',
    }}
  >

    <div>
      <h3>
        Received
      </h3>

      <p
        style={{
          color: '#5ecb52',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        $
        {totalReceived.toFixed(2)}
      </p>
    </div>

    <div>
      <h3>
        Sent
      </h3>

      <p
        style={{
          color: '#ff6666',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        $
        {totalSent.toFixed(2)}
      </p>
    </div>

    <div>
      <h3>
        Net Flow
      </h3>

      <p
        style={{
          color:
            netFlow >= 0
              ? '#5ecb52'
              : '#ff6666',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        $
        {netFlow.toFixed(2)}
      </p>
    </div>

  </div>

</div>


      {/* RECENT ACTIVITY */}

      <div
        id="recent-activity"
        style={{
          background: '#151d3b',
          borderRadius: '30px',
          padding: '35px',
          marginTop: '40px',
        }}
       >
      <h1>Recent Activity</h1>

     {
        history.length === 0
          ? (
            <p style={{ color: '#aaa' }}>
              No transactions yet
            </p>
          )
          : (
            history.map((tx) => (

              <div
                key={tx.id}
                style={{
                background: '#232b4d',
                padding: '15px',
                borderRadius: '15px',
                marginTop: '15px',
              }}
             >

              <div
                style={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {
                tx.sender === walletAddress
                  ? `Sent $${tx.amount}`
                  : `Received $${tx.amount}`
              }
            </div>

            <div
              style={{
                color: '#aaa',
                marginTop: '5px',
              }}
            >
              {
                tx.sender === walletAddress
                  ? `To ${
                      tx.recipient_username
                        ? `@${tx.recipient_username}`
                        : tx.recipient
                   }`
                 : `From ${
                     tx.sender_username
                     ? `@${tx.sender_username}`
                     : tx.sender
                   }`
              }
            </div>

            <div
              style={{
                color: '#777',
                fontSize: '12px',
                marginTop: '5px',
              }}
            >
              {new Date(tx.created_at).toLocaleString()}
            </div>

          </div>

        ))
      )
  }

</div>


      
      {/* STATUS */}

      <div
        style={{
          background: '#151d3b',
          borderRadius: '30px',
          padding: '35px',
          marginTop: '40px',
        }}
      >

        <h2>Account Status</h2>

        <h1
          style={{
            color: '#67e667',
          }}
        >
          Verified & Active
        </h1>

      </div>

    </div>
  );
}

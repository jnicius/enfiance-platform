
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import API from '../services/api';

import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

import { QRCodeCanvas } from 'qrcode.react';


import BalanceHero from '../components/BalanceHero';
import '../styles/dashboard.css';

import AppHeader from '../components/AppHeader';

import SideMenu from '../components/SideMenu';

export default function Dashboard() {

  const { t } = useTranslation();

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
      t('dashboard.validRequestAmount')
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
        t('dashboard.paymentRequestCreated')
      );
 
      setRequestAmount('');
      setRequestRecipient('');
      setRequestNote('');
    }

  } catch (error) {

    console.error(error);

    setRequestMessage(
      t('dashboard.paymentRequestFailed')
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
      t('dashboard.payRequestFailed')
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
        t('dashboard.walletNotFound')
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
          t('dashboard.recipientRequired')
        );

        return;
      }

      if (
        !amount ||
        parseFloat(amount) <= 0
      ) {

        setMessage(
          t('dashboard.invalidAmount')
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
          t('dashboard.submittingTransaction')
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
          t('dashboard.confirmingTransaction')
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
          t('dashboard.transferComplete')
        );

        setMessage(
          t('dashboard.transferSuccessful')
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
          t('dashboard.transferFailed')
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
     {t('dashboard.needAddMoney')}
   </h2>

   <p
     style={{
       color: '#d0d0d0',
       fontSize: '18px',
       marginBottom: '25px',
     }}
    >
     {t('dashboard.fundWalletDescription')}
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
      {t('dashboard.addFunds')}
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
  <h1>{t('dashboard.receiveMoney')}</h1>

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
  {t('dashboard.shareUsername')}
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
    {t('dashboard.accountId')}
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
            t('dashboard.usernameCopied')
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
        {t('dashboard.copyUsername')}
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(
            walletAddress
          );

          setMessage(
            t('dashboard.accountCopied')
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
        {t('dashboard.copyAccount')}
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

        <h1>{t('dashboard.sendMoney')}</h1>

        <input
          type="text"
          placeholder={t('dashboard.recipientPlaceholder')}
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
          placeholder={t('dashboard.amount')}
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
         placeholder={t('dashboard.message')}
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
              ? transferStatus || t('dashboard.processing')
              : t('dashboard.sendMoney')
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
        <h1>{t('dashboard.requestPayment')}</h1>

  <p
   style={{
     color: '#aaa',
     marginTop: '10px',
     marginBottom: '20px',
   }}
 >
  {t('dashboard.requestDescription')}
</p>
  
  <input
    type="text"
    placeholder={t('dashboard.recipientUsernameEmail')}
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
    placeholder={t('dashboard.messageOptional')}
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
  placeholder={t('dashboard.amount')}
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
    {t('dashboard.sendRequest')}
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
        {t('dashboard.requestCreated')}
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
    {t('dashboard.pendingRequests')}
  </h1>

  {
    paymentRequests.length === 0

      ? (

        <p
          style={{
            color: '#aaa',
          }}
        >
          {t('dashboard.noRequestsYet')}
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
                {
                  request.status === 'pending'
                    ? t('dashboard.statusPending')
                    : request.status === 'paid'
                      ? t('dashboard.statusPaid')
                      : request.status
                }
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

  <h1>{t('dashboard.incomingRequests')}</h1>

  {
    incomingRequests.length === 0
      ? (
        <p
          style={{
            color: '#aaa',
          }}
        >
          {t('dashboard.noIncomingRequests')}
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
                <strong>{t('dashboard.from')}:</strong>{' '}
                {request.requesterUsername}
              </div>

              <div>
                <strong>{t('dashboard.amount')}:</strong>{' '}
                ${request.amount}
              </div>

              <div>
                <strong>{t('dashboard.message')}:</strong>{' '}
                {request.message || t('dashboard.noMessage')}
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
                {t('dashboard.payRequest')}
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
          {t('dashboard.recentContacts')}
        </h3>

        {

          contacts.length === 0

          ? (

            <p
              style={{
                color: '#aaa',
              }}
            >
              {t('dashboard.noContactsYet')}
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
                    t('dashboard.enfianceUser')
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
    {t('dashboard.transactionSummary')}
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
      <h3>{t('dashboard.received')}</h3>

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
      <h3>{t('dashboard.sent')}</h3>

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
      <h3>{t('dashboard.netFlow')}</h3>

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
      <h1>{t('dashboard.recentActivity')}</h1>

     {
        history.length === 0
          ? (
            <p style={{ color: '#aaa' }}>
              {t('dashboard.noTransactionsYet')}
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
                  ? t('dashboard.sentAmount', {
                        amount: tx.amount,
                      })
                  : t('dashboard.receivedAmount', {
                        amount: tx.amount,
                      })
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
                    ? t('dashboard.toRecipient', {
                        recipient:
                          tx.recipient_username
                            ? `@${tx.recipient_username}`
                            : tx.recipient,
                      })
                    : t('dashboard.fromSender', {
                        sender:
                          tx.sender_username
                            ? `@${tx.sender_username}`
                            : tx.sender,
                      })
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

        <h2>{t('dashboard.accountStatus')}</h2>

        <h1
          style={{
            color: '#67e667',
          }}
        >
          {t('dashboard.verifiedActive')}
        </h1>

      </div>

    </div>
  );
}

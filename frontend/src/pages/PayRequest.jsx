import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function PayRequest() {

  const { requestId } = useParams();

  const [request, setRequest] =
    useState(null);

  const token =
  localStorage.getItem('token');
  
  const [paying, setPaying] =
    useState(false);

  const [message, setMessage] =
    useState('');


  useEffect(() => {

    loadRequest();

  }, []);

  const loadRequest = async () => {

    try {

      const res =
        await API.get(
          `/request/${requestId}`
        );

      setRequest(
        res.data.request
      );

    } catch (error) {

      console.error(error);
    }
  };


  const payRequest = async () => {

  try {

    setPaying(true);

    // -------------------------
    // SEND REAL USDC
    // -------------------------

    const transfer =
  await API.post(
    '/wallet/send',
    {
      recipient:
        request.requesterWallet,

      amount:
        request.amount,
    }
  );

if (
  !transfer.data ||
  !transfer.data.success
) {
  throw new Error(
    'Blockchain transfer failed'
  );
}

const res =
  await API.post(
    `/request/pay/${requestId}`
  );


    setMessage(
      res.data.message
    );

    await loadRequest();

  } catch (error) {

    console.error(error);

    setMessage(
      error?.response?.data?.message ||
      'Payment failed'
    );

  } finally {

    setPaying(false);
  }
};

  if (!token) {

  return (

    <div
      style={{
        color: 'white',
        padding: '50px',
        textAlign: 'center',
      }}
    >

      <h1>
        Login Required
      </h1>

      <p>
        You must login to pay this request.
      </p>

      <a
        href="/login"
        style={{
          color: '#67e667',
          fontWeight: 'bold',
        }}
      >
        Login
      </a>

    </div>
  );
}


  if (!request) {

    return (
      <div
        style={{
          color: 'white',
          padding: '50px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (

    <div
      style={{
        maxWidth: '600px',
        margin: '100px auto',
        background: '#151d3b',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
      }}
    >

      <h1>
        Payment Request
      </h1>

      <h2>
        ${request.amount}
      </h2>

      <p>
        Request ID:
        {request.requestId}
      </p>

      <p
        style={{
          color:
            request.status === 'paid'
              ? '#67e667'
              : '#ffd166',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Status:
        {' '}
        {request.status}
      </p>



      <button
  onClick={payRequest}
  disabled={
    paying ||
    request.status === 'paid'
  }
  style={{
    background:
      request.status === 'paid'
        ? '#666'
        : '#5ecb52',
    color: 'white',
    padding: '20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%',
  }}
>
  {
    request.status === 'paid'
      ? 'Paid'
      : paying
        ? 'Processing...'
        : 'Pay Now'
  }
</button>


{
  message && (

    <p
      style={{
        marginTop: '20px',
        color:
          message
            .toLowerCase()
            .includes('completed')
              ? '#67e667'
              : '#ff6b6b',
        fontWeight: 'bold',
      }}
    >
      {message}
    </p>

  )
}



    </div>
  );
}

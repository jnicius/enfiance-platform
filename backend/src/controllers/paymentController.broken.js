async function payRequest(req, res) {

try {

```
console.log(
  'PAY REQUEST HIT'
);

console.log(
  'REQUEST ID:',
  req.params.requestId
);

console.log(
  'USER:',
  req.user
);

const payerId =
  req.user.userId;

console.log(
  'REQUEST PAYER:',
  payerId
);

const { requestId } =
  req.params;

const paymentRequest =
  await prisma.paymentRequest.findUnique({

    where: {
      requestId,
    },
  });

console.log(
  'PAYMENT REQUEST:',
  paymentRequest
);

if (!paymentRequest) {

  return res.status(404).json({
    success: false,
    message: 'Request not found',
  });
}

if (
  paymentRequest.status === 'paid'
) {

  return res.status(400).json({
    success: false,
    message: 'Request already paid',
  });
}

await prisma.paymentRequest.update({

  where: {
    requestId,
  },

  data: {
    status: 'paid',
  },
});

console.log(
  'REQUEST UPDATED'
);

return res.json({

  success: true,

  message:
    'Payment completed',
});
```

} catch (error) {

```
console.error(
  'PAY REQUEST ERROR:',
  error
);

return res.status(500).json({

  success: false,

  message:
    'Payment failed',
});
```

}
}
module.exports = {
  sendPayment,
  createPaymentRequest,
  getPaymentRequests,
  payRequest,
};

const prisma = require('../config/database');
const {
  sendEmail,
} = require(
  '../services/emailService'
);

const {
  sendUSDC,
} = require('../services/tokenService');

async function sendPayment(req, res) {
  try {

    return res.json({
      success: true,
      message: 'sendPayment placeholder'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Payment failed'
    });
  }
}

async function createPaymentRequest(
req,
res
) {

try {


const amount =
  Number(req.body.amount);

const recipient =
  req.body.recipient?.trim() || null;

const message =
  req.body.message?.trim() || null;

if (
  isNaN(amount) ||
  amount <= 0
) {

  return res.status(400).json({
    success: false,
    message:
      'Invalid amount',
  });
}

const userId =
  req.user.userId;

const user =
  await prisma.user.findUnique({

    where: {
      id: userId,
    },
  });

if (!user) {

  return res.status(404).json({
    success: false,
    message:
      'User not found',
  });
}

let recipientUser = null;

if (recipient) {

  recipientUser =
    await prisma.user.findFirst({

      where: {

        OR: [

          {
            username:
              recipient.replace('@', ''),
          },

          {
            email:
              recipient,
          },
        ],
      },
    });
}

const requestId =
  `RQ-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;

const paymentRequest =
  await prisma.paymentRequest.create({

    data: {

      requestId,

      requesterId:
        userId,

      requesterUsername:
        user.username,

      recipientId:
        recipientUser?.id || null,

      recipientUsername:
        recipientUser?.username || null,

      recipientEmail:
        recipient &&
        recipient.includes('@')
          ? recipient
          : null,

      amount,

      message,

      status:
        'pending',
    },
  });


if (
  recipientUser?.email
) {

  await sendEmail(

    recipientUser.email,

    'New Payment Request',

    `
      <h2>Payment Request</h2>

      <p>
        @${user.username}
        requested
        $${amount}
        from you.
      </p>

      <p>
        Message:
        ${message || 'None'}
      </p>

      <p>
        Login to Enfiance
        to review the request.
      </p>
    `
  );
}

return res.json({

  success: true,

  request:
    paymentRequest,
});


} catch (error) {


console.error(error);

return res.status(500).json({

  success: false,

  message:
    'Failed to create request',
});


}
}


async function getPaymentRequests(
  req,
  res
) {

  try {

    const userId =
      req.user.userId;

    const requests =
      await prisma.paymentRequest.findMany({

        where: {
          requesterId: userId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return res.json({

      success: true,

      requests,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Failed to load requests',
    });
  }
}


async function getIncomingRequests(
  req,
  res
) {

  try {

    const requests =
      await prisma.paymentRequest.findMany({

        where: {

          recipientId:
            req.user.userId,

          status:
            'pending',
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return res.json({

      success: true,

      requests,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Failed to load incoming requests',
    });
  }
}




async function payRequest(req, res) {

  try {

    console.log(
      'PAY REQUEST HIT'
    );

    const { requestId } =
      req.params;

    const paymentRequest =
      await prisma.paymentRequest.findUnique({
        where: {
          requestId,
        },
      });

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
   
    const payer =
      await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
        include: {
          wallet: true,
        },
      });

    const requester =
      await prisma.user.findUnique({
        where: {
          id: paymentRequest.requesterId,
        },
        include: {
          wallet: true,
        },
      });


if (!payer || !requester) {

  return res.status(404).json({
    success: false,
    message: 'User not found',
  });
}

if (
  payer.balance <
  paymentRequest.amount
) {

  return res.status(400).json({
    success: false,
    message: 'Insufficient balance',
  });
}

await prisma.$transaction([

  prisma.user.update({
    where: {
      id: payer.id,
    },
    data: {
      balance: {
        decrement:
          paymentRequest.amount,
      },
    },
  }),

  prisma.user.update({
    where: {
      id: requester.id,
    },
    data: {
      balance: {
        increment:
          paymentRequest.amount,
      },
    },
  }),

  prisma.paymentRequest.update({
    where: {
      requestId,
    },
    data: {
      status: 'paid',
    },
  }),

]);


if (
  requester.email
) {

  await sendEmail(

    requester.email,

    'Payment Request Paid',

    `
      <h2>Request Paid</h2>

      <p>
        @${payer.username}
        paid your request.
      </p>

      <p>
        Amount:
        $${paymentRequest.amount}
      </p>

      <p>
        Request:
        ${paymentRequest.requestId}
      </p>
    `
  );
}


return res.json({
  success: true,
  message: 'Payment completed',
});



  } catch (error) {

    console.error(
      'PAY REQUEST ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Payment failed',
    });
  }
}


module.exports = {
  sendPayment,
  createPaymentRequest,
  getPaymentRequests,
  getIncomingRequests,
  payRequest,
};

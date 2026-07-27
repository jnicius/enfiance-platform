const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {
payRequest,
getIncomingRequests,
} = require(
'../controllers/paymentController'
);

router.get(
'/incoming',
authMiddleware,
getIncomingRequests
);

router.get('/:requestId', async (req, res) => {

try {

const request =
  await prisma.paymentRequest.findUnique({

    where: {
      requestId: req.params.requestId,
    },

    include: {

      requester: {

        include: {
          wallet: true,
        },
      },
    },
  });

if (!request) {

  return res.status(404).json({
    success: false,
    message: 'Request not found',
  });
}

res.json({
  success: true,

  request: {

    ...request,

    requesterWallet:
      request.requester?.wallet?.address ||
      null,
  },
});

} catch (error) {

console.error(error);

res.status(500).json({
  success: false,
  message: 'Server error',
});

}
});

router.post(
'/pay/:requestId',
authMiddleware,
(req, res, next) => {

console.log(
  'ROUTE HIT:',
  req.params.requestId
);

next();

},
payRequest
);

module.exports = router;

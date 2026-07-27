const express = require('express');

const {
  sendPayment,
  createPaymentRequest,
  getPaymentRequests,
} = require('../controllers/paymentController');


const authMiddleware = require(
  '../middleware/authMiddleware'
);

const router = express.Router();

// -------------------------
// SEND PAYMENT
// -------------------------
router.post(
  '/send',
  authMiddleware,
  sendPayment
);

router.post(
  '/request',
  authMiddleware,
  createPaymentRequest
);

router.get(
  '/requests',
  authMiddleware,
  getPaymentRequests
);

module.exports = router;

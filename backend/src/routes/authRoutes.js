const express = require('express');

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require(
  '../controllers/authController'
);

const router = express.Router();

// -------------------------
// TEST ROUTE
// -------------------------

router.get(
  '/test',
  (req, res) => {

    res.json({
      success: true,
      message:
        'Auth routes working',
    });

  }
);

// -------------------------
// REGISTER
// -------------------------

router.post(
  '/register',
  register
);

// -------------------------
// LOGIN
// -------------------------

router.post(
  '/login',
  login
);

// -------------------------
// FORGOT PASSWORD
// -------------------------

router.post(
  '/forgot-password',
  forgotPassword
);


// -------------------------
// RESET PASSWORD
// -------------------------

router.post(
  '/reset-password/:token',
  resetPassword
);

module.exports = router;

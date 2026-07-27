const express = require("express");

const {
  getStats,
  getUsers,
  getTransactions,
  getPendingRequests,
} = require("../controllers/adminController");

const auth =
  require("../middleware/authMiddleware");

const admin =
  require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/stats",
  auth,
  admin,
  getStats
);

router.get(
  "/users",
  auth,
  admin,
  getUsers
);

router.get(
  "/transactions",
  auth,
  admin,
  getTransactions
);

router.get(
  "/requests",
  auth,
  admin,
  getPendingRequests
);

module.exports = router;

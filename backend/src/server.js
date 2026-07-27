require('dotenv').config();

const requestRoutes =
  require('./routes/requestRoutes');

const historyRoutes = require('./routes/historyRoutes');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const searchRoutes = require('./routes/searchRoutes');

const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require("./routes/adminRoutes");
const app = express();

app.use(
  '/api/search',
  searchRoutes
);

app.use(
  '/api/contacts',
  contactRoutes
);

app.use(
  '/api/request',
  requestRoutes
);

app.use("/api/admin", adminRoutes);

// -------------------------
// CORE MIDDLEWARE
// -------------------------
app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan('dev'));

// -------------------------
// BODY PARSERS
// -------------------------
app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

// -------------------------
// HEALTH CHECK
// -------------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ENFIANCE API RUNNING',
    version: '1.0.0',
  });
});

// -------------------------
// ROUTES
// -------------------------

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/wallet',
  walletRoutes
);

app.use(
  '/api/payments',
  paymentRoutes
);

app.use(
  '/api/history',
  historyRoutes
);

app.use(
  '/api/contacts',
  contactRoutes
);

// -------------------------
// 404
// -------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 ENFIANCE API RUNNING ON PORT ${PORT}`
  );
});

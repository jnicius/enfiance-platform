const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma =
  require('../config/database');

const connection =
  require('../config/solana');

const fs = require('fs');

const {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
  createWallet,
} = require('../services/walletService');

const {
  encrypt,
} = require('../utils/encryption');


const {
  sendResetEmail,
} = require('../utils/emailService');

// -------------------------
// LOAD TREASURY WALLET
// -------------------------

const TREASURY_KEY_PATH =
  process.env.TREASURY_KEY_PATH ||
  '/home/enfigrd/.enfiance-secrets/treasury-wallet.json';

const treasurySecretKey =
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(
        TREASURY_KEY_PATH,
        'utf8'
      )
    )
  );

const treasuryKeypair =
  Keypair.fromSecretKey(
    treasurySecretKey
  );

// -------------------------
// REGISTER
// -------------------------

async function register(
  req,
  res
) {

  try {

    const {
      email,
      password,
      firstName,
      lastName,
    } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message:
          'Email and password required',
      });

    }

    // -------------------------
    // CHECK EXISTING USER
    // -------------------------

    const existingUser =
      await prisma.user.findUnique({

        where: {
          email,
        },
      });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message:
          'User already exists',
      });

    }

    // -------------------------
    // HASH PASSWORD
    // -------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------
    // CREATE WALLET
    // -------------------------

    const wallet =
      createWallet();

    // -------------------------
    // ENCRYPT PRIVATE KEY
    // -------------------------

    const encryptedKey =
      encrypt(
        wallet.secretKey
      );

    // -------------------------
    // CREATE USER
    // -------------------------

    const user =
      await prisma.user.create({

        data: {

          email,

          username:
            email.split('@')[0],

          password:
            hashedPassword,

          firstName,
          lastName,

          wallet: {

            create: {

              address:
                wallet.publicKey,

              encryptedKey,
            },
          },
        },

        include: {
          wallet: true,
        },
      });

    // -------------------------
    // AUTO FUND SOL
    // -------------------------

    const transaction =
      new Transaction().add(

        SystemProgram.transfer({

          fromPubkey:
            treasuryKeypair.publicKey,

          toPubkey:
            new PublicKey(
              user.wallet.address
            ),

          lamports:
            0.01 * 1000000000,
        })

      );

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [treasuryKeypair]
    );

    // -------------------------
    // CREATE JWT
    // -------------------------

    const token = jwt.sign(

      {
        userId: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    );

    return res.status(201).json({

      success: true,

      token,

      user: {

        id: user.id,

        email: user.email,

        firstName:
          user.firstName,

        lastName:
          user.lastName,

        username:
          user.username,

        role:
          user.role,
      },

      wallet: {
        address:
          user.wallet.address,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Registration failed',
    });

  }
}

// -------------------------
// LOGIN
// -------------------------

async function login(
  req,
  res
) {

  try {

    const {
      email,
      password,
    } = req.body;

    // -------------------------
    // FIND USER
    // -------------------------

    const user =
      await prisma.user.findUnique({

        where: {
          email,
        },

        include: {
          wallet: true,
        },
      });

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid credentials',
      });

    }

    // -------------------------
    // CHECK PASSWORD
    // -------------------------

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid credentials',
      });

    }

    // -------------------------
    // CREATE JWT
    // -------------------------

    const token = jwt.sign(

      {
        userId: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    );

    return res.json({

      success: true,

      token,

      user: {

        id: user.id,

        firstName:
          user.firstName,

        lastName:
          user.lastName,

        email:
          user.email,

        username:
          user.username,

        role:
          user.role,
      },

      wallet: {
        address:
          user.wallet.address,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Login failed',
    });

  }
}

// -------------------------
// FORGOT PASSWORD
// -------------------------

const forgotPassword = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    // -------------------------
    // FIND USER
    // -------------------------

    const user =
      await prisma.user.findUnique({

        where: {
          email,
        },
      });

    // -------------------------
    // ALWAYS RETURN SUCCESS
    // -------------------------

    if (!user) {

      return res.json({

        success: true,

        message:
          'If account exists, reset instructions sent',
      });

    }

    // -------------------------
    // GENERATE TOKEN
    // -------------------------

    const resetToken =
      crypto.randomBytes(32)
        .toString('hex');

    // -------------------------
    // EXPIRATION
    // -------------------------

    const resetExpires =
      new Date(
        Date.now() +
        1000 * 60 * 30
      );

    // -------------------------
    // SAVE TOKEN
    // -------------------------

    await prisma.user.update({

      where: {
        email,
      },

      data: {

        passwordResetToken:
          resetToken,

        passwordResetExpires:
          resetExpires,
      },
    });

    // -------------------------
    // SEND EMAIL
    // -------------------------

    await sendResetEmail(
      email,
      resetToken
    );

    // -------------------------
    // DEBUG LOGS
    // -------------------------

    console.log(
      'RESET TOKEN:',
      resetToken
    );

    console.log(
      'RESET EMAIL:',
      email
    );

    console.log(
      'RESET EXPIRES:',
      resetExpires
    );


    return res.json({

      success: true,

      message:
        'If account exists, reset instructions sent',
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Server error',
    });

  }
};

// -------------------------
// RESET PASSWORD
// -------------------------

const resetPassword = async (
  req,
  res
) => {

  try {

    const { token } =
      req.params;

    const { password } =
      req.body;

    // -------------------------
    // FIND USER
    // -------------------------

    const user =
      await prisma.user.findFirst({

        where: {

          passwordResetToken:
            token,

          passwordResetExpires: {

            gt: new Date(),
          },
        },
      });

    // -------------------------
    // INVALID TOKEN
    // -------------------------

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid or expired token',
      });

    }

    // -------------------------
    // HASH PASSWORD
    // -------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------
    // UPDATE USER
    // -------------------------

    await prisma.user.update({

      where: {
        id: user.id,
      },

      data: {

        password:
          hashedPassword,

        passwordResetToken:
          null,

        passwordResetExpires:
          null,
      },
    });

    return res.json({

      success: true,

      message:
        'Password reset successful',
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Server error',
    });

  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

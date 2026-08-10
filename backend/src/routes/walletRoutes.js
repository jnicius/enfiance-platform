const express = require('express');

const authMiddleware =
  require(
    '../middleware/authMiddleware'
  );

const router = express.Router();

const {
  PrismaClient,
} = require('@prisma/client');

const prisma =
  new PrismaClient();

const {
  decrypt,
} = require(
  '../utils/encryption'
);

const {
  sendTransferEmail,
} = require(
  '../utils/emailService'
);

const {
  getSolBalance,
  getUSDCBalance,
  sendUSDC,
} = require(
  '../services/walletService'
);

// -------------------------
// GET BALANCES
// -------------------------

router.get(
  '/balances/:wallet',
  authMiddleware,

  async (req, res) => {

    try {

        const wallet =
          await prisma.wallet.findUnique({
            where: {
              userId: req.user.userId
            }
          });

        if (!wallet) {
          return res.status(404).json({
            success: false,
            message: 'Wallet not found'
          });
        }

        const solBalance =
          await getSolBalance(
            wallet.address
          );

        const usdcBalance =
          await getUSDCBalance(
            wallet.address
          );

        res.json({
          success: true,
          sol: solBalance,
          usdc: usdcBalance
        });


    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to load balances',
      });
    }
  }
);

// -------------------------
// SEND USDC
// -------------------------

router.post(
  '/send',
  authMiddleware,

  async (req, res) => {

    try {

      let {
        recipient,
        amount,
      } = req.body;

      let recipientWallet =
        recipient;

      let recipientUsername =
        null;

      let recipientUser =
        null;

      // -------------------------
      // AUTHENTICATED USER
      // -------------------------

      console.log(
        'REQ USER:',
        req.user
      );

      const senderUser =
        await prisma.user.findUnique({

          where: {
            id: req.user.userId,
          },

          include: {
            wallet: true,
          },
        });

      if (
        !senderUser ||
        !senderUser.wallet
      ) {

        return res.status(404).json({

          success: false,

          message:
            'Sender wallet not found',
        });
      }

      // -------------------------
      // SENDER WALLET
      // -------------------------

      const senderWallet =
        senderUser.wallet.address;

      const senderSecretKey =
        decrypt(
          senderUser
            .wallet
            .encryptedKey
        );

      console.log(
        'AUTH USER:',
        senderUser.username
      );

      console.log(
        'SENDER WALLET:',
        senderWallet
      );

      // -------------------------
      // RESOLVE @USERNAME
      // -------------------------

      if (
        recipient.startsWith('@')
      ) {

        const username =
          recipient
            .replace('@', '')
            .trim()
            .toLowerCase();

        console.log(
          'USERNAME LOOKUP:',
          username
        );

        recipientUser =
          await prisma.user.findFirst({

            where: {

              username: {

                equals: username,

                mode:
                  'insensitive',
              },
            },

            include: {
              wallet: true,
            },
          });

        console.log(
          'USER RESULT:',
          recipientUser
        );

        if (
          !recipientUser ||
          !recipientUser.wallet
        ) {

          return res.status(404).json({

            success: false,

            message:
              'User not found',
          });
        }

        recipientUsername =
          recipientUser.username;

        recipientWallet =
          recipientUser
            .wallet
            .address;
      }

      // -------------------------
      // RESOLVE EMAIL
      // -------------------------

      else if (
        recipient.includes('@')
      ) {

        recipientUser =
          await prisma.user.findUnique({

            where: {
              email: recipient,
            },

            include: {
              wallet: true,
            },
          });

        if (
          !recipientUser ||
          !recipientUser.wallet
        ) {

          return res.status(404).json({

            success: false,

            message:
              'User not found',
          });
        }

        recipientUsername =
          recipientUser.username;

        recipientWallet =
          recipientUser
            .wallet
            .address;
      }

      // -------------------------
      // SEND USDC
      // -------------------------
      
      // -------------------------
      // RESOLVE WALLET ADDRESS
      // -------------------------

      if (!recipientUser) {

        const walletRecord =
          await prisma.wallet.findUnique({

            where: {
              address: recipientWallet
            },

            include: {
              user: true
            }

          });

        if (walletRecord) {

          recipientUser =
            walletRecord.user;

          recipientUsername =
            walletRecord.user.username;

      }

     }



      // -------------------------
      // LIVE SOLANA USDC TRANSFER
      // -------------------------

      amount = Number(amount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount'
        });
      }

      if (
        recipientUser &&
        senderUser.id === recipientUser.id
      ) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send money to yourself'
        });
      }

      const liveBalance =
        await getUSDCBalance(
          senderWallet
        );

      console.log(
        'LIVE USDC BALANCE:',
        liveBalance
      );

      if (liveBalance < amount) {
        return res.status(400).json({
          success: false,
          message:
            'Not enough money to perform this transaction. Please add more funds.'
        });
      }

      console.log(
        'SENDING LIVE USDC:',
        amount,
        senderWallet,
        '→',
        recipientWallet
      );

      const signature =
        await sendUSDC(
          senderSecretKey,
          recipientWallet,
          amount
        );

      console.log(
        'SOLANA SEND RESULT:',
        signature
      );

      // -------------------------
      // SAVE CONTACT
      // -------------------------

      try {

        await prisma.contact.upsert({

          where: {

            ownerId_recipientWallet: {

              ownerId:
                senderUser.id,

              recipientWallet:
                recipientWallet,
            },
          },

          update: {

            recipientName:

              recipientUsername ||

              recipientWallet,
          },

          create: {

            ownerId:
              senderUser.id,

            recipientId:
              recipientUser?.id ||
              null,

            recipientName:

              recipientUsername ||

              recipientWallet,

            recipientEmail:

              recipientUser?.email ||

              null,

            recipientWallet:
              recipientWallet,
          },
        });

        console.log(
          '✅ Contact saved'
        );

      } catch (contactError) {

        console.log(
          'CONTACT SAVE ERROR:',
          contactError
        );
      }

      // -------------------------
      // SAVE TRANSACTION
      // -------------------------

      await prisma.transactionHistory.create({

        data: {

          sender:
            senderWallet,

           sender_username:
             senderUser.username,

          recipient:

            recipientUsername ||

            recipientWallet,

          recipient_username:

            recipientUsername ||

            null,

          recipient_wallet:
            recipientWallet,

          amount:
            parseFloat(amount),

          signature:
            signature,

          status:
            'completed',
        },
      });


      // -------------------------
      // SEND EMAILS
      // -------------------------

      try {

        await sendTransferEmail(

          senderUser.email,

          'send',

          amount,

          recipientUser?.username

            ? '@' +
              recipientUser.username

            : recipientUser?.email ||
              recipientWallet
        );

        if (recipientUser) {

          await sendTransferEmail(

            recipientUser.email,

            'receive',

            amount,

            senderUser.username

              ? '@' +
                senderUser.username

              : senderUser.email
          );
        }

      } catch (emailError) {

        console.error(
          'Transfer email error:',
          emailError
        );
      }

      // -------------------------
      // SUCCESS RESPONSE
      // -------------------------

      res.json({

        success: true,

        signature,
      });

    } catch (error) {

      console.error(error);

      // -------------------------
      // INSUFFICIENT FUNDS
      // -------------------------

      if (

        error.message &&

        (

          error.message.includes(
            'insufficient'
          ) ||

          error.message.includes(
            'Attempt to debit'
          )
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Not enough money to perform this transaction. Please add more funds.',
        });
      }

      // -------------------------
      // GENERIC ERROR
      // -------------------------

      return res.status(500).json({

        success: false,

        message:
          'Transfer failed',
      });
    }
  }
);

// -------------------------
// TRANSACTION HISTORY
// -------------------------

router.get(
  '/history',

  authMiddleware,

  async (req, res) => {

    try {

      // -------------------------
      // GET USER
      // -------------------------

      const user =
        await prisma.user.findUnique({

          where: {
            id: req.user.userId,
          },

          include: {
            wallet: true,
          },
        });

      if (!user?.wallet) {

        return res.status(404).json({

          success: false,

          message:
            'Wallet not found',
        });
      }

      // -------------------------
      // GET USER HISTORY ONLY
      // -------------------------

      const history =
        await prisma.transactionHistory.findMany({

          where: {

            OR: [

              {
                sender:
                  user.wallet.address,
              },

              {
                recipient_wallet:
                  user.wallet.address,
              },
            ],
          },

          orderBy: {
            created_at: 'desc',
          },

          take: 20,
        });

      res.json({

        success: true,

        history,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to load history',
      });
    }
  }
);

// -------------------------
// GET RECENT CONTACTS
// -------------------------

router.get(

  '/contacts',

  authMiddleware,

  async (req, res) => {

    try {

      // -------------------------
      // GET USER
      // -------------------------

      const user =
        await prisma.user.findUnique({

          where: {
            id: req.user.userId,
          },
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            'User not found',
        });
      }

      // -------------------------
      // GET CONTACTS
      // -------------------------

      const contacts =
        await prisma.contact.findMany({

          where: {
            ownerId: user.id,
          },

          orderBy: {
            createdAt: 'desc',
          },

          take: 10,
        });

      res.json({

        success: true,

        contacts,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to load contacts',
      });
    }
  }
);

module.exports = router;

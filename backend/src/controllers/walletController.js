const prisma = require('../config/database');

const connection = require('../config/solana');

const {
  getUSDCBalance,
} = require('../services/tokenService');


const {
  PublicKey,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');

const {
  getAssociatedTokenAddress,
} = require('@solana/spl-token');

async function getWallet(req, res) {
  try {
    const userId = req.user.userId;

    // -------------------------
    // GET USER + WALLET
    // -------------------------
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        include: {
          wallet: true,
        },
      });

    if (!user || !user.wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    // -------------------------
    // WALLET PUBLIC KEY
    // -------------------------
    const publicKey = new PublicKey(
      user.wallet.address
    );

    // -------------------------
    // SOL BALANCE
    // -------------------------
    const balance =
      await connection.getBalance(
        publicKey
      );

    const solBalance =
      balance / LAMPORTS_PER_SOL;

    // -------------------------
    // USDC TOKEN ACCOUNT
    // -------------------------
    const usdcMint = new PublicKey(
      process.env.USDC_MINT
    );

    const tokenAccount =
      await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

    // -------------------------
    // FETCH TOKEN BALANCE
    // -------------------------
    let usdcBalance = 0;

    try {
      const tokenBalance =
        await connection.getTokenAccountBalance(
          tokenAccount
        );

      usdcBalance =
        tokenBalance.value.uiAmount || 0;
    } catch (error) {
      usdcBalance = 0;
    }

    return res.json({
      success: true,

      wallet: {
        address: user.wallet.address,

        solBalance,

        usdcBalance,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
    });
  }
}
const getBalance = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const wallet =
      await prisma.wallet.findUnique({
        where: {
          userId,
        },
      });

    if (!wallet) {

      return res.status(404).json({
        success: false,
        message:
          'Wallet not found',
      });

    }

    const user =
      await prisma.user.findUnique({
        where: {
        id: userId
      }
    });

    const balance =
      user.balance || 0;


    return res.json({
      success: true,
      wallet: wallet.address,
      balance,
    });

  } catch (err) {

    console.error(
      'Balance error:',
      err
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch balance',
    });

  }
};
module.exports = {
  getWallet,
  getBalance,
};

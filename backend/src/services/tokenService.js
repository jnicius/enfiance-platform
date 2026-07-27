const bs58 = require('bs58').default;
const {
  decrypt,
} = require('../utils/encryption');

const connection = require('../config/solana');

const prisma =
  require('../config/database');

const {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

// -------------------------
// SEND USER USDC
// -------------------------
async function sendUSDC(
  senderUserId,
  recipientAddress,
  amount
) {

  try {

    // -------------------------
    // LOAD SENDER WALLET
    // -------------------------
    const wallet =
      await prisma.wallet.findUnique({
        where: {
          userId: senderUserId,
        },
      });

    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    // -------------------------
    // REBUILD KEYPAIR
    // -------------------------
    const decryptedKey =
      decrypt(wallet.encryptedKey);

    const senderKeypair =
      Keypair.fromSecretKey(
        bs58.decode(
          decryptedKey
        )
      );

    // -------------------------
    // TOKEN MINT
    // -------------------------
    const mint =
      new PublicKey(
        process.env.USDC_MINT
      );

    // -------------------------
    // RECIPIENT
    // -------------------------
    const recipientPublicKey =
      new PublicKey(
        recipientAddress
      );

    // -------------------------
    // SENDER TOKEN ACCOUNT
    // -------------------------
    const senderTokenAccount =
      await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        mint,
        senderKeypair.publicKey
      );

    // -------------------------
    // RECIPIENT TOKEN ACCOUNT
    // -------------------------
    const recipientTokenAccount =
      await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        mint,
        recipientPublicKey
      );

    // -------------------------
    // CREATE TX
    // -------------------------
    const transaction =
      new Transaction().add(

        createTransferInstruction(
          senderTokenAccount.address,

          recipientTokenAccount.address,

          senderKeypair.publicKey,

          Number(amount) * 1000000,

          [],

          TOKEN_PROGRAM_ID
        )
      );

    // -------------------------
    // SEND TX
    // -------------------------
    const signature =
      await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
      );

    return {
      success: true,
      signature,
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error,
    };
  }
}

module.exports = {
  sendUSDC,
};

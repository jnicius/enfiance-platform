const {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');

const {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

const bs58 = require('bs58').default;

// -------------------------
// SOLANA CONNECTION
// -------------------------

const connection =
  new Connection(
    process.env.SOLANA_RPC
  );

// -------------------------
// USDC MINT
// -------------------------

const USDC_MINT =
  new PublicKey(
    process.env.USDC_MINT
  );

// -------------------------
// SOL BALANCE
// -------------------------

async function getSolBalance(
  walletAddress
) {

  try {

    const publicKey =
      new PublicKey(walletAddress);

    const balance =
      await connection.getBalance(
        publicKey
      );

    return (
      balance / LAMPORTS_PER_SOL
    );

  } catch (error) {

    console.error(
      'SOL balance error:',
      error.message
    );

    return 0;
  }
}

// -------------------------
// USDC BALANCE
// -------------------------

async function getUSDCBalance(
  walletAddress
) {

  try {

    const owner =
      new PublicKey(walletAddress);

    const tokenAccount =
      await getAssociatedTokenAddress(
        USDC_MINT,
        owner
      );

    const accountInfo =
      await connection.getParsedAccountInfo(
        tokenAccount
      );

    if (!accountInfo.value) {
      return 0;
    }

    const balance =
      await connection.getTokenAccountBalance(
        tokenAccount
      );

    return (
      balance.value.uiAmount || 0
    );

  } catch (error) {

    console.error(
      'USDC balance error:',
      error.message
    );

    return 0;
  }
}

// -------------------------
// SEND USDC
// -------------------------

async function sendUSDC(
  senderSecretKey,
  recipientWallet,
  amount
) {

  try {

    // -------------------------
    // SENDER KEYPAIR
    // -------------------------

    const sender =
      Keypair.fromSecretKey(
        bs58.decode(
          senderSecretKey
        )
      );

    console.log(
      'SENDER KEYPAIR OK'
    );

    console.log(
      'SENDER WALLET:',
      sender.publicKey.toString()
    );

    // -------------------------
    // RECIPIENT
    // -------------------------

    const recipient =
      new PublicKey(
        recipientWallet
      );

    // -------------------------
    // TOKEN ACCOUNTS
    // -------------------------

    const senderTokenAccount =
      await getAssociatedTokenAddress(
        USDC_MINT,
        sender.publicKey
      );
      console.log(
        'SENDER TOKEN ACCOUNT:',
        senderTokenAccount.toString()
      );
    const recipientTokenAccount =
      await getAssociatedTokenAddress(
        USDC_MINT,
        recipient
      );
    console.log(
      'RECIPIENT TOKEN ACCOUNT:',
      recipientTokenAccount.toString()
    );
    const transaction =
      new Transaction();

    // -------------------------
    // CREATE RECIPIENT ATA
    // -------------------------

    const recipientAccountInfo =
      await connection.getAccountInfo(
        recipientTokenAccount
      );
    console.log(
      'RECIPIENT ACCOUNT EXISTS:',
      !!recipientAccountInfo
    );
    if (!recipientAccountInfo) {

      transaction.add(

        createAssociatedTokenAccountInstruction(
          sender.publicKey,
          recipientTokenAccount,
          recipient,
          USDC_MINT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )

      );
    }

    // -------------------------
    // TRANSFER USDC
    // -------------------------

    transaction.add(

      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        sender.publicKey,
        amount * 1000000
      )

    );

    // -------------------------
    // SEND TRANSACTION
    // -------------------------
    console.log(
      'SENDING TRANSACTION...'
    );
    const signature =
      await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
      );
    console.log(
      'TX SIGNATURE:',
      signature
    );
    return signature;

  } catch (error) {

    console.error(
      'USDC transfer error:',
      error
    );

    throw error;
  }
}

// -------------------------
// CREATE WALLET
// -------------------------

function createWallet() {

  const wallet =
    Keypair.generate();

  return {

    publicKey:
      wallet.publicKey.toString(),

    secretKey:
      bs58.encode(
        wallet.secretKey
      ),
  };
}

module.exports = {
  createWallet,
  getSolBalance,
  getUSDCBalance,
  sendUSDC,
};

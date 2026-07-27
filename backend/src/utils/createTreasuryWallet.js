const fs = require('fs');

const {
  Keypair,
} = require('@solana/web3.js');

const bs58 = require('bs58').default;

// -------------------------
// CREATE WALLET
// -------------------------
const keypair = Keypair.generate();

const wallet = {
  publicKey: keypair.publicKey.toString(),

  secretKey: bs58.encode(
    Buffer.from(keypair.secretKey)
  ),
};

// -------------------------
// SAVE WALLET
// -------------------------
fs.writeFileSync(
  './treasury/master-wallet.json',
  JSON.stringify(wallet, null, 2)
);

console.log('✅ TREASURY WALLET CREATED');

console.log(wallet);

const { SigningStargateClient, GasPrice, StargateClient } = require('@cosmjs/stargate');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');

async function sendSei(mnemonic, receiver, coin_amount) {
  const rpcEndpoint = "https://rpc.sei-apis.com/"; // Replace with the actual RPC endpoint.
  const sanitizedMnemonic = mnemonic.trim().replace(/\s+/g, ' ');
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    sanitizedMnemonic,
    { prefix: "sei" }
  );

  const [firstAccount] = await wallet.getAccounts();
  console.log("Account address:", firstAccount.address);
  
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
    gasPrice: GasPrice.fromString("0.025usei")
  });
  const recipientAddress = receiver; // Replace with the recipient's address.
  const amount = [
    {
      denom: "usei", // Replace with the correct denom.
      amount: coin_amount, // Amount to transfer in micro units.
    },
  ];
  const result = await client.sendTokens(firstAccount.address, recipientAddress, amount, "auto");
//   assertIsBroadcastTxSuccess(result);
  console.log("result: ", result);
  return result;
}

async function getBalance(address) {
  const rpcEndpoint = "https://rpc.sei-apis.com/"; 
  
  const client = await StargateClient.connect(rpcEndpoint);
  let coins = await client.getBalance(address, "usei");
  return coins;
}

async function createWallet() {
  // Generate a new HD wallet with a 24-word mnemonic
  const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "sei" });
  
  // Get the mnemonic
  const mnemonic = wallet.mnemonic;

  // Get the first account in the wallet
  const accounts = await wallet.getAccounts();

  return { ...accounts[0], mnemonic };
}

async function recorverWallet(mnemonic) {
  
  const hdPath = "m/44'/118'/0'/0/0";
  const sanitizedMnemonic = mnemonic.trim().replace(/\s+/g, ' ');
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    sanitizedMnemonic,
    {
      prefix: "sei",
    }
  );
  
  let account = await wallet.getAccounts();
  return { ...account[0], mnemonic };
}

// Exporting all the functions
module.exports = {
  sendSei,
  getBalance,
  createWallet,
  recorverWallet
};

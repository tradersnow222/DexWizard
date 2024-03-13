const {Web3} = require('web3');
const QRCode = require('qrcode');
const fs = require('fs');
const yaml = require('js-yaml');

// Load connection configuration
let connection;
try {
  let fileContents = fs.readFileSync('connection.yaml', 'utf8');
  connection = yaml.load(fileContents);
} catch (e) {
  console.log(e);
}

const API_TOKEN = connection['infura']['API_TOKEN'];
const infura_url = "https://arbitrum-mainnet.infura.io/v3/00bc1cf200ec4defbdae9922c91d34e3";
const web3 = new Web3("https://arbitrum-mainnet.infura.io/v3/00bc1cf200ec4defbdae9922c91d34e3");

function generateAddress() {
  const account = web3.eth.accounts.create();
  return { privateKey: account.privateKey, address: account.address };
}

function checkAddress(address) {
  return web3.utils.isAddress(address) && web3.utils.checkAddressChecksum(address);
}

async function changeWallet(chatId, privateKey, address) {
    const db = getDB(); // Fetches MongoDB connection
    try {
      const usersCollection = db.collection('users');
      await usersCollection.updateOne(
        { chatId },
        { $set: { privateKey, address } },
        { upsert: true }
      );
      console.log('Wallet updated successfully');
    } catch (e) {
      console.error('Failed to update wallet', e);
    }
  }

async function getAddressQR(chatId) {
  // Fetch the user's address.
  // Assuming address retrieval is done, generates QR code:
  const address = "userAddressHere"; // Placeholder for actual address retrieval
  try {
    const qrStream = new QRCode.toFileStream(fs.createWriteStream('addressQR.png'), address, {
      color: {
        dark: '#000', // QR code dots
        light: '#FFF', // Background
      },
    });
    return qrStream;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAddressKey(chatId) {
  // Placeholder for database interaction
}

async function getFee(tx) {
  const gasPrice = await web3.eth.getGasPrice();
  const maxPriorityFeePerGas = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(1.5));
  const latestBlock = await web3.eth.getBlock('latest');
  const feePerGas = latestBlock.baseFeePerGas;
 //blockchain.js
  const estimateGas = await web3.eth.estimateGas(tx);
  return { maxPriorityFeePerGas, feePerGas, estimateGas };
}

async function getETHBalance(chatId) {
  // Placeholder for fetching address from your database
  const address = "userAddressHere"; // Adjust based on actual implementation
  const balanceWei = await web3.eth.getBalance(address);
  const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
  return balanceEth;
}

async function sendTransaction(userAddress, toAddress, value, privateKey, data = '') {
  const nonce = await web3.eth.getTransactionCount(userAddress);
  const { maxPriorityFeePerGas, feePerGas, estimateGas } = await getFee({ from: userAddress, to: toAddress });

  const tx = {
    from: userAddress,
    to: toAddress,
    value: web3.utils.toWei(value.toString(), 'ether'),
    gas: estimateGas,
    maxPriorityFeePerGas,
    maxFeePerGas: feePerGas,
    nonce,
    data,
    chainId: 42161 // Arbitrum Mainnet
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const txnReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txnReceipt.transactionHash;
}

async function getTokenInfo(contractAddress) {
  // ABI and contract interaction logic here, similar to Python's implementation.
}

async function getTokenBalance(contractAddress, accountAddress) {
  // Similar to getTokenInfo, implement contract interaction based on ABI for balanceOf.
}

module.exports = {
  generateAddress,
  checkAddress,
  changeWallet,
  getAddressQR,
  getAddressKey,
  getFee,
  getETHBalance,
  sendTransaction,
  getTokenInfo,
  getTokenBalance
};

// Note: For `getTokenInfo` and `getTokenBalance`, ensure to properly configure and use the ABI for the token contract interactions. 
// The details of ABI handling and contract interaction are omitted for brevity but follow a similar pattern to `sendTransaction`.

// Further database and API interaction logic would need to be adapted based on your specific JavaScript backend setup.

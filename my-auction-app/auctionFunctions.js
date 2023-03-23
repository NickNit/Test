import Web3 from 'web3';
import auctionContractABI from '../contracts/auctionContractABI.json';

const web3 = new Web3('https://eth.sepolia.io/');

const contractAddress = '0x2651a2db60562bb4a5122ce4d902988f62d54178';
const auctionContract = new web3.eth.Contract(auctionContractABI, contractAddress);

export async function getActiveAuctions() {
  const activeAuctions = await auctionContract.methods.getActiveAuctions().call();
  return activeAuctions;
}

export async function getAuctionDetails(auctionId) {
  const auctionDetails = await auctionContract.methods.getAuctionDetails(auctionId).call();
  return auctionDetails;
}

export async function placeBid(auctionId, bidAmount, privateKey) {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const encodedABI = auctionContract.methods.placeBid(auctionId).encodeABI();
  const txCount = await web3.eth.getTransactionCount(account);
  const txObject = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
    to: contractAddress,
    data: encodedABI,
    value: web3.utils.toHex(bidAmount)
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txReceipt;
}

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { auctionContractAddress, auctionContractAbi } from '../constants/auctionContract';

function BiddingForm() {
  const [bidAmount, setBidAmount] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleAuctionIdChange = (event) => {
    setAuctionId(event.target.value);
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };
}

return (
  <form>
    <label htmlFor="bid-amount">Bid amount:</label>
    <input type="text" id="bid-amount" value={bidAmount} onChange={handleBidAmountChange} />

    <label htmlFor="auction-id">Auction ID:</label>
    <input type="text" id="auction-id" value={auctionId} onChange={handleAuctionIdChange} />

    <label htmlFor="private-key">Private key:</label>
    <input type="password" id="private-key" value={privateKey} onChange={handlePrivateKeyChange} />

    <button type="submit">Place Bid</button>
  </form>
);

const handleSubmit = async (event) => {
  event.preventDefault();

  const provider = new ethers.providers.JsonRpcProvider('https://eth.sepolia.io/');
  const signer = new ethers.Wallet(privateKey, provider);
  const auctionContract = new ethers.Contract(auctionContractAddress, auctionContractAbi, signer);

  const bidAmountWei = ethers.utils.parseEther(bidAmount);

  try {
    const tx = await auctionContract.placeBid(auctionId, bidAmountWei);
    console.log('Transaction hash:', tx.hash);
    console.log('Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log('Transaction confirmed!');
    console.log('Block number:', receipt.blockNumber);
  } catch (error) {
    console.error(error);
  }
};

return (
  <form onSubmit={handleSubmit}>
    ...
  </form>
);

export default BiddingForm;


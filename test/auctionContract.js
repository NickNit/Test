import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import auctionContractABI from '../auctionContractABI.json';

const web3 = new Web3('https://eth.sepolia.io/'); // Replace with the endpoint of the Sepolia testnet
const contractAddress = '0x2651a2db60562bb4a5122ce4d902988f62d54178';
const auctionContract = new web3.eth.Contract(auctionContractABI, contractAddress);

function Auctions() {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [bids, setBids] = useState({});
  const [loading, setLoading] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const auctions = await auctionContract.methods.getAuctions().call();
        setActiveAuctions(auctions);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  async function placeBid(auctionId, bidAmount) {
    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tx = await auctionContract.methods.placeBid(auctionId).send({
        from: accounts[0],
        value: web3.utils.toWei(bidAmount, 'ether')
      });
      setTransactionStatus(tx.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setTransactionStatus(null);
      setLoading(false);
    }
  }

  async function approveERC20Token() {
    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tx = await auctionContract.methods.approveToken().send({
        from: accounts[0]
      });
      setTransactionStatus(tx.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setTransactionStatus(null);
      setLoading(false);
    }
  }

  async function createAuction(minimumPrice) {
    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tx = await auctionContract.methods.createAuction(minimumPrice).send({
        from: accounts[0]
      });
      setTransactionStatus(tx.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setTransactionStatus(null);
      setLoading(false);
    }
  }

  async function approveBid(auctionId) {
    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tx = await auctionContract.methods.approveBid(auctionId).send({
        from: accounts[0]
      });
      setTransactionStatus(tx.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setTransactionStatus(null);
      setLoading(false);
    }
  }

  async function settleTransaction(auctionId, bidderAddress, ownerAddress, bidderSignature, ownerSignature) {
    try {
      setLoading(true);
      const tx = await auctionContract.methods.settleTransaction(
        auctionId,
        bidderAddress,
        ownerAddress,
        bidderSignature,
        ownerSignature
      ).send();
      setTransactionStatus(tx.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setTransactionStatus(null);
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <

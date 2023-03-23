import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Create a new instance of the Ethereum provider and contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    // Call the smart contract to get the list of auctions
    const getAuctions = async () => {
      const auctionCount = await contract.getAuctionCount();
      const auctions = [];

      for (let i = 0; i < auctionCount; i++) {
        const auction = await contract.getAuction(i);
        auctions.push(auction);
      }

      setAuctions(auctions);
    };

    getAuctions();
  }, []);

  const handleAuctionSelect = (auction) => {
    setSelectedAuction(auction);
    setCurrentBid(auction.currentBid.toNumber());
  };

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleBidSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      // Create a new instance of the Ethereum provider and contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Call the smart contract to place a bid
      const tx = await contract.placeBid(selectedAuction.id, { value: ethers.utils.parseEther(bidAmount) });
      await tx.wait();

      // Refresh the list of auctions
      const updatedAuctions = await contract.getAuctions();
      setAuctions(updatedAuctions);
      setSelectedAuction(null);
      setCurrentBid(0);
      setBidAmount(0);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Auction App</h1>

      <h2>Auctions</h2>
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id}>
            <button onClick={() => handleAuctionSelect(auction)}>
              {auction.name} ({ethers.utils.formatEther(auction.currentBid)} ETH)
            </button>
          </li>
        ))}
      </ul>

      {selectedAuction && (
        <div>
          <h2>{selectedAuction.name}</h2>
          <p>Current Bid: {ethers.utils.formatEther(currentBid)} ETH</p>
          <form onSubmit={handleBidSubmit}>
            <label>
              Bid Amount:
              <input type="number" value={bidAmount} onChange={handleBidChange} />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Place Bid'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import auctionContract from '../path/to/auctionContract.js';

import React, { useState, useEffect } from 'react';
import auctionContract from '../path/to/auctionContract.js';

function Auctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    auctionContract.methods.getAuctions().call()
      .then(auctions => setAuctions(auctions))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>List of active auctions:</h1>
      <ul>
        {auctions.map(auction => (
          <li key={auction.id}>
            <p>Auction ID: {auction.id}</p>
            <p>Current highest bid: {auction.highestBid}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Auctions;

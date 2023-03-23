const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Sample NFT data
const nfts = [
  { id: 1, name: 'NFT 1' },
  { id: 2, name: 'NFT 2' },
  { id: 3, name: 'NFT 3' },
];

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello NFT World!');
});

app.get('/api/myroute', (req, res) => {
  res.send('This is my custom route!');
});

app.post('/api/create-nft', (req, res) => {
  // Get the NFT data from the request body
  const nftData = req.body;

  // Do something with the NFT data, e.g. save it to a database

  // Send a response
  res.send('New NFT created successfully!');
});

// Get all NFTs
app.get('/api/nfts', (req, res) => {
  res.json(nfts);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

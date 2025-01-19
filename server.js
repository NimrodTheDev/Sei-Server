import express from 'express';
import {
  sendSei,
  getBalance,
  createWallet,
  recorverWallet,
} from './send'; // Replace with the correct file path
import cors from 'cors';
const app = express();
const port = 4000;

app.use(cors())
// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to send Sei tokens
app.post('/sendSei', async (req, res) => {
  const { mnemonic, receiver, coin_amount } = req.body;
  try {
    const result = await sendSei(mnemonic, receiver, coin_amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get balance
app.get('/getBalance/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const result = await getBalance(address);
    res.status(200).json({ balance: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a wallet
app.post('/createWallet', async (req, res) => {
  try {
    const result = await createWallet();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Endpoint to recover a wallet
app.post('/recoverWallet', async (req, res) => {
  const { mnemonic } = req.body;
  try {
    console.log(mnemonic)
    const result = await recorverWallet(String(mnemonic));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});

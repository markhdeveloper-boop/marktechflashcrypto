require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   WALLET STATE
========================= */
let wallet = {
  BTC: 20,
  USDT: 50000000,
  ETH: 10000,
  TRX: 10000
};

/* =========================
   TRANSACTIONS
========================= */
let transactions = [];

/* =========================
   YOUR TRX DEPOSIT ADDRESS
========================= */
const TRX_ADDRESS = "TQFx2LdL7XGfJNnbdCGZrixt5c8J4zKEdD";

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
  res.send("MarkTech Exchange Running 🚀");
});

/* =========================
   BALANCE
========================= */
app.get("/balance", (req, res) => {
  res.json(wallet);
});

/* =========================
   DEPOSIT ADDRESS (QR SOURCE)
========================= */
app.get("/deposit-address", (req, res) => {
  res.json({
    coin: "TRX",
    network: "TRC20",
    address: TRX_ADDRESS
  });
});

/* =========================
   SEND
========================= */
app.post("/send", (req, res) => {
  const { coin, amount, address, network } = req.body;

  if (!wallet[coin] || wallet[coin] < amount) {
    return res.json({ success: false, message: "Insufficient balance" });
  }

  wallet[coin] -= Number(amount);

  const tx = {
    id: Date.now(),
    coin,
    amount,
    address,
    network,
    status: "processing"
  };

  transactions.push(tx);

  setTimeout(() => {
    tx.status = "completed";
  }, 2000);

  res.json({ success: true, tx });
});

/* =========================
   TRANSACTIONS
========================= */
app.get("/transactions", (req, res) => {
  res.json([...transactions].reverse());
});

/* =========================
   FRONTEND
========================= */
app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("Exchange running on http://localhost:5000");
});
// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 SET YOUR EMAIL HERE
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "markhdeveloper@gmail.com",
    pass: "cgel kyju qpws iial" // NOT your normal password
  }
});

// 👉 SEND EMAIL ROUTE
app.post("/send-email", async (req, res) => {
  try {
    const { email, amount, coin } = req.body;

    await transporter.sendMail({
      from: "MarkTech FlashWallet",
      to: email,
      subject: "Transaction Notification",
      text: `You have successfully sent ${amount} ${coin}`
    });

    res.send("Email sent");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending email");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
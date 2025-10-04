// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [btcGold, setBtcGold] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setBtcGold(data);
    }
    fetchPrices();
  }, []);

  if (!btcGold) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>💰 Bitcoin in Gold (BTC/XAU)</h1>
      <p>1 BTC = {btcGold.btcInGold.toFixed(4)} oz of Gold</p>
      <p>BTC (USD): ${btcGold.btcUsd}</p>
      <p>Gold (USD/oz): ${btcGold.goldUsd}</p>
      <p style={{ color: "gray", fontSize: "0.9em" }}>
        Last updated: {new Date(btcGold.timestamp).toLocaleString()}
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Home() {
  const [btcUsd, setBtcUsd] = useState(null);
  const [goldUsd, setGoldUsd] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      const btcRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      const goldRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd");
      const btcData = await btcRes.json();
      const goldData = await goldRes.json();

      setBtcUsd(btcData.bitcoin.usd);
      setGoldUsd(goldData.gold.usd);
    }
    fetchPrices();
  }, []);

  if (!btcUsd || !goldUsd) return <p>Loading...</p>;

  const ratio = (btcUsd / goldUsd).toFixed(2);

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>💰 Bitcoin / Gold Ratio</h1>
      <p>1 BTC = {ratio} oz Gold</p>
      <p>BTC: ${btcUsd.toLocaleString()}</p>
      <p>Gold: ${goldUsd.toLocaleString()} / oz</p>
    </div>
  );
}

// pages/api/prices.js
export default async function handler(req, res) {
  try {
    const [btcData, goldData] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then(r => r.json()),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd").then(r => r.json()),
    ]);

    const btcUsd = btcData.bitcoin.usd;
    const goldUsd = goldData.gold.usd;
    const btcInGold = btcUsd / goldUsd;

    res.status(200).json({
      btcUsd,
      goldUsd,
      btcInGold,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
}

// pages/api/prices.js
import { getBTCPriceUSD, getGoldPriceUSDPerOunce } from "../../lib/fetchPrices";

let CACHE = { ts: 0, data: null };
const TTL = 30 * 1000; // 30秒キャッシュ（API制限回避用）

export default async function handler(req, res) {
  try {
    if (Date.now() - CACHE.ts < TTL && CACHE.data) {
      return res.status(200).json({ fromCache: true, ...CACHE.data });
    }

    const [btcUsd, goldUsdPerOunce] = await Promise.all([
      getBTCPriceUSD(),
      getGoldPriceUSDPerOunce()
    ]);

    if (btcUsd == null) return res.status(500).json({ error: "btc price unavailable" });
    if (goldUsdPerOunce == null) return res.status(500).json({ error: "gold price unavailable; set METALS_API_KEY or GOLDAPI_KEY" });

    const btcInGoldOunce = btcUsd / goldUsdPerOunce;
    const goldOuncePerBtc = 1 / btcInGoldOunce;

    const payload = {
      btcUsd,
      goldUsdPerOunce,
      btcInGoldOunce,
      goldOuncePerBtc,
      timestamp: new Date().toISOString()
    };

    CACHE = { ts: Date.now(), data: payload };
    return res.status(200).json({ fromCache: false, ...payload });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal error", detail: e.message });
  }
}

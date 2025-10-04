// lib/fetchPrices.js
// Node fetch を使う場合は node-fetch を import してください。
// Next.js ではサーバー環境で global fetch が使えることが多いです。

export async function getBTCPriceUSD() {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
  const r = await fetch(url);
  const j = await r.json();
  // j.bitcoin.usd
  return j?.bitcoin?.usd ?? null;
}

/*
  Gold price fetcher: supports Metals-API (query param) or GoldAPI (header),
  determined by environment variables:
    - process.env.METALS_API_KEY  -> Metals-API (query param)
    - process.env.GOLDAPI_KEY    -> GoldAPI (header x-access-token)
*/
export async function getGoldPriceUSDPerOunce() {
  // 1) Metals-API (preferred if key present)
  if (process.env.METALS_API_KEY) {
    const key = process.env.METALS_API_KEY;
    // Metals-API docs: https://metals-api.com/documentation
    const url = `https://metals-api.com/api/latest?access_key=${key}&base=USD&symbols=XAU`;
    const r = await fetch(url);
    const j = await r.json();
    // Metals-API typically returns rates object like { rates: { XAU: 0.0005 } } depending on base.
    // You must inspect the returned JSON for exact field. Assume j.rates.XAU is price of XAU in base currency.
    // If j.rates.XAU is present and base is USD, then priceUSDPerOunce = 1 / j.rates.XAU ? or direct?
    // **Check provider docs**. For safety, attempt common patterns:
    if (j && j.rates && typeof j.rates.XAU === "number") {
      // Metals-API often gives conversion rate in terms of 1 USD = XAU, so convert:
      // If j.rates.XAU is XAU per 1 USD, then priceUSDPerOunce = 1 / j.rates.XAU
      const rate = j.rates.XAU;
      if (rate === 0) return null;
      return 1 / rate;
    }
    // fallback
  }

  // 2) GoldAPI (header based)
  if (process.env.GOLDAPI_KEY) {
    const key = process.env.GOLDAPI_KEY;
    const url = "https://www.goldapi.io/api/XAU/USD";
    const r = await fetch(url, {
      headers: {
        "x-access-token": key,
        "Content-Type": "application/json"
      }
    });
    const j = await r.json();
    // GoldAPI usually returns { price: 1976.54, unit: "t oz", ... } — check docs
    if (j && (j.price || j.price_usd)) {
      return j.price || j.price_usd;
    }
  }

  // 3) No key / fallback -> return null
  return null;
}

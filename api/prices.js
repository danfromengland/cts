export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'symbols query param required' });

  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

  try {
    // Step 1: visit Yahoo Finance to establish session cookies
    const seedRes = await fetch('https://finance.yahoo.com/', {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      redirect: 'follow',
    });
    const rawCookies = seedRes.headers.getSetCookie?.() ?? [];
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');

    // Step 2: fetch crumb using the session cookies
    const crumbRes = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: { 'User-Agent': UA, 'Cookie': cookieHeader },
    });
    const crumb = (await crumbRes.text()).trim();

    // Step 3: fetch quotes
    const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${encodeURIComponent(symbols)}&fields=regularMarketPrice,currency,shortName,longName,marketState&crumb=${encodeURIComponent(crumb)}`;
    const quoteRes = await fetch(url, {
      headers: { 'User-Agent': UA, 'Cookie': cookieHeader, 'Accept': 'application/json' },
    });

    const text = await quoteRes.text();
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      res.status(502).json({ error: `Yahoo returned non-JSON: ${text.slice(0, 120)}` });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

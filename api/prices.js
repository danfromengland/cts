export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'symbols query param required' });

  const fields = 'regularMarketPrice,currency,shortName,longName,marketState';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://finance.yahoo.com/',
    'Origin': 'https://finance.yahoo.com',
  };

  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];

  for (const host of hosts) {
    try {
      const url = `https://${host}/v8/finance/quote?symbols=${encodeURIComponent(symbols)}&fields=${fields}`;
      const r = await fetch(url, { headers });

      if (r.status === 429) continue; // try next host

      const text = await r.text();
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      // try next host
    }
  }

  res.status(429).json({ error: 'Yahoo Finance is rate limiting this server. Please try again in a minute.' });
}

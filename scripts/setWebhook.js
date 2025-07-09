import fetch from 'node-fetch';

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const VERCEL_URL = process.env.VERCEL_URL;

  if (!TELEGRAM_TOKEN || !VERCEL_URL) {
    return res.status(400).json({
      error: 'Missing TELEGRAM_BOT_TOKEN or VERCEL_URL env var'
    });
  }

  const webhookUrl = `https://${VERCEL_URL}/api/telegram`;

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    }
  );

  const data = await response.json();

  return res.status(200).json(data);
}

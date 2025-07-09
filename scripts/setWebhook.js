import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VERCEL_URL = process.env.VERCEL_URL; // e.g. your-app.vercel.app

if (!TELEGRAM_BOT_TOKEN || !VERCEL_URL) {
  console.error('❌ Please set TELEGRAM_BOT_TOKEN and VERCEL_URL in your .env or env vars.');
  process.exit(1);
}

const webhookUrl = `https://${VERCEL_URL}/api/telegram`;

const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`;

fetch(url)
  .then(res => res.json())
  .then(json => {
    console.log('✅ Telegram responded:', json);
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });

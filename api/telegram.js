import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).send('This endpoint only handles POST requests from Telegram.');
    return;
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  const body = req.body;

  // Basic safety check
  if (!body.message) {
    res.status(200).send('No message.');
    return;
  }

  const chatId = body.message.chat.id;
  const text = body.message.text;

  if (text === '/start') {
    // Send welcome photo with inline buttons
    await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: 'https://client263.vercel.app/profile-pic.jpg',  // <-- replace with your image URL
        caption: `👋 Welcome, ${body.message.from.first_name}!\nPlease choose an option:`,
        reply_markup: {
          inline_keyboard: [
            [{ text: '💸 View Payments', callback_data: 'view_payments' }],
            [{ text: '📈 Rates', callback_data: 'rates' }],
            [{ text: 'ℹ️ More Info', callback_data: 'more_info' }]
          ]
        }
      })
    });
  }

// Add this after checking for `body.message`
if (body.callback_query) {
  const chatId = body.callback_query.message.chat.id;
  const data = body.callback_query.data;

  let responseText = 'Unknown option.';

  if (data === 'view_payments') {
    responseText = '💸 Here are your current payment options:\n1. PayPal\n2. Stripe\n3. Crypto';
  } else if (data === 'rates') {
    responseText = '📈 Current rates:\nUSD: 1.0\nEUR: 0.9\nBTC: $30,000';
  } else if (data === 'more_info') {
    responseText = 'ℹ️ More info: https://test';
  }

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: responseText
    })
  });

  res.status(200).send('ok');
  return;
}

  res.status(200).send('ok');
}

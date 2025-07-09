import fetch from 'node-fetch';

export default async function handler(req, res) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  if (req.method !== 'POST') {
    return res.status(200).send('✅ Telegram webhook is running.');
  }

  const body = req.body;

  if (body.message) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    if (text === '/start') {
      await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: 'https://placehold.co/300x300.png?text=Profile+Pic',
          caption: `🎉 *Welcome to MyBot!* 🎉\n\nSelect an option:`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📥 Download APK', url: 'https://example.com/app.apk' }],
              [{ text: '🏦 Banks', callback_data: 'banks' }],
              [{ text: '📈 Rates', callback_data: 'rates' }],
              [{ text: '📝 Register', callback_data: 'register' }],
              [{ text: '💎 Pro', callback_data: 'pro' }],
              [{ text: 'ℹ️ More Info', url: 'https://example.com/info' }]
            ]
          }
        })
      });
    } else {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🤖 Unknown command. Type /start or use the buttons.`
        })
      });
    }
  }

  if (body.callback_query) {
    const chatId = body.callback_query.message.chat.id;
    const data = body.callback_query.data;

    let replyText = '';

    if (data === 'banks') {
      replyText = `🏦 *Available Banks*\nChoose one:`;
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Bank A', callback_data: 'bank_A' }],
              [{ text: 'Bank B', callback_data: 'bank_B' }],
              [{ text: 'Bank C', callback_data: 'bank_C' }]
            ]
          }
        })
      });
    } else if (data === 'rates') {
      replyText = `📈 *Current Rates*\n\nUSD: $1.00\nEUR: $0.92\nBTC: $30,000`;
    } else if (data === 'register') {
      replyText = `📝 *Register*\nPlease visit https://example.com/register`;
    } else if (data === 'pro') {
      replyText = `💎 *Pro*\nSend payment proof to @YourSupportBot for verification.`;
    } else if (data.startsWith('bank_')) {
      const bank = data.split('_')[1];
      replyText = `🏦 *${bank}*\nRates:\nUSD ➜ 1.0\nEUR ➜ 0.92\nFee: 1%`;
    }

    if (replyText) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: 'Markdown'
        })
      });
    }

    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: body.callback_query.id
      })
    });
  }

  res.status(200).send('ok');
}

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).send('Hello 👋 Hello 👋 This is Analyser Client Bot Demo.');
    return;
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  const body = req.body;

  // Handle messages
  if (body.message) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    if (text === '/start') {
      // Send welcome photo & buttons
      await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: 'https://1234zwtest.vercel.app/profile.jpg', // <-- your hosted welcome image
          caption: `🎉 *Welcome to MyBot!* 🎉\n\nWe make payments easy. Pick an option below 👇`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📥 Download APK', url: 'https://yourdomain.com/app.apk' }],
              [{ text: '🏦 Banks', callback_data: 'banks' }],
              [{ text: '📈 Rates', callback_data: 'rates' }],
              [{ text: '📝 Register', callback_data: 'register' }],
              [{ text: '💎 Pro', callback_data: 'pro' }],
              [{ text: 'ℹ️ More Info', url: 'https://yourdomain.com/info' }]
            ]
          }
        })
      });
    } else {
      // Fallback for any other text
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🤖 I didn't understand that. Please use the buttons or type /start.`
        })
      });
    }
  }

  // Handle button clicks (callback queries)
  if (body.callback_query) {
    const chatId = body.callback_query.message.chat.id;
    const data = body.callback_query.data;

    let replyText = '';

    if (data === 'banks') {
      replyText = `🏦 *Available Banks*\n\n- Bank A\n- Bank B\n- Bank C\n\nClick one to see rates:`;
      // Send bank buttons
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
      replyText = `📈 *Current Rates*\n\nUSD ➜ 1.0\nEUR ➜ 0.92\nBTC ➜ $30,500`;
    } else if (data === 'register') {
      replyText = `📝 *Register*\n\nPlease visit https://statusplus.zone.id/register and complete the form.`;
    } else if (data === 'pro') {
      replyText = `💎 *Pro Verification*\n\nPlease send your payment proof to our support: @Tcronebhx`;
    } else if (data.startsWith('bank_')) {
      const bankName = data.split('_')[1];
      replyText = `🏦 *${bankName} Rates*\n\nUSD ➜ 1.0\nEUR ➜ 0.92\nProcessing fee: 1%`;
    } else {
      replyText = `❓ Unknown option.`;
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

    // Always answer callback_query to remove loading spinner in Telegram
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

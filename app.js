//app.js

require('dotenv').config();
console.log(process.env.TELEGRAM_BOT_TOKEN);
const TelegramBot = require('node-telegram-bot-api');
const { generateAddress, getETHBalance, sendTransaction, getTokenInfo, getTokenBalance } = require('./blockchain');
const { connectDB } = require('./db');
const { fetchTokenPrice } = require('./tokenPrice.js');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

const mainMenu = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Buy', callback_data: 'Buy' }, { text: 'Sell / manage', callback_data: 'Sell' }],
      [{ text: 'Export Private Key', callback_data: 'Export' }, { text: 'Refer Friends', callback_data: 'Referal' }],
      [{ text: 'Refresh', callback_data: 'Refresh' }]
    ]
  })
};

// Connect to the database
connectDB().then(() => {
  // Start your bot after the database connection is established
  // Placeholder for initialization
});

// Handle '/start' command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  // Create a new wallet
  const { privateKey, address } = generateAddress();

  const welcomeMessage = `⚡⚡⚡ Welcome to DexWizard ⚡⚡⚡

Your new wallet address is automatically created:
${address}

What would you like to do next?`;

  // When sending the message, ensure to use parse_mode='HTML'
  bot.sendMessage(chatId, welcomeMessage, { ...mainMenu, parse_mode: 'HTML' });
});

// Handle '/help' command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Need help? Please send DM to @tradersnow for assistance.');
});

// Handle non-command messages
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const response = `You said: ${msg.text}`;
    bot.sendMessage(chatId, response);
  }
});

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const potentialAddress = msg.text.trim();

    // Check if the text could be an EVM(ARB) address
    if (/^0x[a-fA-F0-9]{40}$/.test(potentialAddress)) {
      // It looks like an address, attempt to fetch the token price
      fetchTokenPrice(potentialAddress)
        .then(priceInfo => {
          // Assuming priceInfo contains a 'price' property
          const price = priceInfo.price || 'Price information not available';
          bot.sendMessage(chatId, `Price: ${price}`);
        })
        .catch(err => {
          console.error(err);
          bot.sendMessage(chatId, 'Failed to fetch token price.');
        });
    } else {
      // Handle other messages as before
      const response = `You said: ${msg.text}`;
      bot.sendMessage(chatId, response);
    }
  }
});



require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { generateAddress, getETHBalance, sendTransaction, getTokenInfo, getTokenBalance } = require('./blockchain');
const { connectDB } = require('./db');

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
  // Your bot initialization code here
});

// Handle '/start' command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  // Call the generateAddress function from blockchain.js to create a new wallet
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

// Handle callback queries from inline keyboards
bot.on('callback_query', (callbackQuery) => {
  // It's good practice to call 'answerCallbackQuery' to prevent the user from waiting too long
  bot.answerCallbackQuery(callbackQuery.id)
    .then(() => {
      handleCallbackQuery(callbackQuery, bot); // Use the imported function
    });
});

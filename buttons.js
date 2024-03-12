// Updated buttons.js to export functions and menus without initializing the bot

const mainMenu = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Get Price', callback_data: 'GetP' }],
        [{ text: 'Buy', callback_data: 'Buy' }],
        // Add more buttons as needed
      ],
    }),
  };
  
  function handleCallbackQuery(callbackQuery, bot) {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
  
    if (data === "GetP") {
      // Replace 'Price information here...' with actual price fetching logic
      bot.editMessageText('Price information here...', { chat_id: message.chat.id, message_id: message.message_id });
    } else if (data === "Buy") {
      // Replace 'Buying interface...' with actual buying logic
      bot.editMessageText('Buying interface...', { chat_id: message.chat.id, message_id: message.message_id });
    }
    // Add more cases as needed
  }
  
  module.exports = { mainMenu, handleCallbackQuery };
  
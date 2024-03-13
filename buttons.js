//buttons.js

const mainMenu = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Get Price', callback_data: 'GetP' }],
        [{ text: 'Buy', callback_data: 'Buy' }],
        // Add more buttons as needed
      ],
    }),
  };
  
const { fetchTokenPrice } = require('./tokenPrice.js'); // Assuming tokenPrice.js is in the same directory

// Inside handleCallbackQuery function in buttons.js
if (data === "GetP") {
  const contractAddress = 'UserProvidedContractAddress'; // Replace with actual user input
  fetchTokenPrice(contractAddress)
    .then(priceInfo => {
      bot.editMessageText(`Price: ${priceInfo}`, { chat_id: message.chat.id, message_id: message.message_id });
    })
    .catch(err => {
      bot.editMessageText('Failed to fetch token price', { chat_id: message.chat.id, message_id: message.message_id });
      console.error(err);
    });
}

  
  module.exports = { mainMenu, handleCallbackQuery };
  
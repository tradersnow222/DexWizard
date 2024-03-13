// tokenPrice.js
// Dynamically import node-fetch as an ES Module
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fetchTokenPrice = async (contractAddress) => {
  const apiKey = '8a6a3be2bda64c179812ad30f666debf'; //stored in .env
  const url = `https://public-api.birdeye.so/defi/price?check_liquidity=${contractAddress}&include_liquidity=false&address=${contractAddress}`;

  const options = {
    method: 'GET',
    headers: {
      'x-chain': 'arbitrum',
      'X-API-KEY': apiKey
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("API response:", data); 
    return data;
  } catch (err) {
    console.error('Error fetching token price:', err);
    throw err;
  }
};

module.exports = { fetchTokenPrice };

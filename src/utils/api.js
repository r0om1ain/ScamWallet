import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

// Dans api.js
export const fetchCryptoPrices = async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20'
  );
  return response.data.map(crypto => ({
    id: crypto.id,
    symbol: crypto.symbol.toUpperCase(),
    current_price: crypto.current_price
  }));
};

export const fetchCryptoHistory = async (cryptoId) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`
    );
    return response.data;
  };
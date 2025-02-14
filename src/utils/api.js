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

  export const fetchCryptoPricesHome = async () => {
    const response = await axios.get(
      `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false`
    );
    return response.data;
  };
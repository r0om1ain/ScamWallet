import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoPrices = async () => {
  const response = await axios.get(`${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
  return response.data;
};

export const fetchCryptoHistory = async (cryptoId) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`
    );
    return response.data;
  };
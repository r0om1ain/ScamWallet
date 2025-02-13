import React, { useEffect, useState } from 'react';
import { fetchCryptoPrices } from '../utils/api';

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const getPrices = async () => {
      const data = await fetchCryptoPrices();
      setCryptos(data);
    };
    getPrices();
  }, []);

  return (
    <div>
      <h2>Crypto Prices</h2>
      <ul>
        {cryptos.map((crypto) => (
          <li key={crypto.id}>
            {crypto.name}: ${crypto.current_price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoList;
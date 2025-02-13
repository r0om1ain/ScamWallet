import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler des données locales
  useEffect(() => {
    const fakeData = [
      { id: 'bitcoin', name: 'Bitcoin', current_price: 50000, price_change_percentage_24h: 2.5, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
      { id: 'ethereum', name: 'Ethereum', current_price: 4000, price_change_percentage_24h: 1.8, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    ];
    setCryptos(fakeData);
    setLoading(false);
  }, []);

  return (
    <div className="home">
      <h1>Bienvenue sur Binance-Like</h1>
      <p>
        Une plateforme de trading simulé de cryptomonnaies. Commencez à trader dès maintenant !
      </p>

      <Link to="/trade" className="trade-link">
        Commencer à Trader
      </Link>

      <h2>Top Cryptomonnaies</h2>
      {loading ? (
        <p>Chargement des prix...</p>
      ) : (
        <div className="crypto-list">
          {cryptos.map((crypto) => (
            <div key={crypto.id} className="crypto-item">
              <img src={crypto.image} alt={crypto.name} className="crypto-image" />
              <div className="crypto-info">
                <h3>{crypto.name}</h3>
                <p>Prix : ${crypto.current_price.toLocaleString()}</p>
                <p>Variation (24h) : {crypto.price_change_percentage_24h.toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
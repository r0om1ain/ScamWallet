import React, { useEffect, useState } from 'react';
import { fetchCryptoPricesHome } from '../utils/api';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les prix des cryptos
  useEffect(() => {
    const getPrices = async () => {
      try {
        const data = await fetchCryptoPricesHome();
        setCryptos(data.slice(0, 5)); // Afficher les 5 premières cryptos
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        setLoading(false);
      }
    };

    getPrices();

    // Actualiser les prix toutes les 60 secondes
    const interval = setInterval(getPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <h1>Bienvenue sur Scam-Wallet</h1>
      <p>
        Une plateforme de trading où tu stockes mais tu retires jamais 🥷
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
                <p
                  className={
                    crypto.price_change_percentage_24h >= 0
                      ? 'price-up'
                      : 'price-down'
                  }
                >
                  Variation (24h) : {crypto.price_change_percentage_24h}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCryptoPrices } from '../utils/api';
import '../styles/BlogPage.css';

const BlogPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les cryptos disponibles
  useEffect(() => {
    const getCryptos = async () => {
      try {
        const data = await fetchCryptoPrices();
        setCryptos(data.slice(0, 10)); // Limiter à 10 cryptos pour la démo
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
        setLoading(false);
      }
    };
    getCryptos();
  }, []);

  console.log(cryptos);
  return (
    <div className="blog-page">
      <h1>Blogs des Cryptomonnaies</h1>
      {loading ? (
        <p>Chargement des cryptos...</p>
      ) : (
        <div className="crypto-blogs">
          {cryptos.map((crypto) => (
            <div key={crypto.symbol} className="crypto-blog">
              <h2>{crypto.symbol}</h2>
              <p>Prix actuel : ${crypto.current_price.toLocaleString()}</p>
              <Link to={`/blog/${crypto.symbol}`} className="view-blog-link">
                Voir le Blog
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
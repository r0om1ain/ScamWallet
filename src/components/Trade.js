import React, { useState, useEffect } from 'react';
import { fetchCryptoHistory } from '../utils/api';
import CryptoChart from '../components/CryptoChart';
import '../styles/Trade.css';

const Trade = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cryptoHistory, setCryptoHistory] = useState(null);

  // Récupérer les prix des cryptos
  useEffect(() => {
    const getPrices = async () => {
      try {
        const data = await fetchCryptoPrices();
        setCryptos(data.slice(0, 10)); // Afficher seulement les 10 premières cryptos pour la démo
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        setLoading(false);
      }
    };
    getPrices();
  }, []);

  // Récupérer l'historique des prix d'une crypto
  useEffect(() => {
    if (selectedCrypto) {
      const getHistory = async () => {
        try {
          const cryptoId = cryptos.find((c) => c.name === selectedCrypto)?.id;
          if (cryptoId) {
            const history = await fetchCryptoHistory(cryptoId);
            setCryptoHistory({
              name: selectedCrypto,
              labels: history.prices.map((price) => new Date(price[0]).toLocaleDateString()),
              prices: history.prices.map((price) => price[1]),
            });
          }
        } catch (error) {
          console.error('Error fetching crypto history:', error);
        }
      };
      getHistory();
    }
  }, [selectedCrypto, cryptos]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      crypto: selectedCrypto,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType === 'limit' ? parseFloat(price) : null,
      status: 'pending',
      date: new Date().toLocaleString(),
    };

    // Ajouter l'ordre à la liste des ordres
    setOrders([...orders, newOrder]);

    // Sauvegarder dans localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...savedOrders, newOrder]));

    // Réinitialiser le formulaire
    setSelectedCrypto('');
    setQuantity('');
    setPrice('');
  };

  return (
    <div className="trade">
      <h1>Passer un Ordre</h1>

      <form onSubmit={handleSubmit} className="trade-form">
        <div className="form-group">
          <label>Crypto :</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            required
          >
            <option value="" disabled>Sélectionnez une crypto</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.name}>
                {crypto.name} (${crypto.current_price.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type d'ordre :</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            required
          >
            <option value="market">Ordre au marché</option>
            <option value="limit">Ordre limite</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantité :</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {orderType === 'limit' && (
          <div className="form-group">
            <label>Prix limite :</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          Passer l'ordre
        </button>
      </form>

      {cryptoHistory && (
        <div className="chart-container">
          <CryptoChart cryptoData={cryptoHistory} />
        </div>
      )}

      <h2>Ordres en Attente</h2>
      {orders.length === 0 ? (
        <p>Aucun ordre en attente.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <p><strong>Crypto :</strong> {order.crypto}</p>
              <p><strong>Type :</strong> {order.type === 'market' ? 'Marché' : 'Limite'}</p>
              <p><strong>Quantité :</strong> {order.quantity}</p>
              {order.price && <p><strong>Prix limite :</strong> ${order.price.toLocaleString()}</p>}
              <p><strong>Date :</strong> {order.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trade;
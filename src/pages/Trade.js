import React, { useState, useEffect } from 'react';
import { fetchCryptoPrices, fetchCryptoHistory } from '../utils/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/Trade.css';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trade = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [cryptoHistory, setCryptoHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des cryptos
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

  // Récupérer l'historique des prix de la crypto sélectionnée
  useEffect(() => {
    if (selectedCrypto) {
      const getHistory = async () => {
        try {
          const cryptoId = cryptos.find((c) => c.symbol.toUpperCase() === selectedCrypto)?.id;
          if (cryptoId) {
            const history = await fetchCryptoHistory(cryptoId);
            setCryptoHistory({
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

  // Données pour le graphique
  const chartData = {
    labels: cryptoHistory?.labels || [],
    datasets: [
      {
        label: `Prix du ${selectedCrypto} (USD)`,
        data: cryptoHistory?.prices || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Évolution du prix du ${selectedCrypto}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Prix (USD)',
        },
      },
    },
  };

  return (
    <div className="trade">
      <h1>Graphiques des Cryptomonnaies</h1>

      <div className="crypto-selector">
        <label>Sélectionnez une cryptomonnaie :</label>
        <select
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
        >
          <option value="" disabled>Sélectionnez une crypto</option>
          {cryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.symbol.toUpperCase()}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Chargement des cryptos...</p>
      ) : (
        selectedCrypto && (
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        )
      )}
    </div>
  );
};

export default Trade;
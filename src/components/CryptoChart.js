import React from 'react';
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

const CryptoChart = ({ cryptoData }) => {
  // Préparer les données pour le graphique
  const data = {
    labels: cryptoData.labels, // Dates ou heures
    datasets: [
      {
        label: 'Prix (USD)',
        data: cryptoData.prices, // Prix
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Évolution du prix de ${cryptoData.name}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Temps',
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

  return <Line data={data} options={options} />;
};

export default CryptoChart;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoPrices } from '../utils/api';
import '../styles/WalletPage.css';

const WalletPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cryptoBalances, setCryptoBalances] = useState({});
  const [usdBalance, setUsdBalance] = useState(10000); // Solde initial
  const [transactionType, setTransactionType] = useState('deposit');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Vérifier la connexion et charger le portefeuille
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    loadWallet(user.username);
    fetchPrices();
  }, [navigate]);

  const fetchPrices = async () => {
    const prices = await fetchCryptoPrices();
    const priceMap = prices.reduce((acc, crypto) => {
      acc[crypto.symbol.toUpperCase()] = crypto.current_price;
      return acc;
    }, {});
    setCryptoPrices(priceMap);
  };

  const loadWallet = (username) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    if (user?.wallet) {
      setUsdBalance(user.wallet.usd);
      setCryptoBalances(user.wallet.crypto || {});
      setTransactions(user.wallet.transactions || []);
    }
  };

  const saveWallet = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(u => {
      if (u.username === currentUser.username) {
        return {
          ...u,
          wallet: {
            usd: usdBalance,
            crypto: cryptoBalances,
            transactions
          }
        };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    
    if (transactionType === 'deposit') {
      setUsdBalance(prev => {
        const newBalance = prev + numericAmount;
        addTransaction('Dépôt USD', numericAmount);
        return newBalance;
      });
    } else if (transactionType === 'withdraw') {
      if (usdBalance >= numericAmount) {
        setUsdBalance(prev => {
          const newBalance = prev - numericAmount;
          addTransaction('Retrait USD', -numericAmount);
          return newBalance;
        });
      }
    } else if (transactionType === 'buy') {
      const cost = numericAmount * cryptoPrices[selectedCrypto];
      if (usdBalance >= cost) {
        setUsdBalance(prev => prev - cost);
        setCryptoBalances(prev => ({
          ...prev,
          [selectedCrypto]: (prev[selectedCrypto] || 0) + numericAmount
        }));
        addTransaction(`Achat ${selectedCrypto}`, -cost);
      }
    } else if (transactionType === 'sell') {
      if ((cryptoBalances[selectedCrypto] || 0) >= numericAmount) {
        const revenue = numericAmount * cryptoPrices[selectedCrypto];
        setUsdBalance(prev => prev + revenue);
        setCryptoBalances(prev => ({
          ...prev,
          [selectedCrypto]: prev[selectedCrypto] - numericAmount
        }));
        addTransaction(`Vente ${selectedCrypto}`, revenue);
      }
    }
    
    setAmount('');
    saveWallet();
  };

  const addTransaction = (description, amount) => {
    const newTransaction = {
      date: new Date().toLocaleString(),
      description,
      amount,
      type: amount > 0 ? 'credit' : 'debit'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const getTotalValue = () => {
    return Object.entries(cryptoBalances).reduce((total, [symbol, balance]) => {
      return total + (balance * (cryptoPrices[symbol] || 0));
    }, usdBalance);
  };

  return (
    <div className="wallet-page">
      <h1>Portefeuille de {currentUser?.username}</h1>
      
      <div className="wallet-summary">
        <div className="balance-card">
          <h3>Solde USD</h3>
          <p>${usdBalance.toFixed(2)}</p>
        </div>
        <div className="balance-card">
          <h3>Valeur Totale</h3>
          <p>${getTotalValue().toFixed(2)}</p>
        </div>
      </div>

      <div className="transaction-section">
        <form onSubmit={handleTransaction}>
          <select 
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="deposit">Dépôt USD</option>
            <option value="withdraw">Retrait USD</option>
            <option value="buy">Achat Crypto</option>
            <option value="sell">Vente Crypto</option>
          </select>

          {(transactionType === 'buy' || transactionType === 'sell') && (
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              {Object.keys(cryptoPrices).map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={
              transactionType === 'buy' || transactionType === 'sell' 
                ? `Quantité ${selectedCrypto}` 
                : 'Montant USD'
            }
            required
          />

          <button type="submit">Exécuter</button>
        </form>
      </div>

      <div className="assets-list">
        <h3>Actifs Cryptos</h3>
        {Object.entries(cryptoBalances).map(([symbol, balance]) => (
          <div key={symbol} className="asset-item">
            <span>{symbol}</span>
            <span>{balance.toFixed(4)}</span>
            <span>${((cryptoPrices[symbol] || 0) * balance).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="transaction-history">
        <h3>Historique des Transactions</h3>
        {transactions.map((t, i) => (
          <div key={i} className={`transaction ${t.type}`}>
            <span>{t.date}</span>
            <span>{t.description}</span>
            <span>${Math.abs(t.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletPage;
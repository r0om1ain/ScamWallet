import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoPrices } from '../utils/api';
import '../styles/WalletPage.css';

const WalletPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cryptoBalances, setCryptoBalances] = useState({});
  const [usdBalance, setUsdBalance] = useState(0); // Initialisé à 0
  const [transactionType, setTransactionType] = useState('deposit');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [usersList, setUsersList] = useState([]);



  // Charger les données au montage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }

    setCurrentUser(user);
    loadWallet(user.username);
    fetchPrices();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    setUsersList(users.filter(u => u.username !== user.username));
  }, [navigate]);

   // Récupérer les prix des cryptos
   const fetchPrices = async () => {
    const prices = await fetchCryptoPrices();
    const priceMap = prices.reduce((acc, crypto) => {
      acc[crypto.symbol.toUpperCase()] = crypto.current_price;
      return acc;
    }, {});
    setCryptoPrices(priceMap);
  };

  // Sauvegarder automatiquement quand le portefeuille change
  useEffect(() => {
    if (currentUser) {
      saveWallet();
    }
  }, [usdBalance, cryptoBalances, transactions]); // Déclenché sur les changements

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
            transactions: transactions.slice(0, 50), // Garder seulement les 50 dernières
          },
        };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      wallet: {
        usd: usdBalance,
        crypto: cryptoBalances,
        transactions: transactions.slice(0, 50),
      },
    }));
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    let newUsd = usdBalance;
    let newCrypto = { ...cryptoBalances };
    let newTransaction = null;

    switch (transactionType) {
      case 'deposit':
        newUsd += numericAmount;
        newTransaction = {
          date: new Date().toLocaleString(),
          description: 'Dépôt USD',
          amount: numericAmount,
          type: 'credit',
        };
        break;

      case 'withdraw':
        if (usdBalance >= numericAmount) {
          newUsd -= numericAmount;
          newTransaction = {
            date: new Date().toLocaleString(),
            description: 'Retrait USD',
            amount: -numericAmount,
            type: 'debit',
          };
        }
        break;

      case 'buy': {
        const cost = numericAmount * cryptoPrices[selectedCrypto];
        if (usdBalance >= cost) {
          newUsd -= cost;
          newCrypto[selectedCrypto] = (newCrypto[selectedCrypto] || 0) + numericAmount;
          newTransaction = {
            date: new Date().toLocaleString(),
            description: `Achat ${selectedCrypto}`,
            amount: -cost,
            type: 'debit',
          };
        }
        break;
      }

      case 'sell': {
        const revenue = numericAmount * cryptoPrices[selectedCrypto];
        if ((cryptoBalances[selectedCrypto] || 0) >= numericAmount) {
          newUsd += revenue;
          newCrypto[selectedCrypto] -= numericAmount;
          newTransaction = {
            date: new Date().toLocaleString(),
            description: `Vente ${selectedCrypto}`,
            amount: revenue,
            type: 'credit',
          };
        }
        break;
      }
    }

    if (newTransaction) {
      setUsdBalance(newUsd);
      setCryptoBalances(newCrypto);
      setTransactions(prev => [newTransaction, ...prev]);
      setAmount('');
    }
  };
  // Gérer les transferts de cryptos entre utilisateurs
  const handleTransfer = (e) => {
    e.preventDefault();

    if (!currentUser || !recipient) return;

    // Vérifier si l'utilisateur a suffisamment de crypto
    if ((cryptoBalances[selectedCrypto] || 0) < amount) {
      alert('Solde insuffisant.');
      return;
    }

    // Trouver le destinataire
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const recipientUser = users.find(u => u.username === recipient);
    if (!recipientUser) {
      alert('Destinataire introuvable.');
      return;
    }

    // Mettre à jour les portefeuilles
    const updatedCurrentUser = {
      ...currentUser,
      wallet: {
        ...currentUser.wallet,
        crypto: {
          ...cryptoBalances,
          [selectedCrypto]: cryptoBalances[selectedCrypto] - amount,
        },
        transactions: [
          ...transactions,
          {
            date: new Date().toLocaleString(),
            description: `Transfert de ${amount} ${selectedCrypto} à ${recipient}`,
            amount: -amount,
            type: 'debit',
          },
        ],
      },
    };

    const updatedRecipientUser = {
      ...recipientUser,
      wallet: {
        ...recipientUser.wallet,
        crypto: {
          ...recipientUser.wallet.crypto,
          [selectedCrypto]: (recipientUser.wallet.crypto[selectedCrypto] || 0) + amount,
        },
        transactions: [
          ...(recipientUser.wallet.transactions || []),
          {
            date: new Date().toLocaleString(),
            description: `Réception de ${amount} ${selectedCrypto} de ${currentUser.username}`,
            amount: amount,
            type: 'credit',
          },
        ],
      },
    };

    // Mettre à jour localStorage
    const updatedUsers = users.map(u => 
      u.username === currentUser.username ? updatedCurrentUser :
      u.username === recipientUser.username ? updatedRecipientUser :
      u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

    // Mettre à jour l'état local
    setCryptoBalances(updatedCurrentUser.wallet.crypto);
    setTransactions(updatedCurrentUser.wallet.transactions);
    alert('Transfert effectué avec succès !');
  };

  return (
    <div className="wallet-page">
      <h1>Portefeuille de {currentUser?.username}</h1>

      {/* Section Transactions */}
      <div className="transaction-section">
        <h2>Transactions</h2>
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

      {/* Section Transfert */}
      <div className="transfer-section">
        <h2>Transfert de Crypto</h2>
        <form onSubmit={handleTransfer}>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          >
            <option value="" disabled>Sélectionnez un utilisateur</option>
            {usersList.map(user => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>

          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            required
          >
            {Object.keys(cryptoBalances).map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Quantité"
            required
          />

          <button type="submit">Envoyer</button>
        </form>
      </div>

      {/* Section Historique des Transactions */}
      <div className="transaction-history">
        <h2>Historique des Transactions</h2>
        {transactions.map((transaction, index) => (
          <div key={index} className={`transaction ${transaction.type}`}>
            <p><strong>Date :</strong> {transaction.date}</p>
            <p><strong>Description :</strong> {transaction.description}</p>
            <p><strong>Montant :</strong> ${Math.abs(transaction.amount).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletPage;
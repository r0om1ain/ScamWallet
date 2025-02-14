import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Charger l'historique des transactions
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === currentUser.username);
    if (user?.wallet?.transactions) {
      setTransactions(user.wallet.transactions);
    }
  }, [navigate]);

  return (
    <div className="transaction-history">
      <h1>Historique des Transactions</h1>
      {transactions.length === 0 ? (
        <p>Aucune transaction trouvée.</p>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction, index) => (
            <div key={index} className={`transaction ${transaction.type}`}>
              <p><strong>Date :</strong> {transaction.date}</p>
              <p><strong>Description :</strong> {transaction.description}</p>
              <p><strong>Montant :</strong> ${Math.abs(transaction.amount).toFixed(2)}</p>
              <p><strong>Type :</strong> {transaction.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
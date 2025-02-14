import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur existe déjà
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
      setError('Ce nom d\'utilisateur est déjà pris');
      return;
    }

    // Ajouter le nouvel utilisateur
    // Dans RegisterPage.js
const newUser = { 
  username, 
  password,
  wallet: {
    usd: 10000, // Solde initial
    crypto: {},
    transactions: []
  }
};
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('currentUser') !== null;

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.location.reload(); // Pour forcer la mise à jour de l'état de connexion
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Scam-Wallet
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Accueil
        </Link>
        <Link to="/trade" className="nav-link">
          Trade
        </Link>
        <Link to="/wallet" className="nav-link">
          Portefeuille
        </Link>
        <Link to="/blog" className="nav-link">
          Blog
        </Link>
        {isLoggedIn ? (
        <Link to="/transactions" className="nav-link">
            Historique
          </Link> 
        ) : ( "" )}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-button">
            Déconnexion
          </button>
        ) : (
          <Link to="/login" className="nav-link">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
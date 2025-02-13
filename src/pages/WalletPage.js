// Dans WalletPage.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) navigate('/login');
  }, [navigate]);

  return (
    0
  );
};

export default WalletPage;
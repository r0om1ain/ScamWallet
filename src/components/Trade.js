const handleBuy = async (cryptoId, quantity) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Veuillez vous connecter pour effectuer un achat.');
      return;
    }
  
    const crypto = cryptos.find(c => c.id === cryptoId);
    const cost = quantity * crypto.current_price;
  
    // Vérifier si l'utilisateur a suffisamment de fonds
    if (currentUser.wallet.usd < cost) {
      alert('Fonds insuffisants.');
      return;
    }
  
    // Mettre à jour le portefeuille
    const updatedUser = {
      ...currentUser,
      wallet: {
        ...currentUser.wallet,
        usd: currentUser.wallet.usd - cost,
        crypto: {
          ...currentUser.wallet.crypto,
          [crypto.symbol.toUpperCase()]: (currentUser.wallet.crypto[crypto.symbol.toUpperCase()] || 0) + quantity,
        },
        transactions: [
          ...currentUser.wallet.transactions,
          {
            date: new Date().toLocaleString(),
            description: `Achat de ${quantity} ${crypto.symbol.toUpperCase()}`,
            amount: -cost,
            type: 'debit',
          },
        ],
      },
    };
  
    // Mettre à jour localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(u => 
      u.username === currentUser.username ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
    alert('Achat effectué avec succès !');
  };
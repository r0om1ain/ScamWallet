import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trade from './pages/Trade';
import WalletPage from './pages/WalletPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import CryptoBlog from './components/CryptoBlog';
import RegisterPage from './pages/RegisterPage';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<CryptoBlog />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/transactions" element={<TransactionHistory />} />
      </Routes>
    </>
  );
};

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trade from './pages/Trade';
import WalletPage from './pages/WalletPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
  );
};

export default App;


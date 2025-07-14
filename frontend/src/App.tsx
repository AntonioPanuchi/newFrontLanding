import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Faq from './pages/Faq';
import TelegramFab from './components/TelegramFab';

const App: React.FC = () => (
  <HelmetProvider>
    <Router>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
        <TelegramFab />
      </main>
      <Footer />
    </Router>
  </HelmetProvider>
);

export default App; 
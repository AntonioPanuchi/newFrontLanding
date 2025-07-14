import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Faq from './pages/Faq';
import TelegramFab from './components/TelegramFab';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

const App: React.FC = () => (
  <HelmetProvider>
    <Router>
      <ScrollToTop />
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
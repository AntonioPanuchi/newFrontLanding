import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Faq from './pages/Faq';
import Account from './pages/Account';
import TelegramFab from './components/TelegramFab';
import { logFrontend } from './utils/logger';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function RouteLogger() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    logFrontend('info', 'User navigated', { path: pathname, ts: new Date().toISOString() });
  }, [pathname]);
  return null;
}

const App: React.FC = () => (
  <HelmetProvider>
    <ThemeProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <RouteLogger />
          <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/account" element={<Account />} />
          </Routes>
          <TelegramFab />
        </main>
        <Footer />
        </Router>
      </UserProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App; 
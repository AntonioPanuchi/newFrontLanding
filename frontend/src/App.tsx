import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Faq from './pages/Faq';
import TelegramFab from './components/TelegramFab';
import { logFrontend } from './utils/logger';
import { ThemeProvider } from './context/ThemeContext';
import LearningInsightsDashboard from './pages/admin/learning-insights';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';


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
      <Router>
        <ScrollToTop />
        <RouteLogger />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/admin/learning-insights" element={<LearningInsightsDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <TelegramFab />
        </main>
        <Footer />
      </Router>
    </ThemeProvider>
  </HelmetProvider>
);

export default App; 

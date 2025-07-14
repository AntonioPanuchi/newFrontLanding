import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ServerStatus from '../components/ServerStatus';
import Notification from '../components/Notification';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

const Home: React.FC = () => (
  <>
    <Header />
    <main className="relative z-10">
      <HeroSection />
      <HowItWorks />
      <Features />
      <ServerStatus />
      <Notification />
      <FaqSection />
    </main>
    <Footer />
  </>
);

export default Home; 
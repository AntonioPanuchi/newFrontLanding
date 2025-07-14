import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ServerStatus from '../components/ServerStatus';
import Notification from '../components/Notification';
import FaqSection from '../components/FaqSection';
import SectionDivider from '../components/SectionDivider';

const Home: React.FC = () => (
  <>
    <Header />
    <main className="relative z-10">
      <HeroSection />
      <SectionDivider color="#f0f4f8" />
      <HowItWorks />
      <SectionDivider color="#e0e7ef" flip />
      <Features />
      <SectionDivider color="#f0f4f8" />
      <ServerStatus />
      <SectionDivider color="#e0e7ef" flip />
      <FaqSection />
    </main>
  </>
);

export default Home; 
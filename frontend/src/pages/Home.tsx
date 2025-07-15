import React from 'react';
import PageHead from '../components/PageHead';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ServerStatus from '../components/ServerStatus';
import FaqSection from '../components/FaqSection';
import SectionDivider from '../components/SectionDivider';

const Home: React.FC = () => (
    <>
      <PageHead
        title="ROX.VPN – VPN за 30 секунд прямо в Telegram"
        description="Забудь про сложные настройки! ROX.VPN работает через Telegram-бота — просто нажми кнопку и получи быстрый защищённый интернет."
        path="/"
      />
      <main className="relative z-10">
        <HeroSection />
        <SectionDivider color="#f0f4f8" darkColor="#18181b" />
        <HowItWorks />
        <SectionDivider color="#e0e7ef" darkColor="#23272f" flip />
        <Features />
        <SectionDivider color="#f0f4f8" darkColor="#18181b" />
        <ServerStatus />
        <SectionDivider color="#e0e7ef" darkColor="#23272f" flip />
        <FaqSection />
      </main>
    </>
);

export default Home; 
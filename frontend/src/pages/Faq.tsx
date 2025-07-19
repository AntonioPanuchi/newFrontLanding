import React from 'react';
import PageHead from '../components/PageHead';
import FaqSection from '../components/FaqSection';

const Faq: React.FC = () => (
  <>
    <PageHead
      title="Часто задаваемые вопросы"
      description="Ответы на вопросы о системе мониторинга ROX.VPN. Сервис не предназначен для продвижения VPN-услуг."
      path="/faq"
    />
    <FaqSection />
  </>
);

export default Faq; 
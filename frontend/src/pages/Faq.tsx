import React from 'react';
import PageHead from '../components/PageHead';
import FaqSection from '../components/FaqSection';

const Faq: React.FC = () => (
  <>
    <PageHead
      title="Часто задаваемые вопросы"
      description="Ответы на часто задаваемые вопросы о ROX.VPN. Узнайте как начать пользоваться VPN, о безопасности, поддерживаемых устройствах и способах оплаты."
      path="/faq"
    />
    <FaqSection />
  </>
);

export default Faq; 
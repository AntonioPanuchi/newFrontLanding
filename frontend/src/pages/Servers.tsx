import React from 'react';
import PageHead from '../components/PageHead';
import ServerStatus from '../components/ServerStatus';

const Servers: React.FC = () => (
  <>
    <PageHead
      title="Статус серверов"
      description="Мониторинг статуса VPN серверов ROX.VPN в реальном времени. Проверьте доступность серверов в Германии, США и Финляндии."
      path="/servers"
    />
    <ServerStatus />
  </>
);

export default Servers; 
import React from "react";
import PageHead from "../components/PageHead";
import ServerStatus from "../components/ServerStatus";

const Servers: React.FC = () => (
  <>
    <PageHead
      title="Статус серверов"
      description="Мониторинг доступности серверов ROX.VPN. Информация используется исключительно в технических целях."
      path="/servers"
    />
    <ServerStatus />
  </>
);

export default Servers;

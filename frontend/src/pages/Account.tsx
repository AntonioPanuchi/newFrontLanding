import React from 'react';
import PageHead from '../components/PageHead';

const Account: React.FC = () => (
  <>
    <PageHead
      title="Личный кабинет"
      description="Информация о вашем аккаунте"
      path="/account"
    />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
      <p>Раздел в разработке. Здесь будет отображаться информация о пользователе.</p>
    </div>
  </>
);

export default Account;

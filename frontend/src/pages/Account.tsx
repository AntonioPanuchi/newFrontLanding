import React, { useState } from 'react';
import PageHead from '../components/PageHead';
import { useUser } from '../context/UserContext';

const Account: React.FC = () => {
  const { username, login, logout } = useUser();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      login(trimmed);
      setName('');
    }
  };

  return (
    <>
      <PageHead
        title="Личный кабинет"
        description="Информация о вашем аккаунте"
        path="/account"
      />
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
        {username ? (
          <div className="space-y-4">
            <p className="text-lg">Привет, <span className="font-semibold">{username}</span>!</p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Выйти
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block mb-1">Имя пользователя</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-500"
                placeholder="Введите имя"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Войти
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Account;

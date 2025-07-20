import React, { useState, useEffect } from 'react';
import PageHead from '../components/PageHead';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const Account: React.FC = () => {
  const { username, login, logout } = useUser();
  const { dark, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [editName, setEditName] = useState(username || '');

  useEffect(() => {
    setEditName(username || '');
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      login(trimmed);
      setName('');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (trimmed && trimmed !== username) {
      login(trimmed);
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
          <div className="space-y-6">
            <p className="text-lg">
              Привет, <span className="font-semibold">{username}</span>!
            </p>
            <form onSubmit={handleUpdate} className="space-y-3">
              <label className="block">
                <span className="block mb-1">Изменить имя</span>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-500"
                />
              </label>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Сохранить
              </button>
            </form>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full"
            >
              {dark ? 'Светлая тема' : 'Тёмная тема'}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full"
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

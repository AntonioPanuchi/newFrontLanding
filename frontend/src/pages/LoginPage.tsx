import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageHead from '../components/PageHead';

const LoginPage: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/account');
    } catch (err) {
      setError('Ошибка авторизации');
    }
  };

  return (
    <>
      <PageHead title="Вход" description="Авторизация" path="/login" />
      <div className="container mx-auto p-4 max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Имя"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Войти
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import Card from './Card';
import ServerFilters from './ServerFilters';

type Server = {
  label: string;
  status: 'online' | 'offline';
  users: number;
  ping: number | null;
};

const fetchServers = async (): Promise<Server[]> => {
  const res = await fetch('/api/server-statuses');
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  return res.json();
};

const ServerStatus: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServers = () => {
    setLoading(true);
    setError(null);
    fetchServers()
      .then((data) => {
        const servers = data.map((s: any) => ({
          label: s.name,
          status: s.status,
          users: s.users_online,
          ping: s.ping_ms ?? null,
        }));
        setServers(servers);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServers();
  }, []);

  const filteredServers =
    filter === 'all'
      ? servers
      : servers.filter((s) => s.status === filter);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-blue-50 animate-fade-in-up" id="servers">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-gray-900 drop-shadow-sm">Статус серверов</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <ServerFilters filter={filter} setFilter={setFilter} />
          <button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-blue-600 transition-all text-lg"
            onClick={loadServers}
            disabled={loading}
          >
            Обновить
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl h-40 shadow-inner" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-red-500 py-8">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" strokeWidth="4" />
              <path d="M16 16l16 16M32 16L16 32" strokeWidth="4" />
            </svg>
            <div>{error}</div>
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-blue-600 transition-all text-lg"
              onClick={loadServers}
            >
              Повторить попытку
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {filteredServers.map((s, i) => (
                <Card
                  key={s.label}
                  className={`text-center p-6 rounded-2xl shadow-xl border-2 ${s.status === 'online' ? 'border-green-400' : 'border-red-300'} bg-white/90 backdrop-blur animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.1 + 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className={`text-2xl font-bold mb-2 ${s.status === 'online' ? 'text-green-600' : 'text-red-500'}`}>{s.label}</div>
                  <div className={`mb-2 flex items-center justify-center gap-2`}>
                    <span className={`inline-block w-3 h-3 rounded-full ${s.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                    <span className={`text-base font-semibold ${s.status === 'online' ? 'text-green-600' : 'text-red-500'}`}>{s.status === 'online' ? 'Онлайн' : 'Оффлайн'}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Пользователей: <span className="font-bold text-gray-700">{s.users}</span></div>
                  <div className="text-sm text-gray-500">Пинг: <span className="font-bold text-gray-700">{s.ping !== null ? s.ping + ' мс' : '—'}</span></div>
                </Card>
              ))}
            </div>
            {filteredServers.length === 0 && !loading && !error && (
              <div className="flex flex-col items-center text-gray-400 py-8">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" strokeWidth="4" />
                  <path d="M16 24h16M24 16v16" strokeWidth="4" />
                </svg>
                <div>Нет серверов с выбранным статусом</div>
                <button
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-blue-600 transition-all text-lg"
                  onClick={loadServers}
                >
                  Обновить
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ServerStatus; 
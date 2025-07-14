import React, { useEffect, useState } from 'react';
import CountryFlag from 'react-country-flag';

type Server = {
  country: string;
  status: 'online' | 'offline';
  ping: number;
  users: number;
  uptime: string;
  traffic: number;
  cpu: number;
  memUsed: number;
  memTotal: number;
};

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(2) + ' ТБ';
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' ГБ';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' МБ';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' КБ';
  return bytes + ' Б';
}

function formatMem(used: number, total: number): string {
  if (total >= 1e9) return `${(used / 1e9).toFixed(2)} / ${(total / 1e9).toFixed(2)} ГБ`;
  if (total >= 1e6) return `${(used / 1e6).toFixed(2)} / ${(total / 1e6).toFixed(2)} МБ`;
  return `${used} / ${total} Б`;
}

function getCountryCode(country: string): string | undefined {
  switch (country.toLowerCase()) {
    case 'germany': return 'DE';
    case 'usa': case 'us': case 'united states': return 'US';
    case 'finland': return 'FI';
    default: return undefined;
  }
}

const ServerCard = ({ server, index }: { server: Server; index: number }) => {
  const memPercent = Math.round((server.memUsed / server.memTotal) * 100);
  const countryCode = getCountryCode(server.country);
  const statusColor = server.status === 'online' ? 'bg-green-400' : 'bg-red-400';

  return (
    <div
      className={`relative flex flex-col items-center justify-between min-h-[280px] sm:min-h-[360px] bg-white/90 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up px-6 sm:px-10 md:px-14 py-8 sm:py-12 backdrop-blur-xl transition-transform duration-300 hover:scale-105`}
      style={{
        animationDelay: `${index * 0.1 + 0.1}s`,
        animationFillMode: 'both',
      }}
    >
      {/* Blur Ball/Particle */}
      <span className="absolute -top-10 -left-10 w-24 sm:w-32 h-24 sm:h-32 bg-blue-400 opacity-20 blur-2xl rounded-full animate-pulse pointer-events-none" />
      {/* Вертикальный цветной индикатор */}
      <span className={`absolute left-0 top-0 h-full w-2 ${statusColor} rounded-l-3xl`} />
      {/* Контент */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center gap-3 mb-3">
          {countryCode && (
            <CountryFlag
              countryCode={countryCode}
              svg
              style={{ width: '2.5em', height: '2.5em', borderRadius: '0.7em', boxShadow: '0 1px 4px #0002' }}
              title={server.country}
            />
          )}
          <span className="text-xl sm:text-2xl font-bold">{server.country}</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-semibold ${server.status === 'online' ? 'text-green-600' : 'text-red-500'}`}>{server.status === 'online' ? '🟢 Онлайн' : '🔴 Оффлайн'}</span>
          <span className="text-gray-400 text-sm sm:text-base">({server.uptime})</span>
        </div>
        {/* Минимализм + большие цифры */}
        <div className="flex flex-col items-center gap-1 my-3">
          <div className="text-4xl sm:text-5xl font-black">{server.ping} <span className="text-lg font-normal">мс</span></div>
          <div className="text-lg sm:text-xl text-gray-500">Пинг</div>
        </div>
        <div className="flex flex-col items-center gap-1 my-3">
          <div className="text-3xl sm:text-4xl font-bold">{server.users}</div>
          <div className="text-lg sm:text-xl text-gray-500">Пользователей</div>
        </div>
        {/* Прогресс-бары */}
        <div className="w-full mt-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>CPU</span>
            <span>{server.cpu}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-400 to-blue-400" style={{ width: `${Math.min(server.cpu, 100)}%` }} />
          </div>
        </div>
        <div className="w-full mt-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Память</span>
            <span>{formatMem(server.memUsed, server.memTotal)}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-blue-400 to-indigo-400" style={{ width: `${memPercent}%` }} />
          </div>
        </div>
        <div className="w-full mt-3 flex items-center gap-3 text-gray-500">
          ⇅ <span>Трафик:</span> <span className="font-semibold">{formatBytes(server.traffic)}</span>
        </div>
      </div>
    </div>
  );
};

const fetchServers = async (): Promise<Server[]> => {
  const res = await fetch('/api/server-statuses');
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((s: any) => ({
    country: s.name,
    status: s.status,
    ping: s.ping_ms,
    users: s.users_online,
    uptime: s.uptime,
    traffic: s.traffic_used,
    cpu: s.cpu_load,
    memUsed: s.mem_used,
    memTotal: s.mem_total,
  }));
};

const ServerStatus: React.FC = () => {
  const [servers, setServers] = useState<Server[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers().then(data => {
      setServers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Загрузка статуса серверов...</div>;
  }
  if (!Array.isArray(servers)) {
    return <div className="p-8 text-center text-red-500">Ошибка загрузки серверов</div>;
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-bold mb-12 text-center">Статус серверов</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-14">
          {servers.map((server, i) => (
            <ServerCard key={server.country} server={server} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServerStatus; 
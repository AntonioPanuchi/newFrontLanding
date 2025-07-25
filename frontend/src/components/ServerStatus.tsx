import React, { useEffect, useState } from 'react';
import ServerCardSkeleton from './ServerCardSkeleton';
import { useInView } from '../hooks/useInView';
import AnimatedCounter from './AnimatedCounter';

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

function getCountryFlag(country: string): string {
  switch (country.toLowerCase()) {
    case 'germany': return '🇩🇪';
    case 'usa': case 'us': case 'united states': return '🇺🇸';
    case 'finland': return '🇫🇮';
    default: return '🌍';
  }
}

// Круговой прогрессбар SVG
const CircleProgress: React.FC<{ percent: number; color: string; label: string; value: string; }> = ({ percent, color, label, value }) => {
  const size = 64;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - percent / 100);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="mb-1" style={{ display: 'block' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="1.1rem"
          fontWeight="bold"
          fill={color}
        >
          {value}
        </text>
      </svg>
      <span className="text-xs text-gray-500 dark:text-gray-300 italic font-medium mt-0.5">{label}</span>
    </div>
  );
};

const ServerCard = ({ server, index }: { server: Server; index: number }) => {
  const memPercent = server.memTotal > 0 ? Math.round((server.memUsed / server.memTotal) * 100) : 0;
  const countryFlag = getCountryFlag(server.country);
  const statusColor = server.status === 'online' ? 'bg-green-400' : 'bg-red-400';
  const statusTextColor = server.status === 'online' ? 'text-green-600' : 'text-red-500';

  return (
    <div
      className={`card-panel group animate-fade-in-up hover:rotate-1 hover:border-accent/50`}
      style={{
        animationDelay: `${index * 0.1 + 0.1}s`,
        animationFillMode: 'both',
      }}
    >
      {/* Blur Ball/Particle */}
      <span className="absolute -top-10 -left-10 w-24 sm:w-32 h-24 sm:h-32 bg-blue-400 dark:bg-blue-900 opacity-20 blur-2xl rounded-full animate-pulse pointer-events-none transition-colors duration-300" />
      {/* Вертикальный цветной индикатор */}
      <span className={`absolute left-0 top-0 h-full w-2 ${statusColor} rounded-l-3xl`} />
      {/* Контент */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Название и статус */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300" title={server.country}>{countryFlag}</div>
          <span className="text-2xl sm:text-3xl font-extrabold dark:text-gray-100">{server.country}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className={`font-bold text-lg ${statusTextColor}`}>{server.status === 'online' ? '🟢 Онлайн' : '🔴 Оффлайн'}</span>
          <span className="text-gray-400 text-base italic">({server.uptime})</span>
        </div>
        {/* Сетка 2x2 */}
        <div className="grid grid-cols-2 gap-4 w-full my-2">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold dark:text-gray-100">{server.ping} <span className="text-lg font-normal">мс</span></div>
            <div className="text-gray-500 dark:text-gray-300 italic font-medium">Пинг</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold dark:text-gray-100">
              <AnimatedCounter to={server.users} />
            </div>
            <div className="text-gray-500 dark:text-gray-300 italic font-medium">Пользователей</div>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress percent={server.cpu} color="#22c55e" label="CPU" value={`${server.cpu}%`} />
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress percent={memPercent} color="#0ea5e9" label="Память" value={`${memPercent}%`} />
          </div>
        </div>
        {/* Трафик */}
        <div className="w-full mt-2 flex items-center gap-3 text-gray-500 dark:text-gray-300 justify-center">
          ⇅ <span>Трафик:</span> <span className="font-semibold">{formatBytes(server.traffic)}</span>
        </div>
      </div>
    </div>
  );
};

const fetchServers = async (): Promise<Server[] | null> => {
  try {
    const res = await fetch('/api/server-statuses');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    
    // API возвращает { servers: [...], lastUpdate: "..." }
    const serversArray = data.servers || data;
    
    if (!Array.isArray(serversArray)) {
      console.error('Unexpected API response format:', data);
      return [];
    }
    
    return serversArray.map((s: any) => ({
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
  } catch (e) {
    console.error('Error fetching servers:', e);
    return null;
  }
};

const ServerStatus: React.FC = () => {
  const [servers, setServers] = useState<Server[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [ref, inView] = useInView();

  const loadServers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServers();
      setServers(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Ошибка загрузки серверов');
      console.error('Failed to load servers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
    
    // Автообновление каждые 30 секунд
    const interval = setInterval(loadServers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section ref={ref} className={`py-20 sm:py-28 dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">Статус серверов</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-14">
            {[...Array(3)].map((_, i) => <ServerCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section ref={ref} className={`py-20 sm:py-28 dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">Статус серверов</h2>
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button 
              onClick={loadServers}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(servers)) {
    return (
      <section ref={ref} className={`py-20 sm:py-28 dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">Статус серверов</h2>
          <div className="text-center text-red-500">Ошибка загрузки серверов</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`py-20 sm:py-28 dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold dark:text-gray-100">Статус серверов</h2>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Обновлено: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <button 
              onClick={loadServers}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Обновление...' : 'Обновить'}
            </button>
          </div>
        </div>
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

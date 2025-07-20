import React, { useEffect, useState } from 'react';
import PageHead from '../components/PageHead';

interface Inbound {
  id: number;
  remark?: string;
  enable?: boolean;
}

const XuiDashboard: React.FC = () => {
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/xui/inbounds')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setInbounds(Array.isArray(data.inbounds) ? data.inbounds : []);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHead title="3x-ui" description="Управление сервером" path="/xui" />
      <div className="container mx-auto p-4 max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">3x-ui Dashboard</h1>
        {loading && <p>Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {inbounds.map(inb => (
            <li key={inb.id} className="border rounded p-2">
              <div className="font-semibold">{inb.remark || inb.id}</div>
              <div className="text-sm">{inb.enable ? 'Включен' : 'Выключен'}</div>
            </li>
          ))}
          {inbounds.length === 0 && !loading && <li>Нет данных</li>}
        </ul>
      </div>
    </>
  );
};

export default XuiDashboard;

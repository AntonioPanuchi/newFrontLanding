import React, { useEffect, useState } from "react";
import PageHead from "../components/PageHead";

interface Inbound {
  id: number;
  remark?: string;
  enable?: boolean;
  port?: number;
  protocol?: string;
  up?: number;
  down?: number;
  total?: number;
  expiryTime?: number;
}

interface Server {
  id: number;
  name: string;
  baseUrl: string;
  username: string;
  password: string;
}

const XuiDashboard: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newServer, setNewServer] = useState({
    name: "",
    baseUrl: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetch("/api/xui/servers")
      .then((res) => res.json())
      .then((data) => {
        setServers(Array.isArray(data.servers) ? data.servers : []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const fetchInbounds = (id: number) => {
    setLoading(true);
    fetch(`/api/xui/inbounds/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setSelected(id);
        setInbounds(Array.isArray(data.inbounds) ? data.inbounds : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const addServer = () => {
    fetch("/api/xui/servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newServer),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add");
        return res.json();
      })
      .then((data) => {
        setServers((s) => [...s, { ...newServer, id: data.id }]);
        setNewServer({ name: "", baseUrl: "", username: "", password: "" });
      })
      .catch((e) => setError(e.message));
  };

  const removeServer = (id: number) => {
    fetch(`/api/xui/servers/${id}`, { method: "DELETE" })
      .then(() => {
        setServers((s) => s.filter((sr) => sr.id !== id));
        if (selected === id) {
          setSelected(null);
          setInbounds([]);
        }
      })
      .catch((e) => setError(e.message));
  };

  return (
    <>
      <PageHead
        title="3x-ui"
        description="Управление сервером"
        path="/account/xui"
      />
      <div className="container mx-auto p-4 max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">3x-ui Dashboard</h1>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Серверы</h2>
          <ul className="space-y-2">
            {servers.map((s) => (
              <li
                key={s.id}
                className="border rounded p-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.baseUrl}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fetchInbounds(s.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    Просмотр
                  </button>
                  <button
                    type="button"
                    onClick={() => removeServer(s.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
            {servers.length === 0 && <li>Нет серверов</li>}
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Добавить сервер</h2>
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Название"
            value={newServer.name}
            onChange={(e) =>
              setNewServer({ ...newServer, name: e.target.value })
            }
          />
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="URL"
            value={newServer.baseUrl}
            onChange={(e) =>
              setNewServer({ ...newServer, baseUrl: e.target.value })
            }
          />
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Username"
            value={newServer.username}
            onChange={(e) =>
              setNewServer({ ...newServer, username: e.target.value })
            }
          />
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            value={newServer.password}
            onChange={(e) =>
              setNewServer({ ...newServer, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={addServer}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Добавить
          </button>
        </div>

        {selected && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Правила сервера</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
              {inbounds.map((inb) => (
                <li key={inb.id} className="border rounded p-2 space-y-1">
                  <div className="font-semibold">{inb.remark || inb.id}</div>
                  <div className="text-sm">
                    {inb.enable ? "Включен" : "Выключен"}
                  </div>
                  {inb.port && (
                    <div className="text-sm text-gray-500">Порт: {inb.port}</div>
                  )}
                  {inb.protocol && (
                    <div className="text-sm text-gray-500">Протокол: {inb.protocol}</div>
                  )}
                  {(inb.up || inb.down) && (
                    <div className="text-sm text-gray-500">
                      Трафик: {((inb.up || 0) + (inb.down || 0)) / (1024 * 1024)} MB
                    </div>
                  )}
                  {inb.total && (
                    <div className="text-sm text-gray-500">Лимит: {inb.total / (1024 * 1024)} MB</div>
                  )}
                  {inb.expiryTime && (
                    <div className="text-sm text-gray-500">
                      Истекает: {new Date(inb.expiryTime * 1000).toLocaleDateString()}
                    </div>
                  )}
                </li>
              ))}
              {inbounds.length === 0 && !loading && <li>Нет данных</li>}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default XuiDashboard;

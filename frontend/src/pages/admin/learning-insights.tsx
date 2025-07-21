import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LearningInsightsDashboard() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.includes("auth_token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const ws = new WebSocket("wss://rx-test.ru/ws/insights");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs((prev) => [data, ...prev.slice(0, 100)]);
    };
    return () => ws.close();
  }, []);

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">📊 Обучение агентов</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetch("/api/auth/logout").then(() => navigate("/login"));
          }}
        >
          Выйти
        </Button>
      </div>
      <ul className="space-y-1 text-sm font-mono text-muted-foreground">
        {logs.map((log, i) => (
          <li key={i}>{JSON.stringify(log)}</li>
        ))}
      </ul>
    </main>
  );
}

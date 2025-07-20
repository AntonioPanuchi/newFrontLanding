import React, { useState } from "react";
import { useAccount } from "../context/AccountContext";

const MyDataPage: React.FC = () => {
  const { state, addDocument } = useAccount();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleAdd = () => {
    if (file) {
      addDocument({
        id: Date.now(),
        title: file.name,
        type: file.type || "file",
        date: new Date().toISOString(),
      });
      setFile(null);
    }
  };

  const docs = state.documents.filter(
    (d) =>
      (!typeFilter || d.type === typeFilter) &&
      d.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Мои данные</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="search"
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded-md"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="text/plain">Текст</option>
          <option value="application/pdf">PDF</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Загрузить
        </button>
      </div>
      <ul className="space-y-2">
        {docs.map((d) => (
          <li key={d.id} className="border-b pb-1 text-sm">
            {d.title} — {new Date(d.date).toLocaleDateString()} ({d.type})
          </li>
        ))}
        {docs.length === 0 && (
          <li className="text-sm text-gray-500">Нет данных</li>
        )}
      </ul>
    </div>
  );
};

export default MyDataPage;

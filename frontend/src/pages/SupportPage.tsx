import React, { useState } from "react";
import { useAccount } from "../context/AccountContext";

const SupportPage: React.FC = () => {
  const { state, addMessage } = useAccount();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSend = () => {
    if (text.trim()) {
      addMessage({
        id: Date.now(),
        text,
        fileName: file?.name,
        date: new Date().toISOString(),
        from: "user",
      });
      setText("");
      setFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Поддержка</h2>
      <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
        {state.messages.map((m) => (
          <li key={m.id} className="text-sm border-b pb-1">
            <span className="font-semibold mr-2">
              {m.from === "user" ? "Вы" : "Поддержка"}:
            </span>
            {m.text}
            {m.fileName && (
              <span className="ml-2 text-gray-500">({m.fileName})</span>
            )}
          </li>
        ))}
        {state.messages.length === 0 && (
          <li className="text-sm text-gray-500">Нет сообщений</li>
        )}
      </ul>
      <div className="space-y-2">
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ваше сообщение"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default SupportPage;

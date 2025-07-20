import React, { useState } from "react";
import { useAccount } from "../context/AccountContext";

const ProfilePage: React.FC = () => {
  const { state, updateProfile } = useAccount();
  const [name, setName] = useState(state.profile.name);
  const [password, setPassword] = useState(state.profile.password);
  const [subscription, setSubscription] = useState(state.profile.subscription);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, password, subscription });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Профиль</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <label className="block">
          <span className="block mb-1">Имя</span>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block mb-1">Пароль</span>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block mb-1">Тариф</span>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
          >
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Business">Business</option>
          </select>
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Сохранить
        </button>
      </form>
      {state.profile.payments.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">История платежей</h3>
          <ul className="space-y-1">
            {state.profile.payments.map((p) => (
              <li key={p.id} className="text-sm border-b pb-1">
                {new Date(p.date).toLocaleDateString()} — {p.amount}₽
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

import React from "react";
import { useAccount } from "../context/AccountContext";

const NotificationsPage: React.FC = () => {
  const { state, updateNotifications } = useAccount();
  const n = state.notifications;

  const handleChange =
    (key: keyof typeof n) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNotifications({ ...n, [key]: e.target.checked });
    };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Уведомления</h2>
      <form className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={n.email}
            onChange={handleChange("email")}
          />
          <span>E-mail</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={n.sms}
            onChange={handleChange("sms")}
          />
          <span>SMS</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={n.push}
            onChange={handleChange("push")}
          />
          <span>Push</span>
        </label>
      </form>
    </div>
  );
};

export default NotificationsPage;

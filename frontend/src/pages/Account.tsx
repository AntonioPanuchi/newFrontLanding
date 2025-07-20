import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import PageHead from "../components/PageHead";
import { useAccount } from "../context/AccountContext";
import { useUser } from "../context/UserContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-md text-center transition-colors ${
    isActive
      ? "bg-blue-600 text-white"
      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
  }`;

const Account: React.FC = () => {
  const { state } = useAccount();
  const { username } = useUser();

  return (
    <>
      <PageHead
        title="Личный кабинет"
        description="Управление аккаунтом"
        path="/account"
      />
      <div className="container mx-auto p-4 max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Личный кабинет</h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-1">
          <p>
            Пользователь: <strong>{username || state.profile.name}</strong>
          </p>
          <p>
            Подписка: <strong>{state.profile.subscription}</strong>
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2">
          <NavLink to="profile" className={linkClass}>
            Профиль
          </NavLink>
          <NavLink to="xui" className={linkClass}>
            3x-ui
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default Account;

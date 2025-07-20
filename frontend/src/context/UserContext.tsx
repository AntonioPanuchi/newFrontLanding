import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextProps {
  username: string | null;
  role: string | null;
  token: string | null;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  username: null,
  role: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

function getInitialState() {
  if (typeof window !== 'undefined') {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      token: localStorage.getItem('token'),
    };
  }
  return { username: null, role: null, token: null };
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    if (state.username) {
      localStorage.setItem('username', state.username);
      localStorage.setItem('role', state.role || '');
      localStorage.setItem('token', state.token || '');
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    }
  }, [state]);

  const login = async (name: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }),
    });
    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    setState({ username: name, role: data.role, token: data.token });
  };
  const logout = () => setState({ username: null, role: null, token: null });

  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}

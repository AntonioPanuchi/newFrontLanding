import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextProps {
  username: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  username: null,
  login: () => {},
  logout: () => {},
});

function getInitialUser(): string | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('username');
    return saved || null;
  }
  return null;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(getInitialUser);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  const login = (name: string) => setUsername(name);
  const logout = () => setUsername(null);

  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}

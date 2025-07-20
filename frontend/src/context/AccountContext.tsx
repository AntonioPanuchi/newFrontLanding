import React, { createContext, useContext, useEffect, useState } from "react";

export interface Payment {
  id: number;
  date: string;
  amount: number;
}

export interface DocumentItem {
  id: number;
  title: string;
  type: string;
  date: string;
}

export interface MessageItem {
  id: number;
  text: string;
  fileName?: string;
  date: string;
  from: "user" | "support";
}

export interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface Profile {
  name: string;
  password: string;
  subscription: string;
  payments: Payment[];
}

interface AccountState {
  profile: Profile;
  documents: DocumentItem[];
  messages: MessageItem[];
  notifications: NotificationPrefs;
}

interface AccountContextProps {
  state: AccountState;
  updateProfile: (p: Partial<Profile>) => void;
  addPayment: (p: Payment) => void;
  addDocument: (d: DocumentItem) => void;
  addMessage: (m: MessageItem) => void;
  updateNotifications: (n: NotificationPrefs) => void;
}

const defaultState: AccountState = {
  profile: {
    name: "Гость",
    password: "",
    subscription: "Free",
    payments: [],
  },
  documents: [],
  messages: [],
  notifications: { email: true, sms: false, push: true },
};

const AccountContext = createContext<AccountContextProps>({
  state: defaultState,
  updateProfile: () => {},
  addPayment: () => {},
  addDocument: () => {},
  addMessage: () => {},
  updateNotifications: () => {},
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AccountState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("account");
      if (saved) return JSON.parse(saved) as AccountState;
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(state));
  }, [state]);

  const updateProfile = (profile: Partial<Profile>) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }));
  const addPayment = (payment: Payment) =>
    setState((s) => ({
      ...s,
      profile: { ...s.profile, payments: [payment, ...s.profile.payments] },
    }));
  const addDocument = (doc: DocumentItem) =>
    setState((s) => ({ ...s, documents: [doc, ...s.documents] }));
  const addMessage = (msg: MessageItem) =>
    setState((s) => ({ ...s, messages: [...s.messages, msg] }));
  const updateNotifications = (n: NotificationPrefs) =>
    setState((s) => ({ ...s, notifications: n }));

  return (
    <AccountContext.Provider
      value={{
        state,
        updateProfile,
        addPayment,
        addDocument,
        addMessage,
        updateNotifications,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  return useContext(AccountContext);
}

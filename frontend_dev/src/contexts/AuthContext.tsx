// context/AuthContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { User } from "../types/user";

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  resetAuthContext: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  valueOverride?: Partial<AuthContextProps>; // 🔹 オプションで override を許可
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, valueOverride }) => {
  const [user, setUser] = useState<User | null>(null);

  const resetAuthContext = () => {
    setUser(null);
  };  

  const value = useMemo(
    () => ({
      user: valueOverride?.user ?? user,
      setUser: valueOverride?.setUser ?? setUser,
      resetAuthContext,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

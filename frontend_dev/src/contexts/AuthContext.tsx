// context/AuthContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { User } from "../types/user";

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  resetAuthContext: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const resetAuthContext = () => {
    setUser(null);
  };  

  const value = useMemo(
    () => ({
      user,
      setUser,
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

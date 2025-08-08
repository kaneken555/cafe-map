// context/CafeContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { Cafe } from "../types/cafe";

interface CafeContextProps {
  cafeList: Cafe[];
  setCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  myCafeList: Cafe[];
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  sharedMapCafeList: Cafe[];
  setSharedMapCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  selectedSearchedCafe: Cafe | null;
  setSelectedSearchedCafe: React.Dispatch<React.SetStateAction<Cafe | null>>;
  selectedRegisteredCafe: Cafe | null;
  setSelectedRegisteredCafe: React.Dispatch<React.SetStateAction<Cafe | null>>;
  resetCafeContext: () => void;
}

const CafeContext = createContext<CafeContextProps | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cafeList, setCafeList] = useState<Cafe[]>([]);
  const [myCafeList, setMyCafeList] = useState<Cafe[]>([]);
  const [sharedMapCafeList, setSharedMapCafeList] = useState<Cafe[]>([]);
  const [selectedSearchedCafe, setSelectedSearchedCafe] = useState<Cafe | null>(null);
  const [selectedRegisteredCafe, setSelectedRegisteredCafe] = useState<Cafe | null>(null);

  const resetCafeContext = () => {
    setCafeList([]);
    setMyCafeList([]);
    setSharedMapCafeList([]);
    setSelectedSearchedCafe(null);
    setSelectedRegisteredCafe(null);
  };

  const value = useMemo(
    () => ({
      cafeList,
      setCafeList,
      myCafeList,
      setMyCafeList,
      sharedMapCafeList,
      setSharedMapCafeList,
      selectedSearchedCafe,
      setSelectedSearchedCafe,
      selectedRegisteredCafe,
      setSelectedRegisteredCafe,
      resetCafeContext,
    }),
    [
      cafeList, 
      myCafeList, 
      sharedMapCafeList,
      selectedSearchedCafe,
      selectedRegisteredCafe,
    ]
  );

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) throw new Error("useCafe must be used within a CafeProvider");
  return context;
};

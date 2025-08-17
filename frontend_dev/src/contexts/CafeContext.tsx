// context/CafeContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { Cafe } from "../types/cafe";
import { mockSearchResults } from "../api/mockCafeData"; // ✅ Cafe型をインポート


interface CafeContextProps {
  cafeList: Cafe[];
  setCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  /** ✅ 自分のマップに登録済みのカフェ */
  myCafeList: Cafe[];
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  /** 🔗 シェアマップ上の登録済みカフェ */
  sharedMapCafeList: Cafe[];
  setSharedMapCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
  /** 🔍 検索結果（未登録） */
  searchResultCafes: Cafe[];
  setSearchResultCafes: React.Dispatch<React.SetStateAction<Cafe[]>>;
  /** 🔍 検索結果から選択されたカフェ */
  selectedSearchedCafe: Cafe | null;
  setSelectedSearchedCafe: React.Dispatch<React.SetStateAction<Cafe | null>>;
  /** ✅ 登録済みリストから選択されたカフェ */
  selectedRegisteredCafe: Cafe | null;
  setSelectedRegisteredCafe: React.Dispatch<React.SetStateAction<Cafe | null>>;
  /** よく使うヘルパー */
  clearSelectedCafe: () => void;
  /** まとめて初期化 */
  resetCafeContext: () => void;
}

const CafeContext = createContext<CafeContextProps | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cafeList, setCafeList] = useState<Cafe[]>([]);
  const [myCafeList, setMyCafeList] = useState<Cafe[]>([]);
  const [sharedMapCafeList, setSharedMapCafeList] = useState<Cafe[]>([]);
  const [selectedSearchedCafe, setSelectedSearchedCafe] = useState<Cafe | null>(null);
  const [selectedRegisteredCafe, setSelectedRegisteredCafe] = useState<Cafe | null>(null);
  const [searchResultCafes, setSearchResultCafes] = useState<Cafe[]>(mockSearchResults); // 検索結果

  const clearSelectedCafe = () => {
    setSelectedSearchedCafe(null);
    setSelectedRegisteredCafe(null);
  };

  const resetCafeContext = () => {
    setCafeList([]);
    setMyCafeList([]);
    setSharedMapCafeList([]);
    setSearchResultCafes(mockSearchResults); // 初期状態に戻す
    clearSelectedCafe();
  };

  const value = useMemo(
    () => ({
      cafeList,
      setCafeList,
      myCafeList,
      setMyCafeList,
      sharedMapCafeList,
      setSharedMapCafeList,
      searchResultCafes,
      setSearchResultCafes,
      selectedSearchedCafe,
      setSelectedSearchedCafe,
      selectedRegisteredCafe,
      setSelectedRegisteredCafe,
      clearSelectedCafe,
      resetCafeContext,
    }),
    [
      cafeList, 
      myCafeList, 
      sharedMapCafeList,
      searchResultCafes,
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

// src/pages/HomePage.tsx
import React from "react";
import MapComponent from "../components/Map";

interface HomePageProps {
  selectedMap: { id: number; name: string } | null;
}

const HomePage: React.FC<HomePageProps> = ({ selectedMap }) => {
  return (
    <div>
      <MapComponent selectedMap={selectedMap} />
    </div>
  );
};

export default HomePage;

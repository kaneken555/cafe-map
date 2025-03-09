// src/pages/HomePage.tsx
import React from "react";
import MapComponent from "../components/Map";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>カフェマップ</h1>
      <MapComponent />
    </div>
  );
};

export default HomePage;

// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import MapComponent from "./components/Map"; // ← MapComponent追加

const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<{ id: number; name: string } | null>(null);

  return (
    <Router>
      <Header selectedMap={selectedMap} setSelectedMap={setSelectedMap} />
      <Routes>
      <Route path="/" element={<HomePage selectedMap={selectedMap} />} />
      </Routes>
    </Router>
  );
};

export default App;

// App.tsx
import './App.css'
// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import HomePage from './pages/HomePage';
import SharedMapViewPage from './pages/SharedMapViewPage';
import AnalyzePage from './pages/AnalyzePage';
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";
import { CafeProvider } from './contexts/CafeContext';
import { GroupProvider } from './contexts/GroupContext';

import InitializeApp from './components/InitializeApp'; // ✅ 初期化ロジックを切り出し

const App: React.FC = () => {
  // const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Router>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["visualization", "marker"]}
        loadingElement={<div>Loading Maps...</div>}
      >
        <AuthProvider>
          <MapProvider>
            <CafeProvider>
              <GroupProvider>
                <InitializeApp /> {/* ✅ 初期化ロジックを切り出し */}
                  <div className="min-h-screen flex flex-col">
                    {/* トーストを追加 */}
                    <Toaster />

                    {/* メインコンテンツ */}
                    <main className="flex-grow">
                      <Routes>
                        {/* <Route path="/" element={<HomePage user={user} setUser={setUser} />} /> */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shared-maps/:uuid" element={<SharedMapViewPage />} />
                        <Route path="/analyze" element={<AnalyzePage />} />
                      </Routes>
                    </main>
                  </div>
              </GroupProvider>
            </CafeProvider>
          </MapProvider>
        </AuthProvider>
      </LoadScript>
    </Router>
  )
}

export default App

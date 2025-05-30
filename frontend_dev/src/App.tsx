// App.tsx
import './App.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";
import { CafeProvider } from './contexts/CafeContext';
import { GroupProvider } from './contexts/GroupContext';

const App: React.FC = () => {
  // const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  return (
    <Router>
      <AuthProvider>
        <MapProvider>
          <CafeProvider>
            <GroupProvider>
            <div className="min-h-screen flex flex-col">       
              {/* トーストを追加 */}
              <Toaster /> 

              {/* メインコンテンツ */}
              <main className="flex-grow">
                <Routes>
                  {/* <Route path="/" element={<HomePage user={user} setUser={setUser} />} /> */}
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </main>
            </div>
            </GroupProvider>
          </CafeProvider>
        </MapProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

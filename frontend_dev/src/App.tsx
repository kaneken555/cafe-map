// App.tsx
import './App.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import { Toaster } from "react-hot-toast";


const App: React.FC = () => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">       
        {/* トーストを追加 */}
        <Toaster /> 

        {/* メインコンテンツ */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

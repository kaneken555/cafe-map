import './App.css'
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';

const App: React.FC = () => {

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* ヘッダー */}
        {/* <Header selectedMap={selectedMap} setSelectedMap={setSelectedMap} /> */}
        <Header />
        
        {/* メインコンテンツ */}
        <main className="flex-grow bg-white">
          <Routes>
            {/* <Route path="/" element={<HomePage selectedMap={selectedMap} />} /> */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        {/* <Map /> */}
      </div>
    </Router>
  )
}

export default App

// App.tsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {

  return (
    <Router>
      <div className="min-h-screen flex flex-col">       
        {/* トーストを追加 */}
        <Toaster /> 

        {/* メインコンテンツ */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

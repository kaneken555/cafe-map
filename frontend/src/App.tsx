import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("API request error:", error);
        setMessage("API error");
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Cafe Map</h1>
        <p>API Response: {message}</p>
      </header>
    </div>
  );
}

export default App;

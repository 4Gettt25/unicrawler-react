import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import Chat from './components/Chat'; // Adjust the path as necessary

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      const taskId = response.data.task_id;
      const intervalId = setInterval(async () => {
        const resultResponse = await axios.get(`http://localhost:5000/results/${taskId}`);
        if (resultResponse.data.state === 'SUCCESS') {
          setResults(resultResponse.data.pdf_results);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch (error) {
      setError('Error fetching results');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Chat handleSend={handleSend} setQuery={setQuery} />
      {error && <p>{error}</p>}
      {results && <div>Results: {JSON.stringify(results)}</div>}
    </div>
  );
};

export default App;
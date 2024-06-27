import axios from 'axios';
import React, { useState } from 'react';

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
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSend}>Search</button>
      {error && <p>{error}</p>}
      {results && (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <strong>File Path:</strong> {result.file_path}
              <br />
              <strong>Context:</strong> {result.context}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;

// src/components/Chat.js
import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      const taskId = response.data.task_id;
      console.log('Task ID:', taskId);  // Log task ID
      const intervalId = setInterval(async () => {
        const resultResponse = await axios.get(`http://localhost:5000/results/${taskId}`);
        console.log('Result Response:', resultResponse.data);  // Log result response
        if (resultResponse.data.state === 'SUCCESS') {
          setResults(resultResponse.data.pdf_results);
          console.log('Results:', resultResponse.data.pdf_results);  // Log results
          clearInterval(intervalId);
        }
      }, 1000);
    } catch (error) {
      setError('Error fetching results');
      console.error(error);
    const data = await response.json();
    const responseMessage = `
      PDFs:
      ${data.pdf_results.map(r => `File: ${r.file}, Page: ${r.page}, Context: ${r.context.substring(0, 100)}...`).join('\n')}
      Excels:
      ${data.excel_results.map(r => `File: ${r.file}, Cell: ${r.cell}, Context: ${r.context.substring(0, 100)}...`).join('\n')}
    `;
    setMessages([...messages, { text: input, user: 'user' }, { text: responseMessage, user: 'bot' }]);
    setInput('');
  };
  

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.user === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
}

export default Chat;

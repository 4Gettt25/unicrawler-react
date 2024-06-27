// src/components/Chat.js
import axios from 'axios';
import React, { useEffect, useState } from 'react'; // Updated import to include useEffect

const Chat = async () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  let intervalId = null;

  const handleSend = async () => {
    try {
      // Assuming query is defined somewhere in your code
      const response = await axios.post('http://localhost:5000/query', { query });
      const taskId = response.data.task_id;
      console.log('Task ID:', taskId);  // Log task ID
      clearInterval(intervalId);  // Clear previous interval before setting a new one
      intervalId = setInterval(async () => {
        const resultResponse = await axios.get(`http://localhost:5000/results/${taskId}`);
        console.log('Result Response:', resultResponse.data);  // Log result response
        if (resultResponse.data.state === 'SUCCESS') {
          setMessages(resultResponse.data.pdf_results); // Assuming you meant to update messages
          console.log('Results:', resultResponse.data.pdf_results);  // Log results
          clearInterval(intervalId);
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    return () => {
      clearInterval(intervalId);  // Clear interval when component is unmounted
    };
  }, [intervalId]);
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


export default Chat;

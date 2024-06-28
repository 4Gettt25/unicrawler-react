// src/components/Chat.js
import axios from 'axios';
import React, { useRef, useState } from 'react';
import './Chat.css';

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const intervalIdRef = useRef(null);

	const handleSend = async () => {
		const response = await axios.post('http://localhost:5000/query', {
			query: input,
		});
		const taskId = response.data.task_id;
		console.log('Task ID:', taskId);

		intervalIdRef.current = setInterval(async () => {
			const resultResponse = await axios.get(
				`http://localhost:5000/results/${taskId}`
			);
			const result = resultResponse.data;
			console.log('Result Response:', result);

			if (result.state === 'SUCCESS') {
				clearInterval(intervalIdRef.current);
				setMessages((prevMessages) => [
					...prevMessages,
					{ text: result.pdf_results, user: 'bot' },
				]);
			}
		}, 1000); // poll every 1 second
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: input, user: 'me' },
		]);
		setInput('');
		handleSend();
	};

	return (
		<div className="chat-container">
			<div className="messages">
				{messages.map((msg, index) => (
					<div key={index} className={`message ${msg.user}`}>
						{msg.text}
					</div>
				))}
			</div>
			<form className="input-form" onSubmit={handleSubmit}>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="input-field"
				/>
				<button type="submit" className="send-button">
					Send
				</button>
			</form>
		</div>
	);
};

export default Chat;

import axios from 'axios';
import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');

	const handleSend = async () => {
		if (input.trim() === '') return;

		const userMessage = {
			sender: 'user',
			text: input,
		};

		setMessages((prevMessages) => [...prevMessages, userMessage]);

		try {
			const response = await axios.post('http://localhost:5000/query', {
				query: input,
			});

			const results = response.data.results;

			results.forEach((result) => {
				const botMessage = {
					sender: 'bot',
					text: result.text,
					imageUrl: result.image_url || null,
					pdfLink: result.pdf_path
						? `http://localhost:5000/${decodeURIComponent(result.pdf_path)}`
						: null,
				};

				setMessages((prevMessages) => [...prevMessages, botMessage]);
			});
		} catch (error) {
			console.error('Error:', error);
		}

		setInput('');
	};

	const handleChange = (e) => {
		setInput(e.target.value);
	};

	return (
		<div className="chat-container">
			<div className="messages">
				{messages.map((msg, index) => (
					<div key={index} className={`message ${msg.sender}`}>
						{msg.imageUrl ? (
							<img src={msg.imageUrl} alt="PDF Context" />
						) : (
							<p>{msg.text}</p>
						)}
						{msg.pdfLink && (
							<a href={msg.pdfLink} target="_blank" rel="noopener noreferrer">
								Open PDF
							</a>
						)}
					</div>
				))}
			</div>
			<div className="input-container">
				<input type="text" value={input} onChange={handleChange} />
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
};

export default Chat;

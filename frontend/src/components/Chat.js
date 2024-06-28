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
			const taskId = response.data.task_id;

			const fetchResults = async () => {
				const resultResponse = await axios.get(
					`http://localhost:5000/results/${taskId}`
				);

				if (resultResponse.data.state === 'SUCCESS') {
					const pdfResults = resultResponse.data.pdf_results;

					pdfResults.forEach((result) => {
						let formattedContext = result.context
							.replace(/\\n/g, '<br />') // Handle escaped newlines
							.replace(/\n/g, '<br />') // Handle normal newlines
							.replace(/\\u([\dA-Fa-f]{4})/g, (match, p1) =>
								String.fromCharCode(parseInt(p1, 16))
							); // Decode Unicode characters

						const botMessage = {
							sender: 'bot',
							html: formattedContext,
							pdfLink: result.file_path
								? `http://localhost:5000/${decodeURIComponent(
										result.file_path
								  )}`
								: null,
						};
						setMessages((prevMessages) => [...prevMessages, botMessage]);
					});
				} else {
					setTimeout(fetchResults, 1000);
				}
			};

			fetchResults();
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
						{msg.html ? (
							<p dangerouslySetInnerHTML={{ __html: msg.html }} />
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

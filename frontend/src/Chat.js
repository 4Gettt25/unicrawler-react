import axios from 'axios';
import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);

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
			const pdfResults = response.data;

			for (const result of pdfResults) {
				if (result.image_path) {
					const botMessage = {
						sender: 'bot',
						imageUrl: `http://localhost:5000/${result.image_path}`,
						pdfLink: result.pdf_path
							? `http://localhost:5000/${result.pdf_path}`
							: null,
						text: result.text,
					};

					setMessages((prevMessages) => [...prevMessages, botMessage]);
				} else {
					const botMessage = {
						sender: 'bot',
						text: result.text,
					};
					setMessages((prevMessages) => [...prevMessages, botMessage]);
				}
			}
		} catch (error) {
			console.error('Error:', error);
		}

		setInput('');
	};

	const handleChange = (e) => {
		setInput(e.target.value);
	};

	const handleImageClick = (imageUrl) => {
		setSelectedImage(imageUrl);
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
	};

	return (
		<div className="chat-container">
			<div className="messages">
				{messages.map((msg, index) => (
					<div key={index} className={`message ${msg.sender}`}>
						{msg.imageUrl ? (
							<img
								src={msg.imageUrl}
								alt="PDF Context"
								className="thumbnail"
								onClick={() => handleImageClick(msg.imageUrl)}
							/>
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
			{selectedImage && (
				<div className="modal" onClick={handleCloseModal}>
					<img
						src={selectedImage}
						alt="Enlarged PDF Context"
						className="modal-content"
					/>
				</div>
			)}
		</div>
	);
};

export default Chat;
import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleSend = async () => {
		if (input.trim() === '') return;

		const userMessage = {
			sender: 'user',
			text: input,
		};

		setMessages((prevMessages) => [...prevMessages, userMessage]);

		try {
			const response = await fetch('http://localhost:5000/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: input }),
			});

			const pdfResults = await response.json();
			console.log('PDF Results:', pdfResults);

			if (!Array.isArray(pdfResults)) {
				throw new Error('Invalid response format');
			}

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

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className={`container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
			<aside className="sidebar">
				<div className="sidebar-header">
					<h2>Menu</h2>
				</div>
				<ul className="sidebar-menu">
					<li>
						<a href="#">New Chat</a>
					</li>
					<li>
						<a href="#">Workspace</a>
					</li>
					<li>
						<a href="#">Search</a>
					</li>
				</ul>
			</aside>
			<button className="open-sidebar-btn" onClick={toggleSidebar}>
				☰
			</button>
			<main className="main-content">
				<div className="chat-header">
					<div className="user-panel">
						<img
							src="/path-to-user-avatar.jpg"
							alt="User Avatar"
							className="user-avatar"
						/>
						<div className="user-info">
							<p className="user-name">Felix Günther</p>
						</div>
						<div className="user-actions">
							<button className="user-action-button">Settings</button>
							<button className="user-action-button">Sign Out</button>
						</div>
					</div>
				</div>
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
								{msg.pdfLink ? (
									<a
										href={msg.pdfLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										Open PDF
									</a>
								) : null}
							</div>
						))}
					</div>
					<div className="input-container">
						<input type="text" value={input} onChange={handleChange} />
						<button onClick={handleSend}>Send</button>
					</div>
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
			</main>
		</div>
	);
};

export default Chat;

import axios from 'axios';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import './Chat.css'; // Ensure this path is correct

const Chat = () => {
	const [userInput, setUserInput] = useState('');
	const [messages, setMessages] = useState([]);

	const intervalIdRef = useRef(null);

	useEffect(() => {
		return () => {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
			}
		};
	}, []);

	const handleSend = async () => {
		try {
			const query = userInput;
			const response = await axios.post('http://localhost:5000/query', {
				query,
			});
			const taskId = response.data.task_id;
			console.log('Task ID:', taskId);
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
			}
			intervalIdRef.current = setInterval(async () => {
				const resultResponse = await axios.get(
					`http://localhost:5000/results/${taskId}`
				);
				if (resultResponse.data.state === 'SUCCESS') {
					setMessages(resultResponse.data.pdf_results);
					clearInterval(intervalIdRef.current);
					intervalIdRef.current = null;
				}
			}, 5000);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleInputChange = (event) => {
		setUserInput(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// Here you would send the userInput to the backend to perform the search
		// and then update the messages state with the search results
	};

	// Inside the Chat component, right before rendering the messages
	const sanitizedMessages = messages.map((msg) => ({
		...msg,
		context: DOMPurify.sanitize(msg.context),
	}));

	// Then, use sanitizedMessages for rendering
	return (
		<div className="chat">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={userInput}
					onChange={handleInputChange}
					placeholder="Enter your search query"
				/>
				<button type="submit">Search</button>
			</form>
			<div className="chat-messages">
				{sanitizedMessages.map((msg, index) => (
					<div key={index} className="chat-message user-message">
						<div>
							<strong>File:</strong> {msg.file_path}
						</div>
						<div dangerouslySetInnerHTML={{ __html: msg.context }}></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Chat;

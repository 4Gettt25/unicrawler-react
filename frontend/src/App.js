// src/App.js
import React, { useState } from 'react';
import {
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
} from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';

const App = () => {
	const [showUserActions, setShowUserActions] = useState(false);
	const location = useLocation();

	const toggleUserActions = () => {
		setShowUserActions(!showUserActions);
	};

	const getUserInitials = (name) => {
		return name
			.split(' ')
			.map((part) => part[0])
			.join('');
	};

	const isAuthPage =
		location.pathname === '/login' || location.pathname === '/signup';

	return (
		<div className={isAuthPage ? 'auth-container' : 'app-container'}>
			{!isAuthPage && (
				<div className="sidebar">
					<div className="sidebar-content">
						<h2>Menu</h2>
						<ul>
							<li>
								<a href="/new-chat">New Chat</a>
							</li>
							<li>
								<a href="/workspace">Workspace</a>
							</li>
							<li>
								<a href="/search">Search</a>
							</li>
						</ul>
					</div>
					<div className="sidebar-footer">
						<div className="user-panel" onClick={toggleUserActions}>
							<div className="user-avatar">{getUserInitials}</div>
							<div className="user-info">
								<p className="user-name"></p>
								<p className="user-status">Active Users: 1</p>
							</div>
						</div>
						{showUserActions && (
							<div className="user-actions">
								<button className="user-action-button">Settings</button>
								<button className="user-action-button">Sign Out</button>
							</div>
						)}
					</div>
				</div>
			)}
			<div className={isAuthPage ? 'auth-content' : 'main-content'}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/" element={<Login />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;

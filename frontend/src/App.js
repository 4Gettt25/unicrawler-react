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

// App component
const App = () => {
	const [showUserActions, setShowUserActions] = useState(false);
	const location = useLocation();
	// Function to toggle user actions
	const toggleUserActions = () => {
		setShowUserActions(!showUserActions);
	};
	// Function to get user initials
	const getUserInitials = (name) => {
		return name
			.split(' ')
			.map((part) => part[0])
			.join('');
	};
	// Check if the current page is an authentication page
	const isAuthPage =
		location.pathname === '/login' || location.pathname === '/signup';
	// Render the app
	return (
		<div className={isAuthPage ? 'auth-container' : 'app-container'}>
			{!isAuthPage && (
				<div className="sidebar">
					<div className="sidebar-content">
						<h2>Menu</h2>
						<ul>
							<li>
								<a href="/new-chat" className='redirectlink'>New Chat</a>
							</li>
							<li>
								<a href="/workspace" className='redirectlink'>Workspace</a>
							</li>
							<li>
								<a href="/search" className='redirectlink'>Search</a>
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

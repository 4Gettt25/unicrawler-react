import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
	return (
		<div className="sidebar">
			<div className="sidebar-content">
				{/* Existing sidebar content goes here */}
			</div>
			<div className="sidebar-footer">
				<div className="user-panel">
					<img
						src="/path-to-user-avatar.jpg"
						alt="User Avatar"
						className="user-avatar"
					/>
					<div className="user-info">
						<p className="user-name">Felix Günther</p>
						<p className="user-status">Active Users: 1</p>
					</div>
				</div>
				<div className="user-actions">
					<button className="user-action-button">Settings</button>
					<button className="user-action-button">Sign Out</button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;

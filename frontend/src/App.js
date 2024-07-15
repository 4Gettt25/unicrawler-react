import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';

const App = () => {
	return (
		<Router>
			<div className="app-container">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/chat" element={<Chat />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;

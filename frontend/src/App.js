import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/" element={<Login />} />
			</Routes>
		</Router>
	);
};

export default App;

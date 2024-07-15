import React, { useState } from 'react';
import './Login.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle login logic here
		console.log('Email:', email);
		console.log('Password:', password);
	};

	return (
		<div className="login-container">
			<div className="login-logo">
				<img src="logo.png" alt="Logo" /> {/* Add your logo image here */}
			</div>
			<form className="login-form" onSubmit={handleSubmit}>
				<h2>Sign in to Unicrawler</h2>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Sign in</button>
				<p>
					Don't have an account? <a href="/signup">Sign up</a>
				</p>
			</form>
		</div>
	);
};

export default Login;

import React, { useState } from 'react';
import './Login.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = (e) => {
		e.preventDefault();
		// Handle login logic here
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<form className="login-form" onSubmit={handleLogin}>
					<h2>Sign in to Unicrawler</h2>
					<label>Email</label>
					<input
						type="email"
						placeholder="Enter Your Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter Your Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">Sign in</button>
					<p>
						Don't have an account? <a href="/signup">Sign up</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;

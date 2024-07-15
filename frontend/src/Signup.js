import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignup = (e) => {
		e.preventDefault();
		// Handle signup logic here
	};

	return (
		<div className="signup-page">
			<div className="signup-container">
				<form className="signup-form" onSubmit={handleSignup}>
					<h2>Sign up to Unicrawler</h2>
					<label>Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">Create Account</button>
					<p>
						Already have an account? <a href="/login">Sign in</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Signup;

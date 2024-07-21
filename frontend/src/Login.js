// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { supabase } from './supabaseClient';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setErrorMessage('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = formData;

		setLoading(true);

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			console.error('Error signing in:', error.message);
			if (error.message === 'Invalid login credentials') {
				setErrorMessage('Incorrect email or password.');
			} else {
				setErrorMessage(error.message);
			}
		} else {
			console.log('User signed in:', data);
			navigate('/chat');
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-content">
				<div className="login-form">
					<h2>Sign in to Unicrawler</h2>
					<form onSubmit={handleSubmit} autoComplete="off">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							autoComplete="off"
						/>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							autoComplete="off"
						/>
						<button type="submit" disabled={loading}>
							{loading ? 'Signing In...' : 'Sign In'}
						</button>
					</form>
					{errorMessage && <p className="error-message">{errorMessage}</p>}
					<p>
						Don't have an account? <a href="/signup">Sign up</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;

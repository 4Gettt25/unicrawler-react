import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { supabase } from './supabaseClient';

// Signup component
const Signup = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		name: '',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Handle form input changes
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setErrorMessage('');
	};

	// Validate email
	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};
	// 
	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password, name } = formData;

		if (!validateEmail(email)) {
			setErrorMessage('Invalid email format.');
			return;
		}

		if (password.length < 6) {
			setErrorMessage('Password should be at least 6 characters.');
			return;
		}

		setLoading(true);

		// Sign up user
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name },
			},
		});

		setLoading(false);

		if (error) {
			console.error('Error signing up:', error.message);
			setErrorMessage(error.message);
		} else {
			console.log('User signed up:', data);
			navigate('/login');
		}
	};

	return (
		<div className="signup-container">
			<div className="signup-form">
				<h2>Sign up to EduExtract</h2>
				<form onSubmit={handleSubmit} autoComplete="off">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						autoComplete="new-name"
					/>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						autoComplete="new-email"
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						autoComplete="new-password"
					/>
					<button type="submit" disabled={loading}>
						{loading ? 'Creating Account...' : 'Create Account'}
					</button>
				</form>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<p className="sign-in-link">
					Already have an account? <a href="/login">Sign in</a>
				</p>
			</div>
		</div>
	);
};

export default Signup;

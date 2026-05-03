import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
	// state for page navigation
	const navigate = useNavigate()
	// state for username input
	const [username, setUsername] = useState('')
	// state for password input
	const [password, setPassword] = useState('')
	// state for confirm password input
	const [confirmPassword, setConfirmPassword] = useState('')
	// state for error messages
	const [error, setError] = useState('')
	// state for submission status
	const [isSubmitting, setIsSubmitting] = useState(false)

	// function to handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		// check if password and confirm password match
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}

		setIsSubmitting(true)

		// make API call to register the user
		try {
			const query = new URLSearchParams({ username, password }).toString()
			const response = await fetch(`http://localhost:8000/users/post?${query}`, {
				method: 'POST',
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.detail || 'Registration failed')
			}

			navigate('/')
		} catch (registerError) {
			setError(registerError.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	// render the registration form
	return (
		<main className="login-page">
			<section className="login-box">
				<h1 style={{color: '#13f0e5' }}>Register Page</h1>

				{/* registration form with fields*/}
				<form className="login-form" onSubmit={handleSubmit}>

					{/* username input field */}
					<div className="login-field">
						<label htmlFor="username">Username:</label>
						<input
							id="username"
							name="username"
							type="text"
							className="login-input"
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							autoComplete="username"
							required
						/>
					</div>

					{/* password input fields */}
					<div className="login-field">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							className="login-input"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="new-password"
							required
						/>
					</div>

					{/* confirm password input field */}
					<div className="login-field">
						<label htmlFor="confirm-password">Confirm Password</label>
						<input
							id="confirm-password"
							name="confirm-password"
							type="password"
							className="login-input"
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							autoComplete="new-password"
							required
						/>
					</div>

					{/* if there is an error show the error message */}
					{error && <p className="login-error" role="alert">{error}</p>}

					<div className="login-actions">
						<button
							type="button"
							className="register-button"
							onClick={() => navigate('/')}
						>
							Back to Login
						</button>

						<button type="submit" className="login-button" disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Create account'}
						</button>
					</div>
				</form>
			</section>
		</main>
	)
}

export default Register

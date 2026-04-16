import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:8000/auth/token/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('username', username)
      navigate('/home')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-box">
        <h1>Login Page</h1>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="login-actions">
            <button
              type="button"
              className="register-button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'submit'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
export default Login

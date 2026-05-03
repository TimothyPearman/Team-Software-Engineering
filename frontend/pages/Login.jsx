import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Login component to handle user authentication
function Login({ onLoginSuccess, onLogout }) {
  // function to check if the stored token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem('access_token')
    if (!token) return false

    // decode the JWT token to check the expiration time
    try {
      // JWT tokens are in format: header.payload.signature
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch (e) {
      return false
    }
  }

  //state to determine if the user is logged in or not based on token validity
  const [isLoggedInView, setIsLoggedInView] = useState(isTokenValid())
  //state to store the username of the logged in user, initialized from localStorage if available
  const [loggedInUsername, setLoggedInUsername] = useState(localStorage.getItem('username') || '')
  //state for username input
  const [username, setUsername] = useState('')
  //state for password input
  const [password, setPassword] = useState('')
  //state for error messages
  const [error, setError] = useState('')
  //state for submission status to disable the submit button while processing
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // hook for navigating between pages
  const navigate = useNavigate()

  // function to handle user logout
  const handleLogout = async () => {
    const token = localStorage.getItem('access_token')

    // attempt to revoke the token on the server
    try {
      if (token) {
        await fetch('http://localhost:8000/auth/token/revoke', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } finally {
      // ensure local logout happens regardless of API response
      localStorage.removeItem('access_token')
      localStorage.removeItem('username')
      setIsLoggedInView(false)
      setLoggedInUsername('')
      setUsername('')
      setPassword('')
      setError('')
      onLogout?.()
    }
  }

  // function to handle form submission for login
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    // make API call to authenticate the user and retrieve an access token
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
      setIsLoggedInView(true)
      setLoggedInUsername(username)
      onLoginSuccess?.()
      navigate('/home')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // render the login form or logged in view based on the isLoggedInView state
  return (
    <main className="login-page">
      <section className="login-box">

        {/* if the user is logged in show the logged in panel with username and logout button */}
        {isLoggedInView ? (
          <div className="logged-in-panel">
            <h1 style={{color: '#13f0e5' }}>Logged In</h1>
            <p className="login-username">user: {loggedInUsername || 'User'}</p>
            <button type="button" className="login-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          // if the user is not logged in show the login form
          <>
            <h1 style={{color: '#13f0e5' }}>Login Page</h1>

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

              {/* password input field */}
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

              {/* if there is an error show the error message */}
              {error && <p className="login-error" role="alert">{error}</p>}

              {/* buttons for navigating to register page and submitting the login form */}
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
          </>
        )}
      </section>
    </main>
  )
}
export default Login

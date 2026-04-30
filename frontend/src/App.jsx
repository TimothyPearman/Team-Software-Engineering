import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Home from '../pages/Home.jsx'
import Profile from '../pages/Profile.jsx'
import './App.css'

// function to protect routes that require authentication
function ProtectedRoute({ isLoggedIn, children }) {
  const isTokenValid = () => {
    // check if token exists
    const token = localStorage.getItem('access_token')

    // if no token, user is not logged in
    if (!token) return false

    // check time to see if token is expired
    try {
      // JWT tokens are in format: header.payload.signature
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime

    } catch (e) {
      return false
    }
  }

  // if user is not logged in or token is invalid, redirect to login page
  if (!isLoggedIn || !isTokenValid()) {
    return <Navigate to="/" replace />
  }

  return children
}

// function to handle app title clicks
function AppHeader() {
  // get current location to check if user is already on home page
  const location = useLocation()

  // if user clicks on header while already on home page, reload the page to reset quiz state
  const handleTitleClick = (event) => {
    if (location.pathname === '/home') {
      event.preventDefault()
      window.location.reload()
    }
  }

  // render app header as a link to home page
  return (
    <Link
      // redirects to home page if user clicks on header
      to="/home"
      className="app-header"
      onClick={handleTitleClick}
    >
      <h1 className="app-title">CompuTaught</h1>
    </Link>
  )
}

// main app component
function App() {
  // state to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('access_token')))
  // state to track if dropdown menu is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <BrowserRouter>
      <nav>
        {/* app header */}
        <AppHeader/>

        {/* app dropdown menu */}
        {/* display dropdown menu only if user is logged in, so it persists accross all pages except the login page */}
        {isLoggedIn && (

          // shell for dropdown menu options
          <div className="app-dropdown-shell">

            {/* dropdown menu itself */}
            <button
              type="button"
              className="app-dropdown-trigger"
              // toggle dropdown menu state
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              Drop-down menu
            </button>

            {/* show dropdown menu if opened */}
            {isDropdownOpen && (
              <div className="app-dropdown-menu">
                {/* dropdown menu options */}
                <Link to="/home" className="app-dropdown-link">Home</Link>
                <Link to="/profile" className="app-dropdown-link">Profile</Link>
                <Link to="/" className="app-dropdown-link">Logout</Link>
              </div>
            )}
          </div>
        )}

      </nav>

      {/* file paths for different pages */}
      <Routes>
        {/* path for login page */}
        <Route
          path="/"
          element={(
            <Login
              onLoginSuccess={() => setIsLoggedIn(true)}
              // if user logs out from login page in dropdown menu, set isLoggedIn to false and close dropdown menu
              onLogout={() => {
                setIsLoggedIn(false)
                setIsDropdownOpen(false)
              }}
            />
          )}
        />

        {/* path for register page */}
        <Route path="/register" element={<Register />} />

        {/* path for home page */}
        <Route
          path="/home"
          element={(
            // protect home page route so only logged in users can access it */}
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home />
            </ProtectedRoute>
          )}
        />

        {/* path for profile page */}
        <Route
          path="/profile"
          element={(
            // protect profile page route so only logged in users can access it */}
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

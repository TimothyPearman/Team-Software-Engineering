import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Home from '../pages/Home.jsx'
import Profile from '../pages/Profile.jsx'
import './App.css'

function ProtectedRoute({ isLoggedIn, children }) {
  const hasToken = Boolean(localStorage.getItem('access_token'))

  if (!isLoggedIn || !hasToken) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('access_token')))
  {/* toggles the dropdown menu */}
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <BrowserRouter>
      <nav>
        {/* header */}
        <Link
          to="/"
          className="app-header-link"
        >
          <h1 className="app-title">CompuTaught</h1>
        </Link>

        {isLoggedIn && (
          <div className="app-dropdown-shell">
            <button
              type="button"
              className="app-dropdown-trigger"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              Drop-down menu
            </button>

            {/* dropdown menu */}
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
        <Route
          path="/"
          element={(
            <Login
              onLoginSuccess={() => setIsLoggedIn(true)}
              onLogout={() => {
                setIsLoggedIn(false)
                setIsDropdownOpen(false)
              }}
            />
          )}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={(
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
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

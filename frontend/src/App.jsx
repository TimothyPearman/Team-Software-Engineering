import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Home from '../pages/Home.jsx'
import Profile from '../pages/Profile.jsx'
import Test from '../pages/Test.jsx'
import More from '../pages/More.jsx'
import './App.css'

function App() {
  {/* toggles the dropdown menu */}
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  {/* gets the position of the dropdown menu button */}
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  {/* reference to the dropdown menu button */}
  const dropdownButtonRef = useRef(null)
  {/* displays the fetched lesson data */}
  const API_URL = "http://localhost:8000/"

  {/* style for the dropdown menu options */}
  const menuButtonStyle = {
    border: '1px solid #13f0e5',
    backgroundColor: '#888;',
    padding: '6px 10px',
    borderRadius: '4px',
    color: '#13f0e5',
    font: 'inherit',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  }

  {/* updates the position of the dropdown menu */}
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (!dropdownButtonRef.current) {
        return
      }

      const rect = dropdownButtonRef.current.getBoundingClientRect()  // gets the position of the dropdown menu button
      const spacing = 12  
      setDropdownPosition({         // sets the position of the dropdown menu below the button
        top: rect.bottom + spacing,
        left: rect.left,
      })
    }

    updateDropdownPosition()
    window.addEventListener('resize', updateDropdownPosition)

    return () => window.removeEventListener('resize', updateDropdownPosition)
  }, [])

  return (
    <BrowserRouter>
      <nav>
        {/* header */}
        <Link
          to="/"
          style={{ position: 'fixed', top: '12px', left: '12px', margin: 0, zIndex: 1000, color: '#13f0e5', textDecoration: 'none' }}
        >
          <h1 style={{ margin: 0, color: 'inherit' }}>CompuTaught</h1>
        </Link>

        {/* drop down menu button */}
        <button
          ref={dropdownButtonRef}                             // reference to the button element
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}  // toggles the drop down menu
          style={{ ...menuButtonStyle, position: 'fixed', top: '120px', left: '12px', zIndex: 1000 }}  // fixes the button below the header
        >
          Drop-down menu
        </button>

        {/* dropdown menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: 'fixed',                  // fixes the dropdown menu
              top: `${dropdownPosition.top}px`,   // positions the dropdown menu below the button
              left: `${dropdownPosition.left}px`, // aligns the dropdown menu with the button
              //backgroundColor: 'white',
              //border: '1px solid #ccc',
              padding: '8px',                     // padding around the dropdown menu
              zIndex: 1000,                       // ensures the dropdown menu appears above other content
              display: 'flex',                    // uses flexbox for layout
              flexDirection: 'column',            // arranges the dropdown options in a column
              gap: '8px',                         // space between the dropdown options           
            }}
          >
            {/* dropdown menu options */}
            <Link to="/" style={menuButtonStyle}>Login</Link>
            <Link to="/home" style={menuButtonStyle}>Home</Link>
            <Link to="/profile" style={menuButtonStyle}>Profile</Link>
            <Link to="/test" style={menuButtonStyle}>Test</Link>
            <Link to="/more" style={menuButtonStyle}>More</Link>
          </div>
        )}

      </nav>

      {/* file paths for different pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<Test />} />
        <Route path="/more" element={<More />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

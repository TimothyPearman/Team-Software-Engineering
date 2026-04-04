import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [lesson, setLesson] = useState([])
  const API_URL = "http://localhost:8000/"

  const fetchLesson = async () => {
    try {
      const response = await fetch(API_URL + "/lessons/get")
      const data = await response.json()
      console.log("DATA FROM BACKEND:", data)
      setLesson(data)
    } catch (error) {
      console.error("Error fetching lesson:", error)
    }
  }

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import backGroundImg from '../src/assets/green.png'
import './Home.css'

const API_URL = "http://localhost:8000/"

function Home() {
  const [lesson, setLesson] = useState(null)
  const lessonOutput = lesson ? JSON.stringify(lesson) : 'No output yet.'

  const fetchLesson = async () => {
    try {
      const response = await fetch(API_URL + "levels/get")
      const data = await response.json()
      console.log("DATA FROM BACKEND:", data)
      setLesson(data)
    } catch (error) {
      console.error("Error fetching level:", error)
    }
  }

  return (
    <div className="home-page">
      <img className="home-background-image" src={backGroundImg} alt=""/>

      <div className="home-content">
        <h1>Home</h1>

        {/* data fetched from level endpoint*/}
        <button type="button" onClick={fetchLesson}>
          Fetch Level
        </button>

        <p>{lessonOutput}</p>
      </div>
    </div>
  )
}

export default Home

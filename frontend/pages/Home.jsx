import { useState } from 'react'

const API_URL = "http://localhost:8000/"

function Home() {
  const [lesson, setLesson] = useState(null)
  const [count, setCount] = useState(0)

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
    <div>
      <h1>Home</h1>
      <button onClick={() => setCount(count + 1)}>
        Count is {count}
      </button>
    </div>
  )
}

export default Home

import './Profile.css'
import { useEffect, useState } from 'react'

function Profile() {
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFetchProfile = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setProfileData(null)
      setError('No access token found. Please log in first.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/users/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch profile information')
      }

      setProfileData(data)

    } catch (profileError) {
      setProfileData(null)
      setError(profileError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchProfile()
  }, [])

  const profileSections = [
    {
      title: 'User',
      fields: [
        { key: 'Username', label: 'Username' },
      ],
    },
    {
      title: 'Progress',
      fields: [
        { key: 'Level_ID', label: 'Level' },
      ],
    },
    {
      title: 'Badge',
      fields: [
        { key: 'Name', label: 'Name' },
        { key: 'Description', label: 'Description' },
        //{ key: 'Asset', label: 'Asset' },
      ],
    },
    {
      title: 'Streak',
      fields: [
        { key: 'StartDate', label: 'Start Date' },
        { key: 'EndDate', label: 'End Date' },
        { key: 'Count', label: 'days' },
      ],
    },
  ]

  const formatProfileValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A'
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  }

  return (
    <main className="login-page">
      <section className="login-box">
        <h1 style={{ color: '#13f0e5' }}>Profile Page</h1>

        {isLoading && <p>Loading profile info...</p>}

        {error && <p className="login-error" role="alert">{error}</p>}

        {profileData && (
          <div className="profile-sections">
            {profileSections.map((section) => (
              <section key={section.title} className="profile-section">
                <h2 className="profile-section-title">{section.title}</h2>

                {section.fields.map(({ key, label }) => (
                  <div key={key} className="profile-row">
                    <span className="profile-label">{label}:</span>
                    <span className="profile-value">{formatProfileValue(profileData[key])}</span>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
export default Profile

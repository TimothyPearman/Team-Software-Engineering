import './Profile.css'
import { useEffect, useState } from 'react'
import badge1Image from '../src/assets/badge1.png'
import badge2Image from '../src/assets/badge2.png'

function Profile() {
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const [badgeInputValue, setBadgeInputValue] = useState('')
  const [streaks, setStreaks] = useState([])
  const [streakError, setStreakError] = useState('')
  const [isStreakLoading, setIsStreakLoading] = useState(false)
  const [badges, setBadges] = useState([])
  const [badgeError, setBadgeError] = useState('')
  const [isBadgeLoading, setIsBadgeLoading] = useState(false)

  {/* function for handling fetch from endpoint */}
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

  {/* fetch data from endpoint on page load */}
  useEffect(() => {
    handleFetchProfile()
  }, [])

  useEffect(() => {
    setBadgeInputValue(formatProfileValue(profileData?.Badge_ID))
  }, [profileData])

  {/* fetch streaks when streaks section is expanded */}
  useEffect(() => {
    const fetchStreaks = async () => {
      if (expandedSection !== 'Streak') {
        return
      }

      const token = localStorage.getItem('access_token')

      if (!token) {
        setStreaks([])
        setStreakError('No access token found. Please log in first.')
        return
      }

      setStreakError('')
      setIsStreakLoading(true)

      try {
        const response = await fetch('http://localhost:8000/streaks/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch streaks')
        }

        setStreaks(Array.isArray(data) ? data : [data])
      } catch (streakFetchError) {
        setStreaks([])
        setStreakError(streakFetchError.message)
      } finally {
        setIsStreakLoading(false)
      }
    }

    fetchStreaks()
  }, [expandedSection])

  {/* fetch badges when badge section is expanded */}
  useEffect(() => {
    const fetchBadges = async () => {
      if (expandedSection !== 'Badge') {
        return
      }

      const token = localStorage.getItem('access_token')

      if (!token) {
        setBadges([])
        setBadgeError('No access token found. Please log in first.')
        return
      }

      setBadgeError('')
      setIsBadgeLoading(true)

      try {
        const response = await fetch('http://localhost:8000/badges/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch badges')
        }

        setBadges(Array.isArray(data) ? data : [data])
      } catch (badgeFetchError) {
        setBadges([])
        setBadgeError(badgeFetchError.message)
      } finally {
        setIsBadgeLoading(false)
      }
    }

    fetchBadges()
  }, [expandedSection])

  {/* define profile sections */}
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
        { key: 'Score', label: 'Score' },
      ],
    },
    {
      title: 'Badge',
      fields: [
        { key: 'Badge_ID', label: 'ID' },
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
  
  {/* format endpoint data into string */}
  const formatProfileValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A'
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  }

  {/* handle section expansion */}
  const handleExpand = (sectionTitle) => {
    setExpandedSection(sectionTitle)
  }

  {/* get badge image based on badge ID */}
  const getBadgeImage = (badgeId) => {
    if (badgeId === 1) {
      return badge1Image
    }

    if (badgeId === 2) {
      return badge2Image
    }

    return null
  }

  {/* handle badge update */}
  const handleBadgeUpdate = async () => {
    const badgeId = parseInt(badgeInputValue, 10)

    // Validate that the badge ID matches one of the listed badges
    const isValidBadge = badges.some((badge) => badge.Badge_ID === badgeId)

    if (!isValidBadge) {
      setBadgeError('Invalid badge ID. Please select one from the list.')
      return
    }

    const token = localStorage.getItem('access_token')

    if (!token) {
      setBadgeError('No access token found. Please log in first.')
      return
    }

    try {
      setBadgeError('')
      const response = await fetch(`http://localhost:8000/users/badge/put?badge_id=${badgeId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update badge')
      }

      // Refresh profile data to show updated badge
      handleFetchProfile()
      setBadgeError('')
    } catch (updateError) {
      setBadgeError(updateError.message)
    }
  }

  {/* page content */}
  return (
    <main className="page">

      {/* if a section is expanded, show it */}
      {expandedSection ? (
        <section className="box expanded-box">
          <h1 style={{ color: '#13f0e5' }}>{expandedSection}</h1>

          {/* content for expanded streak section */}
          {expandedSection === 'Streak' ? (
            <div className="expanded-content">
              {isStreakLoading && <p className="expanded-message">Loading streaks...</p>}

              {streakError && <p className="login-error" role="alert">{streakError}</p>}

              {!isStreakLoading && !streakError && streaks.length === 0 && (
                <p className="expanded-message">No streaks found.</p>
              )}

              {streaks.length > 0 && (
                <div className="streak-list">
                  {streaks.map((streak) => (
                    <article key={streak.Streak_ID} className="streak-card">
                      <div className="streak-row">
                        <span className="streak-label">Streak ID:</span>
                        <span className="streak-value">{formatProfileValue(streak.Streak_ID)}</span>
                      </div>
                      <div className="streak-row">
                        <span className="streak-label">Start Date:</span>
                        <span className="streak-value">{formatProfileValue(streak.StartDate)}</span>
                      </div>
                      <div className="streak-row">
                        <span className="streak-label">End Date:</span>
                        <span className="streak-value">{formatProfileValue(streak.EndDate)}</span>
                      </div>
                      <div className="streak-row">
                        <span className="streak-label">Count:</span>
                        <span className="streak-value">{formatProfileValue(streak.Count)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

          /* content for expanded badge section */
          ) : expandedSection === 'Badge' ? (
            <div className="expanded-content">
              <div className="badge-id-row">
                <span className="expanded-message">Favourite Badge:</span>
                <input
                  type="text"
                  className="badge-id-input"
                  value={badgeInputValue}
                  onChange={(event) => setBadgeInputValue(event.target.value)}
                />
                <button
                  type="button"
                  className="badge-update-button"
                  onClick={handleBadgeUpdate}
                >
                  Update
                </button>
              </div>

              {isBadgeLoading && <p className="expanded-message">Loading badges...</p>}

              {badgeError && <p className="login-error" role="alert">{badgeError}</p>}

              {!isBadgeLoading && !badgeError && badges.length === 0 && (
                <p className="expanded-message">No badges found.</p>
              )}

              {badges.length > 0 && (
                <div className="streak-list">
                  {badges.map((badge) => (
                    <article key={`${badge.User_ID}-${badge.Badge_ID}`} className="streak-card">
                      <div className="badge-card-content">
                        <div className="badge-text-content">
                          <div className="streak-row">
                            <span className="streak-label">Favourite Badge:</span>
                            <span className="streak-value">{formatProfileValue(badge.Badge_ID)}</span>
                          </div>
                          <div className="streak-row">
                            <span className="streak-label">Name:</span>
                            <span className="streak-value">{formatProfileValue(badge.Name)}</span>
                          </div>
                          <div className="streak-row">
                            <span className="streak-label">Description:</span>
                            <span className="streak-value">{formatProfileValue(badge.Description)}</span>
                          </div>
                        </div>
                        {getBadgeImage(badge.Badge_ID) && (
                          <img
                            src={getBadgeImage(badge.Badge_ID)}
                            alt={`Badge ${badge.Badge_ID}`}
                            className="badge-image"
                          />
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="expanded-text">badge</p>
          )}
          <button
            type="button"
            className="login-button expanded-back-button"
            onClick={() => setExpandedSection(null)}
          >
            Back
          </button>
        </section>
      ) : (
        /* content for the main profile section */
        <section className="box">
          <h1 style={{ color: '#13f0e5' }}>Profile Page</h1>

          {isLoading && <p>Loading profile info...</p>}

          {error && <p className="login-error" role="alert">{error}</p>}

          {profileData && (
            <div className="profile-sections">
              {profileSections.map((section) => (
                <section key={section.title} className="profile-section">
                  <div className="profile-section-header">
                    <h2 className="profile-section-title">{section.title}</h2>

                    {/* add expand buttons for badge and streak sections */}
                    {(section.title === 'Badge' || section.title === 'Streak') && (
                      <button
                        type="button"
                        className="profile-expand-button"
                        onClick={() => handleExpand(section.title)}
                      >
                        Expand
                      </button>
                    )}
                  </div>

                  {/* layout badge section differently due to image */}
                  {section.title === 'Badge' ? (
                    <div className="badge-card-content">
                      <div className="badge-text-content">
                        {section.fields.map(({ key, label }) => (
                          <div key={key} className="profile-row">
                            <span className="profile-label">{label}:</span>
                            <span className="profile-value">{formatProfileValue(profileData[key])}</span>
                          </div>
                        ))}
                      </div>
                      {getBadgeImage(profileData.Badge_ID) && (
                        <img
                          src={getBadgeImage(profileData.Badge_ID)}
                          alt={`Badge ${profileData.Badge_ID}`}
                          className="badge-image"
                        />
                      )}
                    </div>
                  ) : (
                    section.fields.map(({ key, label }) => (
                      <div key={key} className="profile-row">
                        <span className="profile-label">{label}:</span>
                        <span className="profile-value">{formatProfileValue(profileData[key])}</span>
                      </div>
                    ))
                  )}
                </section>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
export default Profile

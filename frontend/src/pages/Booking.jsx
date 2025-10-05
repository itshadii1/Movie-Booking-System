import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import SeatGrid from '../components/SeatGrid'

const Booking = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [cinemas, setCinemas] = useState([])
  const [screens, setScreens] = useState([])
  const [movies, setMovies] = useState([])
  const [allShows, setAllShows] = useState([])
  const [selectedMovie, setSelectedMovie] = useState('')
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [selectedShow, setSelectedShow] = useState('')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    fetchMovies()
    fetchCinemas()
    fetchAllShows()
    
    if (location.state?.selectedMovie) {
      setSelectedMovie(location.state.selectedMovie.id.toString())
    }
  }, [user, location.state])

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/')
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const fetchCinemas = async () => {
    try {
      const response = await api.get('/cinemas/')
      setCinemas(response.data)
    } catch (error) {
      console.error('Error fetching cinemas:', error)
    }
  }

  const fetchAllShows = async () => {
    try {
      const response = await api.get('/shows/')
      setAllShows(response.data)
    } catch (error) {
      console.error('Error fetching shows:', error)
    }
  }

  const fetchScreens = async (cinemaId) => {
    try {
      const response = await api.get('/screens/')
      setScreens(prevScreens => {
        const newScreens = response.data.filter(screen => screen.cinema_id === Number(cinemaId))
        return [...prevScreens, ...newScreens]
      })
    } catch (error) {
      console.error('Error fetching screens:', error)
    }
  }

  const getShowsForCinema = (cinemaId) => {
    if (!selectedMovie) return []
    return allShows.filter(show => {
      const screen = screens.find(s => s.id === show.screen_id)
      return screen?.cinema_id === cinemaId && show.movie_id === Number(selectedMovie)
    })
  }

  const handleMovieChange = (movieId) => {
    setSelectedMovie(movieId)
    setSelectedCinema(null)
    setSelectedShow('')
  }

  const handleShowSelect = (cinemaId, showId) => {
    setSelectedCinema(cinemaId)
    setSelectedShow(showId)
    setStep(2)
  }

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats)
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/bookings/', {
        show_id: selectedShow,
        seats: selectedSeats
      })
      setSuccess('🎉 Booking confirmed! Enjoy your movie!')
      setTimeout(() => {
        setStep(1)
        setSelectedCinema(null)
        setSelectedMovie('')
        setSelectedShow('')
        setSelectedSeats([])
        setSuccess('')
      }, 3000)
    } catch (error) {
      setError(error.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepStatus = (stepNumber) => {
    if (stepNumber < step) return 'completed'
    if (stepNumber === step) return 'active'
    return ''
  }

  useEffect(() => {
    if (cinemas.length > 0) {
      cinemas.forEach(cinema => fetchScreens(cinema.id))
    }
  }, [cinemas])

  return (
    <div>
      <h1 className="section-title">Book Your Experience</h1>
      
      <div className="step-indicator">
        <div className={`step ${getStepStatus(1)}`}>
          <div className="step-number">1</div>
          <span>Select Show</span>
        </div>
        <div className={`step ${getStepStatus(2)}`}>
          <div className="step-number">2</div>
          <span>Choose Seats</span>
        </div>
      </div>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {step === 1 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '16px', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)' }}>
              Select Movie
            </label>
            <select 
              value={selectedMovie} 
              onChange={(e) => handleMovieChange(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '14px 16px',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '15px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="">Choose your movie</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.duration} min)
                </option>
              ))}
            </select>
          </div>

          {selectedMovie && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '32px',
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
                  <span>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
                  <span>Filling fast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                  <span>Almost full</span>
                </div>
              </div>

              {cinemas.map(cinema => {
                const cinemaShows = getShowsForCinema(cinema.id)
                if (cinemaShows.length === 0) return null

                return (
                  <div 
                    key={cinema.id}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--border-radius)',
                      padding: '28px',
                      marginBottom: '24px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-medium)',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--primary-light)',
                        textAlign: 'center',
                        padding: '8px'
                      }}>
                        {cinema.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                          {cinema.name}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          {cinema.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                      gap: '12px' 
                    }}>
                      {cinemaShows.map(show => (
                        <button
                          key={show.id}
                          onClick={() => handleShowSelect(cinema.id, show.id)}
                          style={{
                            padding: '16px',
                            background: 'var(--bg-tertiary)',
                            border: '2px solid var(--border-medium)',
                            borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--primary)'
                            e.target.style.borderColor = 'var(--primary)'
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = 'var(--shadow-glow)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-tertiary)'
                            e.target.style.borderColor = 'var(--border-medium)'
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = 'none'
                          }}
                        >
                          {new Date(show.start_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {cinemas.every(cinema => getShowsForCinema(cinema.id).length === 0) && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                    No shows available for this movie at the moment.
                  </p>
                </div>
              )}
            </div>
          )}

          {!selectedMovie && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                Please select a movie to view available showtimes
              </p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SeatGrid 
            showId={selectedShow} 
            onSeatsSelected={handleSeatsSelected}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setStep(1)}
              style={{ flex: 1, padding: '14px' }}
            >
              ← Back
            </button>
            <button 
              className="btn btn-accent" 
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || loading}
              style={{ flex: 2, padding: '14px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="loading-spinner"></span> Processing...
                </span>
              ) : (
                `🎟️ Confirm Booking (${selectedSeats.length} ${selectedSeats.length === 1 ? 'seat' : 'seats'})`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking
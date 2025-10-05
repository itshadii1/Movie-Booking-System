import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const Admin = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('movies')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Movies state
  const [movies, setMovies] = useState([])
  const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: '' })

  // Cinemas state
  const [cinemas, setCinemas] = useState([])
  const [newCinema, setNewCinema] = useState({ name: '', location: '' })

  // Screens state
  const [screens, setScreens] = useState([])
  const [newScreen, setNewScreen] = useState({ cinema_id: '', name: '' })

  // Shows state
  const [shows, setShows] = useState([])
  const [newShow, setNewShow] = useState({ movie_id: '', screen_id: '', start_time: '' })

  useEffect(() => {
    if (!user || !user.is_admin) {
      window.location.href = '/'
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [moviesRes, cinemasRes, screensRes, showsRes] = await Promise.all([
        api.get('/movies/'),
        api.get('/cinemas/'),
        api.get('/screens/'),
        api.get('/shows/')
      ])
      setMovies(moviesRes.data)
      setCinemas(cinemasRes.data)
      setScreens(screensRes.data)
      setShows(showsRes.data)
    } catch (error) {
      setError('Failed to fetch data')
    }
  }

  const handleCreateMovie = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/movies/', newMovie)
      setNewMovie({ title: '', description: '', duration: '' })
      await fetchData()
      setSuccess('Movie created successfully')
    } catch (error) {
      setError('Failed to create movie')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return
    try {
      await api.delete(`/movies/${id}`)
      await fetchData()
      setSuccess('Movie deleted successfully')
    } catch (error) {
      setError('Failed to delete movie')
    }
  }

  const handleCreateCinema = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/cinemas/', newCinema)
      setNewCinema({ name: '', location: '' })
      await fetchData()
      setSuccess('Cinema created successfully')
    } catch (error) {
      setError('Failed to create cinema')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCinema = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cinema? This will also delete all its screens and shows.')) return
    try {
      await api.delete(`/cinemas/${id}`)
      await fetchData()
      setSuccess('Cinema deleted successfully')
    } catch (error) {
      setError('Failed to delete cinema')
    }
  }

  const handleCreateScreen = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/screens/', newScreen)
      setNewScreen({ cinema_id: '', name: '' })
      await fetchData()
      setSuccess('Screen created successfully')
    } catch (error) {
      setError('Failed to create screen')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScreen = async (id) => {
    if (!window.confirm('Are you sure you want to delete this screen? This will also delete all its shows.')) return
    try {
      await api.delete(`/screens/${id}`)
      await fetchData()
      setSuccess('Screen deleted successfully')
    } catch (error) {
      setError('Failed to delete screen')
    }
  }

  const handleCreateShow = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/shows/', newShow)
      setNewShow({ movie_id: '', screen_id: '', start_time: '' })
      await fetchData()
      setSuccess('Show created successfully')
    } catch (error) {
      setError('Failed to create show')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show? This will also delete all its bookings.')) return
    try {
      await api.delete(`/shows/${id}`)
      await fetchData()
      setSuccess('Show deleted successfully')
    } catch (error) {
      setError('Failed to delete show')
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  if (!user || !user.is_admin) {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="section-title">Admin Panel</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${activeTab === 'movies' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button 
            className={`btn ${activeTab === 'cinemas' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cinemas')}
          >
            Cinemas
          </button>
          <button 
            className={`btn ${activeTab === 'screens' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('screens')}
          >
            Screens
          </button>
          <button 
            className={`btn ${activeTab === 'shows' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('shows')}
          >
            Shows
          </button>
          <button 
            className={`btn ${activeTab === 'seat-layout' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('seat-layout')}
          >
            Seat Layout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Movies Tab */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h2>Create New Movie</h2>
              <form onSubmit={handleCreateMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Movie Title"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  required
                  rows="3"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newMovie.duration}
                  onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Movie'}
                </button>
              </form>
            </div>
            <div>
              <h2>Existing Movies</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {movies.map(movie => (
                  <div key={movie.id} style={{ 
                    padding: '15px', 
                    border: '1px solid var(--border-medium)', 
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4>{movie.title}</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {movie.duration} minutes
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {movie.description}
                      </p>
                    </div>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteMovie(movie.id)}
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinemas Tab */}
      {activeTab === 'cinemas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h2>Create New Cinema</h2>
              <form onSubmit={handleCreateCinema} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Cinema Name"
                  value={newCinema.name}
                  onChange={(e) => setNewCinema({ ...newCinema, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newCinema.location}
                  onChange={(e) => setNewCinema({ ...newCinema, location: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Cinema'}
                </button>
              </form>
            </div>
            <div>
              <h2>Existing Cinemas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {cinemas.map(cinema => (
                  <div key={cinema.id} style={{ 
                    padding: '15px', 
                    border: '1px solid var(--border-medium)', 
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4>{cinema.name}</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {cinema.location}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Screens: {screens.filter(s => s.cinema_id === cinema.id).length}
                      </p>
                    </div>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteCinema(cinema.id)}
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screens Tab */}
      {activeTab === 'screens' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h2>Create New Screen</h2>
              <form onSubmit={handleCreateScreen} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select
                  value={newScreen.cinema_id}
                  onChange={(e) => setNewScreen({ ...newScreen, cinema_id: e.target.value })}
                  required
                >
                  <option value="">Select Cinema</option>
                  {cinemas.map(cinema => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name} - {cinema.location}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Screen Name"
                  value={newScreen.name}
                  onChange={(e) => setNewScreen({ ...newScreen, name: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Screen'}
                </button>
              </form>
            </div>
            <div>
              <h2>Existing Screens</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {screens.map(screen => {
                  const cinema = cinemas.find(c => c.id === screen.cinema_id)
                  return (
                    <div key={screen.id} style={{ 
                      padding: '15px', 
                      border: '1px solid var(--border-medium)', 
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4>{screen.name}</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {cinema?.name} - {cinema?.location}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Shows: {shows.filter(s => s.screen_id === screen.id).length}
                        </p>
                      </div>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteScreen(screen.id)}
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shows Tab */}
      {activeTab === 'shows' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h2>Create New Show</h2>
              <form onSubmit={handleCreateShow} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select
                  value={newShow.movie_id}
                  onChange={(e) => setNewShow({ ...newShow, movie_id: e.target.value })}
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.duration} min)
                    </option>
                  ))}
                </select>
                <select
                  value={newShow.screen_id}
                  onChange={(e) => setNewShow({ ...newShow, screen_id: e.target.value })}
                  required
                >
                  <option value="">Select Screen</option>
                  {screens.map(screen => {
                    const cinema = cinemas.find(c => c.id === screen.cinema_id)
                    return (
                      <option key={screen.id} value={screen.id}>
                        {screen.name} - {cinema?.name}
                      </option>
                    )
                  })}
                </select>
                <input
                  type="datetime-local"
                  value={newShow.start_time}
                  onChange={(e) => setNewShow({ ...newShow, start_time: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Show'}
                </button>
              </form>
            </div>
            <div>
              <h2>Existing Shows</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {shows.map(show => {
                  const movie = movies.find(m => m.id === show.movie_id)
                  const screen = screens.find(s => s.id === show.screen_id)
                  const cinema = cinemas.find(c => c.id === screen?.cinema_id)
                  return (
                    <div key={show.id} style={{ 
                      padding: '15px', 
                      border: '1px solid var(--border-medium)', 
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4>{movie?.title}</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {screen?.name} - {cinema?.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {new Date(show.start_time).toLocaleString()}
                        </p>
                      </div>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteShow(show.id)}
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seat Layout Tab */}
      {activeTab === 'seat-layout' && (
        <SeatLayoutView shows={shows} movies={movies} screens={screens} cinemas={cinemas} />
      )}
    </div>
  )
}

// Seat Layout Component
const SeatLayoutView = ({ shows, movies, screens, cinemas }) => {
  const [selectedShow, setSelectedShow] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchBookings = async (showId) => {
    setLoading(true)
    try {
      const response = await api.get(`/shows/${showId}/bookings`)
      setBookings(response.data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedShow) {
      fetchBookings(selectedShow)
    }
  }, [selectedShow])

  const getShowDetails = (showId) => {
    const show = shows.find(s => s.id === showId)
    if (!show) return null
    
    const movie = movies.find(m => m.id === show.movie_id)
    const screen = screens.find(s => s.id === show.screen_id)
    const cinema = cinemas.find(c => c.id === screen?.cinema_id)
    
    return { show, movie, screen, cinema }
  }

  const getSeatBooking = (seat) => {
    return bookings.find(b => b.seat === seat)
  }

  const showDetails = selectedShow ? getShowDetails(selectedShow) : null

  return (
    <div>
      <h2>Show Seat Layout</h2>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedShow}
          onChange={(e) => setSelectedShow(e.target.value)}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <option value="">Select a show to view seat layout</option>
          {shows.map(show => {
            const movie = movies.find(m => m.id === show.movie_id)
            const screen = screens.find(s => s.id === show.screen_id)
            const cinema = cinemas.find(c => c.id === screen?.cinema_id)
            return (
              <option key={show.id} value={show.id}>
                {movie?.title} - {cinema?.name} - {screen?.name} - {new Date(show.start_time).toLocaleString()}
              </option>
            )
          })}
        </select>
      </div>

      {selectedShow && showDetails && (
        <div>
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '20px', 
            borderRadius: 'var(--border-radius)',
            marginBottom: '20px'
          }}>
            <h3>{showDetails.movie?.title}</h3>
            <p>{showDetails.cinema?.name} - {showDetails.screen?.name}</p>
            <p>Show Time: {new Date(showDetails.show.start_time).toLocaleString()}</p>
          </div>

          {loading ? (
            <div>Loading seat layout...</div>
          ) : (
            <div>
              <h4>Seat Layout (Hover over booked seats to see user details)</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(10, 1fr)', 
                gap: '8px',
                maxWidth: '600px',
                margin: '20px 0'
              }}>
                {Array.from({ length: 80 }, (_, i) => {
                  const seatNumber = String.fromCharCode(65 + Math.floor(i / 10)) + (i % 10 + 1)
                  const booking = getSeatBooking(seatNumber)
                  const isBooked = !!booking
                  
                  return (
                    <div
                      key={seatNumber}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: isBooked ? 'pointer' : 'default',
                        backgroundColor: isBooked ? '#ef4444' : '#10b981',
                        color: 'white',
                        border: '2px solid transparent',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      title={isBooked ? `Booked by: ${booking.user?.name || 'Unknown'} (${booking.user?.email || 'No email'})` : `Seat ${seatNumber} - Available`}
                      onMouseEnter={(e) => {
                        if (isBooked) {
                          e.target.style.backgroundColor = '#dc2626'
                          e.target.style.borderColor = '#fbbf24'
                          e.target.style.transform = 'scale(1.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isBooked) {
                          e.target.style.backgroundColor = '#ef4444'
                          e.target.style.borderColor = 'transparent'
                          e.target.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      {seatNumber}
                    </div>
                  )
                })}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginTop: '20px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                  <span>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
                  <span>Booked</span>
                </div>
              </div>

              {bookings.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h4>Booking Details</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {bookings.map((booking, index) => (
                      <div key={index} style={{ 
                        padding: '10px', 
                        border: '1px solid var(--border-medium)', 
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '12px'
                      }}>
                        <strong>Seat: {booking.seat}</strong><br/>
                        <strong>User: {booking.user?.name || 'Unknown'}</strong><br/>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Email: {booking.user?.email || 'No email'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Admin

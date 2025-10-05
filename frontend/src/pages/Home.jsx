import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import MovieCard from '../components/MovieCard'

const Home = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/')
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show success message if redirected from signup
  const showSuccess = location.state?.fromSignup

  return (
    <div>
      {showSuccess && (
        <div className="success" style={{ marginTop: '20px' }}>
          Account created successfully! Please login to continue.
        </div>
      )}
      
      <div className="hero-section">
        <h1 className="hero-title">🎬 Movie Booking</h1>
        <p className="hero-subtitle">Book your favorite movies at the best cinemas</p>
        
        {user ? (
          <div>
            <Link to="/booking" className="btn btn-outline" style={{ marginRight: '15px' }}>
              Book a Movie
            </Link>
            <Link to="/my-bookings" className="btn btn-secondary">
              My Bookings
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn btn-outline" style={{ marginRight: '15px' }}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div className="container">
        <h2 className="section-title">Now Showing</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {movies.length === 0 && !loading && (
          <div className="text-center">
            <p>No movies available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

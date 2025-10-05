import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1>Movie Booking</h1>
          </Link>
          <div className="navbar-actions">
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Link to="/booking" className="btn btn-secondary">Book Movie</Link>
                <Link to="/my-bookings" className="btn btn-secondary">My Bookings</Link>
                {user.is_admin && (
                  <Link to="/admin" className="btn btn-accent">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

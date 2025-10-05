import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(name, email, password)
      navigate('/login', { state: { fromSignup: true } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '460px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Join us and start booking amazing movies
        </p>
      </div>
      
      {error && <div className="error">❌ {error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password (min 6 characters)"
            minLength="6"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading} 
          style={{ width: '100%', padding: '14px' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="loading-spinner"></span> Creating account...
            </span>
          ) : (
            '✨ Create Account'
          )}
        </button>
      </form>
      
      <p className="text-center" style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
        Already have an account? {' '}
        <Link 
          to="/login" 
          style={{ 
            color: 'var(--primary-light)', 
            textDecoration: 'none', 
            fontWeight: '600' 
          }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Signup
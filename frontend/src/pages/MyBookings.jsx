import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/me')
      setBookings(response.data)
    } catch (error) {
      setError('Failed to fetch bookings')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await api.delete(`/bookings/${bookingId}`)
      setBookings(bookings.filter(booking => booking.id !== bookingId))
    } catch (error) {
      setError('Failed to cancel booking')
      console.error('Error canceling booking:', error)
    }
  }

  if (loading) {
    return <div className="text-center">Loading your bookings...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center">
        <h1>My Bookings</h1>
        <p>You have no bookings yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>My Bookings</h1>
      
      <div className="grid">
        {bookings.map(booking => (
          <div key={booking.id} className="card">
            <h3>Booking #{booking.id}</h3>
            <p><strong>Show ID:</strong> {booking.show_id}</p>
            <p><strong>Seats:</strong> {booking.seats.map(seat => `Row ${seat.row}, Col ${seat.col}`).join(', ')}</p>
            <p><strong>Booked on:</strong> {new Date(booking.created_at).toLocaleString()}</p>
            
            <button 
              className="btn btn-danger" 
              onClick={() => handleCancelBooking(booking.id)}
              style={{ marginTop: '10px' }}
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings

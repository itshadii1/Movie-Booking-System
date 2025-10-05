import { useState, useEffect } from 'react'
import api from '../services/api'

const SeatGrid = ({ showId, onSeatsSelected }) => {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (showId) {
      fetchBookedSeats()
    }
  }, [showId])

  const fetchBookedSeats = async () => {
    try {
      const response = await api.get('/bookings/me')
      const bookedSeats = response.data
        .filter(booking => booking.show_id === showId)
        .flatMap(booking => booking.seats)
      
      setSeats(bookedSeats)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching booked seats:', error)
      setLoading(false)
    }
  }

  const isSeatBooked = (row, col) => {
    return seats.some(seat => seat.row === row && seat.col === col)
  }

  const isSeatSelected = (row, col) => {
    return selectedSeats.some(seat => seat.row === row && seat.col === col)
  }

  const handleSeatClick = (row, col) => {
    if (isSeatBooked(row, col)) return

    const seat = { row, col }
    const isSelected = isSeatSelected(row, col)
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => !(s.row === row && s.col === col)))
    } else {
      if (selectedSeats.length >= 6) {
        alert('Maximum 6 seats allowed per booking')
        return
      }
      setSelectedSeats(prev => [...prev, seat])
    }
  }

  useEffect(() => {
    onSeatsSelected(selectedSeats)
  }, [selectedSeats, onSeatsSelected])

  if (loading) {
    return <div className="text-center">Loading seats...</div>
  }

  return (
    <div>
      <h3>Select Seats (Max 6)</h3>
      <div className="seat-grid">
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const isBooked = isSeatBooked(row, col)
            const isSelected = isSeatSelected(row, col)
            
            return (
              <div
                key={`${row}-${col}`}
                className={`seat ${
                  isBooked ? 'occupied' : 
                  isSelected ? 'selected' : 'available'
                }`}
                onClick={() => handleSeatClick(row, col)}
              >
                {row}{col}
              </div>
            )
          })
        )}
      </div>
      
      <div className="seat-legend">
        <div className="seat-legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat occupied"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  )
}

export default SeatGrid

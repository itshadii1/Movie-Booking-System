import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App

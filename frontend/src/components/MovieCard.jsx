
import { useNavigate } from 'react-router-dom'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  const handleMovieClick = () => {
    navigate('/booking', { state: { selectedMovie: movie } })
  }

  // Function to get the image path based on movie title
  const getMovieImage = (title) => {
    const imageMap = {
      'Inception': '/images/inception.png',
      'Interstellar': '/images/interstellar.png',
      'New Movie': '/images/new-movie.png'
    }
    return imageMap[title] || null
  }

  const movieImage = getMovieImage(movie.title)

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <div className="movie-poster" style={{
        backgroundImage: movieImage ? `url(${movieImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {!movieImage && <span>{movie.title}</span>}
        {movieImage && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(10, 14, 39, 0.9) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px'
          }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
            }}>
              {movie.title}
            </span>
          </div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-duration">⏱️ {movie.duration} minutes</p>
        <p className="movie-description">{movie.description}</p>
        <button 
          className="btn btn-accent" 
          style={{ marginTop: '20px', width: '100%' }}
          onClick={(e) => {
            e.stopPropagation()
            handleMovieClick()
          }}
        >
          Book Tickets
        </button>
      </div>
    </div>
  )
}

export default MovieCard
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";

function Favourites() {
  const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const onFavoriteClick = (e, movie) => {
    e.preventDefault();
    if (isFavorite(movie.imdb_id)) {
      removeFromFavorites(movie.imdb_id);
    } else {
      addToFavorites(movie);
    }
  };

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favourites</h2>
        <div className="grid">
          {favorites.map((movie, index) => (
            <div key={movie.imdb_id || index} className="movie-card">
              <img
                className="movie-poster"
                src={movie.poster}
                alt={movie.title1}
                width={250}
                height={400}
              />
              <div className="movie-info">
                <h3>{movie.title1}</h3>
                <button
                  className={`favorite-btn ${isFavorite(movie.imdb_id) ? "active" : ""}`}
                  onClick={(e) => onFavoriteClick(e, movie)}
                >
                  ♥
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
  );
}

export default Favourites;

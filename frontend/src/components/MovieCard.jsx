import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useState, useEffect } from "react";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // Use movie.movie_id consistently (could be imdb_id)
    const id = movie.imdb_id || movie.movie_id;
    setIsFav(isFavorite(id));
  }, [movie, isFavorite]);

  const onFavoriteClick = async (e) => {
    e.preventDefault();
    const id = movie.imdb_id || movie.movie_id;

    if (isFav) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites(movie);
    }
  };

  return (
    <div className="movie-info">
      <button
        className={`favorite-btn ${isFav ? "active" : ""}`}
        onClick={onFavoriteClick}
      >
        ♥
      </button>
    </div>
  );
}

export default MovieCard;

import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useState, useEffect } from "react";

function MovieCard({ movie }) {
    const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();
    
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(favorites.some(fav => fav.imdb_id === movie.imdb_id));
    }, [favorites, movie]);  // Now updates when movie changes

    function onFavoriteClick(e) {
        e.preventDefault();
        if (isFav) {
            removeFromFavorites(movie.imdb_id);
        } else {
            addToFavorites(movie);
        }
    }

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

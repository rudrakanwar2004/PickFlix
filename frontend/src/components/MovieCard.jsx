import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({movie}) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return <div className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} alt={movie.title}/>
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                    ♥
                </button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title1}</h3>
            <p>{movie.release_date}</p>
        </div>
    </div>
}

export default MovieCard


// import React from "react";

// function MovieCard({ movie, isFavorite, toggleFavorite }) {
//   return (
//     <div className="movie-card">
//       <div className="poster-lg">
//         <img
//           className="poster"
//           style={{ borderRadius: "40px", marginLeft: "80px" }}
//           height={400}
//           width={250}
//           src={movie.poster}
//           alt="Movie Poster"
//         />
//         {/* Favorite Icon */}
//         <div className="favorite-icon" onClick={() => toggleFavorite(movie)}>
//           {isFavorite ? "❤️" : "🤍"}
//         </div>
//       </div>

//       <div className="movie-details">
//         <h2>{movie.title1}</h2>
//         <p>Rating: {movie.rating}/10</p>
//         <p>Release Date: {movie.release_date}</p>
//       </div>
//     </div>
//   );
// }

// export default MovieCard;

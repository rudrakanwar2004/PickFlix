import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import api from "../api";  // if needed for debugging

function Favourites() {
  const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const onFavoriteClick = async (e, movie) => {
    e.preventDefault();
    // Standardize to one id:
    const id = movie.imdb_id || movie.movie_id;
  
    if (isFavorite(id)) {
      try {
        await removeFromFavorites(id);
      } catch (error) {
        console.log("Error removing from favourites:", error);
      }
    } else {
      try {
        await addToFavorites(movie);
      } catch (error) {
        console.log("Error adding to favourites:", error);
      }
    }
  };

  if (!favorites) {
    return <div>Loading...</div>;
  }

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favourites</h2>
        <div className="grid">
          {favorites.map((movie) => (
            <div key={movie.movie_id} className="movie-card">
              <img
                className="movie-poster"
                src={movie.poster}
                alt={movie.title}
                width={250}
                height={400}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <button
                  className={`favorite-btn ${isFavorite(movie.movie_id) ? "active" : ""}`}
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
      <p>Start adding movies to your favourites and they will appear here!</p>
    </div>
  );
}

export default Favourites;





// import "../css/Favorites.css";
// import { useMovieContext } from "../contexts/MovieContext";

// function Favourites() {
//   const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

//   const onFavoriteClick = (e, movie) => {
//     e.preventDefault();
//     if (isFavorite(movie.imdb_id)) {
//       removeFromFavorites(movie.imdb_id);
//     } else {
//       addToFavorites(movie);
//     }
//   };

//   if (favorites.length > 0) {
//     return (
//       <div className="favorites">
//         <h2>Your Favourites</h2>
//         <div className="grid">
//           {favorites.map((movie, index) => (
//             <div key={movie.imdb_id || index} className="movie-card">
//               <img
//                 className="movie-poster"
//                 src={movie.poster}
//                 alt={movie.title1}
//                 width={250}
//                 height={400}
//               />
//               <div className="movie-info">
//                 <h3>{movie.title1}</h3>
//                 <button
//                   className={`favorite-btn ${isFavorite(movie.imdb_id) ? "active" : ""}`}
//                   onClick={(e) => onFavoriteClick(e, movie)}
//                 >
//                   ♥
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="favorites-empty">
//       <h2>No Favorite Movies Yet</h2>
//       <p>Start adding movies to your favorites and they will appear here!</p>
//     </div>
//   );
// }

// export default Favourites;

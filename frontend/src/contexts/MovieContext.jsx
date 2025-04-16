import { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../api"; // axios with token

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("api/favourites/");
      if (res.data) {
        setFavorites(res.data);
      }
    } catch (error) {
      console.log("Error fetching favourites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addToFavorites = useCallback(async (movie) => {
    try {
      // Use consistent id: assume movie.imdb_id is the value
      await api.post("api/favourites/add_favourite/", {
        movie_id: movie.imdb_id,  // using imdb_id consistently as movie_id
        title: movie.title1,       // ensure movie object has title property
        poster: movie.poster,
      });
      fetchFavorites();
    } catch (error) {
      console.log("Error adding to favourites:", error);
    }
  }, []);

  const removeFromFavorites = useCallback(async (movieId) => {
    try {
      await api.delete(`api/favourites/${movieId}/`);
      fetchFavorites();
    } catch (error) {
      console.log("Error removing from favourites:", error);
    }
  }, []);

  const isFavorite = useCallback(
    (movieId) => favorites.some((fav) => fav.movie_id === movieId),
    [favorites]
  );

  return (
    <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite , fetchFavorites}}>
      {children}
    </MovieContext.Provider>
  );
};











// import { createContext, useState, useContext, useEffect, useCallback } from "react";

// const MovieContext = createContext();

// export const useMovieContext = () => useContext(MovieContext);

// export const MovieProvider = ({ children }) => {
//     const [favorites, setFavorites] = useState([]);

//     // Load favorites from localStorage on mount
//     useEffect(() => {
//         const storedFavs = localStorage.getItem("favorites");
//         if (storedFavs) setFavorites(JSON.parse(storedFavs));
//     }, []);

//     // Save favorites to localStorage whenever it updates
//     useEffect(() => {
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//     }, [favorites]);

//     // ✅ Prevent duplicate favorites
//     const addToFavorites = useCallback((movie) => {
//         setFavorites((prev) => {
//             if (!prev.some((fav) => fav.imdb_id === movie.imdb_id)) {
//                 return [...prev, movie];
//             }
//             return prev;
//         });
//     }, []);

//     const removeFromFavorites = useCallback((movieId) => {
//         setFavorites((prev) => prev.filter((movie) => movie.imdb_id !== movieId));
//     }, []);

//     const isFavorite = useCallback((movieId) => {
//         return favorites.some((movie) => movie.imdb_id === movieId);
//     }, [favorites]);

//     return (
//         <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
//             {children}
//         </MovieContext.Provider>
//     );
// };

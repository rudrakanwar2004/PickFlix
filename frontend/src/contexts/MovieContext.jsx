import { createContext, useState, useContext, useEffect, useCallback } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
    }, []);

    // Save favorites to localStorage whenever it updates
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // ✅ Prevent duplicate favorites
    const addToFavorites = useCallback((movie) => {
        setFavorites((prev) => {
            if (!prev.some((fav) => fav.imdb_id === movie.imdb_id)) {
                return [...prev, movie];
            }
            return prev;
        });
    }, []);

    const removeFromFavorites = useCallback((movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.imdb_id !== movieId));
    }, []);

    const isFavorite = useCallback((movieId) => {
        return favorites.some((movie) => movie.imdb_id === movieId);
    }, [favorites]);

    return (
        <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </MovieContext.Provider>
    );
};

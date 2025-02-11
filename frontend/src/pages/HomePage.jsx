import { useState, useEffect } from "react";
import axios from "axios";
import CastModal from "../components/CastModal";
// import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import "../css/Home.css";


function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null); // New state to track selected cast
  const [showModal, setShowModal] = useState(false); // New state to handle modal visibility

  const [myApiKey, setApiKey] = useState('');
  // const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  // function onFavoriteClick(e, movie) {
  //   if (isFavorite(movie.id)) removeFromFavorites(movie.id);
  //   else addToFavorites(movie);
  // }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const conn_url = "https://d20dac28-8784-48da-bf70-dcb274ddc96a-dev.e1-us-east-azure.choreoapis.dev/pickflix/backend/v1";

  const api = axios.create({ 
    baseURL: BACKEND_URL ? BACKEND_URL : conn_url,
  });
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/get-api-key/`) // Fetch API key from Django backend
          .then((response) => response.json())
          .then((data) => {
              setApiKey(data.api_key);
          })
          .catch((error) => console.error('Error fetching API key:', error));
  }, []);
 

  // Open modal with the selected cast details
  const openModal = (cast) => {
    setSelectedCast(cast);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCast(null);
 
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/autocomplete/?query=${query}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching autocomplete:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Hide suggestions
    handleRecommend(suggestion);
  };

  const handleRecommend = async (title) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${myApiKey}&query=${title}`
      );

      const results = response.data.results;
      if (results.length < 1) {
        setError("No movie recommendations found.");
        setRecommendations(null);
      } else {
        const movieId = results[0].id;
        const movieTitle = results[0].original_title;
        console.log("movie id"+movieId)
        await movie_recs(movieTitle, movieId,myApiKey);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle movie recommendations
  const movie_recs = async (movie_title, movie_id, my_api_key) => {
    const url = BACKEND_URL+"/similarity/"; // Your Django backend endpoint
    try {
      const response = await axios.post(url, { name: movie_title });
      const recs = response.data.recommendations;

      if (!recs || recs.length < 1) {
        setError("No Recommendations Found.");
        setMovies([]);
      } else {
        await movie_details(movie_id, my_api_key, recs, movie_title);
      }
    } catch (error) 
    {
      console.error(error);
      // setError("Error fetching recommendations.");
      // setMovies([]);
      // Extract meaningful error message
      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        errorMessage = "Sorry! The movie you requested is not in our database.Please check the spelling or try with other movies!";
      } else if (error.request) {
        // Request was made, but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message;
      }

      // Set the extracted error message
      setError(errorMessage);
      setMovies([]);      

    }
  };
  const movie_details = async (movie_id, my_api_key, arr, movie_title) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${myApiKey}`
      );

      const result = response.data; // We expect a single movie object here
      if (result) {
        // Process the movie details and recommendations
        const movieInfo = await show_details(result, arr, movie_title, myApiKey, movie_id);
        setMovies([movieInfo]); // Set the formatted movie info with recommendations
        //setMovies([{ ...result, recommendations: arr }]); // Assuming arr is the list of recommended movie titles
        setError(null);
      } else {
        setError("Failed to fetch movie details.");
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movie details.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const show_details = async (movie_details, arr, movie_title, my_api_key, movie_id) => {
    const imdb_id = movie_details.imdb_id;
    const title1 = movie_details.title;
    const poster = `https://image.tmdb.org/t/p/original${movie_details.poster_path}`;
    const overview = movie_details.overview;
    const genres = movie_details.genres;
    const rating = movie_details.vote_average;
    const vote_count = movie_details.vote_count;
    const release_date = new Date(movie_details.release_date);
    const runtime = parseInt(movie_details.runtime);
    const status = movie_details.status;

    const genre_list = genres.map((genre) => genre.name);
    const my_genre = genre_list.join(", ");

    let formatted_runtime = "";
    if (runtime % 60 === 0) {
      formatted_runtime = `${Math.floor(runtime / 60)} hour(s)`;
    } else {
      formatted_runtime = `${Math.floor(runtime / 60)} hour(s) ${runtime % 60} min(s)`;
    }

    // get movie posters
    const posters = await get_movie_posters(arr,myApiKey)
    
    // get the details of cast
    const castDetails = await get_movie_cast(movie_id, myApiKey);
    // Return the formatted movie info
    return {
      imdb_id,
      title1,
      poster,
      overview,
      genres: my_genre,
      rating,
      vote_count,
      release_date: release_date.toDateString(),
      runtime: formatted_runtime,
      status,
      recommendations: arr.map((title, index) => ({
        title,
        poster: posters[index] || null,
      })),
      cast: castDetails,
    };
  };

  // Function to get searched movie's poster 
  const get_movie_posters = async (arr, myApiKey) => {
    try 
    {
      const posterPromises = arr.map(async (title) => {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${myApiKey}&query=${title}`
        );
        const movieData = response.data.results[0];
        return movieData
          ? `https://image.tmdb.org/t/p/original${movieData.poster_path}`
          : null; // Return null if no poster is found
      });

      const posters = await Promise.all(posterPromises);
      return posters.filter((poster) => poster !== null); // Filter out null values
    } 
    catch (error) 
    {
    console.error("Error fetching posters:", error);
    return [];
    }
  };

  // Function to get searched movie cast details
  const get_movie_cast = async (movieId, myApiKey) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${myApiKey}`
      );
  
      const cast = response.data.cast;
      const topCast = cast.slice(0, Math.min(cast.length, 10)); // Get up to the top 10 cast members
  
      const castDetails = topCast.map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profile: member.profile_path
          ? `https://image.tmdb.org/t/p/original${member.profile_path}`
          : null, // Handle missing profile images
      }));
  
      return castDetails;
    } catch (error) {
      console.error("Error fetching cast details:", error);
      return [];
    }
  };


  

  return (
    <div className="home">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery) {
            handleRecommend(searchQuery);
          }
        }}
        className="search-form"
        style={{ position: "relative" }} // Ensures the dropdown is positioned correctly
      >
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button" disabled={loading}>
          Search
        </button>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
      <br />
      
      {/* Error Message Section */}
      {error && (
        <div className="error-message">
          <center>{error}</center>
        </div>
      )}
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="movies-grid">
          {movies.length > 0 &&
            movies.map((movie) => (
              <div key={movie.imdb_id}>
        
                <div className="text-uppercase">
                  <center>
                      <h2>{movie.title1}</h2>
                  </center>
                </div>
                <br /><br /><br />
  
                <div id="mcontent">
                  <div className="poster-lg">
                    <img
                      className="poster"
                      style={{ borderRadius: "40px", marginLeft: "80px" }}
                      height={400}
                      width={250}
                      src={movie.poster}
                      alt="Movie Poster"
                      
                    />
    
                    <MovieCard movie={movie} key={movie.imdb_id} />
                  </div>
                  
                  <div id="details">

                    <h6 id="title" style={{ color: "white" }}>
                      <b>TITLE</b>: &nbsp;{movie.title1}
                    </h6>

                    <br />

                    <h6
                      id="overview"
                      style={{ color: "white", maxWidth: "85%" }}
                    >
                      <b>OVERVIEW:</b>
                      <br />
                      
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{movie.overview}
                    </h6>
                    <h6 id="vote_average" style={{ color: "white" }}>

                    <br />
                    <b>RATING:</b> &nbsp;{movie.rating}/10 ({movie.vote_count} votes)
                    </h6>

                    <br />

                    <h6 id="genres" style={{ color: "white" }}>
                    <b>GENRE:</b> &nbsp;{movie.genres}
                    </h6>
                    
                    <br />
                    
                    <h6 id="date" style={{ color: "white" }}>
                    <b>RELEASE DATE:</b>&nbsp;{movie.release_date}
                    </h6>
                    
                    <br />
                    
                    <h6 id="runtime" style={{ color: "white" }}>
                    <b>RUNTIME:</b> &nbsp;{movie.runtime}
                    </h6>

                    <br />
                    
                    <h6 id="status" style={{ color: "white" }}>
                    <b>STATUS:</b> &nbsp;{movie.status}
                    </h6>
                  </div>
                </div>

                <br /><br />

                <center><h2>Top Cast</h2></center>
                <div className="cast-list">
                  {movie.cast.map((member) => (
                    <div key={member.id} 
                        className="castcard card" 
                        title={`Click to know more about ${member.name}`}
                        
                    >
                      <div className="imghvr">
                        <img
                          className="card-img-top cast-img"
                          id={member.id}
                          height="360"
                          width="240"
                          alt={`${member.name} - profile`}
                          src={member.profile}
                        />
                        <figcaption className="image-container">
                          <button className="card-btn btn btn-danger" onClick={() => openModal(member)}>
                            Know More
                          </button>
                        </figcaption>
                      </div>
                      <h5 className="card-title cast-name">{member.name}</h5>
                      <h6 className="card-character cast-character">
                        Character :- {member.character}
                      </h6>
                    </div>
                  ))}

                </div>

                <br /><br />
  
                <center><h2>More Like This</h2></center>
                <div className="recommendations">
                  {movie.recommendations.map((rec, recIndex) => (
                    <div key={recIndex} className="card-body">
                      <div className="imghvr">
                        <img
                          src={rec.poster}
                          alt={`${rec.title} poster`}
                          width={240} // Optional: Keep consistent card dimensions
                          height={360} // Optional: Keep consistent card dimensions
                        />
                        <figcaption className="image-container">
                        <button className="card-btn btn btn-danger" onClick={() => {handleRecommend(rec.title);     setSearchQuery("")
 }}>
                            Know More
                          </button>
                        </figcaption>
                      </div>                   
                      <div className="card-title">
                        <h5>{toTitleCase(rec.title)}</h5>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
        </div>
      )}

      <div className="modal-overlay">
        <CastModal cast={selectedCast} showModal={showModal} closeModal={closeModal} />
      </div>
    </div>
  );
}
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export default HomePage;


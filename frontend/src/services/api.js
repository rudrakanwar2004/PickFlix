const BASE_URL = "http://127.0.0.1:8000"; // Django backend base URL

// export const getPopularMovies = async () => {
//   const response = await fetch(`${BASE_URL}/movies/popular/`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await response.json();
//   return data.results;
// };

// export const searchMovies = async (query) => {
//   const response = await fetch(`${BASE_URL}/movies/search/?query=${encodeURIComponent(query)}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await response.json();
//   return data.results;
// };




export const getRecommendations = async () => {
  const response = await fetch(`${BASE_URL}/recommend`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.results;
};

// const API_KEY = "23f11857def64e1cc0dc66c09692b2a7";
// const BASE_URL = "https://api.themoviedb.org/3";

// export const getPopularMovies = async () => {
//   const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
//   const data = await response.json();
//   return data.results;
// };

// export const searchMovies = async (query) => {
//   const response = await fetch(
//     `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
//       query
//     )}`
//   );
//   const data = await response.json();
//   return data.results;
// };
  


// const API_KEY = "f5316685";
// const BASE_URL = "http://www.omdbapi.com/";
// export const getpopularMovies = async (query = "") => {
//     const response = await fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch movies");
//     }
//     const data = await response.json();
//     return data.Search || []; 
//   };
  

//   export const searchMovies = async (query) => {
//     const response = await fetch(
//       `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
//     );
//     const data = await response.json();
//     return data.results || [];
//   };

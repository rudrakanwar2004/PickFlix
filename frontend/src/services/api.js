const BASE_URL = "http://127.0.0.1:8000"; // Django backend base URL



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

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import os
import pickle
import requests
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load the movie data and similarity matrix
movies_dict = pickle.load(open('movie_dict1.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity_matrix = pickle.load(open('similarity1.pkl', 'rb'))
api_key = os.getenv("API_KEY")

# Function to get API key
def get_api_key(request):
    return JsonResponse({"api_key": api_key})

# Function to fetch movie poster
def fetch_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US"
    data = requests.get(url).json()
    poster_path = data.get('poster_path', '')
    full_path = f"https://image.tmdb.org/t/p/w500/{poster_path}" if poster_path else ""
    return full_path

# Movie recommendations based on similarity
def recommend_movies(movie_name):
    try:
        movie_index = movies[movies['title'] == movie_name].index[0]
        distances = similarity_matrix[movie_index]
        movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
        recommended_movies_name = []
        recommended_movie_posters = []
        for i in movie_list:
            movie_id = movies.iloc[i[0]].movie_id
            recommended_movies_name.append(movies.iloc[i[0]].title)
            recommended_movie_posters.append(fetch_poster(movie_id))
        return {"movies": recommended_movies_name, "posters": recommended_movie_posters}
    except IndexError:
        return {"error": "Movie not found"}

# API view for movie recommendations
@api_view(['GET'])
def recommend_view(request):
    movie_name = request.query_params.get('movie', '')
    if not movie_name:
        return JsonResponse({"error": "Movie name is required"}, status=400)
    
    recommendations = recommend_movies(movie_name)
    return JsonResponse(recommendations)

# Autocomplete functionality for movie search
@api_view(['GET'])
@permission_classes([AllowAny])
def autocomplete(request):
    query = request.GET.get("query", "").strip().lower()
    if not query:
        return JsonResponse({"error": "Query parameter is required"}, status=400)

    starts_with_matches = movies[movies["title"].str.lower().str.startswith(query)]
    contains_matches = movies[
        movies["title"].str.lower().str.contains(query, na=False)
        & ~movies.index.isin(starts_with_matches.index)
    ]

    combined_matches = pd.concat([starts_with_matches, contains_matches])
    movie_titles = combined_matches["title"].head(5).tolist()
    return JsonResponse({"suggestions": movie_titles})

# Function to create similarity matrix (used for CSV-based system)
def create_similarity():
    data = pd.read_csv('final_data1.csv')
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(data['comb'])
    similarity = cosine_similarity(count_matrix)
    return data, similarity

# Recommendation function based on CSV dataset
@csrf_exempt
def similarity(request):
    if request.method == "POST":
        movie_title = json.loads(request.body).get('name', '').lower()
        recommendations = rcmd(movie_title)
        if isinstance(recommendations, str):  # In case of error message
            return JsonResponse({"error": recommendations}, status=400)
        return JsonResponse({"recommendations": recommendations})
    return JsonResponse({"error": "Invalid method"}, status=405)

def rcmd(movie_title):
    try:
        data.head()
        similarity_matrix.shape
    except:
        data, similarity_matrix = create_similarity()

    if movie_title not in data['movie_title'].unique():
        return 'Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies'
    else:
        movie_index = data.loc[data['movie_title'] == movie_title].index[0]
        similarity_scores = list(enumerate(similarity_matrix[movie_index]))
        sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        recommended_movies = [data['movie_title'][i[0]] for i in sorted_scores[1:11]]
        return recommended_movies



def index(request):
    return render(request, 'index.html')




from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from decouple import config

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import requests
from django.http import JsonResponse
import pickle,json
import pandas as pd


# Load the movie data and similarity matrix
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl', 'rb'))
api_key = config("API_KEY")

@csrf_exempt
def get_api_key(request):
    return JsonResponse({"api_key": settings.API_KEY})

def fetch_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US"
    data = requests.get(url).json()
    poster_path = data.get('poster_path', '')
    full_path = f"https://image.tmdb.org/t/p/w500/{poster_path}" if poster_path else ""
    return full_path

def recommend_movies(movie_name):
    try:
        movie_index = movies[movies['title'] == movie_name].index[0]
        distances = similarity[movie_index]
        movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
        recommended_movies_name = []
        recommended_movie_posters = []
        for i in movie_list:

            movie_id = movies.iloc[i[0]].movie_id
            recommended_movies_name.append(movies.iloc[i[0]].title)
            recommended_movie_posters.append(fetch_poster(movie_id))
        print(recommended_movies_name)
        print(recommended_movie_posters)
        return {"movies": recommended_movies_name, "posters": recommended_movie_posters}
    except IndexError:
        return {"error": "Movie not found"}

@api_view(['GET'])
@permission_classes([AllowAny])
def recommend_view(request):
    movie_name = request.query_params.get('movie', '')
    if not movie_name:
        return Response({"error": "Movie name is required"}, status=400)
    
    recommendations = recommend_movies(movie_name)
    return Response(recommendations)



def create_similarity():
    data = pd.read_csv('main_data.csv')
    # creating a count matrix
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(data['comb'])
    # creating a similarity score matrix
    similarity = cosine_similarity(count_matrix)
    return data,similarity



@csrf_exempt
def similarity(request):
    if request.method == "POST":
        movie_title = json.loads(request.body).get('name', '')
        recommendations = rcmd(movie_title)
        if isinstance(recommendations, str):  # In case of error message
            return JsonResponse({"error": recommendations}, status=400)
        print(recommendations)
        return JsonResponse({"recommendations": recommendations})
    return JsonResponse({"error": "Invalid method"}, status=405)

def rcmd(movie_title):
    movie_title = movie_title.lower()
    try:
        data.head()
        similarity.shape
    except:
        data, similarity = create_similarity()

    if movie_title not in data['movie_title'].unique():
        return 'Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies'
    else:
        movie_index = data.loc[data['movie_title'] == movie_title].index[0]
        similarity_scores = list(enumerate(similarity[movie_index]))
        sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        recommended_movies = [data['movie_title'][i[0]] for i in sorted_scores[1:11]]  # Exclude the original movie
        return recommended_movies



def index(request):
    return render(request, 'index.html')




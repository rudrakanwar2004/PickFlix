from django.urls import path
from .views import *

urlpatterns = [
    path('',index, name='index'),
    # path("movies/popular/", get_popular_movies, name="get_popular_movies"),
    # path("movies/search/", search_movies, name="search_movies"),
    path("recommend/", recommend_view, name="recommend"),
    path('similarity/', similarity, name='similarity'),
    path('api/get-api-key/',get_api_key,name='get-api-key')
]

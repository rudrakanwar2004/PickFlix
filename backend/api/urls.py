from django.urls import path
from .views import *

urlpatterns = [
    path('',index, name='index'),
    path("recommend/", recommend_view, name="recommend"),
    path('similarity/', similarity, name='similarity'),
    path('api/get-api-key/',get_api_key,name='get-api-key'),
    path('api/autocomplete/', autocomplete, name='autocomplete'),

]

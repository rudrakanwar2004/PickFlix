from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Favourite


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError("Username is already in use.")
        return value.lower()

    def create(self, validated_data):
        validated_data['username'] = validated_data['username'].lower()
        user = User.objects.create_user(**validated_data)
        return user


class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = ['id', 'movie_id', 'title', 'poster']


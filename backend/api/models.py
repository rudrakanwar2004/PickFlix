from django.db import models
from django.contrib.auth.models import User

class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=100, null=True, blank=True)
    title = models.CharField(max_length=255,null=True, blank=True)
    poster = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"


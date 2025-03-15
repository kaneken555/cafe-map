from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    # email = models.EmailField(unique=True)
    # password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Map(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MapUserRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Cafe(models.Model):
    place_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    rating = models.FloatField(null=True, blank=True)
    user_ratings_total = models.IntegerField(null=True, blank=True)
    photo_url = models.CharField(max_length=255, null=True, blank=True)
    photo_urls = models.JSONField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    opening_hours = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeMapRelation(models.Model):
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    color = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeTagRelation(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Memo(models.Model):
    memo = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeMemoRelation(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    memo = models.ForeignKey(Memo, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ShareMap(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeShareMapRelation(models.Model):
    share_map = models.ForeignKey(ShareMap, on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

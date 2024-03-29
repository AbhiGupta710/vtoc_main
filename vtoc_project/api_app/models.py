from django.db import models
# Create your models here.

class TryOnModel(models.Model):
    username = models.CharField(max_length=100)
    person_image = models.TextField()  # Assuming base64 image URL will be stored as text
    cloth_image = models.TextField()   # Assuming base64 image URL will be stored as text
    tryon_image = models.TextField()   # Assuming base64 image URL will be stored as text
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.date_time}"
    
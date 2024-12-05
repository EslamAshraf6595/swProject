from django.db import models

# Create your models here.

class Product(models.Model):
    name= models.CharField(max_length=50)
    price=models.DecimalField( max_digits=7, decimal_places=2)
    contain=models.TextField()
    # image=models.ImageField(upload_to="photo/%y/%m/%d")
    active=models.BooleanField(default=True)
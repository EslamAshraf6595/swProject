from django.db import models

# Create your models here.
class Product(models.Model): 
    name= models.CharField(max_length=50) 
    content= models.TextField()
    price= models. DecimalField(max_digits=5, decimal_places=2) 
    # image=models.ImageField(upload_to='photos/%y/%m/%d') 
    active= models.BooleanField(default=True)

class Signup(models.Model):
    name= models.CharField(max_length=50) 
    email=models.EmailField(name='')
    password=models.CharField(max_length=15)
    
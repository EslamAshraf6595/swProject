from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # Updated
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    amount = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
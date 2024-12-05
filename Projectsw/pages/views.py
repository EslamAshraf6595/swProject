from django.shortcuts import render, redirect
from django.contrib import messages
# from django.http import HttpResponse
# Create your views here.

# Temporary storage for user data (Replace with a database in production)
users_data = {}

def index(data):
    # return HttpResponse('wlecom to my project')
    x={'name':'Eslam','Age':25}
    return render(data,'pages/index.html',x)

def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Save user details
        if email in users_data:
            messages.error(request, "Email already exists. Please log in.")
        else:
            users_data[email] = {'username': username, 'password': password}
            messages.success(request, "Signup successful! Please log in.")
            return redirect('login')

    return render(request, 'pages/signup.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Check if user exists and password matches
        user = users_data.get(email)
        if user and user['password'] == password:
            return redirect('home')
        else:
            messages.error(request, "Invalid email or password. Please try again.")

    return render(request, 'pages/login.html')

def home(request):
    return render(request, 'pages/home.html')

def about(data):
    return render(data,'pages/about.html')

def products(data):
    return render(data,'pages/products.html')

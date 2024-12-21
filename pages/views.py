from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product
import json

# Temporary storage for user data (Replace with a database in production)
users_data = {}

# -----------------------
# User Authentication
# -----------------------
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
            return redirect('home')  # Go to our single-page home
        else:
            messages.error(request, "Invalid email or password. Please try again.")

    return render(request, 'pages/login.html')


# -----------------------
# Single-Page Core View
# -----------------------
def home(request):
    """
    Renders a single template (e.g. pages/home.html) that contains
    all sections: hero/banner, about, products, etc.
    """
    # Fetch products so we can display them on this single page
    all_products = Product.objects.all()
    # You could also fetch other data here if needed

    # Render 'pages/home.html' which includes all the
    # sections (Home, About, Products, etc.) in one file
    return render(request, 'pages/home.html', {
        'products': all_products
    })


# -----------------------
# Cart Management (Ajax Endpoints)
# -----------------------
@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            product_name = data.get('product_name')
            product_price = data.get('product_price')
            product_image = data.get('product_image')

            # Validate product details
            if not product_name or not product_price:
                return JsonResponse({'error': 'Missing product details'}, status=400)

            # Fetch the cart from session
            cart = request.session.get('cart', {})

            # Use product_name as a unique key in the cart
            if product_name in cart:
                cart[product_name]['quantity'] += 1
            else:
                cart[product_name] = {
                    'price': float(product_price),
                    'image': product_image,
                    'quantity': 1
                }

            # Save the cart back into the session
            request.session['cart'] = cart

            return JsonResponse({
                'success': True,
                'cart_count': len(cart),
                'message': 'Product added to cart!'
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def remove_from_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')

        cart = request.session.get('cart', {})

        if product_id in cart:
            del cart[product_id]
            request.session['cart'] = cart

        return JsonResponse({
            'success': True,
            'cart_count': sum(item['quantity'] for item in cart.values()),
            'cart': cart
        })

    return JsonResponse({'success': False, 'message': 'Invalid request'}, status=400)


def cart_view(request):
    cart = request.session.get('cart', {})
    # Optionally, calculate a grand total
    total = 0.0
    for item_data in cart.values():
        total += item_data['price'] * item_data['quantity']

    return render(request, 'pages/cart.html', {
        'cart': cart,
        'total': total
    })
def about(request):
    return render(request, 'pages/about.html')
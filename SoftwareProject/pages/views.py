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
            return redirect('home')  # Redirect to home page
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

            # Add or update the cart item
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
                'cart_count': sum(item['quantity'] for item in cart.values()),
                'message': 'Product added to cart!'
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def remove_from_cart(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            product_id = data.get('product_id')

            # Fetch the cart from session
            cart = request.session.get('cart', {})

            if product_id in cart:
                cart[product_id]['quantity'] -= 1
                if cart[product_id]['quantity'] <= 0:
                    del cart[product_id]

                # Save the updated cart back to the session
                request.session['cart'] = cart

                return JsonResponse({
                    'success': True,
                    'cart_count': sum(item['quantity'] for item in cart.values()),
                    'cart': cart,
                    'message': f'{product_id} quantity updated or removed.'
                })

            return JsonResponse({'error': 'Product not found in cart'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def cart_view(request):
    """
    Renders the cart page and calculates the total price of items in the cart.
    """
    cart = request.session.get('cart', {})
    total = sum(item['price'] * item['quantity'] for item in cart.values())

    return render(request, 'pages/cart.html', {
        'cart': cart,
        'total': total
    })


def about(request):
    """
    Renders the about page.
    """
    return render(request, 'pages/about.html')

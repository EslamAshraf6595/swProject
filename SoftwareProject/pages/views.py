from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product

# Temporary storage for user data (Replace with a database in production)
users_data = {}

# User Authentication Views
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


# Core Views
def home(request):
    return render(request, 'pages/home.html')


def about(request):
    return render(request, 'pages/about.html')


def products(request):
    products = Product.objects.all()
    return render(request, 'pages/products.html', {'products': products})


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    return render(request, 'pages/product_detail.html', {'product': product})


# Cart Management
@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            product_name = request.POST.get('product_name')
            product_price = request.POST.get('product_price')
            product_image = request.POST.get('product_image')

            if not product_id or not product_name or not product_price:
                return JsonResponse({'error': 'Missing product details'}, status=400)

            cart = request.session.get('cart', {})

            if product_id in cart:
                cart[product_id]['quantity'] += 1
            else:
                cart[product_id] = {
                    'name': product_name,
                    'price': float(product_price),
                    'image': product_image,
                    'quantity': 1
                }

            request.session['cart'] = cart

            return JsonResponse({'success': True, 'cart_count': len(cart), 'message': 'Product added to cart!'})

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
    return render(request, 'pages/cart.html', {'cart': cart})


def product_list(request):
    products = Product.objects.all()
    return render(request, 'pages/product_list.html', {'products': products})

# galli_connect_app/views.py
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages

# Create your views here.
def home(request):
    return render(request, 'index.html') 

def homepage(request):
    return render(request, 'index.html') 

@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
        except json.JSONDecodeError:
            return HttpResponse("Invalid JSON in request body.", status=400)



        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect('signup')

        user = User.objects.create_user(username=username, password=password)
        user.save()
        messages.success(request, "Account created successfully! Please login.")
        return HttpResponse("Successfully created user", status = 200)

    return render(request, "signup.html")

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return HttpResponse("Invalid JSON in request body.", status=400)

        # username = request.POST.get("username")
        # password = request.POST.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            messages.success(request, "Login successful!")
            return HttpResponse("Login successful", status=200)
            # return redirect('home')
        else:
            messages.error(request, "Invalid username or password")
            return HttpResponse("Invalid username or password", status=400)
            # return redirect('login')

    return render(request, "login.html")


def logout_view(request):
    auth_logout(request)
    return redirect('login')

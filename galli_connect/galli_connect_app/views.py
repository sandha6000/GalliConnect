# galli_connect_app/views.py
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from .models import UserProfile  # import the profile model

import json
from django.http import JsonResponse

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
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON in request body."}, status=400)

        if not name or not email or not password or not role:
            return JsonResponse({"message": "All fields are required."}, status=400)

        # Check if same email already exists for this role
        existing_user = User.objects.filter(email=email, userprofile__role=role).first()
        if existing_user:
            return JsonResponse({"message": f"User with email {email} and role {role} already exists."}, status=409)

        # Create the Django User
        user = User.objects.create_user(username=f"{email}_{role}", email=email, password=password)
        user.first_name = name
        user.save()

        # Create linked profile with role
        UserProfile.objects.create(user=user, role=role)

        return JsonResponse({
            "id": user.id,
            "name": name,
            "email": email,
            "role": role
        }, status=201)

    return JsonResponse({"message": "Method not allowed."}, status=405)


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')   # match client login payload
            password = data.get('password')
            role = data.get('role')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON in request body."}, status=400)

        if not email or not password:
            return JsonResponse({"message": "Email and password are required."}, status=400)

        # authenticate() uses username, not email, so we fetch username by email
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            return JsonResponse({"message": "Invalid credentials."}, status=401)

        if user is None:
            return JsonResponse({"message": "Invalid credentials."}, status=401)

        return JsonResponse({
            "id": user.id,
            "name": user.first_name or user.username,
            "email": user.email,
            "role": role
        }, status=200)

    return JsonResponse({"message": "Method not allowed."}, status=405)


def logout_view(request):
    auth_logout(request)
    return redirect('login')

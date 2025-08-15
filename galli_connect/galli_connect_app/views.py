# galli_connect_app/views.py
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.utils.dateparse import parse_date
from datetime import datetime
from .models import UserProfile  # import the profile model
from .models import DriverRoute
from .models import PassengerBooking

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
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')  # "DRIVER" or "PASSENGER"
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body"}, status=400)

        if not email or not password or not role:
            return JsonResponse({"error": "Email, password, and role are required"}, status=400)

        # Find user with matching email AND role
        user_obj = User.objects.filter(email=email, userprofile__role=role).first()
        if not user_obj:
            return JsonResponse({"error": "No user found with given email and role"}, status=404)

        # Authenticate
        user = authenticate(username=user_obj.username, password=password)
        if user:
            auth_login(request, user)
            return JsonResponse({
                "message": "Login successful",
                "id": user.id,  # unique internal id
                "role": role,
                "name": user.first_name,
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def add_driver_route(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            driver_id = data.get("driverId")
            from_location = data.get("from")
            to_location = data.get("to")
            departure_time = data.get("departureTime")
            cost_per_seat = data.get("costPerSeat")
            active_days = data.get("activeDays")
            total_seats = data.get("totalSeats")

            driver = User.objects.filter(id=driver_id).first()
            if not driver:
                return JsonResponse({"error": "Driver not found"}, status=404)

            route = DriverRoute.objects.create(
                driver=driver,
                from_location=from_location,
                to_location=to_location,
                departure_time=departure_time,
                cost_per_seat=cost_per_seat,
                active_days=active_days,
                total_seats = total_seats
            )

            return JsonResponse({
                "id": route.id,
                "from": route.from_location,
                "to": route.to_location,
                "departureTime": route.departure_time,
                "costPerSeat": str(route.cost_per_seat),
                "activeDays": route.active_days
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)





@csrf_exempt
def get_driver_routes(request, driver_id):
    if request.method == "GET":
        driver = User.objects.filter(id=driver_id).first()
        if not driver:
            return JsonResponse({"error": "Driver not found"}, status=404)

        routes = DriverRoute.objects.filter(driver=driver)
        route_list = [
            {
                "id": route.id,
                "from_location": route.from_location,
                "to_location": route.to_location,
                "departure_time": route.departure_time,
                "cost_per_seat": str(route.cost_per_seat),
                "active_days": route.active_days,
                "total_seats": route.total_seats
            }
            for route in routes
        ]

        return JsonResponse({"routes": route_list}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import DriverRoute
from django.contrib.auth.models import User
import json

@csrf_exempt
def update_driver_route(request, driver_id, route_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        driver = User.objects.filter(id=driver_id).first()
        if not driver:
            return JsonResponse({"error": "Driver not found"}, status=404)

        route = DriverRoute.objects.filter(id=route_id, driver=driver).first()
        if not route:
            return JsonResponse({"error": "Route not found for this driver"}, status=404)

        # Update fields
        route.from_location = data.get("from_location", route.from_location)
        route.to_location = data.get("to_location", route.to_location)
        route.departure_time = data.get("departure_time", route.departure_time)
        route.cost_per_seat = data.get("cost_per_seat", route.cost_per_seat)
        route.active_days = data.get("active_days", route.active_days)
        route.save()

        return JsonResponse({
            "id": route.id,
            "from_location": route.from_location,
            "to_location": route.to_location,
            "departure_time": route.departure_time,
            "cost_per_seat": str(route.cost_per_seat),
            "active_days": route.active_days
        }, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import DriverRoute
from django.contrib.auth.models import User

@csrf_exempt
def delete_driver_route(request, driver_id, route_id):
    if request.method == "DELETE":
        driver = User.objects.filter(id=driver_id).first()
        if not driver:
            return JsonResponse({"error": "Driver not found"}, status=404)

        route = DriverRoute.objects.filter(id=route_id, driver=driver).first()
        if not route:
            return JsonResponse({"error": "Route not found for this driver"}, status=404)

        route.delete()
        return JsonResponse({"message": "Route deleted successfully"}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def search_routes(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        from_location = data.get("from")
        to_location = data.get("to")

        if not from_location or not to_location:
            return JsonResponse({"message": "Both 'from' and 'to' locations are required"}, status=400)

        # Query matching routes (case-insensitive match)
        routes = DriverRoute.objects.filter(
            from_location__icontains=from_location,
            to_location__icontains=to_location
        )

        # Format response
        results = []
        for route in routes:
            results.append({
                "id": route.id,
                "from": route.from_location,
                "to": route.to_location,
                "departureTime": route.departure_time,
                "costPerSeat": float(route.cost_per_seat),
                "activeDays": route.active_days,
                "totalSeats": route.total_seats,
                "driverId": route.driver.id,
                "driverName": route.driver.username  # You can change this to full_name if stored
            })

        return JsonResponse(results, safe=False)

    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
    
@csrf_exempt
def book_seats(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        driver_id = data.get("driverId")
        route_id = data.get("routeId")
        dates = data.get("dates", [])
        seats_to_book = int(data.get("seatsToBook", 0))

        if not (driver_id and route_id and dates and seats_to_book):
            return JsonResponse({"message": "Missing booking details"}, status=400)

        # Find the route
        try:
            route = DriverRoute.objects.get(id=route_id, driver_id=driver_id)
        except DriverRoute.DoesNotExist:
            return JsonResponse({"message": "Route not found"}, status=404)

        # Ensure active_days structure is correct
        active_days = route.active_days  # Example: [{"date": "2025-08-15", "availableSeats": 3}, ...]

        # First check seat availability
        for date_str in dates:
            day_schedule = next((d for d in active_days if d["date"] == date_str), None)
            if not day_schedule or day_schedule["availableSeats"] < seats_to_book:
                return JsonResponse({"message": f"Not enough seats available on {date_str}"}, status=400)

        # Reduce seats & save booking
        passenger = request.user  # This assumes user is logged in
        for date_str in dates:
            day_schedule = next((d for d in active_days if d["date"] == date_str), None)
            if day_schedule:
                day_schedule["availableSeats"] -= seats_to_book
                PassengerBooking.objects.create(
                    passenger=passenger,
                    route=route,
                    date=parse_date(date_str),
                    seats_booked=seats_to_book
                )

        # Save updated active_days
        route.active_days = active_days
        route.save()

        return JsonResponse({
            "id": route.id,
            "from": route.from_location,
            "to": route.to_location,
            "departureTime": route.departure_time,
            "costPerSeat": float(route.cost_per_seat),
            "totalSeats": route.total_seats,
            "activeDays": route.active_days
        })

    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


def logout_view(request):
    auth_logout(request)
    return redirect('login')
